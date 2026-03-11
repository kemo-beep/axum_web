import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '#/components/pages/HomePage'

export const Route = createFileRoute('/')({
  ssr: false,
  component: HomePage,
})
