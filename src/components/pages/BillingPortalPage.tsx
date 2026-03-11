import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '#/lib/api'
import { motion } from 'framer-motion'
import { Loader2, ShieldAlert } from 'lucide-react'

export function BillingPortalPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['billing', 'portal'],
    queryFn: () =>
      apiFetch<{ url: string }>(
        `/v1/billing/portal?return_url=${encodeURIComponent(window.location.origin + '/dashboard')}`,
      ),
  })

  useEffect(() => {
    if (data?.url) {
      window.location.href = data.url
    }
  }, [data])

  if (isLoading) {
    return (
      <main className="page-wrap flex min-h-[60vh] flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6 rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-12 shadow-2xl backdrop-blur-2xl text-center"
        >
          <div className="relative flex size-16 items-center justify-center rounded-2xl bg-[var(--lagoon)]/10 text-[var(--lagoon)] overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
            <Loader2 className="size-8 animate-spin" />
          </div>
          <div>
            <h2 className="text-2xl font-bold display-title text-[var(--sea-ink)] mb-2">Secure Gateway</h2>
            <p className="text-base font-medium text-[var(--sea-ink-soft)] max-w-sm">
              Authenticating and redirecting you to your secure Stripe billing portal...
            </p>
          </div>
        </motion.div>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="page-wrap flex min-h-[60vh] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-5 rounded-[2rem] border border-red-200 bg-red-50/80 p-10 shadow-xl backdrop-blur-xl text-center dark:border-red-900/50 dark:bg-red-900/20"
        >
          <div className="flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-800/50 dark:text-red-400">
            <ShieldAlert className="size-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">Portal Access Denied</h2>
            <p className="text-sm font-medium text-red-600 dark:text-red-400 max-w-xs">
              Failed to securely open the billing portal. Ensure this organization has an active Stripe customer association.
            </p>
          </div>
        </motion.div>
      </main>
    )
  }

  return null
}
