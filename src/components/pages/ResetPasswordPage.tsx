import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AuthLayout } from '#/components/layout/AuthLayout'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { apiFetch } from '#/lib/api'

interface ResetPasswordPageProps {
  token?: string
}

export function ResetPasswordPage({ token = '' }: ResetPasswordPageProps) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      setError('Invalid or missing reset token')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await apiFetch<{ ok: boolean }>('/v1/auth/password-reset/confirm', {
        method: 'POST',
        body: JSON.stringify({ token, new_password: password }),
      })
      setSuccess(true)
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      setError(apiErr?.message ?? 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (!token && !success) {
    return (
      <main className="page-wrap">
        <AuthLayout
          title="Invalid link"
          subtitle="This reset link is invalid or expired. Request a new one."
        >
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-lg">
            <Button variant="outline" className="h-11 w-full" asChild>
              <Link to="/forgot-password">Request new link</Link>
            </Button>
          </div>
        </AuthLayout>
      </main>
    )
  }

  if (success) {
    return (
      <main className="page-wrap">
        <AuthLayout
          title="Password updated"
          subtitle="Your password has been reset. You can now log in."
        >
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-lg">
            <Button
              className="h-11 w-full bg-[var(--lagoon)] hover:bg-[var(--lagoon-deep)]"
              asChild
            >
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </AuthLayout>
      </main>
    )
  }

  return (
    <main className="page-wrap">
      <AuthLayout title="Set new password" subtitle="Enter your new password below">
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
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              className="h-11 w-full bg-[var(--lagoon)] hover:bg-[var(--lagoon-deep)]"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </Button>
          </form>
        </div>
      </AuthLayout>
    </main>
  )
}
