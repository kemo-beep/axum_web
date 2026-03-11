import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { LoginForm } from '#/components/features/auth/LoginForm'
import { AuthLayout } from '#/components/layout/AuthLayout'
import { useAuth } from '#/hooks/useAuth'
import { motion } from 'framer-motion'

export function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const search = useSearch({ strict: false })
  const tokenHandledRef = useRef(false)

  // Handle OAuth callback: token in URL → login, then wait for user before navigating
  useEffect(() => {
    const token = typeof search?.token === 'string' ? search.token : null
    if (!token || tokenHandledRef.current) return
    tokenHandledRef.current = true
    login(token)
  }, [search?.token, login])

  // Navigate when user is loaded (after OAuth callback)
  useEffect(() => {
    const token = typeof search?.token === 'string' ? search.token : null
    if (!token || !user) return
    const target =
      typeof search?.redirect === 'string' ? search.redirect : '/dashboard'
    navigate({ to: target, replace: true })
  }, [search?.token, search?.redirect, user, navigate])

  const handleSuccess = (token: string) => {
    login(token)
    const redirect =
      typeof search?.redirect === 'string' ? search.redirect : '/dashboard'
    window.location.href = redirect
  }

  const hasOAuthToken = typeof search?.token === 'string'

  return (
    <main className="page-wrap flex min-h-[90vh] items-center justify-center py-12">
      <AuthLayout
        title="Welcome back"
        subtitle="Sign in to your workspace"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[2rem] border border-[var(--line)] bg-gradient-to-b from-[var(--surface-strong)] to-[var(--surface)] p-8 sm:p-10 shadow-2xl backdrop-blur-2xl"
        >
          {hasOAuthToken && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 flex items-center justify-center gap-2 text-sm font-medium text-[var(--sea-ink-soft)]"
            >
              <span className="size-4 animate-spin rounded-full border-2 border-[var(--lagoon)] border-t-transparent" />
              Authenticating securely…
            </motion.p>
          )}
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
          <LoginForm onSuccess={handleSuccess} onError={setError} />

          <div className="mt-8 border-t border-[var(--line)] pt-6">
            <p className="text-center text-sm font-medium text-[var(--sea-ink-soft)]">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="text-[var(--sea-ink)] hover:text-[var(--lagoon-deep)] transition-colors inline-block relative group"
              >
                Sign up
                <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-[var(--lagoon)] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            </p>
          </div>
        </motion.div>
      </AuthLayout>
    </main>
  )
}
