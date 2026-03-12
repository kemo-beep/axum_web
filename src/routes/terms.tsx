import { createFileRoute } from '@tanstack/react-router'
import { createSeoMeta } from '#/lib/seo'

export const Route = createFileRoute('/terms')({
  head: () => {
    const { meta, links } = createSeoMeta({
      title: 'Terms of Service',
      description: 'Terms of service and acceptable use policy.',
      path: '/terms',
    })
    return { meta, links }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/terms"!</div>
}
