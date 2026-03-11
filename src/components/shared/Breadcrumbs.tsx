import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && (
            <ChevronRight className="size-4 text-[var(--sea-ink-soft)]" />
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="text-[var(--sea-ink-soft)] hover:text-[var(--lagoon)]"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-[var(--sea-ink)]">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
