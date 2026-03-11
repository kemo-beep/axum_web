import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 lg:py-16">
      <div className="w-full max-w-[420px]">
        {(title || subtitle) && (
          <div className="mb-8 text-center">
            {title && (
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--sea-ink)]">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
