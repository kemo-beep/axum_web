import type { ReactNode } from 'react'
import { Navigate, useLocation } from '@tanstack/react-router'
import { useAuth } from '#/hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
  permission?: string
}

export function ProtectedRoute({ children, permission }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <span className="text-sm text-[var(--sea-ink-soft)]">Loading...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        search={{ redirect: location.pathname + location.search }}
        replace
      />
    )
  }

  if (permission && !user.permissions?.includes(permission)) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-[var(--sea-ink-soft)]">Access denied</p>
      </div>
    )
  }

  return <>{children}</>
}
