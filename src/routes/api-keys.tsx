import { createFileRoute } from '@tanstack/react-router'
import { ApiKeysPage } from '#/components/pages/ApiKeysPage'
import { ProtectedRoute } from '#/components/shared/ProtectedRoute'

export const Route = createFileRoute('/api-keys')({
  component: function ApiKeysRoute() {
    return (
      <ProtectedRoute>
        <ApiKeysPage />
      </ProtectedRoute>
    )
  },
})
