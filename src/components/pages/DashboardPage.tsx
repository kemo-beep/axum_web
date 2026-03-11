import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '#/lib/api'
import type { Org } from '#/types'
import { useAuth } from '#/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { EmptyState } from '#/components/shared/EmptyState'
import { DashboardSkeleton } from '#/components/shared/PageSkeleton'
import { Building2 } from 'lucide-react'

export function DashboardPage() {
  const { user } = useAuth()
  const { data: orgs, isLoading } = useQuery({
    queryKey: ['orgs'],
    queryFn: () => apiFetch<Org[]>('/v1/orgs'),
  })

  if (isLoading) {
    return (
      <main className="page-wrap">
        <DashboardSkeleton />
      </main>
    )
  }

  return (
    <main className="page-wrap">
      <section className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-[var(--sea-ink)]">
          Dashboard
        </h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          Welcome, {user?.email}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-[var(--sea-ink)]">
          Your organizations
        </h2>
        {orgs && orgs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {orgs.map((org) => (
              <Link key={org.id} to="/orgs/$orgId" params={{ orgId: org.id }}>
                <Card className="h-full transition hover:border-[var(--lagoon)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{org.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[var(--sea-ink-soft)]">
                      {org.slug}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Building2 className="size-12" />}
            title="No organizations yet"
            description="Create your first organization to get started."
            action={
              <Link to="/orgs">
                <button
                  type="button"
                  className="rounded-lg bg-[var(--lagoon)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Create organization
                </button>
              </Link>
            }
          />
        )}
      </section>

      <section>
        <div className="flex flex-wrap gap-4">
          <Link to="/orgs">
            <span className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]">
              Orgs
            </span>
          </Link>
          <Link to="/billing/plans">
            <span className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]">
              Billing
            </span>
          </Link>
          <Link to="/api-keys">
            <span className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]">
              API Keys
            </span>
          </Link>
        </div>
      </section>
    </main>
  )
}
