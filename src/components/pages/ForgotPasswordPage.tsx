import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AuthLayout } from '#/components/layout/AuthLayout'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { apiFetch } from '#/lib/api'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

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
      const apiErr = err as { message: string }
      setError(apiErr.message ?? 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <main className="page-wrap flex min-h-[80vh] items-center justify-center py-12">
        <AuthLayout
          title="Check your email"
          subtitle={`If an account exists for ${email}, we've sent a secure password reset link.`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[2rem] border border-[var(--line)] bg-gradient-to-b from-[var(--surface-strong)] to-[var(--surface)] p-8 shadow-2xl backdrop-blur-2xl text-center"
          >
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-[var(--lagoon)]/10 text-[var(--lagoon)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <Button variant="outline" className="h-12 w-full rounded-xl text-md font-medium" asChild>
              <Link to="/login">Back to login</Link>
            </Button>
          </motion.div>
        </AuthLayout>
      </main>
    )
  }

  return (
    <main className="page-wrap flex min-h-[80vh] items-center justify-center py-12">
      <AuthLayout
        title="Reset password"
        subtitle="Enter your email and we'll send a secure reset link"
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
              <Label htmlFor="forgot-email" className="text-[var(--sea-ink)] font-semibold">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="h-12 rounded-xl border-[var(--line)] bg-[var(--surface)] px-4 focus-visible:ring-2 focus-visible:ring-[var(--lagoon)]/50"
              />
            </div>
            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-[var(--lagoon)] hover:bg-[var(--lagoon-deep)] text-white font-semibold text-md transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? 'Sending link...' : 'Send reset link'}
            </Button>
          </form>

          <div className="mt-8 border-t border-[var(--line)] pt-6 flex justify-center">
            <Link
              to="/login"
              className="group flex items-center gap-2 text-sm font-medium text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] transition-colors"
            >
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              Back to login
            </Link>
          </div>
        </motion.div>
      </AuthLayout>
    </main>
  )
}
