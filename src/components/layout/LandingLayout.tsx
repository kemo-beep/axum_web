import type { ReactNode } from 'react'
import { LandingHeader } from './LandingHeader'
import Footer from './Footer'

interface LandingLayoutProps {
  children: ReactNode
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
