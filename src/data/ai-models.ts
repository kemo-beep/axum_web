export const PROVIDERS = [
  { id: 'ollama', label: 'Ollama' },
  { id: 'openai', label: 'OpenAI' },
  { id: 'anthropic', label: 'Anthropic' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'groq', label: 'Groq' },
  { id: 'deepseek', label: 'DeepSeek' },
  { id: 'xai', label: 'xAI' },
] as const

export const MODELS_BY_PROVIDER: Record<string, { value: string; label: string }[]> = {
  ollama: [
    { value: 'gemma:2b', label: 'gemma:2b' },
    { value: 'llama3.2', label: 'llama3.2' },
    { value: 'mistral', label: 'mistral' },
  ],
  openai: [
    { value: 'gpt-5.4', label: 'GPT-5.4' },
    { value: 'gpt-5.4-pro', label: 'GPT-5.4 Pro' },
    { value: 'gpt-5-mini-2025-08-07', label: 'GPT-5 Mini' },
    { value: 'gpt-5-nano', label: 'GPT-5 Nano' },
    { value: 'gpt-5.3-codex', label: 'GPT-5.3 Codex' },
    { value: 'gpt-4.1', label: 'GPT-4.1' },
    { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
    { value: 'gpt-4.1-nano', label: 'GPT-4.1 Nano' },
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

export type ModelEntry = {
  provider: string
  providerLabel: string
  value: string
  label: string
}

export const ALL_MODELS: ModelEntry[] = PROVIDERS.flatMap((p) =>
  (MODELS_BY_PROVIDER[p.id] ?? []).map((m) => ({
    provider: p.id,
    providerLabel: p.label,
    value: m.value,
    label: m.label,
  })),
)
