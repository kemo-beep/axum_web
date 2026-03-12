import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { JobStatsSection } from '#/components/features/admin/JobStatsSection'
import { FeatureFlagsSection } from '#/components/features/admin/FeatureFlagsSection'
import { ImpersonateSection } from '#/components/features/admin/ImpersonateSection'
import { BarChart3, Flag, UserCog } from 'lucide-react'

export function AdminPage() {
  return (
    <main className="page-wrap py-8 min-h-[90vh]">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--sea-ink)] display-title">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-base text-[var(--sea-ink-soft)] font-medium">
          Job stats, feature flags, and user impersonation.
        </p>
      </div>

      <Tabs defaultValue="job-stats" className="w-full">
        <TabsList className="mb-6 bg-[var(--surface-strong)] border border-[var(--line)] p-1 rounded-xl">
          <TabsTrigger value="job-stats" className="gap-2">
            <BarChart3 className="size-4" />
            Job Stats
          </TabsTrigger>
          <TabsTrigger value="feature-flags" className="gap-2">
            <Flag className="size-4" />
            Feature Flags
          </TabsTrigger>
          <TabsTrigger value="impersonate" className="gap-2">
            <UserCog className="size-4" />
            Impersonate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="job-stats">
          <JobStatsSection />
        </TabsContent>
        <TabsContent value="feature-flags">
          <FeatureFlagsSection />
        </TabsContent>
        <TabsContent value="impersonate">
          <ImpersonateSection />
        </TabsContent>
      </Tabs>
    </main>
  )
}
