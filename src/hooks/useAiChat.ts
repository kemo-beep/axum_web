import { useState, useCallback, useMemo } from 'react'
import { apiFetchStream } from '#/lib/api'
import type { ApiError } from '#/lib/api'
import { readSSE } from '#/lib/sse'
import {
  fileToBase64,
  IMAGE_TYPES,
  FILE_TYPES,
  MAX_FILE_SIZE_MB,
} from '#/lib/file-utils'
import { ALL_MODELS, type ModelEntry } from '#/data/ai-models'
import type { ChatMessage } from '#/components/features/ai/ChatMessageList'
import type { PendingAttachment } from '#/components/features/ai/ChatInputArea'

export function useAiChat() {
  const [model, setModel] = useState(ALL_MODELS[0]?.value ?? 'gemma:2b')
  const [modelSearch, setModelSearch] = useState('')
  const [modelPopoverOpen, setModelPopoverOpen] = useState(false)
  const [selectedProviderTab, setSelectedProviderTab] = useState('ollama')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streamingContent, setStreamingContent] = useState('')
  const [attachments, setAttachments] = useState<PendingAttachment[]>([])
  const [loading, setLoading] = useState(false)

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

  const handleModelSelect = useCallback((value: string) => {
    setModel(value)
    setModelPopoverOpen(false)
    setModelSearch('')
  }, [])

  const handlePopoverOpenChange = useCallback((open: boolean) => {
    setModelPopoverOpen(open)
    if (open) {
      const entry = ALL_MODELS.find((m) => m.value === model)
      setSelectedProviderTab(entry?.provider ?? 'ollama')
    } else {
      setModelSearch('')
    }
  }, [model])

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files?.length) return
      const toAdd: PendingAttachment[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!FILE_TYPES.includes(file.type as (typeof FILE_TYPES)[number])) {
          throw new Error(`Unsupported type: ${file.type}. Use image or PDF.`)
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          throw new Error(`${file.name} exceeds ${MAX_FILE_SIZE_MB}MB`)
        }
        try {
          const base64 = await fileToBase64(file)
          toAdd.push({ id: crypto.randomUUID(), file, base64 })
        } catch {
          throw new Error(`Failed to read ${file.name}`)
        }
      }
      setAttachments((prev) => [...prev, ...toAdd])
      e.target.value = ''
    },
    [],
  )

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const handleSend = useCallback(
    async (scrollToBottom: () => void): Promise<boolean> => {
      const text = message.trim()
      const hasAttachments = attachments.length > 0
      if (!text && !hasAttachments) return false

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

    const buildPayload = () => {
      if (!hasAttachments) {
        return [{ role: 'user', content: text || ' ' }]
      }
      const contentParts: Array<
        | { type: 'text'; text: string }
        | { type: 'image' | 'file'; content_type: string; base64: string; name?: string }
      > = []
      if (text) contentParts.push({ type: 'text', text })
      for (const a of attachments) {
        const type = IMAGE_TYPES.includes(a.file.type as (typeof IMAGE_TYPES)[number])
          ? 'image'
          : 'file'
        contentParts.push({
          type,
          content_type: a.file.type,
          base64: a.base64,
          name: a.file.name,
        })
      }
      return [{ role: 'user', content_parts: contentParts }]
    }

    try {
      const payload = buildPayload()
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

      setMessages((prev) => [...prev, { role: 'assistant', content: fullContent }])
      setStreamingContent('')
      return true
    } catch (e) {
      throw e
    } finally {
      setLoading(false)
    }
  },
    [message, attachments, model],
  )

  return {
    model,
    setModel,
    modelSearch,
    setModelSearch,
    modelPopoverOpen,
    setModelPopoverOpen,
    selectedProviderTab,
    setSelectedProviderTab,
    message,
    setMessage,
    messages,
    setMessages,
    streamingContent,
    attachments,
    setAttachments,
    loading,
    filteredModels,
    modelsByProviderFiltered,
    currentModelEntry,
    handleModelSelect,
    handlePopoverOpenChange,
    removeAttachment,
    handleSend,
    handleFileSelect,
  }
}
