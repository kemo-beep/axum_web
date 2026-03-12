import { createFileRoute } from '@tanstack/react-router'
import { createSeoMeta } from '#/lib/seo'
import { PrivacyPage } from '#/components/pages/PrivacyPage'

export const Route = createFileRoute('/privacy')({
  head: () => {
    const { meta, links } = createSeoMeta({
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your data.',
      path: '/privacy',
    })
    return { meta, links }
  },
  component: PrivacyPage,
})
