import { LandingContentPage } from '#/components/layout/LandingContentPage'
import { ContactForm } from '#/components/features/contact/ContactForm'

export function ContactPage() {
  return (
    <LandingContentPage
      title="Contact Us"
      subtitle="We'd love to hear from you. Get in touch with our team."
      maxWidth="2xl"
      centered
    >
      <ContactForm />
    </LandingContentPage>
  )
}
