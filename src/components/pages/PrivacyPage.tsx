import { LandingContentPage } from '#/components/layout/LandingContentPage'
import { PRIVACY_CONTENT } from '#/data/legal/privacy'

export function PrivacyPage() {
  return (
    <LandingContentPage title="Privacy Policy" prose>
      <p>Last updated: {PRIVACY_CONTENT.lastUpdated}</p>
      {PRIVACY_CONTENT.sections.map((section, i) => (
        <div key={i}>
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </div>
      ))}
    </LandingContentPage>
  )
}
