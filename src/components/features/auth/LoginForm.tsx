import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { apiFetch } from '#/lib/api'
import { API_BASE } from '#/lib/api'
import type { AuthResponse } from '#/types'

interface LoginFormProps {
  onSuccess: (token: string) => void
  onError: (msg: string) => void
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [magicEmail, setMagicEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    setLoading(true)
    try {
      const res = await apiFetch<AuthResponse>('/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      })
      onSuccess(res.access_token)
    } catch (err: unknown) {
      const apiErr = err as { message?: string; detail?: string }
      onError(apiErr?.detail ?? apiErr?.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMagicCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!magicEmail.trim()) return
    setLoading(true)
    try {
      await apiFetch<{ ok: boolean }>('/v1/auth/send-code', {
        method: 'POST',
        body: JSON.stringify({ email: magicEmail.trim() }),
      })
      setMagicLinkSent(true)
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      onError(apiErr?.message ?? 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!magicEmail.trim() || !code.trim()) return
    setLoading(true)
    try {
      const res = await apiFetch<AuthResponse>('/v1/auth/verify-code', {
        method: 'POST',
        body: JSON.stringify({ email: magicEmail.trim(), code: code.trim() }),
      })
      onSuccess(res.access_token)
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      onError(apiErr?.message ?? 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  const googleUrl = `${API_BASE}/v1/auth/google`

  return (
    <div className="space-y-6">
      <a
        href={googleUrl}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--sea-ink)] transition-colors hover:bg-[var(--link-bg-hover)]"
      >
        <svg className="size-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </a>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="email" className="rounded-lg border border-[var(--line)] [&]:border-b-0">
          <AccordionTrigger className="rounded-lg px-4 py-3 text-sm font-medium text-[var(--sea-ink)] hover:no-underline [&[data-state=open]]:rounded-b-none">
            Login with email
          </AccordionTrigger>
          <AccordionContent className="rounded-b-lg border-x border-b border-[var(--line)] px-4 pb-4 pt-2">
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-[var(--lagoon)] hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                className="h-11 w-full bg-[var(--lagoon)] hover:bg-[var(--lagoon-deep)]"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="rounded-lg border border-[var(--line)] p-4">
        {magicLinkSent ? (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <p className="text-sm text-[var(--sea-ink-soft)]">
              We sent a code to {magicEmail}. Enter it below.
            </p>
            <div className="space-y-2">
              <Label htmlFor="login-code">Code</Label>
              <Input
                id="login-code"
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                autoComplete="one-time-code"
                className="h-11"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="h-11 flex-1 bg-[var(--lagoon)] hover:bg-[var(--lagoon-deep)]"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-11"
                onClick={() => setMagicLinkSent(false)}
              >
                Back
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSendMagicCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-magic-email">Email</Label>
              <Input
                id="login-magic-email"
                type="email"
                placeholder="you@example.com"
                value={magicEmail}
                onChange={(e) => setMagicEmail(e.target.value)}
                autoComplete="email"
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              variant="outline"
              className="h-11 w-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send magic link'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
