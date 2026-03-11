import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '#/lib/api'

export function BillingPortalPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['billing', 'portal'],
    queryFn: () =>
      apiFetch<{ url: string }>(
        `/v1/billing/portal?return_url=${encodeURIComponent(window.location.origin + '/dashboard')}`
      ),
  })

  useEffect(() => {
    if (data?.url) {
      window.location.href = data.url
    }
  }, [data])

  if (isLoading) {
    return (
      <main className="page-wrap flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-sm text-[var(--sea-ink-soft)]">
          Redirecting to billing portal...
        </p>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="page-wrap flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-sm text-red-600">
          Failed to open billing portal. Ensure you have a Stripe customer
          associated.
        </p>
      </main>
    )
  }

  return null
}
