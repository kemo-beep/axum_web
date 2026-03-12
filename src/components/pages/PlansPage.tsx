import { useBillingPlans, useBillingPackages } from '#/hooks/useBilling'
import { Card, CardContent, CardHeader } from '#/components/ui/card'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { formatPrice } from '#/lib/format'
import {
  staggerContainerSlow,
  staggerItemY30,
} from '#/lib/animations'
import { PageHeader } from '#/components/shared/PageHeader'
import { Check, CreditCard, Sparkles } from 'lucide-react'

export function PlansPage() {
  const { data: plans, isLoading: plansLoading } = useBillingPlans()
  const { data: packages, isLoading: packagesLoading } = useBillingPackages()

  return (
    <main className="page-wrap px-4 pb-12 pt-14 min-h-[90vh]">
      <PageHeader
        title="Billing & Plans"
        subtitle="Subscribe to a tier that fits your scale or purchase flexible token packages. Billing is managed securely per organization."
        action={
          <Link
            to="/orgs"
            className="h-11 inline-flex items-center rounded-xl bg-[var(--surface-strong)] border border-[var(--line)] shadow-sm px-6 text-sm font-semibold text-[var(--sea-ink)] hover:text-[var(--lagoon-deep)] hover:border-[var(--lagoon)]/50 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <CreditCard className="mr-2 size-4.5 text-[var(--lagoon)]" />
            Manage Organizations
          </Link>
        }
      />

      <section className="mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 mb-6"
        >
          <Sparkles className="size-5 text-[var(--lagoon)]" />
          <h2 className="text-2xl font-bold text-[var(--sea-ink)] display-title">
            Subscription Tiers
          </h2>
        </motion.div>

        {plansLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[400px] rounded-3xl bg-[var(--surface-strong)] animate-pulse border border-[var(--line)]"
              />
            ))}
          </div>
        ) : plans && plans.length > 0 ? (
          <motion.div
            variants={staggerContainerSlow}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {plans.map((plan) => (
              <motion.div key={plan.id} variants={staggerItemY30} className="h-full">
                <Card className="h-full relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface-strong)] backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-[var(--lagoon)]/10 hover:border-[var(--lagoon)]/30 transition-all duration-500 group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--lagoon)]/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[var(--lagoon)]/20 transition-colors duration-500" />

                  <CardHeader className="p-8 pb-6 border-b border-[var(--line)]/50 bg-gradient-to-br from-white/40 to-transparent">
                    <span className="text-sm font-bold tracking-widest uppercase text-[var(--lagoon)] mb-2 block">
                      {plan.name}
                    </span>
                    <div className="flex items-baseline gap-1 text-[var(--sea-ink)]">
                      <span className="text-4xl font-bold tracking-tight">
                        {formatPrice(plan.amount_cents, plan.currency)}
                      </span>
                      <span className="text-sm font-semibold text-[var(--sea-ink-soft)]">
                        {plan.interval === 'month'
                          ? '/ mo'
                          : plan.interval === 'year'
                            ? '/ yr'
                            : ''}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    {plan.features && Array.isArray(plan.features) && (
                      <ul className="space-y-4 mb-8">
                        {(plan.features as string[]).map((f: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-[15px] text-[var(--sea-ink)] font-medium"
                          >
                            <Check className="size-5 shrink-0 text-[var(--lagoon)]" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-8 pt-6 border-t border-[var(--line)]/50">
                      <p className="text-sm font-medium text-[var(--sea-ink-soft)] bg-[var(--sea-ink)]/5 p-3 rounded-xl border border-[var(--line)] text-center">
                        Subscribe from an organization&apos;s Billing tab.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-[var(--sea-ink-soft)] font-medium p-4 rounded-xl bg-[var(--surface-strong)] border border-[var(--line)]">
            No active subscription plans available.
          </p>
        )}
      </section>

      <section className="mb-8">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 text-2xl font-bold text-[var(--sea-ink)] display-title"
        >
          Flexible Token Packages
        </motion.h2>

        {packagesLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-32 rounded-3xl bg-[var(--surface-strong)] animate-pulse border border-[var(--line)]"
              />
            ))}
          </div>
        ) : packages && packages.length > 0 ? (
          <motion.div
            variants={staggerContainerSlow}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {packages.map((pkg) => (
              <motion.div key={pkg.id} variants={staggerItemY30}>
                <Card className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] backdrop-blur-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--lagoon)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="p-6 pb-2 relative z-10">
                    <span className="text-sm font-semibold tracking-wide text-[var(--sea-ink-soft)] group-hover:text-[var(--lagoon)] transition-colors">
                      {pkg.name}
                    </span>
                    <span className="text-3xl font-bold tracking-tight text-[var(--sea-ink)] block mt-1">
                      {formatPrice(pkg.amount_cents, pkg.currency ?? 'usd')}
                    </span>
                  </CardHeader>
                  <CardContent className="p-6 pt-2 relative z-10">
                    <div className="mt-4 flex items-center justify-between text-sm font-semibold text-[var(--sea-ink)] border-t border-[var(--line)] pt-3">
                      <span>Volume allocation</span>
                      <span className="px-2.5 py-1 bg-[var(--sea-ink)]/5 rounded-md">
                        {pkg.tokens.toLocaleString()} tokens
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-[var(--sea-ink-soft)] font-medium p-4 rounded-xl bg-[var(--surface-strong)] border border-[var(--line)]">
            No token packages currently available.
          </p>
        )}
      </section>
    </main>
  )
}
