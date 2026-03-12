import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AuthLayout } from '#/components/layout/AuthLayout'
import { Button } from '#/components/ui/button'
import { ResetPasswordForm } from '#/components/features/auth/ResetPasswordForm'
import { motion } from 'framer-motion'
import { CheckCircle2, ShieldAlert } from 'lucide-react'

interface ResetPasswordPageProps {
  token?: string
}

export function ResetPasswordPage({ token = '' }: ResetPasswordPageProps) {
  const [success, setSuccess] = useState(false)

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
              transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
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
          <ResetPasswordForm token={token} onSuccess={() => setSuccess(true)} />
        </motion.div>
      </AuthLayout>
    </main>
  )
}
