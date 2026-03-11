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

type OrgDetailPageProps = {
  tab: string
}

export function OrgDetailPage({ tab }: OrgDetailPageProps) {
  const { orgId } = useParams({ strict: false }) as { orgId: string }
  const queryClient = useQueryClient()

  const { data: org, isLoading: orgLoading } = useQuery({
    queryKey: ['org', orgId],
    queryFn: () => apiFetch<Org>(`/v1/orgs/${orgId}`),
  })

  const { data: members, refetch: refetchMembers } = useQuery({
    queryKey: ['org', orgId, 'members'],
    queryFn: () =>
      apiFetch<OrgMember[]>(`/v1/orgs/${orgId}/members`),
  })

  const { data: workspaces, refetch: refetchWorkspaces } = useQuery({
    queryKey: ['org', orgId, 'workspaces'],
    queryFn: () =>
      apiFetch<Workspace[]>(`/v1/orgs/${orgId}/workspaces`),
  })

  const refetchAll = () => {
    refetchMembers()
    refetchWorkspaces()
    queryClient.invalidateQueries({ queryKey: ['org', orgId] })
  }

  if (orgLoading || !org) {
    return (
      <main className="page-wrap">
        <OrgDetailSkeleton />
      </main>
    )
  }

  return (
    <main className="page-wrap">
      <Breadcrumbs
        items={[
          { label: 'Organizations', href: '/orgs' },
          { label: org.name },
        ]}
      />
      <h1 className="mb-8 mt-4 text-2xl font-bold text-[var(--sea-ink)]">
        {org.name}
      </h1>

      <Tabs value={tab} className="w-full">
        <TabsList>
          <TabsTrigger value="members" asChild>
            <Link to="/orgs/$orgId" params={{ orgId }} search={{}}>
              Members
            </Link>
          </TabsTrigger>
          <TabsTrigger value="workspaces" asChild>
            <Link
              to="/orgs/$orgId"
              params={{ orgId }}
              search={{ tab: 'workspaces' }}
            >
              Workspaces
            </Link>
          </TabsTrigger>
          <TabsTrigger value="invites" asChild>
            <Link
              to="/orgs/$orgId"
              params={{ orgId }}
              search={{ tab: 'invites' }}
            >
              Invites
            </Link>
          </TabsTrigger>
          <TabsTrigger value="billing" asChild>
            <Link
              to="/orgs/$orgId"
              params={{ orgId }}
              search={{ tab: 'billing' }}
            >
              Billing
            </Link>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="members" className="mt-6">
          <MemberTable members={members ?? []} />
        </TabsContent>
        <TabsContent value="workspaces" className="mt-6">
          <WorkspaceList
            orgId={orgId}
            workspaces={workspaces ?? []}
            onCreated={refetchAll}
            onError={(msg) => toast.error(msg ?? 'Something went wrong')}
          />
        </TabsContent>
        <TabsContent value="invites" className="mt-6">
          <div className="space-y-4">
            <InviteForm
              orgId={orgId}
              onInvited={refetchMembers}
              onError={(msg) => toast.error(msg ?? 'Something went wrong')}
            />
          </div>
        </TabsContent>
        <TabsContent value="billing" className="mt-6">
          <OrgBillingTab orgId={orgId} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
