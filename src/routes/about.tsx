import { createFileRoute, Navigate } from '@tanstack/react-router'
import { createSeoMeta } from '#/lib/seo'

export const Route = createFileRoute('/about')({
  head: () => {
    const { meta, links } = createSeoMeta({
      title: 'About',
      description: 'Learn more about our mission and team.',
      path: '/about',
    })
    return { meta, links }
  },
  component: AboutRedirect,
})

function AboutRedirect() {
  return <Navigate to="/#about" replace />
}
