import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '#/components/pages/ProfilePage'
import { ProtectedRoute } from '#/components/shared/ProtectedRoute'

export const Route = createFileRoute('/profile')({
  component: function ProfileRoute() {
    return (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    )
  },
})
