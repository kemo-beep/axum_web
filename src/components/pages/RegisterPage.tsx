import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { RegisterForm } from '#/components/features/auth/RegisterForm'
import { AuthLayout } from '#/components/layout/AuthLayout'
import { useAuth } from '#/hooks/useAuth'

export function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const handleSuccess = (token: string) => {
    login(token)
    navigate({ to: '/dashboard' })
  }

  return (
    <main className="page-wrap">
      <AuthLayout
        title="Create account"
        subtitle="Sign up with your email and password"
      >
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-lg">
          {error && (
            <div
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
              role="alert"
            >
              {error}
            </div>
          )}
          <RegisterForm onSuccess={handleSuccess} onError={setError} />
          <p className="mt-6 text-center text-sm text-[var(--sea-ink-soft)]">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[var(--lagoon)] underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </AuthLayout>
    </main>
  )
}
