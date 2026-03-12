export const APP_NAV = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'AI Demo', href: '/ai-demo' },
  { label: 'Organizations', href: '/orgs' },
  { label: 'Store', href: '/store' },
  { label: 'Billing', href: '/billing/plans' },
  { label: 'API Keys', href: '/api-keys' },
] as const

/** Admin-only nav item. Shown only when user has admin:access. */
export const ADMIN_NAV = [{ label: 'Admin', href: '/admin' }] as const
