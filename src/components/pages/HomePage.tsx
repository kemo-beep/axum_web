import { useEffect, useRef } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '#/hooks/useAuth'
import { Button } from '#/components/ui/button'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Hexagon, Layers, ShieldCheck } from 'lucide-react'

// Custom hook to create a parallax effect based on scroll
function useParallax(distance: number = 50) {
  const { scrollY } = useScroll()
  return useTransform(scrollY, [0, 1000], [0, -distance])
}

export function HomePage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: '/dashboard' })
    }
  }, [user, loading, navigate])

  if (loading || user) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="size-8 rounded-full border-2 border-[var(--lagoon)] border-t-transparent"
        />
      </main>
    )
  }

  const features = [
    {
      title: 'Organizations',
      desc: 'Fluid workspace and team management built for scale.',
      icon: <Layers className="size-5 text-[var(--lagoon)]" />,
    },
    {
      title: 'Billing',
      desc: 'Painless subscriptions and seamless integrated payments.',
      icon: <Hexagon className="size-5 text-[var(--lagoon)]" />,
    },
    {
      title: 'API Keys',
      desc: 'Enterprise-grade secure programmatic access.',
      icon: <ShieldCheck className="size-5 text-[var(--lagoon)]" />,
    },
  ]

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-[var(--background)]">
      {/* Dynamic Background Elements */}
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

        {/* Scroll Indicator */}
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

      <section
        id="features"
        className="relative z-10 px-4 py-24 sm:py-32 border-t border-[var(--line)] backdrop-blur-3xl bg-white/5 dark:bg-black/10"
      >
        <div className="page-wrap mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="display-title text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl"
            >
              Everything you need.{' '}
              <span className="text-[var(--sea-ink-soft)]/50">
                Nothing you don't.
              </span>
            </motion.h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative rounded-3xl border border-[var(--line)] bg-[var(--surface-strong)]/80 backdrop-blur-xl p-8 shadow-2xl shadow-[var(--sea-ink)]/5 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--lagoon)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-[var(--surface)] shadow-inner border border-[var(--line)]/50 transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[var(--sea-ink)]">
                    {feature.title}
                  </h3>
                  <p className="text-base text-[var(--sea-ink-soft)] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section
        id="integrations"
        className="relative z-10 py-24 overflow-hidden border-t border-[var(--line)] bg-[var(--surface)] text-center"
      >
        <div className="mx-auto max-w-4xl px-4 text-center mb-16">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[var(--lagoon)]">
            Connect Everywhere
          </p>
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="display-title text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl"
          >
            Integrates with your stack
          </motion.h2>
        </div>

        <div className="relative flex w-[120vw] -left-[10vw] flex-col overflow-hidden gap-10">
          <div className="absolute inset-y-0 left-0 w-[20%] bg-gradient-to-r from-[var(--surface)] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-[20%] bg-gradient-to-l from-[var(--surface)] to-transparent z-10 pointer-events-none" />

          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            className="flex w-fit gap-10 whitespace-nowrap px-10"
          >
            {/* Duplicated for a seamless continuous marquee */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-10 items-center justify-center">
                {['Slack', 'GitHub', 'Linear', 'Notion', 'Figma', 'Stripe', 'Vercel', 'AWS'].map((logo) => (
                  <div
                    key={`${i}-${logo}`}
                    className="flex h-16 sm:h-20 w-40 sm:w-48 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)]/50 backdrop-blur-md shadow-sm transition-transform hover:scale-105"
                  >
                    <span className="font-semibold text-lg sm:text-xl text-[var(--sea-ink-soft)] uppercase tracking-widest">{logo}</span>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        id="about"
        className="relative z-10 px-4 py-32 overflow-hidden bg-[var(--surface)] backdrop-blur-2xl border-t border-[var(--line)]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="page-wrap mx-auto max-w-4xl rounded-[3rem] p-12 sm:p-20 text-center border border-[var(--line)] bg-gradient-to-b from-[var(--surface-strong)] to-[var(--surface)] shadow-none"
        >
          <p className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-[var(--lagoon)]">
            The Foundation
          </p>
          <h2 className="display-title mb-8 text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
            A minimalist masterpiece.
          </h2>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed text-[var(--sea-ink-soft)]">
            Built on top of TanStack Start and Framer Motion. Engineered for
            speed, typed from front to back, and designed meticulously to feel
            extraordinary in your hands.
          </p>
        </motion.div>
      </section>
    </main>
  )
}
