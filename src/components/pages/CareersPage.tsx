import { motion } from 'framer-motion'
import { LandingHeader } from '#/components/layout/LandingHeader'
import Footer from '#/components/layout/Footer'

export function CareersPage() {
    return (
        <div className="flex min-h-screen flex-col bg-[var(--background)]">
            <LandingHeader />
            <main className="flex-1 flex flex-col pt-32 pb-24 px-4 overflow-hidden relative">
                <div className="page-wrap mx-auto max-w-4xl text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[var(--lagoon)]">
                            Join the Team
                        </p>
                        <h1 className="display-title mb-6 text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
                            Build the future.
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-[var(--sea-ink-soft)] leading-relaxed mb-16">
                            We're looking for passionate builders who want to create category-defining tools.
                        </p>
                        <div className="p-12 rounded-3xl border border-[var(--line)] bg-[var(--surface-strong)]/50 backdrop-blur-xl">
                            <p className="text-[var(--sea-ink-soft)] font-medium">No open positions at this moment. Check back soon!</p>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
