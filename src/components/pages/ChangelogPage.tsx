import { motion } from 'framer-motion'
import { LandingHeader } from '#/components/layout/LandingHeader'
import Footer from '#/components/layout/Footer'

export function ChangelogPage() {
    return (
        <div className="flex min-h-screen flex-col bg-[var(--background)]">
            <LandingHeader />
            <main className="flex-1 flex flex-col pt-32 pb-24 px-4 overflow-hidden relative">
                <div className="page-wrap mx-auto max-w-3xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <h1 className="display-title mb-10 text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
                            Changelog
                        </h1>
                        <div className="border-l-2 border-[var(--line)] pl-8 space-y-12">
                            <div className="relative">
                                <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-[var(--background)] bg-[var(--lagoon)] shadow-[0_0_10px_var(--lagoon)]" />
                                <p className="text-sm font-bold text-[var(--lagoon)] mb-2">Today</p>
                                <h3 className="text-xl font-bold text-[var(--sea-ink)] mb-3">High-Fidelity Interface Upgrade</h3>
                                <p className="text-[var(--sea-ink-soft)] leading-relaxed">
                                    We've completely overhauled our dark mode, animations, and glassmorphism styling to deliver a billion-dollar aesthetic.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
