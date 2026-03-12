import { useState } from 'react'
import { motion } from 'framer-motion'
import { LandingHeader } from '#/components/layout/LandingHeader'
import Footer from '#/components/layout/Footer'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { apiFetch } from '#/lib/api'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ContactPage() {
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

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <LandingHeader />
      <main className="relative flex flex-1 flex-col overflow-hidden px-4 pt-32 pb-24">
        <div className="page-wrap relative z-10 mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="display-title mb-6 text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
              Contact Us
            </h1>
            <p className="mb-12 text-lg leading-relaxed text-[var(--sea-ink-soft)]">
              We&apos;d love to hear from you. Get in touch with our team.
            </p>

            {status === 'success' ? (
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-strong)]/50 p-12 backdrop-blur-xl">
                <p className="font-medium text-[var(--lagoon)]">
                  Thanks for reaching out! We&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-[var(--line)] bg-[var(--surface-strong)]/50 p-8 backdrop-blur-xl text-left sm:p-12"
              >
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-[var(--sea-ink)]">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      maxLength={200}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[var(--sea-ink)]">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-[var(--sea-ink)]">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="How can we help?"
                      required
                      maxLength={200}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-[var(--sea-ink)]">
                      Message
                    </Label>
                    <textarea
                      id="message"
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
                  <p className="mt-4 text-sm text-red-600">{error}</p>
                )}
                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="mt-6"
                >
                  {status === 'loading' ? 'Sending...' : 'Send message'}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
