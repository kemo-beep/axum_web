import { useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '#/hooks/useAuth'
import { Button } from '#/components/ui/button'

export function HomePage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: '/dashboard' })
    }
  }, [user, loading, navigate])

  if (loading || user) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--lagoon)] border-t-transparent" />
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative flex flex-1 flex-col items-center justify-center px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--lagoon-deep)]">
            Built for teams
          </p>
          <h1 className="display-title mb-6 text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl md:text-6xl">
            Ship faster with less friction
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-[var(--sea-ink-soft)]">
            Organizations, billing, and API keys in one place. Sign in to get started.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="h-12 px-8 bg-[var(--lagoon)] text-white hover:bg-[var(--lagoon-deep)]"
            >
              <Link to="/register">Get started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--surface)]/50 px-4 py-16">
        <div className="page-wrap grid gap-8 sm:grid-cols-3">
          {[
            {
              title: 'Organizations',
              desc: 'Manage teams and workspaces.',
            },
            {
              title: 'Billing',
              desc: 'Subscriptions and payments.',
            },
            {
              title: 'API Keys',
              desc: 'Secure programmatic access.',
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-sm"
            >
              <h3 className="mb-2 font-semibold text-[var(--sea-ink)]">{title}</h3>
              <p className="text-sm text-[var(--sea-ink-soft)]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="border-t border-[var(--line)] px-4 py-20">
        <div className="page-wrap max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--lagoon-deep)]">
            About
          </p>
          <h2 className="display-title mb-4 text-3xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-4xl">
            A small starter with room to grow
          </h2>
          <p className="m-0 text-base leading-8 text-[var(--sea-ink-soft)]">
            TanStack Start gives you type-safe routing, server functions, and
            modern SSR defaults. Use this as a clean foundation, then layer in
            your own routes, styling, and add-ons.
          </p>
        </div>
      </section>
    </main>
  )
}
