import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '#/lib/api'
import type { FeatureFlagItem } from '#/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { Switch } from '#/components/ui/switch'
import { Skeleton } from '#/components/ui/skeleton'
import { toast } from 'sonner'

export function FeatureFlagsSection() {
  const queryClient = useQueryClient()
  const { data: flags, isLoading, error } = useQuery({
    queryKey: ['admin', 'feature-flags'],
    queryFn: () => apiFetch<FeatureFlagItem[]>('/internal/feature-flags'),
  })

  const setFlagMutation = useMutation({
    mutationFn: async ({
      name,
      orgId,
      enabled,
    }: {
      name: string
      orgId: string | null
      enabled: boolean
    }) => {
      const url = orgId
        ? `/internal/feature-flags/${encodeURIComponent(name)}?org_id=${encodeURIComponent(orgId)}`
        : `/internal/feature-flags/${encodeURIComponent(name)}`
      return apiFetch(url, {
        method: 'PUT',
        body: JSON.stringify({ enabled }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'feature-flags'] })
      toast.success('Feature flag updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update flag')
    },
  })

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--line)] overflow-hidden">
        <Skeleton className="h-12 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-none" />
        ))}
      </div>
    )
  }

  if (error || !flags) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-6 text-red-700 dark:text-red-400">
        {error instanceof Error ? error.message : 'Failed to load feature flags'}
      </div>
    )
  }

  if (flags.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--line)] p-8 text-center text-[var(--sea-ink-soft)]">
        No feature flags configured.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[var(--line)] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-[var(--line)] bg-[var(--surface)]">
            <TableHead className="text-[var(--sea-ink-soft)]">Name</TableHead>
            <TableHead className="text-[var(--sea-ink-soft)]">Scope</TableHead>
            <TableHead className="text-[var(--sea-ink-soft)]">Enabled</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flags.map((flag) => (
            <TableRow key={`${flag.name}-${flag.org_id ?? 'global'}`}>
              <TableCell className="font-medium text-[var(--sea-ink)]">
                {flag.name}
              </TableCell>
              <TableCell className="text-[var(--sea-ink-soft)]">
                {flag.org_id ?? 'Global'}
              </TableCell>
              <TableCell>
                <Switch
                  checked={flag.enabled}
                  disabled={setFlagMutation.isPending}
                  onCheckedChange={(enabled) => {
                    setFlagMutation.mutate({
                      name: flag.name,
                      orgId: flag.org_id,
                      enabled,
                    })
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
