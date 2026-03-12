import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '#/hooks/useAuth'
import { motion } from 'framer-motion'
import { HeroSection } from '#/components/features/landing/HeroSection'
import { FeaturesSection } from '#/components/features/landing/FeaturesSection'
import { IntegrationsMarquee } from '#/components/features/landing/IntegrationsMarquee'
import { AboutSection } from '#/components/features/landing/AboutSection'

export function HomePage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: '/dashboard' })
    }
  }, [user, loading, navigate])

  if (loading || user) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="size-8 rounded-full border-2 border-[var(--lagoon)] border-t-transparent"
        />
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-[var(--background)]">
      <HeroSection />
      <FeaturesSection />
      <IntegrationsMarquee />
      <AboutSection />
    </main>
  )
}
