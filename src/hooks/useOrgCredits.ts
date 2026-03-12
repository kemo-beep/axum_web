import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '#/lib/api'

export interface CreditsResponse {
  balance: number
  consumed: number
}

export function useOrgCredits(orgId: string | null) {
  return useQuery({
    queryKey: ['billing', 'credits', orgId],
    queryFn: () =>
      apiFetch<CreditsResponse>(`/v1/orgs/${orgId}/billing/credits`),
    enabled: !!orgId,
  })
}
