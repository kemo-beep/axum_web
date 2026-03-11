import { createFileRoute } from '@tanstack/react-router'
import { ChangelogPage } from '#/components/pages/ChangelogPage'

export const Route = createFileRoute('/changelog')({
  component: ChangelogPage,
})
