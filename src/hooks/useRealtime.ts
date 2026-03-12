import { useCallback, useEffect, useRef, useState } from 'react'
import { getWsToken, WS_BASE } from '#/lib/api'

/** Close codes that should NOT trigger reconnection. */
const NO_RECONNECT_CODES = new Set([
  1008, // Policy violation
  1003, // Unsupported data
  4401, // Custom: auth failure
])

export interface WsMessage {
  type: string
  payload: unknown
  ts?: string
}

export interface UseRealtimeOptions {
  enabled?: boolean
  onMessage?: (msg: WsMessage) => void
}

export interface UseRealtimeResult {
  connected: boolean
}

export function useRealtime(options?: UseRealtimeOptions): UseRealtimeResult {
  const { enabled = true, onMessage } = options ?? {}
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const backoffRef = useRef(1000)
  const mountedRef = useRef(true)
  const connectingRef = useRef(false)
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  const connect = useCallback(async () => {
    if (!mountedRef.current || connectingRef.current) return
    connectingRef.current = true

    try {
      const token = await getWsToken()
      const url = `${WS_BASE}/v1/ws?token=${encodeURIComponent(token)}`
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        connectingRef.current = false
        if (!mountedRef.current) {
          ws.close()
          return
        }
        setConnected(true)
        backoffRef.current = 1000
      }

      ws.onclose = (event) => {
        connectingRef.current = false
        if (!mountedRef.current) return
        wsRef.current = null
        setConnected(false)

        if (NO_RECONNECT_CODES.has(event.code)) return

        const delay = Math.min(backoffRef.current, 30_000)
        backoffRef.current = Math.min(backoffRef.current * 2, 30_000)

        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectTimeoutRef.current = null
          connect()
        }, delay)
      }

      ws.onerror = () => {
        // Close handler will run; avoid double reconnect
      }

      ws.onmessage = (event) => {
        if (!mountedRef.current) return
        try {
          const data = JSON.parse(event.data) as WsMessage
          onMessageRef.current?.(data)
        } catch {
          // ignore invalid JSON
        }
      }
    } catch {
      connectingRef.current = false
      setConnected(false)
      const delay = Math.min(backoffRef.current, 30_000)
      backoffRef.current = Math.min(backoffRef.current * 2, 30_000)
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectTimeoutRef.current = null
        connect()
      }, delay)
    }
  }, [options?.onMessage])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setConnected(false)
  }, [])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      disconnect()
    }
  }, [disconnect])

  useEffect(() => {
    if (!enabled) {
      disconnect()
      return
    }
    connect()
  }, [enabled, connect, disconnect])

  return { connected }
}
