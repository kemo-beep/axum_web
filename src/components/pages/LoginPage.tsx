import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { LoginForm } from '#/components/features/auth/LoginForm'
import { AuthLayout } from '#/components/layout/AuthLayout'
import { useAuth } from '#/hooks/useAuth'

export function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const search = useSearch({ strict: false }) as { redirect?: string; token?: string }
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
    const target = typeof search?.redirect === 'string' ? search.redirect : '/dashboard'
    navigate({ to: target, replace: true })
  }, [search?.token, search?.redirect, user, navigate])

  const handleSuccess = (token: string) => {
    login(token)
    const redirect = typeof search?.redirect === 'string' ? search.redirect : '/dashboard'
    window.location.href = redirect
  }

  const hasOAuthToken = typeof search?.token === 'string'

  return (
    <main className="page-wrap">
      <AuthLayout
        title="Log in"
        subtitle="Sign in with magic link, password, or Google"
      >
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-lg">
          {hasOAuthToken && (
            <p className="mb-4 text-center text-sm text-[var(--sea-ink-soft)]">Signing you in…</p>
          )}
          {error && (
            <div
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
              role="alert"
            >
              {error}
            </div>
          )}
          <LoginForm onSuccess={handleSuccess} onError={setError} />
          <p className="mt-6 text-center text-sm text-[var(--sea-ink-soft)]">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-[var(--lagoon)] underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </AuthLayout>
    </main>
  )
}
