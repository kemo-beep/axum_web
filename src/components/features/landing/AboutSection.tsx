import { motion } from 'framer-motion'

export function AboutSection() {
  return (
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
  )
}
