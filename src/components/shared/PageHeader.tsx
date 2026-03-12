import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '#/lib/utils'

type PageHeaderProps = {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
  /** Use smaller title (text-3xl instead of text-4xl) */
  size?: 'default' | 'sm'
}

export function PageHeader({
  title,
  subtitle,
  action,
  className,
  size = 'default',
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--line)] pb-6',
        className,
      )}
    >
      <div>
        <h1
          className={cn(
            'font-bold tracking-tight text-[var(--sea-ink)] display-title',
            size === 'sm' ? 'text-3xl' : 'text-4xl',
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              'mt-2 text-[var(--sea-ink-soft)]',
              size === 'sm' ? 'text-sm max-w-xl' : 'text-base',
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  )
}
