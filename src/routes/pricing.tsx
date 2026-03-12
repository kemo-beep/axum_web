import { createFileRoute } from '@tanstack/react-router'
import { createSeoMeta } from '#/lib/seo'
import { PricingPage } from '#/components/pages/PricingPage'

export const Route = createFileRoute('/pricing')({
  head: () => {
    const { meta, links } = createSeoMeta({
      title: 'Pricing',
      description: 'Simple, transparent pricing for teams of all sizes.',
      path: '/pricing',
    })
    return { meta, links }
  },
  component: PricingPage,
})
