import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '#/lib/api'
import type { ApiError } from '#/lib/api'
import type { SubscriptionPlan, SubscriptionWithPlan, TokenPackage } from '#/types'
import { useOrg } from '#/hooks/useOrg'
import { Link } from '@tanstack/react-router'
import { PlanCard } from '#/components/features/billing/PlanCard'
import { PackageCard } from '#/components/features/billing/PackageCard'
import { CreditCard, Coins, Building2 } from 'lucide-react'

export function StorePage() {
  const queryClient = useQueryClient()
  const { selectedOrgId } = useOrg()
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('billing') === 'success' && selectedOrgId) {
      queryClient.invalidateQueries({ queryKey: ['billing', 'subscription', selectedOrgId] })
      queryClient.invalidateQueries({ queryKey: ['billing', 'credits', selectedOrgId] })
      queryClient.invalidateQueries({ queryKey: ['billing', 'transactions', selectedOrgId] })
      queryClient.invalidateQueries({ queryKey: ['billing', 'subscription-status'] })
      window.history.replaceState({}, '', '/store')
    }
  }, [selectedOrgId, queryClient])

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['billing', 'plans'],
    queryFn: () => apiFetch<SubscriptionPlan[]>('/v1/billing/plans'),
  })

  const { data: subscription } = useQuery({
    queryKey: ['billing', 'subscription', selectedOrgId],
    queryFn: async (): Promise<SubscriptionWithPlan | null> => {
      if (!selectedOrgId) return null
      try {
        return await apiFetch<SubscriptionWithPlan>(
          `/v1/orgs/${selectedOrgId}/billing/subscription`,
        )
      } catch (e) {
        const err = e as ApiError
        if (err.status === 404) return null
        throw e
      }
    },
    enabled: !!selectedOrgId,
  })

  const { data: packages, isLoading: packagesLoading } = useQuery({
    queryKey: ['billing', 'packages'],
    queryFn: () => apiFetch<TokenPackage[]>('/v1/billing/packages'),
  })

  const [changePlanLoading, setChangePlanLoading] = useState<string | null>(null)

  const handleCheckout = async (
    priceId: string,
    mode: 'subscription' | 'payment',
  ) => {
    if (!selectedOrgId) return
    setCheckoutLoading(priceId)
    try {
      const { url } = await apiFetch<{ url: string }>(
        `/v1/orgs/${selectedOrgId}/billing/checkout`,
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
  }

  const handleChangePlan = async (priceId: string) => {
    if (!selectedOrgId) return
    setChangePlanLoading(priceId)
    try {
      await apiFetch(`/v1/orgs/${selectedOrgId}/billing/subscription/change-plan`, {
        method: 'POST',
        body: JSON.stringify({ price_id: priceId }),
      })
      queryClient.invalidateQueries({ queryKey: ['billing', 'subscription', selectedOrgId] })
      queryClient.invalidateQueries({ queryKey: ['billing', 'transactions', selectedOrgId] })
      queryClient.invalidateQueries({ queryKey: ['billing', 'subscription-status'] })
    } finally {
      setChangePlanLoading(null)
    }
  }

  return (
    <main className="page-wrap px-4 pb-12 pt-14 min-h-[90vh]">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--sea-ink)]">
            Store
          </h1>
          <p className="mt-1.5 text-[var(--sea-ink-soft)] text-sm max-w-xl">
            Subscribe to a plan or purchase token packages. Billing is per organization.
          </p>
        </div>
        {selectedOrgId ? (
          <Link
            to="/orgs/$orgId"
            params={{ orgId: selectedOrgId }}
            search={{ tab: 'billing' }}
            className="text-sm font-medium text-[var(--lagoon)] hover:underline"
          >
            View billing & transactions
          </Link>
        ) : (
          <Link
            to="/orgs"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--sea-ink)] hover:bg-[var(--line)]/30"
          >
            <Building2 className="size-4" />
            Select organization to purchase
          </Link>
        )}
      </div>

      {/* Subscription plans (recurring) */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-2">
          <CreditCard className="size-5 text-[var(--lagoon)]" />
          <h2 className="text-xl font-semibold text-[var(--sea-ink)]">
            Subscription plans
          </h2>
          <span className="text-xs text-[var(--sea-ink-soft)]">(recurring billing)</span>
        </div>

        {plansLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-xl bg-[var(--surface)] animate-pulse border border-[var(--line)]"
              />
            ))}
          </div>
        ) : plans && plans.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                orgId={selectedOrgId ?? ''}
                onCheckout={(priceId) => handleCheckout(priceId, 'subscription')}
                loading={checkoutLoading === plan.stripe_price_id}
                currentPlanId={subscription?.plan?.id}
                currentPlanAmountCents={subscription?.plan?.amount_cents ?? 0}
                onChangePlan={handleChangePlan}
                changePlanLoading={changePlanLoading}
              />
            ))}
          </div>
        ) : (
          <p className="text-[var(--sea-ink-soft)] text-sm p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
            No subscription plans available.
          </p>
        )}
      </section>

      {/* Token packages (one-time purchase) */}
      <section>
        <div className="mb-6 flex items-center gap-2">
          <Coins className="size-5 text-[var(--lagoon)]" />
          <h2 className="text-xl font-semibold text-[var(--sea-ink)]">
            Token packages
          </h2>
          <span className="text-xs text-[var(--sea-ink-soft)]">(one-time purchase, adds credits)</span>
        </div>

        {packagesLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-40 rounded-xl bg-[var(--surface)] animate-pulse border border-[var(--line)]"
              />
            ))}
          </div>
        ) : packages && packages.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                orgId={selectedOrgId ?? ''}
                onCheckout={(priceId) => handleCheckout(priceId, 'payment')}
                loading={checkoutLoading === pkg.stripe_price_id}
                disabled={!selectedOrgId}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center">
            <p className="text-[var(--sea-ink-soft)] font-medium">
              No token packages available at the moment.
            </p>
            <Link
              to="/billing/plans"
              className="mt-3 inline-block text-sm font-medium text-[var(--lagoon)] hover:underline"
            >
              View billing plans
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
