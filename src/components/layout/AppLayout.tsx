import { useLocation, Navigate } from '@tanstack/react-router'
import { useAuth } from '#/hooks/useAuth'
import { isAppPath, isLandingPath } from '#/data/routes'
import { AppShell } from './AppShell'
import { LandingLayout } from './LandingLayout'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  const pathname = location.pathname
  const search = location.search

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--lagoon)] border-t-transparent" />
      </div>
    )
  }

  if (isAppPath(pathname)) {
    if (!user) {
      const redirect = pathname + (search || '')
      return <Navigate to="/login" search={{ redirect }} replace />
    }
    return <AppShell>{children}</AppShell>
  }

  if (isLandingPath(pathname)) {
    const guestPaths = ['/login', '/register']
    const normalizedPath = pathname.replace(/\/$/, '') || '/'
    if (user && guestPaths.includes(normalizedPath)) {
      return <Navigate to="/dashboard" replace />
    }
    return <LandingLayout>{children}</LandingLayout>
  }

  return <LandingLayout>{children}</LandingLayout>
}
