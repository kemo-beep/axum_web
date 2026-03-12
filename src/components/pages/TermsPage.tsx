import { LandingContentPage } from '#/components/layout/LandingContentPage'
import { TERMS_CONTENT } from '#/data/legal/terms'

export function TermsPage() {
  return (
    <LandingContentPage title="Terms of Service" prose>
      <p>Last updated: {TERMS_CONTENT.lastUpdated}</p>
      {TERMS_CONTENT.sections.map((section, i) => (
        <div key={i}>
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </div>
      ))}
    </LandingContentPage>
  )
}
