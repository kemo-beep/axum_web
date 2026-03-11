import { motion } from 'framer-motion'
import { LandingHeader } from '#/components/layout/LandingHeader'
import Footer from '#/components/layout/Footer'

export function TermsPage() {
    return (
        <div className="flex min-h-screen flex-col bg-[var(--background)]">
            <LandingHeader />
            <main className="flex-1 flex flex-col pt-32 pb-24 px-4 overflow-hidden relative">
                <div className="page-wrap mx-auto max-w-3xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="prose prose-lg dark:prose-invert prose-headings:text-[var(--sea-ink)] prose-p:text-[var(--sea-ink-soft)]"
                    >
                        <h1 className="display-title">Terms of Service</h1>
                        <p>Last updated: October 2023</p>
                        <h2>1. Agreement to Terms</h2>
                        <p>By accessing our application, you agree to be bound by these terms.</p>
                        <h2>2. Use License</h2>
                        <p>Permission is granted to temporarily download one copy of the materials for personal, non-commercial use.</p>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
