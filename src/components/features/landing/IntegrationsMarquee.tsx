import { motion } from 'framer-motion'
import { INTEGRATION_LOGOS } from '#/data/landing'

export function IntegrationsMarquee() {
  return (
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
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-10 items-center justify-center">
              {INTEGRATION_LOGOS.map((logo) => (
                <div
                  key={`${i}-${logo}`}
                  className="flex h-16 sm:h-20 w-40 sm:w-48 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)]/50 backdrop-blur-md shadow-sm transition-transform hover:scale-105"
                >
                  <span className="font-semibold text-lg sm:text-xl text-[var(--sea-ink-soft)] uppercase tracking-widest">
                    {logo}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
