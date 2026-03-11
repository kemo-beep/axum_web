/** Paths that use the landing layout (marketing, auth). */
export const LANDING_PATHS = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/about',
] as const

/** Path prefixes/patterns for the dashboard layout (sidebar). */
const APP_PATH_PREFIXES = [
  '/dashboard',
  '/orgs',
  '/billing',
  '/api-keys',
  '/invites',
] as const

export function isLandingPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, '') || '/'
  return (LANDING_PATHS as readonly string[]).includes(normalized)
}

export function isAppPath(pathname: string): boolean {
  return APP_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/'),
  )
}
