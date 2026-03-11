import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '#/lib/api'
import type { SubscriptionPlan, TokenPackage } from '#/types'
import { Card, CardContent, CardHeader } from '#/components/ui/card'
import { Link } from '@tanstack/react-router'

export function PlansPage() {
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['billing', 'plans'],
    queryFn: () => apiFetch<SubscriptionPlan[]>('/v1/billing/plans'),
  })

  const { data: packages, isLoading: packagesLoading } = useQuery({
    queryKey: ['billing', 'packages'],
    queryFn: () => apiFetch<TokenPackage[]>('/v1/billing/packages'),
  })

  const formatPrice = (cents: number, currency: string) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: (currency || 'usd').toUpperCase(),
    }).format(cents / 100)

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <h1 className="mb-8 text-2xl font-bold text-[var(--sea-ink)]">
        Billing
      </h1>

      <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">
        Subscribe to a plan or purchase token packages. Billing is managed per
        organization from the org detail page.
      </p>

      <Link
        to="/orgs"
        className="mb-8 inline-block text-sm text-[var(--lagoon)] underline"
      >
        Go to organizations
      </Link>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold">Subscription plans</h2>
        {plansLoading ? (
          <p className="text-sm text-[var(--sea-ink-soft)]">Loading...</p>
        ) : plans && plans.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <span className="text-lg font-semibold">{plan.name}</span>
                  <span className="text-2xl font-bold">
                    {formatPrice(plan.amount_cents, plan.currency)}
                    {plan.interval === 'month'
                      ? '/month'
                      : plan.interval === 'year'
                        ? '/year'
                        : ''}
                  </span>
                </CardHeader>
                <CardContent>
                  {plan.features && Array.isArray(plan.features) && (
                    <ul className="list-disc space-y-1 pl-4 text-sm text-[var(--sea-ink-soft)]">
                      {(plan.features as string[]).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-4 text-sm text-[var(--sea-ink-soft)]">
                    Subscribe from an org&apos;s Billing tab.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--sea-ink-soft)]">
            No plans available.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Token packages</h2>
        {packagesLoading ? (
          <p className="text-sm text-[var(--sea-ink-soft)]">Loading...</p>
        ) : packages && packages.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg) => (
              <Card key={pkg.id}>
                <CardHeader>
                  <span className="text-lg font-semibold">{pkg.name}</span>
                  <span className="text-2xl font-bold">
                    {formatPrice(pkg.amount_cents, pkg.currency ?? 'usd')}
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--sea-ink-soft)]">
                    {pkg.tokens} tokens
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--sea-ink-soft)]">
            No packages available.
          </p>
        )}
      </section>
    </main>
  )
}
