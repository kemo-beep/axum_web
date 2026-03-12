import { forwardRef } from 'react'
import { Sparkles } from 'lucide-react'
import { AiMessageContent } from './AiMessageContent'

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
  attachments?: { name: string; type: string }[]
}

type ChatMessageListProps = {
  messages: ChatMessage[]
  streamingContent: string
}

export const ChatMessageList = forwardRef<
  HTMLDivElement,
  ChatMessageListProps & { messagesEndRef: React.RefObject<HTMLDivElement | null> }
>(function ChatMessageList(
  { messages, streamingContent, messagesEndRef },
  messagesContainerRef,
) {
  return (
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
  )
})
