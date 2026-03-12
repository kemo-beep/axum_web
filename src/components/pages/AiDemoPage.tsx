import { useState, useRef, useCallback, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import { apiFetchStream } from '#/lib/api'
import type { ApiError } from '#/lib/api'
import { toast } from 'sonner'
import {
  Paperclip,
  X,
  Send,
  Sparkles,
  ChevronDown,
  Search,
  Copy,
  Check,
} from 'lucide-react'

const PROVIDERS = [
  { id: 'ollama', label: 'Ollama' },
  { id: 'openai', label: 'OpenAI' },
  { id: 'anthropic', label: 'Anthropic' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'groq', label: 'Groq' },
  { id: 'deepseek', label: 'DeepSeek' },
  { id: 'xai', label: 'xAI' },
] as const

const MODELS_BY_PROVIDER: Record<string, { value: string; label: string }[]> = {
  ollama: [
    { value: 'gemma:2b', label: 'gemma:2b' },
    { value: 'llama3.2', label: 'llama3.2' },
    { value: 'mistral', label: 'mistral' },
  ],
  openai: [
    // GPT-5 Family (Flagship & Reasoning)
    { value: 'gpt-5.4', label: 'GPT-5.4' },
    { value: 'gpt-5.4-pro', label: 'GPT-5.4 Pro' },
    { value: 'gpt-5-mini-2025-08-07', label: 'GPT-5 Mini' },
    { value: 'gpt-5-nano', label: 'GPT-5 Nano' },
    { value: 'gpt-5.3-codex', label: 'GPT-5.3 Codex' },
    // GPT-4.1 Family (General-Purpose)
    { value: 'gpt-4.1', label: 'GPT-4.1' },
    { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
    { value: 'gpt-4.1-nano', label: 'GPT-4.1 Nano' },
    // Specialized
    { value: 'gpt-image-1.5', label: 'GPT Image 1.5' },
    { value: 'sora-2', label: 'Sora 2 / Sora 2 Pro' },
    { value: 'gpt-audio-1.5', label: 'GPT Audio 1.5' },
    { value: 'gpt-audio-mini', label: 'GPT Audio Mini' },
    { value: 'o3-deep-research', label: 'o3 Deep Research' },
    { value: 'o4-mini-deep-research', label: 'o4 Mini Deep Research' },
  ],
  anthropic: [
    { value: 'claude-opus-4-6', label: 'Claude Opus 4.6' },
    { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
    { value: 'claude-opus-4-5', label: 'Claude Opus 4.5' },
    { value: 'claude-haiku-4-5', label: 'Claude Haiku 4.5' },
    { value: 'claude-opus-4-1', label: 'Claude Opus 4.1' },
    { value: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
    { value: 'claude-3-5-haiku', label: 'Claude 3.5 Haiku' },
  ],
  gemini: [
    { value: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro' },
    { value: 'gemini-3-flash-preview', label: 'Gemini 3 Flash' },
    { value: 'gemini-3.1-flash-lite-preview', label: 'Gemini 3.1 Flash-Lite' },
    { value: 'nano-banana-pro', label: 'Nano Banana Pro (Gemini 3 Pro Image)' },
    { value: 'nano-banana-2', label: 'Nano Banana 2 (Gemini 3.1 Flash Image)' },
  ],
  groq: [{ value: 'llama-3.1-8b-instant', label: 'llama-3.1-8b-instant' }],
  deepseek: [{ value: 'deepseek-chat', label: 'deepseek-chat' }],
  xai: [{ value: 'grok-3-mini', label: 'grok-3-mini' }],
}

type ModelEntry = {
  provider: string
  providerLabel: string
  value: string
  label: string
}

const ALL_MODELS: ModelEntry[] = PROVIDERS.flatMap((p) =>
  (MODELS_BY_PROVIDER[p.id] ?? []).map((m) => ({
    provider: p.id,
    providerLabel: p.label,
    value: m.value,
    label: m.label,
  })),
)

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
  attachments?: { name: string; type: string }[]
}

type PendingAttachment = {
  id: string
  file: File
  base64: string
}

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const FILE_TYPES = [...IMAGE_TYPES, 'application/pdf']
const MAX_FILE_SIZE_MB = 10

async function* readSSE(
  reader: ReadableStreamDefaultReader<Uint8Array>,
): AsyncGenerator<string, void, unknown> {
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n\n')
    buffer = lines.pop() ?? ''
    for (const block of lines) {
      const dataMatch = block.match(/^data: (.+)$/m)
      if (dataMatch) {
        const data = dataMatch[1]
        if (data === '[DONE]') return
        yield data
      }
    }
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve(base64 ?? '')
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function CodeBlock({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const match = /language-(\w+)/.exec(className ?? '')
  const lang = match?.[1] ?? 'text'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="my-3 overflow-hidden rounded-lg border border-input/60 bg-muted/50">
      <div className="flex items-center justify-between border-b border-input/40 bg-muted/30 px-3 py-1.5 text-xs">
        <span className="font-medium text-muted-foreground">{lang}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm">
        <code>{children}</code>
      </pre>
    </div>
  )
}

function AiMessageContent({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none prose-p:my-2 prose-p:leading-relaxed prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:my-3 prose-headings:font-semibold prose-strong:font-semibold prose-code:rounded prose-code:bg-muted/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-medium prose-code:before:content-none prose-code:after:content-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:my-0 prose-pre:border-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            const codeEl = Array.isArray(children)
              ? (children[0] as React.ReactElement & { props?: { children?: unknown; className?: string } })
              : (children as React.ReactElement & { props?: { children?: unknown; className?: string } })
            const code = codeEl?.props?.children
            const className = codeEl?.props?.className
            const codeStr =
              typeof code === 'string'
                ? code
                : Array.isArray(code)
                  ? code.join('')
                  : String(code ?? '')
            return <CodeBlock className={className}>{codeStr}</CodeBlock>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export function AiDemoPage() {
  const [model, setModel] = useState(ALL_MODELS[0]?.value ?? 'gemma:2b')
  const [modelSearch, setModelSearch] = useState('')
  const [modelPopoverOpen, setModelPopoverOpen] = useState(false)
  const [selectedProviderTab, setSelectedProviderTab] = useState('ollama')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streamingContent, setStreamingContent] = useState('')
  const [attachments, setAttachments] = useState<PendingAttachment[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const filteredModels = useMemo(() => {
    const q = modelSearch.trim().toLowerCase()
    if (!q) return ALL_MODELS
    return ALL_MODELS.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.value.toLowerCase().includes(q) ||
        m.providerLabel.toLowerCase().includes(q),
    )
  }, [modelSearch])

  const modelsByProviderFiltered = useMemo(() => {
    const map = new Map<string, ModelEntry[]>()
    for (const m of filteredModels) {
      const list = map.get(m.provider) ?? []
      list.push(m)
      map.set(m.provider, list)
    }
    return map
  }, [filteredModels])

  const currentModelEntry = ALL_MODELS.find((m) => m.value === model)

  const handleModelSelect = (value: string) => {
    setModel(value)
    setModelPopoverOpen(false)
    setModelSearch('')
  }

  const handlePopoverOpenChange = (open: boolean) => {
    setModelPopoverOpen(open)
    if (open) {
      setSelectedProviderTab(currentModelEntry?.provider ?? 'ollama')
    } else {
      setModelSearch('')
    }
  }

  const modelsForSelectedProvider = useMemo(() => {
    const list = modelsByProviderFiltered.get(selectedProviderTab) ?? []
    return list
  }, [modelsByProviderFiltered, selectedProviderTab])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    const toAdd: PendingAttachment[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!FILE_TYPES.includes(file.type)) {
        toast.error(`Unsupported type: ${file.type}. Use image or PDF.`)
        continue
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name} exceeds ${MAX_FILE_SIZE_MB}MB`)
        continue
      }
      try {
        const base64 = await fileToBase64(file)
        toAdd.push({
          id: crypto.randomUUID(),
          file,
          base64,
        })
      } catch {
        toast.error(`Failed to read ${file.name}`)
      }
    }
    setAttachments((prev) => [...prev, ...toAdd])
    e.target.value = ''
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  const buildMessagesPayload = () => {
    const text = message.trim()
    const hasAttachments = attachments.length > 0

    if (!hasAttachments) {
      return [{ role: 'user', content: text || ' ' }]
    }

    const contentParts: Array<
      | { type: 'text'; text: string }
      | { type: 'image' | 'file'; content_type: string; base64: string; name?: string }
    > = []

    if (text) {
      contentParts.push({ type: 'text', text })
    }

    for (const a of attachments) {
      if (IMAGE_TYPES.includes(a.file.type)) {
        contentParts.push({
          type: 'image',
          content_type: a.file.type,
          base64: a.base64,
          name: a.file.name,
        })
      } else {
        contentParts.push({
          type: 'file',
          content_type: a.file.type,
          base64: a.base64,
          name: a.file.name,
        })
      }
    }

    return [{ role: 'user', content_parts: contentParts }]
  }

  const handleSend = async () => {
    const text = message.trim()
    const hasAttachments = attachments.length > 0
    if (!text && !hasAttachments) {
      toast.error('Enter a message or attach a file')
      return
    }

    const userMsg: ChatMessage = {
      role: 'user',
      content: text || '[attachment]',
      attachments: attachments.map((a) => ({ name: a.file.name, type: a.file.type })),
    }
    setMessages((prev) => [...prev, userMsg])
    setMessage('')
    setAttachments([])
    setStreamingContent('')
    setLoading(true)

    try {
      const payload = buildMessagesPayload()
      const res = await apiFetchStream('/v1/ai/chat-stream', {
        method: 'POST',
        body: JSON.stringify({ model, messages: payload }),
      })

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          message?: string
          detail?: string
        }
        throw {
          message: err.message ?? err.detail ?? res.statusText,
          status: res.status,
        } as ApiError
      }

      const body = res.body
      if (!body) throw { message: 'No response body', status: 500 } as ApiError

      let fullContent = ''
      const reader = body.getReader()
      for await (const chunk of readSSE(reader)) {
        fullContent += chunk
        setStreamingContent(fullContent)
        scrollToBottom()
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: fullContent },
      ])
      setStreamingContent('')
    } catch (e) {
      const err = e as ApiError
      toast.error(err?.message ?? 'Request failed')
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-wrap flex h-[calc(100vh-4rem)] flex-col px-4 pb-4 pt-4">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4">
        <div className="flex shrink-0 items-center gap-2 border-b border-[var(--line)] pb-4">
          <Sparkles className="size-6 text-[var(--lagoon)]" />
          <h1 className="text-xl font-bold tracking-tight text-[var(--sea-ink)]">
            AI Demo
          </h1>
        </div>

        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto"
        >
          {messages.length === 0 && !streamingContent && (
            <div className="flex h-full items-center justify-center text-sm text-[var(--sea-ink-soft)]">
              Send a message or attach a file to get started.
            </div>
          )}
          <div className="flex flex-col gap-6">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--lagoon)]/15 text-[var(--lagoon)]">
                    <Sparkles className="size-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-muted/70 text-foreground'
                      : 'rounded-bl-md bg-background text-foreground shadow-sm ring-1 ring-input/40'
                  }`}
                >
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {msg.attachments.map((a) => (
                        <span
                          key={a.name}
                          className="rounded bg-black/10 px-2 py-0.5 text-xs"
                        >
                          {a.name}
                        </span>
                      ))}
                    </div>
                  )}
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap break-words text-sm">
                      {msg.content}
                    </p>
                  ) : (
                    <div className="text-sm text-[var(--sea-ink)]">
                      <AiMessageContent content={msg.content} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {streamingContent && (
              <div className="flex gap-3 justify-start">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--lagoon)]/15 text-[var(--lagoon)]">
                  <Sparkles className="size-4" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-background px-4 py-3 text-sm text-[var(--sea-ink)] shadow-sm ring-1 ring-input/40">
                  <AiMessageContent content={streamingContent} />
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        <div className="flex shrink-0 flex-col gap-0">
          <div className="flex min-h-[48px] flex-col gap-0 rounded-2xl border border-input/80 bg-muted/20">
            <div className="flex min-h-[80px] flex-1 gap-3 p-3">
              {attachments.length > 0 && (
                <div className="flex shrink-0 flex-wrap items-start gap-2">
                  {attachments.map((a) =>
                    IMAGE_TYPES.includes(a.file.type) ? (
                      <div
                        key={a.id}
                        className="relative shrink-0 overflow-hidden rounded-lg border border-input/60 bg-muted/50"
                      >
                        <img
                          src={`data:${a.file.type};base64,${a.base64}`}
                          alt={a.file.name}
                          className="block size-16 object-cover sm:size-20"
                        />
                        <button
                          type="button"
                          onClick={() => removeAttachment(a.id)}
                          className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                          aria-label="Remove"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        key={a.id}
                        className="flex items-center gap-1.5 rounded-lg border border-input/60 bg-muted/40 px-2.5 py-1.5 text-xs"
                      >
                        <span className="truncate max-w-[100px]">
                          {a.file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(a.id)}
                          className="rounded p-0.5 hover:bg-muted transition-colors"
                          aria-label="Remove"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ),
                  )}
                </div>
              )}
              <Textarea
                placeholder={
                  currentModelEntry
                    ? `Enter a prompt for ${currentModelEntry.providerLabel}`
                    : 'Enter your message...'
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                rows={2}
                disabled={loading}
                className="min-h-[80px] min-w-0 flex-1 resize-none border-0 bg-transparent px-3 py-2 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-input/50 px-2 py-2">
              <div className="flex items-center gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={FILE_TYPES.join(',')}
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  aria-label="Attach file"
                >
                  <Paperclip className="size-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Popover
                  open={modelPopoverOpen}
                  onOpenChange={handlePopoverOpenChange}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground"
                      disabled={loading}
                      aria-label="Select model"
                    >
                      <span className="truncate max-w-[140px] text-sm">
                        {currentModelEntry
                          ? `${currentModelEntry.providerLabel} · ${currentModelEntry.label}`
                          : 'Select model'}
                      </span>
                      <ChevronDown className="size-3.5 shrink-0 opacity-60" />
                    </Button>
                  </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-[420px] p-0"
                sideOffset={8}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <div className="border-b p-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search models..."
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      className="h-9 pl-8"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="flex max-h-[320px]">
                  <nav className="flex shrink-0 flex-col border-r bg-muted/30 py-1">
                    {PROVIDERS.filter((p) =>
                      MODELS_BY_PROVIDER[p.id]?.length,
                    ).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProviderTab(p.id)}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                          selectedProviderTab === p.id
                            ? 'border-l-2 border-[var(--lagoon)] bg-accent/50 font-medium text-foreground'
                            : 'border-l-2 border-transparent text-muted-foreground hover:bg-accent/30 hover:text-foreground'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </nav>
                  <div className="min-w-0 flex-1 overflow-y-auto p-2">
                    {modelsForSelectedProvider.length === 0 ? (
                      <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                        {modelSearch
                          ? `No models match "${modelSearch}"`
                          : 'No models'}
                      </p>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        {modelsForSelectedProvider.map((m) => (
                          <button
                            key={m.value}
                            type="button"
                            onClick={() => handleModelSelect(m.value)}
                            className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                              model === m.value
                                ? 'bg-accent/80 text-accent-foreground'
                                : ''
                            }`}
                          >
                            <span className="truncate">{m.label}</span>
                            {model === m.value && (
                              <span className="text-[var(--lagoon)]">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
                </Popover>
                <Button
                  onClick={handleSend}
                  disabled={loading}
                  size="icon"
                  className="size-8 shrink-0 bg-[var(--lagoon)] hover:bg-[var(--lagoon)]/90"
                  aria-label="Send"
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
