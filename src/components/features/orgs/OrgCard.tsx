import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader } from '#/components/ui/card'
import type { Org } from '#/types'

interface OrgCardProps {
  org: Org
}

export function OrgCard({ org }: OrgCardProps) {
  return (
    <Link to="/orgs/$orgId" params={{ orgId: org.id }}>
      <Card className="h-full rounded-xl border-[var(--line)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--lagoon)] hover:shadow-md">
        <CardHeader className="pb-2">
          <span className="text-base font-semibold">{org.name}</span>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--sea-ink-soft)]">{org.slug}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
