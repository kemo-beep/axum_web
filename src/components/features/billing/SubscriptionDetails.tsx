import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '#/components/ui/button'
import { apiFetch } from '#/lib/api'
import type { SubscriptionPlan, SubscriptionWithPlan } from '#/types'
import { PlanCard } from './PlanCard'

interface SubscriptionDetailsProps {
  subscription: SubscriptionWithPlan
  plans: SubscriptionPlan[]
  orgId: string
  onPortal: () => void
  portalPending: boolean
  onChangePlan: () => void
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  catch {
    return '—'
  }
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Active',
    trialing: 'Trial',
    past_due: 'Past due',
    unpaid: 'Unpaid',
    canceled: 'Canceled',
  }
  return labels[status] ?? status
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'trialing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    case 'past_due':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    default:
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
  }
}

export function SubscriptionDetails({
  subscription,
  plans,
  orgId,
  onPortal,
  portalPending,
  onChangePlan,
}: SubscriptionDetailsProps) {
  const queryClient = useQueryClient()
  const [changePlanLoading, setChangePlanLoading] = useState<string | null>(null)

  const changePlanMutation = useMutation({
    mutationFn: (priceId: string) =>
      apiFetch<{ ok: boolean }>(
        `/v1/orgs/${orgId}/billing/subscription/change-plan`,
        {
          method: 'POST',
          body: JSON.stringify({ price_id: priceId }),
        }
      ),
    onSuccess: () => {
      setChangePlanLoading(null)
      onChangePlan()
    },
    onError: () => {
      setChangePlanLoading(null)
    },
  })

  const handleChangePlan = (priceId: string) => {
    setChangePlanLoading(priceId)
    changePlanMutation.mutate(priceId)
  }

  const currentPlan = subscription.plan
  const currentAmountCents = currentPlan?.amount_cents ?? 0

  // Sort plans by amount to find next upper and lower tier
  const sortedByAmount = [...plans].sort((a, b) => a.amount_cents - b.amount_cents)
  const nextUpperPlan = sortedByAmount.find((p) => p.amount_cents > currentAmountCents)
  const nextLowerPlan = [...sortedByAmount].reverse().find((p) => p.amount_cents < currentAmountCents)
  const hasUpgradeOrDowngrade = nextUpperPlan != null || nextLowerPlan != null

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-4 text-lg font-semibold">Subscription</h3>
        <div className="rounded-lg border border-[var(--line)] bg-[var(--card-bg)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {currentPlan?.name ?? 'Current plan'}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(subscription.status)}`}
                >
                  {statusLabel(subscription.status)}
                </span>
              </div>
              {currentPlan && (
                <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: (currentPlan.currency || 'usd').toUpperCase(),
                  }).format(currentPlan.amount_cents / 100)}
                  /{currentPlan.interval === 'month' ? 'month' : currentPlan.interval === 'year' ? 'year' : currentPlan.interval}
                </p>
              )}
              {subscription.status === 'trialing' && subscription.trial_end ? (
                <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
                  Trial ends on {formatDate(subscription.trial_end)}
                </p>
              ) : (
                <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
                  Next billing: {formatDate(subscription.current_period_end)}
                </p>
              )}
              {subscription.status === 'past_due' && (
                <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                  Update your payment method to avoid losing access.
                </p>
              )}
              {subscription.cancel_at_period_end && (
                <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                  Cancels on {formatDate(subscription.current_period_end)}. You can resume your subscription in the portal before then.
                </p>
              )}
            </div>
            <Button
              variant="outline"
              onClick={onPortal}
              disabled={portalPending}
            >
              {portalPending ? 'Opening...' : 'Manage billing'}
            </Button>
          </div>
        </div>
      </section>

      {hasUpgradeOrDowngrade && (
        <section>
          <h3 className="mb-4 text-lg font-semibold">Change plan</h3>
          <div className="flex flex-wrap gap-3">
            {nextUpperPlan && (
              <PlanCard
                key={nextUpperPlan.id}
                plan={nextUpperPlan}
                orgId={orgId}
                onCheckout={() => {}}
                loading={false}
                currentPlanId={currentPlan?.id}
                currentPlanAmountCents={currentAmountCents}
                onChangePlan={handleChangePlan}
                changePlanLoading={changePlanLoading}
              />
            )}
            {nextLowerPlan && (
              <PlanCard
                key={nextLowerPlan.id}
                plan={nextLowerPlan}
                orgId={orgId}
                onCheckout={() => {}}
                loading={false}
                currentPlanId={currentPlan?.id}
                currentPlanAmountCents={currentAmountCents}
                onChangePlan={handleChangePlan}
                changePlanLoading={changePlanLoading}
              />
            )}
          </div>
        </section>
      )}
    </div>
  )
}
