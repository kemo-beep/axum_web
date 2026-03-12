import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { apiFetch } from '#/lib/api'
import { InlineErrorBanner } from '#/components/shared/InlineErrorBanner'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError(null)
    try {
      await apiFetch('/v1/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      })
      setStatus('success')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err: unknown) {
      setStatus('error')
      const apiErr = err as { message?: string }
      setError(apiErr?.message ?? 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-strong)]/50 p-12 backdrop-blur-xl">
        <p className="font-medium text-[var(--lagoon)]">
          Thanks for reaching out! We&apos;ll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[var(--line)] bg-[var(--surface-strong)]/50 p-8 backdrop-blur-xl text-left sm:p-12"
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="contact-name" className="text-[var(--sea-ink)]">
            Name
          </Label>
          <Input
            id="contact-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            maxLength={200}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="contact-email" className="text-[var(--sea-ink)]">
            Email
          </Label>
          <Input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="contact-subject" className="text-[var(--sea-ink)]">
            Subject
          </Label>
          <Input
            id="contact-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="How can we help?"
            required
            maxLength={200}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="contact-message" className="text-[var(--sea-ink)]">
            Message
          </Label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us more..."
            required
            rows={5}
            maxLength={5000}
            className="mt-2 w-full resize-y rounded-md border border-[var(--line)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]/50"
          />
        </div>
      </div>
      {error && (
        <div className="mt-4">
          <InlineErrorBanner message={error} />
        </div>
      )}
      <Button
        type="submit"
        disabled={status === 'loading'}
        className="mt-6"
      >
        {status === 'loading' ? 'Sending...' : 'Send message'}
      </Button>
    </form>
  )
}
