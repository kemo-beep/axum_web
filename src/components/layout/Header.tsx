import { useLocation, Link } from '@tanstack/react-router'
import {
    Bell,
    FolderOpen,
    MessageSquare,
    PanelLeft,
    ChevronRight,
    Coins,
    Plus,
    CreditCard,
    User,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
} from '#/components/ui/dropdown-menu'
import { useSidebar } from './SidebarContext'
import { useAuth } from '#/hooks/useAuth'
import { useOrg } from '#/hooks/useOrg'
import { useOrgCredits } from '#/hooks/useOrgCredits'
import { useSubscriptionStatus } from '#/hooks/useSubscriptionStatus'
import ThemeToggle from '#/components/ThemeToggle'
import { CreditRing } from '#/components/ui/credit-ring'

export function Header() {
    const { toggleSidebar } = useSidebar()
    const { user, logout } = useAuth()
    const { selectedOrgId } = useOrg()
    const { data: credits } = useOrgCredits(selectedOrgId ?? null)
    const { data: subscriptionStatus } = useSubscriptionStatus()
    const location = useLocation()

    // Generate a very rudimentary breadcrumb based on route
    const getBreadcrumbs = () => {
        const segments = location.pathname.split('/').filter(Boolean)
        if (segments.length === 0 || (segments.length === 1 && segments[0] === 'dashboard')) {
            return ['Home']
        }

        // Capitalize each segment
        return segments.map(
            (s) => s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')
        )
    }

    const breadcrumbs = getBreadcrumbs()

    const avatarFallback = user?.email ? user.email.charAt(0).toUpperCase() : 'U'

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-md">
            {/* Left side: Toggle & Breadcrumbs */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] hover:bg-[var(--line)]"
                    onClick={toggleSidebar}
                >
                    <PanelLeft className="size-4" />
                </Button>

                <div className="flex items-center gap-2 text-sm font-medium text-[var(--sea-ink)]">
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center gap-2">
                            {index > 0 && (
                                <ChevronRight className="size-4 text-[var(--sea-ink-soft)]" />
                            )}
                            <span>{crumb}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right side: Actions & User Avatar */}
            <div className="flex items-center gap-2">
                {subscriptionStatus?.plan_name && (
                    <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-[var(--line)]/30 px-2.5 py-1.5">
                        <CreditCard className="size-3.5 text-[var(--lagoon)]" />
                        <span className="text-sm font-medium text-[var(--sea-ink)]">
                            {subscriptionStatus.plan_name}
                        </span>
                    </div>
                )}
                {selectedOrgId && credits?.balance != null && (
                    <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-[var(--line)]/30 px-2.5 py-1.5">
                        <Coins className="size-3.5 text-[var(--lagoon)]" />
                        <span className="text-sm font-medium text-[var(--sea-ink)]">
                            {credits.balance.toLocaleString()} credits
                        </span>
                    </div>
                )}
                <Button variant="outline" size="sm" className="hidden sm:flex h-8 bg-transparent text-[var(--sea-ink)] border-[var(--line)] hover:bg-[var(--line)] shadow-sm">
                    Feedback
                </Button>
                <Button variant="outline" size="sm" className="hidden sm:flex h-8 bg-transparent text-[var(--sea-ink)] border-[var(--line)] hover:bg-[var(--line)] shadow-sm">
                    Docs
                </Button>
                <Button variant="outline" size="sm" className="hidden sm:flex h-8 gap-2 bg-transparent text-[var(--sea-ink)] border-[var(--line)] hover:bg-[var(--line)] shadow-sm">
                    <MessageSquare className="size-3.5" />
                    Ask
                </Button>

                <div className="mx-2 h-4 w-px bg-[var(--line)] hidden sm:block"></div>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] hover:bg-[var(--line)]">
                    <FolderOpen className="size-4" />
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] hover:bg-[var(--line)]">
                    <Bell className="size-4" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-1 p-0 hover:opacity-80 transition-opacity ring-1 ring-[var(--line)] ring-offset-2 ring-offset-[var(--background)]">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-[linear-gradient(135deg,var(--lagoon),var(--lagoon-deep))] text-white text-xs font-semibold">
                                    {avatarFallback}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56" forceMount>
                        <div className="flex items-center justify-start gap-2 p-2">
                            <div className="flex flex-col space-y-1 leading-none">
                                {user?.email && (
                                    <p className="font-medium text-sm text-[var(--sea-ink)] truncate">
                                        {user.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {selectedOrgId && credits != null && (
                            <>
                                <DropdownMenuSeparator />
                                <div className="px-2 py-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className="shrink-0">
                                        <CreditRing
                                            remaining={credits.balance}
                                            consumed={credits.consumed}
                                            size={36}
                                            strokeWidth={2.5}
                                        />
                                        </div>
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <p className="text-xs text-[var(--sea-ink-soft)] truncate">
                                                {credits.balance.toLocaleString()} left
                                                {credits.consumed > 0 && (
                                                    <span className="text-[var(--sea-ink-soft)]/80">
                                                        {' / '}{credits.consumed.toLocaleString()} used
                                                    </span>
                                                )}
                                            </p>
                                            <Link
                                                to="/orgs/$orgId"
                                                params={{ orgId: selectedOrgId }}
                                                search={{ tab: 'billing' }}
                                                className="mt-1 flex items-center gap-1 text-xs font-medium text-[var(--lagoon)] hover:underline"
                                            >
                                                <Plus className="size-3 shrink-0" />
                                                Buy tokens
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <DropdownMenuSeparator />

                        <div className="px-2 py-1.5">
                            <div className="flex items-center gap-2 text-xs">
                                <CreditCard className="size-3.5 text-[var(--lagoon)] shrink-0" />
                                <span className="text-[var(--sea-ink-soft)]">Plan:</span>
                                <span className="font-medium text-[var(--sea-ink)]">
                                    {subscriptionStatus?.plan_name ?? 'Free'}
                                </span>
                            </div>
                        </div>

                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to="/billing/portal" target="_blank" className="w-full">
                                Manage subscription
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to="/profile" className="flex w-full items-center gap-2">
                                <User className="size-4 shrink-0" />
                                Profile
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="cursor-pointer">
                                Theme
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <div className="p-2">
                                        <ThemeToggle />
                                    </div>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                            onClick={() => logout()}
                        >
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
