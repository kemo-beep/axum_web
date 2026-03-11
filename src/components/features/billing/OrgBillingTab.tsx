import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '#/components/ui/button'
import { apiFetch } from '#/lib/api'
import type { ApiError } from '#/lib/api'
import type { SubscriptionPlan, SubscriptionWithPlan, TokenPackage } from '#/types'
import { PlanCard } from './PlanCard'
import { PackageCard } from './PackageCard'
import { SubscriptionDetails } from './SubscriptionDetails'
import { TransactionTable } from './TransactionTable'

interface OrgBillingTabProps {
  orgId: string
}

interface TransactionsResponse {
  subscription_transactions: Array<{
    id: string
    event_type: string
    kind?: string
    amount_cents?: number
    currency?: string
    receipt_url?: string
    hosted_invoice_url?: string
    invoice_pdf_url?: string
    status?: string
    billing_email?: string
    occurred_at: string
  }>
  credit_transactions: Array<{
    id: string
    kind: string
    amount_cents?: number
    currency?: string
    receipt_url?: string
    occurred_at: string
  }>
}

export function OrgBillingTab({ orgId }: OrgBillingTabProps) {
  const queryClient = useQueryClient()
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('billing') === 'success') {
      queryClient.invalidateQueries({ queryKey: ['billing', 'subscription', orgId] })
      queryClient.invalidateQueries({ queryKey: ['billing', 'transactions', orgId] })
      queryClient.invalidateQueries({ queryKey: ['billing', 'subscription-status'] })
      window.history.replaceState({}, '', window.location.pathname + '?tab=billing')
    }
  }, [orgId, queryClient])

  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['billing', 'subscription', orgId],
    queryFn: async (): Promise<SubscriptionWithPlan | null> => {
      try {
        return await apiFetch<SubscriptionWithPlan>(
          `/v1/orgs/${orgId}/billing/subscription`
        )
      } catch (e) {
        const err = e as ApiError
        if (err.status === 404) return null
        throw e
      }
    },
  })

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['billing', 'plans'],
    queryFn: () => apiFetch<SubscriptionPlan[]>('/v1/billing/plans'),
  })

  const { data: packages, isLoading: packagesLoading } = useQuery({
    queryKey: ['billing', 'packages'],
    queryFn: () => apiFetch<TokenPackage[]>('/v1/billing/packages'),
  })

  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: ['billing', 'transactions', orgId],
    queryFn: () =>
      apiFetch<TransactionsResponse>(`/v1/orgs/${orgId}/billing/transactions`),
  })

  const portalMutation = useMutation({
    mutationFn: () =>
      apiFetch<{ url: string }>(
        `/v1/orgs/${orgId}/billing/portal?return_url=${encodeURIComponent(window.location.href)}`
      ),
    onSuccess: (data) => {
      window.open(data.url, '_blank', 'noopener,noreferrer')
    },
  })

  const handleCheckout = async (priceId: string, mode: 'subscription' | 'payment') => {
    setCheckoutLoading(priceId)
    try {
      const { url } = await apiFetch<{ url: string }>(
        `/v1/orgs/${orgId}/billing/checkout`,
        {
          method: 'POST',
          body: JSON.stringify({
            mode,
            price_id: priceId,
            success_url: `${window.location.origin}/orgs/${orgId}?billing=success`,
            cancel_url: `${window.location.origin}/orgs/${orgId}?billing=canceled`,
          }),
        }
      )
      window.location.href = url
    } catch {
      setCheckoutLoading(null)
    }
  }

  const onSubscriptionChanged = () => {
    queryClient.invalidateQueries({ queryKey: ['billing', 'subscription', orgId] })
    queryClient.invalidateQueries({ queryKey: ['billing', 'transactions', orgId] })
    queryClient.invalidateQueries({ queryKey: ['billing', 'subscription-status'] })
  }

  const hasSubscription = subscription != null

  return (
    <div className="space-y-8">
      {subscriptionLoading ? (
        <p className="text-sm text-[var(--sea-ink-soft)]">
          Loading subscription...
        </p>
      ) : hasSubscription ? (
        <SubscriptionDetails
          subscription={subscription}
          plans={plans ?? []}
          orgId={orgId}
          onPortal={portalMutation.mutate}
          portalPending={portalMutation.isPending}
          onChangePlan={onSubscriptionChanged}
        />
      ) : (
        <>
          <section>
            <h3 className="mb-4 text-lg font-semibold">Plans</h3>
            {plansLoading ? (
              <p className="text-sm text-[var(--sea-ink-soft)]">
                Loading plans...
              </p>
            ) : plans && plans.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    orgId={orgId}
                    onCheckout={(priceId) => handleCheckout(priceId, 'subscription')}
                    loading={checkoutLoading === plan.stripe_price_id}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--sea-ink-soft)]">
                No plans available.
              </p>
            )}
          </section>
          </>
      )}

      <section>
        <h3 className="mb-4 text-lg font-semibold">Token packages</h3>
        {packagesLoading ? (
          <p className="text-sm text-[var(--sea-ink-soft)]">Loading...</p>
        ) : packages && packages.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                orgId={orgId}
                onCheckout={(priceId) => handleCheckout(priceId, 'payment')}
                loading={checkoutLoading === pkg.stripe_price_id}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--sea-ink-soft)]">
            No token packages available.
          </p>
        )}
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Transactions</h3>
        {txLoading ? (
          <p className="text-sm text-[var(--sea-ink-soft)]">Loading...</p>
        ) : transactions ? (
          <TransactionTable
            subscriptionTransactions={transactions.subscription_transactions ?? []}
            creditTransactions={transactions.credit_transactions ?? []}
          />
        ) : null}
      </section>
    </div>
  )
}
