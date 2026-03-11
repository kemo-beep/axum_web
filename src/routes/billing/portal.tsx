import { createFileRoute } from '@tanstack/react-router'
import { BillingPortalPage } from '#/components/pages/BillingPortalPage'
import { ProtectedRoute } from '#/components/shared/ProtectedRoute'

export const Route = createFileRoute('/billing/portal')({
  component: function BillingPortalRoute() {
    return (
      <ProtectedRoute>
        <BillingPortalPage />
      </ProtectedRoute>
    )
  },
})
