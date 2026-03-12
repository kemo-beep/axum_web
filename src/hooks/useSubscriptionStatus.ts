import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '#/lib/api'

interface SubscriptionStatusResponse {
  plan_name: string | null
}

export function useSubscriptionStatus() {
  return useQuery({
    queryKey: ['billing', 'subscription-status'],
    queryFn: () =>
      apiFetch<SubscriptionStatusResponse>('/v1/billing/subscription-status'),
  })
}
