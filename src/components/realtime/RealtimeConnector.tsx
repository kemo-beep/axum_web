import { useAuth } from '#/hooks/useAuth'
import { useRealtime } from '#/hooks/useRealtime'

/**
 * Connects to the WebSocket when user is authenticated. Mount inside AuthProvider.
 * Renders nothing; use useRealtime() in child components for message handling.
 */
export function RealtimeConnector() {
  const { user } = useAuth()
  useRealtime({ enabled: !!user })
  return null
}
