import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useLocation } from '@tanstack/react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'
import { Button } from '#/components/ui/button'
import ThemeToggle from '#/components/ThemeToggle'
import { useAuth } from '#/hooks/useAuth'
import { APP_NAV } from '#/data/nav'
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Key,
  ChevronDown,
  Menu,
} from 'lucide-react'
import { apiFetch } from '#/lib/api'
import { cn } from '#/lib/utils'

const ICONS = {
  Dashboard: LayoutDashboard,
  Organizations: Building2,
  Billing: CreditCard,
  'API Keys': Key,
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, loading, logout } = useAuth()
  const location = useLocation()
  const pathname = location.pathname

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['billing', 'subscription-status'],
    queryFn: () =>
      apiFetch<{ plan_name: string | null }>('/v1/billing/subscription-status'),
    enabled: !!user && !loading,
  })

  const planName = subscriptionStatus?.plan_name ?? null

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--line)] px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-base font-semibold text-[var(--sea-ink)] no-underline"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--lagoon),var(--lagoon-deep))] text-white">
            S
          </span>
          SaaS App
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4">
        {APP_NAV.map((item) => {
          const Icon = ICONS[item.label as keyof typeof ICONS]
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[var(--lagoon)]/10 text-[var(--lagoon-deep)]'
                  : 'text-[var(--sea-ink-soft)] hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]'
              )}
            >
              {Icon && <Icon className="size-4 shrink-0" />}
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-[var(--line)] p-2">
        <div className="flex items-center justify-between gap-2 px-2 py-2">
          <ThemeToggle />
        </div>
        {user && !loading && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between gap-1 px-2 py-2 text-left font-normal"
              >
                <span className="flex min-w-0 flex-1 items-center gap-2 truncate">
                  <span className="truncate text-sm text-[var(--sea-ink)]">
                    {user.email}
                  </span>
                  {planName && (
                    <span className="shrink-0 rounded bg-[var(--lagoon)]/20 px-1.5 py-0.5 text-xs font-medium text-[var(--lagoon-deep)]">
                      {planName}
                    </span>
                  )}
                </span>
                <ChevronDown className="size-4 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/billing/portal" target="_blank" rel="noopener noreferrer">
                  Manage billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => logout()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:h-screen lg:w-60 lg:flex-col lg:border-r lg:border-[var(--line)] lg:bg-[var(--header-bg)] lg:backdrop-blur-lg">
        <SidebarContent />
      </aside>
      <div className="fixed left-0 top-0 z-40 flex h-14 w-full items-center gap-2 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <Link
          to="/"
          className="flex items-center gap-2 text-base font-semibold text-[var(--sea-ink)] no-underline"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--lagoon),var(--lagoon-deep))] text-white">
            S
          </span>
          SaaS App
        </Link>
      </div>
    </>
  )
}
