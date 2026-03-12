import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Button } from '#/components/ui/button'
import { InlineErrorBanner } from '#/components/shared/InlineErrorBanner'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { apiFetch } from '#/lib/api'
import { motion } from 'framer-motion'

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
      const apiErr = err as { message: string }
      setError(apiErr.message ?? 'Failed to accept invite')
    },
  })

  if (!token) {
    return (
      <main className="page-wrap flex min-h-[60vh] items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md rounded-[2rem] border border-[var(--line)] bg-gradient-to-b from-[var(--surface-strong)] to-[var(--surface)] p-2 shadow-2xl backdrop-blur-2xl"
        >
          <CardHeader>
            <CardTitle className="display-title text-2xl">Invalid invite</CardTitle>
            <CardDescription className="text-base text-[var(--sea-ink-soft)]">
              This invite link is invalid or expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/orgs">
              <Button variant="outline" className="w-full h-12 rounded-xl text-md font-medium">
                Go to organizations
              </Button>
            </Link>
          </CardContent>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="page-wrap flex min-h-[60vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-2 shadow-2xl backdrop-blur-2xl"
      >
        <CardHeader className="pb-4">
          <CardTitle className="display-title text-2xl text-[var(--sea-ink)]">Accept invite</CardTitle>
          <CardDescription className="text-[var(--sea-ink-soft)] text-base">
            Join the organization by accepting this exclusive invite.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <InlineErrorBanner message={error} />}
          <Button
            className="w-full h-12 rounded-xl bg-[var(--lagoon)] hover:bg-[var(--lagoon-deep)] text-white font-semibold text-md transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            onClick={() => acceptMutation.mutate()}
            disabled={acceptMutation.isPending}
          >
            {acceptMutation.isPending ? 'Accepting secure access...' : 'Accept invite'}
          </Button>
        </CardContent>
      </motion.div>
    </main>
  )
}
