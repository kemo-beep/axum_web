import { createFileRoute } from '@tanstack/react-router'
import { AdminPage } from '#/components/pages/AdminPage'
import { ProtectedRoute } from '#/components/shared/ProtectedRoute'

export const Route = createFileRoute('/admin')({
  component: function AdminRoute() {
    return (
      <ProtectedRoute permission="admin:access">
        <AdminPage />
      </ProtectedRoute>
    )
  },
})
