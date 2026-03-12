import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { apiFetch } from '#/lib/api'
import { InlineErrorBanner } from '#/components/shared/InlineErrorBanner'

type ResetPasswordFormProps = {
  token: string
  onSuccess: () => void
}

export function ResetPasswordForm({ token, onSuccess }: ResetPasswordFormProps) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
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
      onSuccess()
    } catch (err: unknown) {
      const apiErr = err as { message: string }
      setError(apiErr.message ?? 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {error && <InlineErrorBanner message={error} />}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-[var(--sea-ink)] font-semibold">
            New password
          </Label>
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
          <Label htmlFor="confirm-password" className="text-[var(--sea-ink)] font-semibold">
            Confirm password
          </Label>
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
    </>
  )
}
