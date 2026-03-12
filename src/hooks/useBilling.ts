import { useEffect, useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '#/lib/api'
import type { ApiError } from '#/lib/api'
import type {
  SubscriptionPlan,
  SubscriptionWithPlan,
  TokenPackage,
} from '#/types'

export function useBillingPlans() {
  return useQuery({
    queryKey: ['billing', 'plans'],
    queryFn: () => apiFetch<SubscriptionPlan[]>('/v1/billing/plans'),
  })
}

export function useBillingPackages() {
  return useQuery({
    queryKey: ['billing', 'packages'],
    queryFn: () => apiFetch<TokenPackage[]>('/v1/billing/packages'),
  })
}

export function useBillingSubscription(orgId: string | undefined) {
  return useQuery({
    queryKey: ['billing', 'subscription', orgId],
    queryFn: async (): Promise<SubscriptionWithPlan | null> => {
      if (!orgId) return null
      try {
        return await apiFetch<SubscriptionWithPlan>(
          `/v1/orgs/${orgId}/billing/subscription`,
        )
      } catch (e) {
        const err = e as ApiError
        if (err.status === 404) return null
        throw e
      }
    },
    enabled: !!orgId,
  })
}

export function useStoreCheckout(orgId: string | undefined) {
  const queryClient = useQueryClient()
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [changePlanLoading, setChangePlanLoading] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('billing') === 'success' && orgId) {
      queryClient.invalidateQueries({
        queryKey: ['billing', 'subscription', orgId],
      })
      queryClient.invalidateQueries({ queryKey: ['billing', 'credits', orgId] })
      queryClient.invalidateQueries({
        queryKey: ['billing', 'transactions', orgId],
      })
      queryClient.invalidateQueries({
        queryKey: ['billing', 'subscription-status'],
      })
      window.history.replaceState({}, '', '/store')
    }
  }, [orgId, queryClient])

  const handleCheckout = useCallback(
    async (priceId: string, mode: 'subscription' | 'payment') => {
      if (!orgId) return
      setCheckoutLoading(priceId)
      try {
        const { url } = await apiFetch<{ url: string }>(
          `/v1/orgs/${orgId}/billing/checkout`,
          {
            method: 'POST',
            body: JSON.stringify({
              mode,
              price_id: priceId,
              success_url: `${window.location.origin}/store?billing=success`,
              cancel_url: `${window.location.origin}/store?billing=canceled`,
            }),
          },
        )
        window.location.href = url
      } catch {
        setCheckoutLoading(null)
      }
    },
    [orgId],
  )

  const handleChangePlan = useCallback(
    async (priceId: string) => {
      if (!orgId) return
      setChangePlanLoading(priceId)
      try {
        await apiFetch(
          `/v1/orgs/${orgId}/billing/subscription/change-plan`,
          {
            method: 'POST',
            body: JSON.stringify({ price_id: priceId }),
          },
        )
        queryClient.invalidateQueries({
          queryKey: ['billing', 'subscription', orgId],
        })
        queryClient.invalidateQueries({
          queryKey: ['billing', 'transactions', orgId],
        })
        queryClient.invalidateQueries({
          queryKey: ['billing', 'subscription-status'],
        })
      } finally {
        setChangePlanLoading(null)
      }
    },
    [orgId, queryClient],
  )

  return {
    handleCheckout,
    handleChangePlan,
    checkoutLoading,
    changePlanLoading,
  }
}
