import { motion } from 'framer-motion'
import { LandingHeader } from '#/components/layout/LandingHeader'
import Footer from '#/components/layout/Footer'

export function CookiePolicyPage() {
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
                        <h1 className="display-title">Cookie Policy</h1>
                        <p>Last updated: October 2023</p>
                        <h2>1. What Are Cookies</h2>
                        <p>Cookies are tiny files downloaded to your computer to improve your experience.</p>
                        <h2>2. The Cookies We Set</h2>
                        <p>We only use essential session cookies required for authentication and security routing.</p>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
