import { createFileRoute } from '@tanstack/react-router'
import { CareersPage } from '#/components/pages/CareersPage'

export const Route = createFileRoute('/careers')({
  component: CareersPage,
})
