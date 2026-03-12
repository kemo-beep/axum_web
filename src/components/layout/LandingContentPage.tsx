import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { LandingHeader } from './LandingHeader'
import Footer from './Footer'
import { cn } from '#/lib/utils'

type LandingContentPageProps = {
  title: string
  subtitle?: string
  children?: ReactNode
  maxWidth?: '2xl' | '3xl' | '4xl'
  centered?: boolean
  prose?: boolean
}

const maxWidthClass = {
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
} as const

export function LandingContentPage({
  title,
  subtitle,
  children,
  maxWidth = '3xl',
  centered = false,
  prose = false,
}: LandingContentPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <LandingHeader />
      <main
        className={cn(
          'flex-1 flex flex-col pt-32 pb-24 px-4 overflow-hidden relative',
          centered && 'text-center',
        )}
      >
        <div
          className={cn(
            'page-wrap relative z-10 mx-auto w-full',
            maxWidthClass[maxWidth],
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={prose ? 'prose prose-lg dark:prose-invert prose-headings:text-[var(--sea-ink)] prose-p:text-[var(--sea-ink-soft)]' : undefined}
          >
            <h1 className="display-title mb-10 text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl sm:text-6xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mb-10 text-lg text-[var(--sea-ink-soft)] leading-relaxed">
                {subtitle}
              </p>
            )}
            {children}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
