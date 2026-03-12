import { useRef } from 'react'
import { Button } from '#/components/ui/button'
import { Textarea } from '#/components/ui/textarea'
import { Paperclip, Send, X } from 'lucide-react'
import { ModelSelectorPopover } from './ModelSelectorPopover'
import { IMAGE_TYPES, FILE_TYPES } from '#/lib/file-utils'
import type { ModelEntry } from '#/data/ai-models'

export type PendingAttachment = {
  id: string
  file: File
  base64: string
}

type ChatInputAreaProps = {
  message: string
  setMessage: (v: string) => void
  attachments: PendingAttachment[]
  removeAttachment: (id: string) => void
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSend: () => void
  loading: boolean
  model: string
  modelSearch: string
  setModelSearch: (v: string) => void
  selectedProviderTab: string
  setSelectedProviderTab: (v: string) => void
  modelPopoverOpen: boolean
  onModelPopoverOpenChange: (open: boolean) => void
  onModelSelect: (value: string) => void
  filteredModels: ModelEntry[]
  modelsByProviderFiltered: Map<string, ModelEntry[]>
  currentModelEntry: ModelEntry | undefined
}

export function ChatInputArea({
  message,
  setMessage,
  attachments,
  removeAttachment,
  handleFileSelect,
  handleSend,
  loading,
  model,
  modelSearch,
  setModelSearch,
  selectedProviderTab,
  setSelectedProviderTab,
  modelPopoverOpen,
  onModelPopoverOpenChange,
  onModelSelect,
  filteredModels,
  modelsByProviderFiltered,
  currentModelEntry,
}: ChatInputAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex shrink-0 flex-col gap-0">
      <div className="flex min-h-[48px] flex-col gap-0 rounded-2xl border border-input/80 bg-muted/20">
        <div className="flex min-h-[80px] flex-1 gap-3 p-3">
          {attachments.length > 0 && (
            <div className="flex shrink-0 flex-wrap items-start gap-2">
              {attachments.map((a) =>
                IMAGE_TYPES.includes(a.file.type as (typeof IMAGE_TYPES)[number]) ? (
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
                    <span className="truncate max-w-[100px]">{a.file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(a.id)}
                      className="rounded p-0.5 transition-colors hover:bg-muted"
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
            <ModelSelectorPopover
              model={model}
              modelSearch={modelSearch}
              setModelSearch={setModelSearch}
              selectedProviderTab={selectedProviderTab}
              setSelectedProviderTab={setSelectedProviderTab}
              modelPopoverOpen={modelPopoverOpen}
              onOpenChange={onModelPopoverOpenChange}
              onModelSelect={onModelSelect}
              filteredModels={filteredModels}
              modelsByProviderFiltered={modelsByProviderFiltered}
              currentModelEntry={currentModelEntry}
              disabled={loading}
            />
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
  )
}
