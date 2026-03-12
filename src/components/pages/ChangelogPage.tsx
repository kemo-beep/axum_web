import { LandingContentPage } from '#/components/layout/LandingContentPage'
import { ChangelogTimeline } from '#/components/features/landing/ChangelogTimeline'
import { CHANGELOG_ENTRIES } from '#/data/changelog'

export function ChangelogPage() {
  return (
    <LandingContentPage title="Changelog">
      <ChangelogTimeline entries={CHANGELOG_ENTRIES} />
    </LandingContentPage>
  )
}
