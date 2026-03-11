import { motion } from 'framer-motion'
import { LandingHeader } from '#/components/layout/LandingHeader'
import Footer from '#/components/layout/Footer'

export function PrivacyPage() {
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
                        <h1 className="display-title">Privacy Policy</h1>
                        <p>Last updated: October 2023</p>
                        <h2>1. Information We Collect</h2>
                        <p>We take your privacy seriously. This document outlines the minimal amount of data we request to operate our platform.</p>
                        <h2>2. How We Use It</h2>
                        <p>Your data is securely stored and only used for essential app functionality.</p>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
