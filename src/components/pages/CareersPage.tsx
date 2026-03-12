import { LandingContentPage } from '#/components/layout/LandingContentPage'

export function CareersPage() {
  return (
    <LandingContentPage
      title="Build the future."
      subtitle="We're looking for passionate builders who want to create category-defining tools."
      maxWidth="4xl"
      centered
    >
      <div className="p-12 rounded-3xl border border-[var(--line)] bg-[var(--surface-strong)]/50 backdrop-blur-xl">
        <p className="text-[var(--sea-ink-soft)] font-medium">
          No open positions at this moment. Check back soon!
        </p>
      </div>
    </LandingContentPage>
  )
}
