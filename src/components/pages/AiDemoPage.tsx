import { useRef, useCallback } from 'react'
import { Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useAiChat } from '#/hooks/useAiChat'
import { ChatMessageList } from '#/components/features/ai/ChatMessageList'
import { ChatInputArea } from '#/components/features/ai/ChatInputArea'

export function AiDemoPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const chat = useAiChat()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleSend = useCallback(async () => {
    try {
      const ok = await chat.handleSend(scrollToBottom)
      if (!ok) {
        toast.error('Enter a message or attach a file')
        return
      }
    } catch (e) {
      const err = e as { message?: string }
      toast.error(err?.message ?? 'Request failed')
      chat.setMessages((prev) => prev.slice(0, -1))
    }
  }, [chat, scrollToBottom])

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        await chat.handleFileSelect(e)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to add file')
      }
    },
    [chat],
  )

  return (
    <main className="page-wrap flex h-[calc(100vh-4rem)] flex-col px-4 pb-4 pt-4">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4">
        <div className="flex shrink-0 items-center gap-2 border-b border-[var(--line)] pb-4">
          <Sparkles className="size-6 text-[var(--lagoon)]" />
          <h1 className="text-xl font-bold tracking-tight text-[var(--sea-ink)]">
            AI Demo
          </h1>
        </div>

        <ChatMessageList
          ref={messagesContainerRef}
          messages={chat.messages}
          streamingContent={chat.streamingContent}
          messagesEndRef={messagesEndRef}
        />

        <ChatInputArea
          message={chat.message}
          setMessage={chat.setMessage}
          attachments={chat.attachments}
          removeAttachment={chat.removeAttachment}
          handleFileSelect={handleFileSelect}
          handleSend={handleSend}
          loading={chat.loading}
          model={chat.model}
          modelSearch={chat.modelSearch}
          setModelSearch={chat.setModelSearch}
          selectedProviderTab={chat.selectedProviderTab}
          setSelectedProviderTab={chat.setSelectedProviderTab}
          modelPopoverOpen={chat.modelPopoverOpen}
          onModelPopoverOpenChange={chat.handlePopoverOpenChange}
          onModelSelect={chat.handleModelSelect}
          filteredModels={chat.filteredModels}
          modelsByProviderFiltered={chat.modelsByProviderFiltered}
          currentModelEntry={chat.currentModelEntry}
        />
      </div>
    </main>
  )
}
