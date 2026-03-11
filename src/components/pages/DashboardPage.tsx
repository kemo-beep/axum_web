import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '#/lib/api'
import type { Org } from '#/types'
import { useAuth } from '#/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { EmptyState } from '#/components/shared/EmptyState'
import { DashboardSkeleton } from '#/components/shared/PageSkeleton'
import { Building2, ArrowUpRight, FolderKey, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, bounce: 0.4 },
  },
}

export function DashboardPage() {
  const { user } = useAuth()
  const { data: orgs, isLoading } = useQuery({
    queryKey: ['orgs'],
    queryFn: () => apiFetch<Org[]>('/v1/orgs'),
  })

  if (isLoading) {
    return (
      <main className="page-wrap py-8">
        <DashboardSkeleton />
      </main>
    )
  }

  return (
    <main className="page-wrap py-10 min-h-[90vh]">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-[var(--sea-ink)] display-title">
            Overview
          </h1>
          <p className="text-base text-[var(--sea-ink-soft)] font-medium">
            Welcome back,{' '}
            <span className="text-[var(--sea-ink)]">{user?.email}</span>
          </p>
        </div>

        <div className="flex bg-[var(--surface-strong)] p-1.5 rounded-[1.25rem] border border-[var(--line)] shadow-sm backdrop-blur-md">
          <Link
            to="/orgs"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--surface)] text-[var(--sea-ink)] shadow-sm border border-[var(--line)] flex items-center gap-2 transition hover:border-[var(--lagoon)] hover:text-[var(--lagoon-deep)]"
          >
            <Building2 className="size-4" />
            Organizations
          </Link>
          <Link
            to="/api-keys"
            className="px-5 py-2.5 text-sm font-medium text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] transition flex items-center gap-2 hover:bg-[var(--surface)] rounded-xl"
          >
            <FolderKey className="size-4" />
            API Keys
          </Link>
          <Link
            to="/billing/plans"
            className="px-5 py-2.5 text-sm font-medium text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] transition flex items-center gap-2 hover:bg-[var(--surface)] rounded-xl"
          >
            <CreditCard className="size-4" />
            Billing
          </Link>
        </div>
      </motion.section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--sea-ink)] display-title">
            Your organizations
          </h2>
          {orgs && orgs.length > 0 && (
            <Link
              to="/orgs"
              className="text-sm font-semibold text-[var(--lagoon-deep)] hover:text-[var(--lagoon)] flex items-center gap-1 group bg-[var(--lagoon)]/10 px-4 py-2 rounded-full border border-[var(--lagoon)]/20 transition-all hover:bg-[var(--lagoon)]/20"
            >
              View all
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          )}
        </div>

        {orgs && orgs.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {orgs.map((org) => (
              <motion.div key={org.id} variants={item}>
                <Link
                  to="/orgs/$orgId"
                  params={{ orgId: org.id }}
                  className="block h-full outline-none group text-left"
                >
                  <Card className="h-full border border-[var(--line)] bg-gradient-to-br from-[var(--surface-strong)] to-[var(--surface)] shadow-md hover:shadow-2xl hover:shadow-[var(--lagoon)]/10 hover:border-[var(--lagoon)]/40 transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-[var(--lagoon)] rounded-3xl overflow-hidden relative group-hover:-translate-y-1.5 backdrop-blur-xl group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-white/90">
                    <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                      <ArrowUpRight className="size-5 text-[var(--lagoon)]" />
                    </div>
                    <CardHeader className="pb-2 pt-7 px-7">
                      <div className="size-12 rounded-[1rem] bg-[var(--lagoon)]/10 text-[var(--lagoon)] flex items-center justify-center mb-5 border border-[var(--lagoon)]/20 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        <Building2 className="size-6" />
                      </div>
                      <CardTitle className="text-xl font-bold tracking-tight text-[var(--sea-ink)] group-hover:text-[var(--lagoon-deep)] transition-colors">
                        {org.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-7 pb-7">
                      <p className="text-sm font-medium text-[var(--sea-ink-soft)] bg-[var(--sea-ink)]/5 inline-flex px-3 py-1 rounded-md border border-[var(--line)]">
                        {org.slug}
                      </p>
                      <div className="mt-6 pt-5 border-t border-[var(--line)] flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-widest">
                          Status
                        </span>
                        <span className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--palm)]/10 border border-[var(--palm)]/20">
                          <span className="size-1.5 rounded-full bg-[var(--palm)] animate-pulse shadow-[0_0_8px_var(--palm)]" />
                          <span className="text-[10px] font-bold text-[var(--palm)] uppercase tracking-wider">
                            Active
                          </span>
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <EmptyState
              icon={
                <Building2 className="size-14 text-[var(--lagoon)] drop-shadow-md" />
              }
              title="No organizations yet"
              description="Create your first organization to set up your workspace and invite your team."
              action={
                <Link to="/orgs">
                  <button
                    type="button"
                    className="rounded-full bg-[var(--lagoon)] px-8 py-3.5 text-sm font-bold tracking-wide text-white shadow-xl shadow-[var(--lagoon)]/25 transition-all hover:scale-105 hover:bg-[var(--lagoon-deep)] focus:outline-none focus:ring-4 focus:ring-[var(--lagoon)]/30 active:scale-95 border border-[var(--lagoon-deep)]"
                  >
                    Create organization
                  </button>
                </Link>
              }
            />
          </motion.div>
        )}
      </section>
    </main>
  )
}
