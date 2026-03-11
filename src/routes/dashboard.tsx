import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '#/components/pages/DashboardPage'
import { ProtectedRoute } from '#/components/shared/ProtectedRoute'

export const Route = createFileRoute('/dashboard')({
  component: function DashboardRoute() {
    return (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    )
  },
})
