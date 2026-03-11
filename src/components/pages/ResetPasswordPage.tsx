import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AuthLayout } from '#/components/layout/AuthLayout'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { apiFetch } from '#/lib/api'
import { motion } from 'framer-motion'
import { CheckCircle2, ShieldAlert } from 'lucide-react'

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
      const apiErr = err as { message: string }
      setError(apiErr.message ?? 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (!token && !success) {
    return (
      <main className="page-wrap flex min-h-[80vh] items-center justify-center py-12">
        <AuthLayout
          title="Invalid access link"
          subtitle="This password reset link is invalid or has expired for security reasons. Please request a new one."
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[2rem] border border-[var(--line)] bg-gradient-to-b from-[var(--surface-strong)] to-[var(--surface)] p-8 shadow-2xl backdrop-blur-2xl text-center"
          >
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-red-100/50 text-red-500 dark:bg-red-900/20 dark:text-red-400">
              <ShieldAlert className="size-8" />
            </div>
            <Button variant="outline" className="h-12 w-full rounded-xl text-md font-medium" asChild>
              <Link to="/forgot-password">Request new secure link</Link>
            </Button>
          </motion.div>
        </AuthLayout>
      </main>
    )
  }

  if (success) {
    return (
      <main className="page-wrap flex min-h-[80vh] items-center justify-center py-12">
        <AuthLayout
          title="Password updated"
          subtitle="Your password has been successfully reset. You can now securely log in to your workspace."
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[2rem] border border-[var(--line)] bg-gradient-to-b from-[var(--surface-strong)] to-[var(--surface)] p-8 shadow-2xl backdrop-blur-2xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
              className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-[var(--lagoon)]/10 text-[var(--lagoon)]"
            >
              <CheckCircle2 className="size-8" />
            </motion.div>
            <Button
              className="h-12 w-full rounded-xl bg-[var(--lagoon)] hover:bg-[var(--lagoon-deep)] text-white font-semibold text-md transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              asChild
            >
              <Link to="/login">Proceed to login</Link>
            </Button>
          </motion.div>
        </AuthLayout>
      </main>
    )
  }

  return (
    <main className="page-wrap flex min-h-[80vh] items-center justify-center py-12">
      <AuthLayout
        title="Set new password"
        subtitle="Please enter your new secure password below."
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[2rem] border border-[var(--line)] bg-gradient-to-b from-[var(--surface-strong)] to-[var(--surface)] p-8 shadow-2xl backdrop-blur-2xl"
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-[var(--sea-ink)] font-semibold">New password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                className="h-12 rounded-xl border-[var(--line)] bg-[var(--surface)] px-4 focus-visible:ring-2 focus-visible:ring-[var(--lagoon)]/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-[var(--sea-ink)] font-semibold">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                className="h-12 rounded-xl border-[var(--line)] bg-[var(--surface)] px-4 focus-visible:ring-2 focus-visible:ring-[var(--lagoon)]/50"
              />
            </div>
            <Button
              type="submit"
              className="mt-2 h-12 w-full rounded-xl bg-[var(--lagoon)] hover:bg-[var(--lagoon-deep)] text-white font-semibold text-md transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? 'Securing account...' : 'Update password'}
            </Button>
          </form>
        </motion.div>
      </AuthLayout>
    </main>
  )
}
