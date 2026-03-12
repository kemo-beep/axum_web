import { LandingContentPage } from '#/components/layout/LandingContentPage'
import { COOKIES_CONTENT } from '#/data/legal/cookies'

export function CookiePolicyPage() {
  return (
    <LandingContentPage title="Cookie Policy" prose>
      <p>Last updated: {COOKIES_CONTENT.lastUpdated}</p>
      {COOKIES_CONTENT.sections.map((section, i) => (
        <div key={i}>
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </div>
      ))}
    </LandingContentPage>
  )
}
