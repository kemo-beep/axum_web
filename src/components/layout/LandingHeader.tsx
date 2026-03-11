import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import ThemeToggle from '#/components/ThemeToggle'
import { Button } from '#/components/ui/button'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

export function LandingHeader() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    if (latest > 100 && latest > previous) {
      setHidden(true)
    } else {
      setHidden(false)
    }

    if (latest > 20) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  })

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={twMerge(
        'fixed top-0 z-50 w-full transition-all duration-500 will-change-transform',
        scrolled
          ? 'bg-[var(--header-bg)]/80 backdrop-blur-2xl shadow-sm border-b border-[var(--line)] py-2'
          : 'bg-transparent border-b-transparent py-4',
      )}
    >
      <div className="page-wrap flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3 text-[var(--sea-ink)] no-underline group"
        >
          <div className="relative flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--lagoon)] to-[var(--lagoon-deep)] text-white font-bold text-lg shadow-lg shadow-[var(--lagoon)]/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 overflow-hidden">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            S
          </div>
          <span className="text-xl font-bold tracking-tight">Structura</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 mr-4">
            <Link
              to="/"
              className="text-sm font-medium text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] transition-colors"
            >
              Product
            </Link>
            <Link
              to="/"
              className="text-sm font-medium text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] transition-colors"
            >
              Solutions
            </Link>
            <Link
              to="/"
              className="text-sm font-medium text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <div className="h-6 w-px bg-[var(--line)] hidden md:block" />
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:inline-flex rounded-full hover:bg-[var(--surface-strong)] hover:text-[var(--sea-ink)] text-[var(--sea-ink-soft)] h-9 px-5"
            >
              <Link
                to="/login"
                className="font-semibold text-[13px] tracking-wide bg-transparent hover:bg-transparent"
              >
                Log in
              </Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="rounded-full bg-(--sea-ink) text-white dark:text-(--bg-base) hover:bg-(--lagoon) hover:scale-105 transition-all shadow-md font-semibold text-[13px] h-9 px-5"
            >
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  )
}
