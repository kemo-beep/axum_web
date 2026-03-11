import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader } from '#/components/ui/card'
import type { SubscriptionPlan } from '#/types'

interface PlanCardProps {
  plan: SubscriptionPlan
  orgId: string
  onCheckout: (priceId: string) => void
  loading?: boolean
  currentPlanId?: string
  currentPlanAmountCents?: number
  onChangePlan?: (priceId: string) => void
  changePlanLoading?: string | null
}

export function PlanCard({
  plan,
  orgId,
  onCheckout,
  loading = false,
  currentPlanId,
  currentPlanAmountCents = 0,
  onChangePlan,
  changePlanLoading = null,
}: PlanCardProps) {
  const price = plan.amount_cents
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: (plan.currency || 'usd').toUpperCase(),
      }).format(plan.amount_cents / 100)
    : 'Custom'

  const interval =
    plan.interval === 'month'
      ? '/month'
      : plan.interval === 'year'
        ? '/year'
        : ''

  const isCurrentPlan = currentPlanId != null && currentPlanId === plan.id
  const isChangePlanMode = currentPlanId != null && onChangePlan != null
  const isUpgrade =
    isChangePlanMode && plan.amount_cents > currentPlanAmountCents
  const isDowngrade =
    isChangePlanMode && plan.amount_cents < currentPlanAmountCents
  const changeLoading = changePlanLoading === plan.stripe_price_id

  const renderButton = () => {
    if (isCurrentPlan) {
      return (
        <Button disabled variant="secondary">
          Current plan
        </Button>
      )
    }
    if (isChangePlanMode && onChangePlan) {
      const label = changeLoading
        ? 'Changing...'
        : isUpgrade
          ? `Upgrade to ${plan.name}`
          : isDowngrade
            ? `Downgrade to ${plan.name}`
            : 'Switch'
      return (
        <Button
          onClick={() => onChangePlan(plan.stripe_price_id)}
          disabled={changeLoading}
        >
          {label}
        </Button>
      )
    }
    return (
      <Button
        onClick={() => onCheckout(plan.stripe_price_id)}
        disabled={loading}
      >
        {loading ? 'Redirecting...' : 'Subscribe'}
      </Button>
    )
  }

  return (
    <Card className="rounded-xl border-[var(--line)] shadow-sm transition-all hover:shadow-md">
      <CardHeader>
        <span className="text-lg font-semibold">{plan.name}</span>
        <span className="text-2xl font-bold">
          {price}
          {interval}
        </span>
      </CardHeader>
      <CardContent>
        {plan.features && Array.isArray(plan.features) && (
          <ul className="mb-4 list-disc space-y-1 pl-4 text-sm text-[var(--sea-ink-soft)]">
            {(plan.features as string[]).map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        )}
        {renderButton()}
      </CardContent>
    </Card>
  )
}
