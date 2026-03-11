import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '#/components/ui/sheet'
import { Button } from '#/components/ui/button'
import { useAuth } from '#/hooks/useAuth'
import { useOrg } from '#/hooks/useOrg'
import { APP_NAV } from '#/data/nav'
import { CreateOrgForm } from '#/components/features/orgs/CreateOrgForm'
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Key,
  ChevronsUpDown,
  Plus,
  Check,
  Settings,
} from 'lucide-react'
import { cn } from '#/lib/utils'
import { useSidebar } from './SidebarContext'

const ICONS = {
  Dashboard: LayoutDashboard,
  Organizations: Building2,
  Billing: CreditCard,
  'API Keys': Key,
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, loading } = useAuth()
  const { isCollapsed } = useSidebar()
  const {
    orgs,
    selectedOrg,
    selectedOrgId,
    setSelectedOrgId,
    refetchOrgs,
    isLoading: orgsLoading,
  } = useOrg()
  const [createOrgOpen, setCreateOrgOpen] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const location = useLocation()
  const pathname = location.pathname

  const handleOrgCreated = (org: { id: string }) => {
    setCreateOrgOpen(false)
    setCreateError(null)
    refetchOrgs()
    setSelectedOrgId(org.id)
    onNavigate?.()
  }

  const navItems = APP_NAV.map((item) => {
    const href =
      item.label === 'Billing' && selectedOrgId
        ? `/orgs/${selectedOrgId}?tab=billing`
        : item.href
    return { ...item, href }
  })

  // Determine if it's rendered within a desktop or a sheet (where isCollapsed is effectively false always)
  // But we use isCollapsed from context. For mobile sheet, the context isCollapsed doesn't affect the sheet width visually usually, but we will force isCollapsed to false for Sheet rendering if we need to.
  // We'll let `isCollapsed` apply correctly to desktop layout.

  return (
    <div className="flex h-full flex-col bg-[var(--header-bg)]">
      <div className={cn("flex h-14 shrink-0 items-center border-b border-[var(--line)]", isCollapsed ? "justify-center px-0" : "px-4")}>
        <Link
          to="/"
          className="flex items-center gap-2 text-base font-semibold text-[var(--sea-ink)] no-underline outline-none"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--sea-ink)] text-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-transform hover:scale-105">
            S
          </span>
          {!isCollapsed && <span className="font-bold tracking-tight">SaaS App</span>}
        </Link>
      </div>

      {user && !loading && (
        <div className={cn("border-b border-[var(--line)] py-3", isCollapsed ? "px-2" : "px-3")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center text-left font-medium transition-all",
                  isCollapsed ? "justify-center px-0 w-10 h-10 rounded-xl" : "w-full justify-between gap-2 px-3 py-2 rounded-xl hover:bg-[var(--line)]"
                )}
              >
                {isCollapsed ? (
                  <div className="size-6 rounded-md bg-[linear-gradient(135deg,var(--lagoon),var(--lagoon-deep))] text-white flex items-center justify-center text-xs font-bold shadow-sm ring-1 ring-black/10">
                    {selectedOrg?.name?.charAt(0).toUpperCase() || 'O'}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 truncate text-sm text-[var(--sea-ink)]">
                      <div className="size-5 shrink-0 rounded-[6px] bg-[linear-gradient(135deg,var(--lagoon),var(--lagoon-deep))] text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                        {selectedOrg?.name?.charAt(0).toUpperCase() || 'O'}
                      </div>
                      <span className="truncate">
                        {orgsLoading ? 'Loading...' : selectedOrg?.name ?? 'Select organization'}
                      </span>
                    </div>
                    <ChevronsUpDown className="size-4 shrink-0 text-[var(--sea-ink-soft)] opacity-50" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isCollapsed ? "start" : "start"} side={isCollapsed ? "right" : "bottom"} className="w-56 shadow-lg rounded-xl border-[var(--line)]">
              {orgs.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  className="rounded-lg cursor-pointer my-0.5"
                  onClick={() => {
                    setSelectedOrgId(org.id)
                    onNavigate?.()
                  }}
                >
                  <span className="flex-1 truncate">{org.name}</span>
                  {selectedOrgId === org.id && (
                    <Check className="ml-2 size-4 shrink-0 text-[var(--lagoon)]" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-[var(--line)]" />
              <DropdownMenuItem className="rounded-lg cursor-pointer my-0.5" onClick={() => setCreateOrgOpen(true)}>
                <Plus className="mr-2 size-4 opacity-70" />
                Create organization
              </DropdownMenuItem>
              {selectedOrgId && (
                <DropdownMenuItem asChild className="rounded-lg cursor-pointer my-0.5">
                  <Link
                    to="/orgs/$orgId"
                    params={{ orgId: selectedOrgId }}
                    onClick={onNavigate}
                  >
                    <Settings className="mr-2 size-4 opacity-70" />
                    Edit organization
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer my-0.5">
                <Link to="/orgs" onClick={onNavigate}>
                  <Building2 className="mr-2 size-4 opacity-70" />
                  Manage organizations
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={createOrgOpen} onOpenChange={setCreateOrgOpen}>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-6 shadow-2xl border-[var(--line)] bg-[var(--surface-strong)] backdrop-blur-3xl">
              <DialogHeader>
                <DialogTitle className="text-xl">Create organization</DialogTitle>
              </DialogHeader>
              {createError && (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-sm font-medium text-red-700 dark:text-red-400 border border-red-200">
                  {createError}
                </div>
              )}
              <CreateOrgForm
                onCreated={handleOrgCreated}
                onError={setCreateError}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto p-2 lg:p-3">
        {navItems.map((item) => {
          const Icon = ICONS[item.label]
          const baseHref = item.label === 'Billing' ? '/orgs' : item.href
          const isActive =
            pathname === item.href ||
            (baseHref !== '/dashboard' &&
              pathname.startsWith(baseHref))

          return (
            <Link
              key={item.label}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center rounded-xl transition-all duration-200 group relative outline-none',
                isCollapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-[var(--line)]/50 text-[var(--sea-ink)] shadow-sm'
                  : 'text-[var(--sea-ink-soft)] hover:bg-[var(--line)]/30 hover:text-[var(--sea-ink)]',
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    "shrink-0 transition-colors",
                    isCollapsed ? "size-5" : "size-[18px]",
                    isActive ? "text-[var(--sea-ink)]" : "text-[var(--sea-ink-soft)] group-hover:text-[var(--sea-ink)]"
                  )}
                />
              )}
              {!isCollapsed && <span>{item.label}</span>}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 hidden rounded-md bg-[var(--sea-ink)] px-2 py-1 text-xs font-medium text-white shadow-xl group-hover:block z-50 whitespace-nowrap">
                  {item.label}
                  <div className="absolute top-1/2 -left-1 -mt-1 border-[4px] border-transparent border-r-[var(--sea-ink)]"></div>
                </div>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export function Sidebar() {
  const { isCollapsed } = useSidebar()

  // Mobile nav doesn't use the top Header's toggle, it will get its own. 
  // Wait, in AppShell mobile header is not existing? AppShell doesn't render mobile top nav anymore if we use the same Header.
  // We need to inject the mobile drawer into the Header left toggle.
  // Actually, we can hook `toggleSidebar` in Header to open the `Sheet` on mobile!
  // It's cleaner if `isCollapsed` on mobile means Sheet is open. 
  // Let's use `isCollapsed` to drive the Sheet open state on mobile? No, context is cleaner.

  return (
    <>
      <aside
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-[var(--line)] lg:bg-[var(--header-bg)] lg:backdrop-blur-lg transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:w-16" : "lg:w-60"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sheet - usually triggered by a menu button in navigation, but we don't have it explicitly bound if Header handles it unless Header is the trigger */}
      {/* We will just expose a mobile Sheet here that listens to a local state or context, but since Header is in AppShell now, we should make Header toggle the Sheet on mobile. */}
      {/* For now, to keep it simple, Header toggles `isCollapsed`. We can make the Sheet read from `isCollapsed` and write to it. */}
      <Sheet open={!isCollapsed} onOpenChange={() => {
        // Only run this in mobile (can't easily check window size without hook, but CSS hides it)
        // This is a bit hacky linking desktop state to mobile sheet.
      }}>
        <SheetContent side="left" className="w-64 p-0 md:hidden lg:hidden" aria-describedby="navigation menu">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <div className="h-full w-full [&_div.lg\:w-16]:w-full">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
