import { Link } from '@tanstack/react-router'
import { PlanCard } from '#/components/features/billing/PlanCard'
import { PackageCard } from '#/components/features/billing/PackageCard'
import { useOrg } from '#/hooks/useOrg'
import {
  useBillingPlans,
  useBillingPackages,
  useBillingSubscription,
  useStoreCheckout,
} from '#/hooks/useBilling'
import { PageHeader } from '#/components/shared/PageHeader'
import { Building2, CreditCard, Coins } from 'lucide-react'

export function StorePage() {
  const { selectedOrgId } = useOrg()
  const orgId = selectedOrgId ?? undefined
  const { data: plans, isLoading: plansLoading } = useBillingPlans()
  const { data: packages, isLoading: packagesLoading } = useBillingPackages()
  const { data: subscription } = useBillingSubscription(orgId)
  const {
    handleCheckout,
    handleChangePlan,
    checkoutLoading,
    changePlanLoading,
  } = useStoreCheckout(orgId)

  const headerAction = orgId ? (
    <Link
      to="/orgs/$orgId"
      params={{ orgId }}
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
  )

  return (
    <main className="page-wrap px-4 pb-12 pt-14 min-h-[90vh]">
      <PageHeader
        title="Store"
        subtitle="Subscribe to a plan or purchase token packages. Billing is per organization."
        action={headerAction}
        size="sm"
      />

      <section className="mb-12">
        <div className="mb-6 flex items-center gap-2">
          <CreditCard className="size-5 text-[var(--lagoon)]" />
          <h2 className="text-xl font-semibold text-[var(--sea-ink)]">
            Subscription plans
          </h2>
          <span className="text-xs text-[var(--sea-ink-soft)]">
            (recurring billing)
          </span>
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
                orgId={orgId ?? ''}
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

      <section>
        <div className="mb-6 flex items-center gap-2">
          <Coins className="size-5 text-[var(--lagoon)]" />
          <h2 className="text-xl font-semibold text-[var(--sea-ink)]">
            Token packages
          </h2>
          <span className="text-xs text-[var(--sea-ink-soft)]">
            (one-time purchase, adds credits)
          </span>
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
                orgId={orgId ?? ''}
                onCheckout={(priceId) => handleCheckout(priceId, 'payment')}
                loading={checkoutLoading === pkg.stripe_price_id}
                disabled={!orgId}
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
