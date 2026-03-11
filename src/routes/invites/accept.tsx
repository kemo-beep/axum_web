import { createFileRoute } from '@tanstack/react-router'
import { AcceptInvitePage } from '#/components/pages/AcceptInvitePage'
import { ProtectedRoute } from '#/components/shared/ProtectedRoute'

export const Route = createFileRoute('/invites/accept')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
  component: function AcceptInviteRoute() {
    const { token } = Route.useSearch()
    return (
      <ProtectedRoute>
        <AcceptInvitePage token={token} />
      </ProtectedRoute>
    )
  },
})
