import { motion } from 'framer-motion'
import { LandingHeader } from '#/components/layout/LandingHeader'
import Footer from '#/components/layout/Footer'

export function PricingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-[var(--background)]">
            <LandingHeader />
            <main className="flex-1 flex flex-col pt-32 pb-24 px-4 overflow-hidden relative">
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[50vh] w-[70vw] rounded-full bg-gradient-to-b from-[var(--lagoon)]/10 to-transparent blur-3xl" />
                </div>
                <div className="page-wrap mx-auto max-w-4xl text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[var(--lagoon)]">
                            Pricing Details
                        </p>
                        <h1 className="display-title mb-6 text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
                            Simple, transparent pricing.
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-[var(--sea-ink-soft)] leading-relaxed">
                            We'll be launching our updated pricing soon. Stay tuned for a seamless billing experience.
                        </p>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
