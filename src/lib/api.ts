const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'http://localhost:7474'

export type ApiError = {
  message: string
  status: number
  detail?: string
}

let getToken: (() => string | null) | null = null
let onUnauthorized: (() => void) | null = null

export function setApiAuth(config: {
  getToken: () => string | null
  onUnauthorized: () => void
}) {
  getToken = config.getToken
  onUnauthorized = config.onUnauthorized
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    onUnauthorized?.()
    throw { message: 'Unauthorized', status: 401 } as ApiError
  }

  const text = await res.text()
  let body: unknown = null
  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      // non-JSON response
    }
  }

  if (!res.ok) {
    const err = body as { message?: string; detail?: string } | null
    throw {
      message: err?.message ?? res.statusText ?? 'Request failed',
      status: res.status,
      detail: err?.detail,
    } as ApiError
  }

  return (body ?? {}) as T
}

const MUTABLE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'] as const

function needsIdempotencyKey(method?: string): boolean {
  return method != null && MUTABLE_METHODS.includes(method as (typeof MUTABLE_METHODS)[number])
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const token = getToken?.() ?? null

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  if (token) {
    ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }
  if (needsIdempotencyKey(options.method)) {
    ;(headers as Record<string, string>)['Idempotency-Key'] =
      (options.headers as Record<string, string>)?.['Idempotency-Key'] ??
      crypto.randomUUID()
  }

  const res = await fetch(url, { ...options, headers })
  return handleResponse<T>(res)
}

export async function apiFetchBlob(
  path: string,
  options: RequestInit = {},
): Promise<Blob> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const token = getToken?.()

  const headers: HeadersInit = { ...options.headers }
  if (token) {
    ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, { ...options, headers })
  if (res.status === 401) {
    onUnauthorized?.()
    throw { message: 'Unauthorized', status: 401 } as ApiError
  }
  if (!res.ok) {
    const text = await res.text()
    let detail: string | undefined
    try {
      const parsed = JSON.parse(text) as { message?: string; detail?: string }
      detail = parsed.detail ?? parsed.message
    } catch {
      detail = text || res.statusText
    }
    throw {
      message: detail ?? 'Request failed',
      status: res.status,
    } as ApiError
  }
  return res.blob()
}

export { API_BASE }
