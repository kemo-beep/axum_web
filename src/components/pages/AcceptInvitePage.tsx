import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Button } from '#/components/ui/button'
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
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 shadow-sm dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
            >
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                {error}
              </span>
            </motion.div>
          )}
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
