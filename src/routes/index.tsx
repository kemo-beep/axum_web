import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '#/components/pages/HomePage'
import { createSeoMeta } from '#/lib/seo'

export const Route = createFileRoute('/')({
  head: () => {
    const { meta, links } = createSeoMeta({
      title: 'Home',
      description:
        'Build and scale with a modern SaaS platform. Organizations, billing, team collaboration, and more.',
      path: '/',
    })
    return { meta, links }
  },
  component: HomePage,
})
