import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { apiFetch } from '#/lib/api'
import type { AuthResponse } from '#/types'

interface RegisterFormProps {
  onSuccess: (token: string) => void
  onError: (msg: string) => void
}

export function RegisterForm({ onSuccess, onError }: RegisterFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    if (password.length < 8) {
      onError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      const res = await apiFetch<AuthResponse>('/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      })
      onSuccess(res.access_token)
    } catch (err: unknown) {
      const apiErr = err as { message?: string; detail?: string }
      onError(apiErr?.detail ?? apiErr?.message ?? 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-email">Email</Label>
        <Input
          id="reg-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-password">Password</Label>
        <Input
          id="reg-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          className="h-11"
        />
        <p className="text-xs text-[var(--sea-ink-soft)]">At least 8 characters</p>
      </div>
      <Button
        type="submit"
        className="h-11 w-full bg-[var(--lagoon)] hover:bg-[var(--lagoon-deep)]"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  )
}
