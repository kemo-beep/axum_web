import { createFileRoute } from '@tanstack/react-router'
import { createSeoMeta } from '#/lib/seo'

export const Route = createFileRoute('/pricing')({
  head: () => {
    const { meta, links } = createSeoMeta({
      title: 'Pricing',
      description: 'Simple, transparent pricing for teams of all sizes.',
      path: '/pricing',
    })
    return { meta, links }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/pricing"!</div>
}
