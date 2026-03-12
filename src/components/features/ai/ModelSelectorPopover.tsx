import { useMemo } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import { ChevronDown, Search } from 'lucide-react'
import {
  PROVIDERS,
  MODELS_BY_PROVIDER,
  type ModelEntry,
} from '#/data/ai-models'

type ModelSelectorPopoverProps = {
  model: string
  modelSearch: string
  setModelSearch: (v: string) => void
  selectedProviderTab: string
  setSelectedProviderTab: (v: string) => void
  modelPopoverOpen: boolean
  onOpenChange: (open: boolean) => void
  onModelSelect: (value: string) => void
  filteredModels: ModelEntry[]
  modelsByProviderFiltered: Map<string, ModelEntry[]>
  currentModelEntry: ModelEntry | undefined
  disabled?: boolean
}

export function ModelSelectorPopover({
  model,
  modelSearch,
  setModelSearch,
  selectedProviderTab,
  setSelectedProviderTab,
  modelPopoverOpen,
  onOpenChange,
  onModelSelect,
  filteredModels: _filteredModels,
  modelsByProviderFiltered,
  currentModelEntry,
  disabled,
}: ModelSelectorPopoverProps) {
  const modelsForSelectedProvider = useMemo(() => {
    return modelsByProviderFiltered.get(selectedProviderTab) ?? []
  }, [modelsByProviderFiltered, selectedProviderTab])

  return (
    <Popover open={modelPopoverOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground"
          disabled={disabled}
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
            {PROVIDERS.filter((p) => MODELS_BY_PROVIDER[p.id]?.length).map(
              (p) => (
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
              ),
            )}
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
                    onClick={() => onModelSelect(m.value)}
                    className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                      model === m.value ? 'bg-accent/80 text-accent-foreground' : ''
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
  )
}
