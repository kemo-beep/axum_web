import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { RegisterForm } from '#/components/features/auth/RegisterForm'
import { AuthLayout } from '#/components/layout/AuthLayout'
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
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 shadow-sm dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
              role="alert"
            >
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                {error}
              </span>
            </motion.div>
          )}
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
