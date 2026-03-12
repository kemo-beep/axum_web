import { useState } from 'react'
import { AuthLayout } from '#/components/layout/AuthLayout'
import { Button } from '#/components/ui/button'
import { ForgotPasswordForm } from '#/components/features/auth/ForgotPasswordForm'
import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')

  // Use a wrapper to capture email on success
  const handleSuccess = (sentEmail: string) => {
    setEmail(sentEmail)
    setSent(true)
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
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
          <ForgotPasswordForm onSuccess={handleSuccess} />
        </motion.div>
      </AuthLayout>
    </main>
  )
}
