import { createFileRoute } from '@tanstack/react-router'
import { OrgListPage } from '#/components/pages/OrgListPage'
import { ProtectedRoute } from '#/components/shared/ProtectedRoute'

export const Route = createFileRoute('/orgs/')({
  component: function OrgListRoute() {
    return (
      <ProtectedRoute>
        <OrgListPage />
      </ProtectedRoute>
    )
  },
})
