import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { apiFetch } from '#/lib/api'
import { InlineErrorBanner } from '#/components/shared/InlineErrorBanner'
import { ArrowLeft } from 'lucide-react'

type ForgotPasswordFormProps = {
  onSuccess: (email: string) => void
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
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
      onSuccess(email.trim())
    } catch (err: unknown) {
      const apiErr = err as { message: string }
      setError(apiErr.message ?? 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {error && <InlineErrorBanner message={error} />}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="forgot-email"
            className="text-[var(--sea-ink)] font-semibold"
          >
            Email
          </Label>
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
    </>
  )
}
