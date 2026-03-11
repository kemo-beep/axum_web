import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { toast } from 'sonner'
import { apiFetch } from '#/lib/api'
import type { Org, OrgMember, Workspace } from '#/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { MemberTable } from '#/components/features/orgs/MemberTable'
import { InviteForm } from '#/components/features/orgs/InviteForm'
import { WorkspaceList } from '#/components/features/orgs/WorkspaceList'
import { OrgBillingTab } from '#/components/features/billing/OrgBillingTab'
import { Breadcrumbs } from '#/components/shared/Breadcrumbs'
import { OrgDetailSkeleton } from '#/components/shared/PageSkeleton'
import { motion, AnimatePresence } from 'framer-motion'

type OrgDetailPageProps = {
  tab: string
}

export function OrgDetailPage({ tab }: OrgDetailPageProps) {
  const { orgId } = useParams({ strict: false })
  const queryClient = useQueryClient()

  const { data: org, isLoading: orgLoading } = useQuery({
    queryKey: ['org', orgId],
    queryFn: () => apiFetch<Org>(`/v1/orgs/${orgId}`),
  })

  // Ensure members API matches OrgMember interface logic if needed
  const { data: members, refetch: refetchMembers } = useQuery({
    queryKey: ['org', orgId, 'members'],
    queryFn: () => apiFetch<OrgMember[]>(`/v1/orgs/${orgId}/members`),
  })

  const { data: workspaces, refetch: refetchWorkspaces } = useQuery({
    queryKey: ['org', orgId, 'workspaces'],
    queryFn: () => apiFetch<Workspace[]>(`/v1/orgs/${orgId}/workspaces`),
  })

  const refetchAll = () => {
    refetchMembers()
    refetchWorkspaces()
    queryClient.invalidateQueries({ queryKey: ['org', orgId] })
  }

  if (orgLoading || !org) {
    return (
      <main className="page-wrap py-8">
        <OrgDetailSkeleton />
      </main>
    )
  }

  // Animation variants
  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  }

  return (
    <main className="page-wrap py-8 min-h-[90vh]">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Breadcrumbs
          items={[
            { label: 'Organizations', href: '/orgs' },
            { label: org.name }
          ]}
        />
        <div className="mt-6 mb-8 pb-6 border-b border-[var(--line)]">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--sea-ink)] display-title tracking-tight">
            {org.name}
          </h1>
          <p className="mt-2 text-sm font-medium text-[var(--sea-ink-soft)] bg-[var(--sea-ink)]/5 inline-flex px-3 py-1 rounded-md border border-[var(--line)]">
            {org.slug}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-2 sm:p-6 shadow-xl backdrop-blur-2xl"
      >
        <Tabs value={tab} className="w-full">
          <TabsList className="bg-[var(--surface)] p-1.5 rounded-2xl h-14 border border-[var(--line)] shadow-inner w-full flex overflow-x-auto justify-start sm:justify-center">
            <TabsTrigger value="members" asChild className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[var(--lagoon-deep)] transition-all">
              <Link to="/orgs/$orgId" params={{ orgId: orgId as string }} search={{}}>
                Members
              </Link>
            </TabsTrigger>
            <TabsTrigger value="workspaces" asChild className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[var(--lagoon-deep)] transition-all">
              <Link
                to="/orgs/$orgId"
                params={{ orgId: orgId as string }}
                search={{ tab: 'workspaces' }}
              >
                Workspaces
              </Link>
            </TabsTrigger>
            <TabsTrigger value="invites" asChild className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[var(--lagoon-deep)] transition-all">
              <Link
                to="/orgs/$orgId"
                params={{ orgId: orgId as string }}
                search={{ tab: 'invites' }}
              >
                Invites
              </Link>
            </TabsTrigger>
            <TabsTrigger value="billing" asChild className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[var(--lagoon-deep)] transition-all">
              <Link
                to="/orgs/$orgId"
                params={{ orgId: orgId as string }}
                search={{ tab: 'billing' }}
              >
                Billing
              </Link>
            </TabsTrigger>
          </TabsList>

          <div className="mt-8 relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                variants={tabVariants}
                initial="hidden"
                animate="enter"
                exit="exit"
              >
                <TabsContent value="members" className="mt-0 outline-none">
                  <div className="bg-white rounded-2xl border border-[var(--line)] shadow-sm overflow-hidden">
                    <MemberTable members={members ?? []} />
                  </div>
                </TabsContent>

                <TabsContent value="workspaces" className="mt-0 outline-none">
                  <WorkspaceList
                    orgId={orgId as string}
                    workspaces={workspaces ?? []}
                    onCreated={refetchAll}
                    onError={(msg) => toast.error(msg ?? 'Something went wrong')}
                  />
                </TabsContent>

                <TabsContent value="invites" className="mt-0 outline-none">
                  <div className="max-w-2xl mx-auto space-y-4">
                    <InviteForm
                      orgId={orgId as string}
                      onInvited={refetchMembers}
                      onError={(msg) => toast.error(msg ?? 'Something went wrong')}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="billing" className="mt-0 outline-none">
                  <OrgBillingTab orgId={orgId as string} />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </motion.div>
    </main>
  )
}
