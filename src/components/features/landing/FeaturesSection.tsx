import { motion } from 'framer-motion'
import { HOME_FEATURES } from '#/data/landing'

export function FeaturesSection() {
  return (
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
              Nothing you don&apos;t.
            </span>
          </motion.h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {HOME_FEATURES.map((feature, i) => {
            const Icon = feature.Icon
            return (
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
                  <Icon className="size-5 text-[var(--lagoon)]" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-[var(--sea-ink)]">
                  {feature.title}
                </h3>
                <p className="text-base text-[var(--sea-ink-soft)] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
