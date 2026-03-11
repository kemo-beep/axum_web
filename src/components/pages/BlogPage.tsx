import { motion } from 'framer-motion'
import { LandingHeader } from '#/components/layout/LandingHeader'
import Footer from '#/components/layout/Footer'

export function BlogPage() {
    return (
        <div className="flex min-h-screen flex-col bg-[var(--background)]">
            <LandingHeader />
            <main className="flex-1 flex flex-col pt-32 pb-24 px-4 overflow-hidden relative">
                <div className="page-wrap mx-auto max-w-4xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <h1 className="display-title mb-10 text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl text-center">
                            Our Blog
                        </h1>
                        <div className="p-12 text-center rounded-3xl border border-[var(--line)] bg-[var(--surface-strong)]/50 backdrop-blur-xl">
                            <p className="text-[var(--sea-ink-soft)] font-medium">Insights and updates are coming soon.</p>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
