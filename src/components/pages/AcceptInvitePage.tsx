import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { apiFetch } from '#/lib/api'

interface AcceptInvitePageProps {
  token?: string
}

export function AcceptInvitePage({ token = '' }: AcceptInvitePageProps) {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const acceptMutation = useMutation({
    mutationFn: () =>
      apiFetch<{ ok: boolean }>('/v1/invites/accept', {
        method: 'POST',
        body: JSON.stringify({ token }),
      }),
    onSuccess: () => {
      navigate({ to: '/orgs' })
    },
    onError: (err: unknown) => {
      const apiErr = err as { message?: string }
      setError(apiErr?.message ?? 'Failed to accept invite')
    },
  })

  if (!token) {
    return (
      <main className="page-wrap flex min-h-[60vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid invite</CardTitle>
            <CardDescription>
              This invite link is invalid or expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/orgs">
              <Button variant="outline" className="w-full">
                Go to organizations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="page-wrap flex min-h-[60vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Accept invite</CardTitle>
          <CardDescription>
            Join the organization by accepting this invite.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
          <Button
            className="w-full"
            onClick={() => acceptMutation.mutate()}
            disabled={acceptMutation.isPending}
          >
            {acceptMutation.isPending ? 'Accepting...' : 'Accept invite'}
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
