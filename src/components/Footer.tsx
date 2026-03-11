export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--surface-strong)]/50 backdrop-blur-md px-4 pb-8 pt-8">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="m-0 text-sm font-medium text-[var(--sea-ink-soft)]">
          &copy; {year} SaaS App. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-sm font-medium text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] transition-colors"
          >
            Documentation
          </a>
          <a
            href="#"
            className="text-sm font-medium text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] transition-colors"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  )
}
