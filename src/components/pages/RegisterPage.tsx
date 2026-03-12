import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { RegisterForm } from '#/components/features/auth/RegisterForm'
import { AuthLayout } from '#/components/layout/AuthLayout'
import { InlineErrorBanner } from '#/components/shared/InlineErrorBanner'
import { useAuth } from '#/hooks/useAuth'
import { motion } from 'framer-motion'

export function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const handleSuccess = (token: string) => {
    login(token)
    navigate({ to: '/dashboard' })
  }

  return (
    <main className="page-wrap flex min-h-[90vh] items-center justify-center py-12">
      <AuthLayout
        title="Start Building"
        subtitle="Create a new workspace for your team"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[2rem] border border-[var(--line)] bg-gradient-to-b from-[var(--surface-strong)] to-[var(--surface)] p-8 sm:p-10 shadow-2xl backdrop-blur-2xl"
        >
          {error && <InlineErrorBanner message={error} />}
          <RegisterForm onSuccess={handleSuccess} onError={setError} />

          <div className="mt-8 border-t border-[var(--line)] pt-6">
            <p className="text-center text-sm font-medium text-[var(--sea-ink-soft)]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[var(--sea-ink)] hover:text-[var(--lagoon-deep)] transition-colors inline-block relative group"
              >
                Log in
                <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-[var(--lagoon)] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            </p>
          </div>
        </motion.div>
      </AuthLayout>
    </main>
  )
}
