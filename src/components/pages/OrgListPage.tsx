import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '#/lib/api'
import type { Org } from '#/types'
import { OrgCard } from '#/components/features/orgs/OrgCard'
import { CreateOrgForm } from '#/components/features/orgs/CreateOrgForm'
import { EmptyState } from '#/components/shared/EmptyState'
import { OrgListSkeleton } from '#/components/shared/PageSkeleton'
import { Building2, Plus, ArrowRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, bounce: 0.4 } }
}

export function OrgListPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    data: orgs,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['orgs'],
    queryFn: () => apiFetch<Org[]>('/v1/orgs'),
  })

  const handleCreated = () => {
    setDialogOpen(false)
    refetch()
  }

  return (
    <main className="page-wrap py-10 min-h-[90vh]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--line)] pb-6"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--sea-ink)] display-title">
            Organizations
          </h1>
          <p className="mt-2 text-[var(--sea-ink-soft)] text-base">
            Manage workspaces, teams, and billing settings.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 rounded-xl bg-[var(--lagoon)] hover:bg-[var(--lagoon-deep)] text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 font-semibold px-6">
              <Plus className="mr-2 size-4.5" />
              New Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-6 shadow-2xl border-[var(--line)] bg-[var(--surface-strong)] backdrop-blur-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl display-title">Create workspace</DialogTitle>
            </DialogHeader>
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 shadow-sm mt-2">
                {error}
              </div>
            )}
            <div className="mt-4">
              <CreateOrgForm
                onCreated={handleCreated}
                onError={(msg) => setError(msg)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {isLoading ? (
        <OrgListSkeleton />
      ) : orgs && orgs.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          {orgs.map((org) => (
            <motion.div key={org.id} variants={item} className="h-full">
              <OrgCard org={org} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-12"
        >
          <EmptyState
            icon={<Building2 className="size-14 text-[var(--lagoon)] drop-shadow-md" />}
            title="No organizations yet"
            description="Create your first organization to set up your workspace and invite your team."
            action={
              <Button onClick={() => setDialogOpen(true)} className="h-12 rounded-full px-8 bg-[var(--lagoon)] hover:bg-[var(--lagoon-deep)] text-white font-semibold shadow-lg hover:shadow-[0_0_30px_-5px_var(--lagoon)] hover:-translate-y-0.5 transition-all mt-4">
                <Plus className="mr-2 size-5" />
                Create organization
                <ArrowRight className="ml-2 size-4" />
              </Button>
            }
          />
        </motion.div>
      )}
    </main>
  )
}
