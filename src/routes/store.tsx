import { createFileRoute } from '@tanstack/react-router'
import { StorePage } from '#/components/pages/StorePage'
import { ProtectedRoute } from '#/components/shared/ProtectedRoute'

export const Route = createFileRoute('/store')({
  component: function StoreRoute() {
    return (
      <ProtectedRoute>
        <StorePage />
      </ProtectedRoute>
    )
  },
})
