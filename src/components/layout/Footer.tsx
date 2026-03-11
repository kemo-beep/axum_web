import { Link } from '@tanstack/react-router'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--header-bg)]/60 px-4 py-8">
      <div className="page-wrap flex flex-col items-center justify-between gap-6 text-sm text-[var(--sea-ink-soft)] sm:flex-row">
        <p className="m-0">
          © {new Date().getFullYear()} SaaS App
        </p>
        <nav className="flex gap-8">
          <Link
            to="/#about"
            className="text-[var(--sea-ink-soft)] no-underline transition hover:text-[var(--sea-ink)]"
          >
            About
          </Link>
          <Link
            to="/login"
            className="text-[var(--sea-ink-soft)] no-underline transition hover:text-[var(--sea-ink)]"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="text-[var(--sea-ink-soft)] no-underline transition hover:text-[var(--sea-ink)]"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </footer>
  )
}
