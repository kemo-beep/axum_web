import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { LandingHeader } from '#/components/layout/LandingHeader'
import Footer from '#/components/layout/Footer'

interface BlogPageProps {
  children?: ReactNode
}

export function BlogPage({ children }: BlogPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <LandingHeader />
      <main className="flex flex-1 flex-col overflow-hidden px-4 pb-24 pt-32 relative">
        <div className="page-wrap relative z-10 mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="display-title mb-10 text-center text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
              Our Blog
            </h1>
            {children ?? (
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-strong)]/50 p-12 text-center backdrop-blur-xl">
                <p className="font-medium text-[var(--sea-ink-soft)]">
                  Insights and updates are coming soon.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
