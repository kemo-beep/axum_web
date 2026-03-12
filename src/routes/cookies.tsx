import { createFileRoute } from '@tanstack/react-router'
import { createSeoMeta } from '#/lib/seo'
import { CookiePolicyPage } from '#/components/pages/CookiePolicyPage'

export const Route = createFileRoute('/cookies')({
  head: () => {
    const { meta, links } = createSeoMeta({
      title: 'Cookie Policy',
      description: 'How we use cookies.',
      path: '/cookies',
    })
    return { meta, links }
  },
  component: CookiePolicyPage,
})
