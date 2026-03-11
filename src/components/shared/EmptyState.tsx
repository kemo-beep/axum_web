import type { ReactNode } from 'react'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface)]/50 px-8 py-16 text-center',
        className,
      )}
    >
      {icon && (
        <div className="mb-4 text-[var(--sea-ink-soft)] opacity-60">{icon}</div>
      )}
      <h3 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">
        {title}
      </h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-[var(--sea-ink-soft)]">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
