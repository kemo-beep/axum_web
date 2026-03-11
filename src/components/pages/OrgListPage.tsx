import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '#/lib/api'
import type { Org } from '#/types'
import { OrgCard } from '#/components/features/orgs/OrgCard'
import { CreateOrgForm } from '#/components/features/orgs/CreateOrgForm'
import { EmptyState } from '#/components/shared/EmptyState'
import { OrgListSkeleton } from '#/components/shared/PageSkeleton'
import { Building2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Plus } from 'lucide-react'

export function OrgListPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: orgs, isLoading, refetch } = useQuery({
    queryKey: ['orgs'],
    queryFn: () => apiFetch<Org[]>('/v1/orgs'),
  })

  const handleCreated = () => {
    setDialogOpen(false)
    refetch()
  }

  return (
    <main className="page-wrap">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">
          Organizations
        </h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              Create org
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create organization</DialogTitle>
            </DialogHeader>
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
            <CreateOrgForm
              onCreated={handleCreated}
              onError={(msg) => setError(msg)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <OrgListSkeleton />
      ) : orgs && orgs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {orgs.map((org) => (
            <OrgCard key={org.id} org={org} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Building2 className="size-12" />}
          title="No organizations yet"
          description="Create your first organization to collaborate with your team."
          action={
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 size-4" />
              Create organization
            </Button>
          }
        />
      )}
    </main>
  )
}
