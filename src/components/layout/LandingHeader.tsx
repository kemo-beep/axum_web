import { Link } from '@tanstack/react-router'
import ThemeToggle from '#/components/ThemeToggle'
import { Button } from '#/components/ui/button'

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--line)] bg-[var(--header-bg)]/80 backdrop-blur-xl">
      <div className="page-wrap flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 text-[var(--sea-ink)] no-underline"
        >
          <span
            className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--lagoon)] to-[var(--lagoon-deep)] text-white font-semibold text-sm shadow-lg shadow-[var(--lagoon-deep)]/20"
            aria-hidden
          >
            S
          </span>
          <span className="text-lg font-semibold tracking-tight">SaaS App</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login" className="text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]">
                Log in
              </Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-[var(--lagoon)] text-white hover:bg-[var(--lagoon-deep)]"
            >
              <Link to="/register">Sign up</Link>
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
