import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '#/components/ui/button'
import { useParallax } from '#/hooks/useParallax'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-[20%] -left-[10%] h-[70vh] w-[70vw] rounded-full bg-gradient-to-br from-[var(--lagoon)]/20 to-transparent blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-[40%] -right-[10%] h-[60vh] w-[60vw] rounded-full bg-gradient-to-bl from-[var(--palm)]/10 to-[var(--lagoon)]/10 blur-3xl delay-150"
        />
      </div>

      <section
        ref={containerRef}
        className="relative z-10 flex min-h-[90vh] flex-col items-center justify-center px-4 py-20"
      >
        <motion.div
          style={{ opacity, y: useParallax(40) }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-[var(--lagoon-deep)]">
              Next-Gen Infrastructure
            </p>
            <h1 className="display-title mb-8 text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--sea-ink)] to-[var(--sea-ink-soft)] dark:from-white dark:to-white/70 sm:text-6xl md:text-7xl lg:text-8xl">
              Ship boundaries,
              <br />
              not friction.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mb-12 max-w-2xl text-lg md:text-xl text-[var(--sea-ink-soft)] leading-relaxed"
          >
            A carefully crafted suite for modern organizations. Unify your
            teams, streamline billing, and secure API keys in one breathtaking
            experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center gap-5 sm:flex-row"
          >
            <Button
              size="lg"
              asChild
              className="h-14 rounded-full px-10 bg-(--lagoon-deep) !text-[#b2e2e6] dark:bg-(--lagoon) dark:text-(--bg-base) shadow-[0_0_40px_-10px_var(--lagoon)] hover:shadow-[0_0_60px_-15px_var(--lagoon)] hover:scale-105 transition-all duration-300 ease-out"
            >
              <Link to="/register" className="font-semibold tracking-wide">
                Get started free
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 rounded-full px-10 border-[var(--line)] bg-[var(--surface)] backdrop-blur-md hover:bg-[var(--surface-strong)] hover:scale-105 transition-all duration-300 ease-out cursor-pointer text-[var(--sea-ink)] hover:text-[var(--sea-ink)]"
            >
              <Link
                to="/login"
                className="font-semibold tracking-wide hover:bg-transparent"
              >
                Sign in to workspace
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-widest text-[var(--sea-ink-soft)] font-semibold">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="h-12 w-[1px] bg-gradient-to-b from-[var(--lagoon-deep)] to-transparent"
          />
        </motion.div>
      </section>
    </>
  )
}
