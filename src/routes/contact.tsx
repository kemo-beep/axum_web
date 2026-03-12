import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '#/components/pages/ContactPage'
import { createSeoMeta } from '#/lib/seo'

export const Route = createFileRoute('/contact')({
  head: () => {
    const { meta, links } = createSeoMeta({
      title: 'Contact',
      description: 'Get in touch with our team. We would love to hear from you.',
      path: '/contact',
    })
    return { meta, links }
  },
  component: ContactPage,
})
