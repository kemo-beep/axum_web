import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { apiFetch } from '#/lib/api'
import type { AuthResponse } from '#/types'

interface MagicCodeFormProps {
  onSuccess: (token: string) => void
  onError: (msg: string) => void
}

export function MagicCodeForm({ onSuccess, onError }: MagicCodeFormProps) {
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await apiFetch<{ ok: boolean }>('/v1/auth/send-code', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
      })
      setStep('code')
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      onError(apiErr?.message ?? 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !code.trim()) return
    setLoading(true)
    try {
      const res = await apiFetch<AuthResponse>('/v1/auth/verify-code', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), code: code.trim() }),
      })
      onSuccess(res.access_token)
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      onError(apiErr?.message ?? 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'code') {
    return (
      <form onSubmit={handleVerify} className="space-y-4">
        <p className="text-sm text-[var(--sea-ink-soft)]">
          We sent a code to {email}. Enter it below.
        </p>
        <div className="space-y-2">
          <Label htmlFor="code">Code</Label>
          <Input
            id="code"
            type="text"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            autoComplete="one-time-code"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => setStep('email')}
        >
          Use different email
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSendCode} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="magic-email">Email</Label>
        <Input
          id="magic-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Sending...' : 'Send magic code'}
      </Button>
    </form>
  )
}
