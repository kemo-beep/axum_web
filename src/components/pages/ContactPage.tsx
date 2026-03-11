import { motion } from 'framer-motion'
import { LandingHeader } from '#/components/layout/LandingHeader'
import Footer from '#/components/layout/Footer'

export function ContactPage() {
    return (
        <div className="flex min-h-screen flex-col bg-[var(--background)]">
            <LandingHeader />
            <main className="flex-1 flex flex-col pt-32 pb-24 px-4 overflow-hidden relative">
                <div className="page-wrap mx-auto max-w-2xl relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <h1 className="display-title mb-6 text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
                            Contact Us
                        </h1>
                        <p className="mb-12 text-lg text-[var(--sea-ink-soft)] leading-relaxed">
                            We'd love to hear from you. Get in touch with our team.
                        </p>
                        <div className="p-12 rounded-3xl border border-[var(--line)] bg-[var(--surface-strong)]/50 backdrop-blur-xl">
                            <p className="text-[var(--sea-ink-soft)] font-medium">Reach out via support@structura.example.com</p>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
