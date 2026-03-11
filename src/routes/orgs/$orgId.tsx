import { createFileRoute } from '@tanstack/react-router'
import { OrgDetailPage } from '#/components/pages/OrgDetailPage'
import { ProtectedRoute } from '#/components/shared/ProtectedRoute'

const VALID_TABS = ['members', 'workspaces', 'billing'] as const
type TabValue = (typeof VALID_TABS)[number]

function parseTab(value: unknown): TabValue {
  if (typeof value === 'string' && VALID_TABS.includes(value as TabValue)) {
    return value as TabValue
  }
  return 'members'
}

export const Route = createFileRoute('/orgs/$orgId')({
  validateSearch: (search: Record<string, unknown>): { tab?: TabValue } => {
    const tab = parseTab(search?.tab)
    return tab === 'members' ? {} : { tab }
  },
  component: function OrgDetailRoute() {
    const { tab } = Route.useSearch()
    const activeTab = tab ?? 'members'
    return (
      <ProtectedRoute>
        <OrgDetailPage tab={activeTab} />
      </ProtectedRoute>
    )
  },
})
