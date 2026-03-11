import { createFileRoute } from '@tanstack/react-router'
import { ResetPasswordPage } from '#/components/pages/ResetPasswordPage'

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
  component: function ResetPasswordRoute() {
    const { token } = Route.useSearch()
    return <ResetPasswordPage token={token} />
  },
})
