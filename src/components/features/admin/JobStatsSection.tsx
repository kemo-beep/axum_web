import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '#/lib/api'
import type { JobStats } from '#/types'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Skeleton } from '#/components/ui/skeleton'

export function JobStatsSection() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin', 'job-stats'],
    queryFn: () => apiFetch<JobStats>('/internal/job-stats'),
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-[var(--line)]">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-6 text-red-700 dark:text-red-400">
        {error instanceof Error ? error.message : 'Failed to load job stats'}
      </div>
    )
  }

  const items = [
    { label: 'Enqueued', value: stats.enqueue },
    { label: 'Success', value: stats.success },
    { label: 'Failed', value: stats.fail },
    { label: 'Dead letter', value: stats.dead_letter },
    {
      label: 'Last latency (ms)',
      value: stats.last_latency_ms ?? '—',
    },
    { label: 'Latency samples', value: stats.latency_sample_count },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ label, value }) => (
        <Card
          key={label}
          className="border-[var(--line)] bg-[var(--surface)]"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--sea-ink-soft)]">
              {label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-[var(--sea-ink)]">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
