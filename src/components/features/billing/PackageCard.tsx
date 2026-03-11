import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader } from '#/components/ui/card'
import type { TokenPackage } from '#/types'

interface PackageCardProps {
  pkg: TokenPackage
  orgId: string
  onCheckout: (priceId: string) => void
  loading?: boolean
}

export function PackageCard({
  pkg,
  onCheckout,
  loading = false,
}: PackageCardProps) {
  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (pkg.currency || 'usd').toUpperCase(),
  }).format(pkg.amount_cents / 100)

  return (
    <Card className="rounded-xl border-[var(--line)] shadow-sm transition-all hover:shadow-md">
      <CardHeader>
        <span className="text-lg font-semibold">{pkg.name}</span>
        <span className="text-2xl font-bold">{price}</span>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-[var(--sea-ink-soft)]">
          {pkg.tokens.toLocaleString()} tokens
        </p>
        <Button
          onClick={() => onCheckout(pkg.stripe_price_id)}
          disabled={loading}
          variant="outline"
        >
          {loading ? 'Redirecting...' : 'Purchase'}
        </Button>
      </CardContent>
    </Card>
  )
}
