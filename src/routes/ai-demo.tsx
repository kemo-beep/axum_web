import { createFileRoute } from '@tanstack/react-router'
import { AiDemoPage } from '#/components/pages/AiDemoPage'
import { ProtectedRoute } from '#/components/shared/ProtectedRoute'

export const Route = createFileRoute('/ai-demo')({
  component: function AiDemoRoute() {
    return (
      <ProtectedRoute>
        <AiDemoPage />
      </ProtectedRoute>
    )
  },
})
