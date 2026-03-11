import { createFileRoute } from '@tanstack/react-router'
import { PlansPage } from '#/components/pages/PlansPage'
import { ProtectedRoute } from '#/components/shared/ProtectedRoute'

export const Route = createFileRoute('/billing/plans')({
  component: function BillingPlansRoute() {
    return (
      <ProtectedRoute>
        <PlansPage />
      </ProtectedRoute>
    )
  },
})
