import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AuthLayout } from '#/components/layout/AuthLayout'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { apiFetch } from '#/lib/api'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    try {
      await apiFetch<{ ok: boolean }>('/v1/auth/password-reset/request', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
      })
      setSent(true)
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      setError(apiErr?.message ?? 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <main className="page-wrap">
        <AuthLayout title="Check your email" subtitle={`If an account exists for ${email}, we've sent a password reset link.`}>
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-lg">
            <Button variant="outline" className="h-11 w-full" asChild>
              <Link to="/login">Back to login</Link>
            </Button>
          </div>
        </AuthLayout>
      </main>
    )
  }

  return (
    <main className="page-wrap">
      <AuthLayout title="Forgot password" subtitle="Enter your email and we'll send a reset link">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-lg">
          {error && (
            <div
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
              role="alert"
            >
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              className="h-11 w-full bg-[var(--lagoon)] hover:bg-[var(--lagoon-deep)]"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-[var(--sea-ink-soft)]">
            <Link
              to="/login"
              className="font-medium text-[var(--lagoon)] underline-offset-4 hover:underline"
            >
              Back to login
            </Link>
          </p>
        </div>
      </AuthLayout>
    </main>
  )
}
