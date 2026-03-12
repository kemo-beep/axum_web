import { Link } from '@tanstack/react-router'
import { useAuth } from '#/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { User, Mail, Shield, KeyRound } from 'lucide-react'

export function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  const avatarFallback = user.email ? user.email.charAt(0).toUpperCase() : 'U'

  return (
    <main className="page-wrap py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-[var(--sea-ink)] display-title">
          Profile
        </h1>

        <Card className="border-[var(--line)] bg-[var(--surface-strong)] shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-[var(--line)]">
                <AvatarFallback className="bg-[linear-gradient(135deg,var(--lagoon),var(--lagoon-deep))] text-white text-xl font-semibold">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl text-[var(--sea-ink)]">
                  Account
                </CardTitle>
                <p className="text-sm text-[var(--sea-ink-soft)] mt-0.5">
                  View your account information
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <User className="size-5 shrink-0 text-[var(--sea-ink-soft)]" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-[var(--sea-ink-soft)] uppercase tracking-wide">
                  User ID
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-[var(--sea-ink)]">
                  {user.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <Mail className="size-5 shrink-0 text-[var(--sea-ink-soft)]" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-[var(--sea-ink-soft)] uppercase tracking-wide">
                  Email
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-[var(--sea-ink)]">
                  {user.email}
                </p>
              </div>
            </div>

            {user.roles.length > 0 && (
              <div className="flex items-start gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
                <Shield className="size-5 shrink-0 text-[var(--sea-ink-soft)] mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[var(--sea-ink-soft)] uppercase tracking-wide">
                    Roles
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {user.roles.map((role) => (
                      <Badge
                        key={role}
                        variant="secondary"
                        className="border-[var(--line)] bg-[var(--line)]/30"
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <div className="flex items-center gap-2">
                <KeyRound className="size-5 shrink-0 text-[var(--sea-ink-soft)]" />
                <p className="text-xs font-medium text-[var(--sea-ink-soft)] uppercase tracking-wide">
                  Password
                </p>
              </div>
              <p className="text-sm text-[var(--sea-ink-soft)]">
                Want to change your password?{' '}
                <Link
                  to="/forgot-password"
                  className="font-medium text-[var(--lagoon)] hover:underline"
                >
                  Request a reset link
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
