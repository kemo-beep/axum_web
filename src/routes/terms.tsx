import { createFileRoute } from '@tanstack/react-router'
import { createSeoMeta } from '#/lib/seo'
import { TermsPage } from '#/components/pages/TermsPage'

export const Route = createFileRoute('/terms')({
  head: () => {
    const { meta, links } = createSeoMeta({
      title: 'Terms of Service',
      description: 'Terms of service and acceptable use policy.',
      path: '/terms',
    })
    return { meta, links }
  },
  component: TermsPage,
})
