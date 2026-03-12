import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { apiFetch } from '#/lib/api'
import type { ListUsersResponse, ImpersonateResponse } from '#/types'
import { useAuth } from '#/hooks/useAuth'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { Skeleton } from '#/components/ui/skeleton'
import { toast } from 'sonner'
import { LogIn } from 'lucide-react'

const PAGE_SIZE = 20

export function ImpersonateSection() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'users', offset],
    queryFn: () =>
      apiFetch<ListUsersResponse>(
        `/internal/users?limit=${PAGE_SIZE}&offset=${offset}`,
      ),
  })

  const impersonateMutation = useMutation({
    mutationFn: (userId: string) =>
      apiFetch<ImpersonateResponse>('/internal/impersonate', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId }),
      }),
    onSuccess: (res) => {
      login(res.token)
      toast.success('Impersonation started. Redirecting...')
      navigate({ to: '/dashboard' })
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to impersonate')
    },
  })

  const users = data?.users ?? []
  const total = data?.total ?? 0
  const filteredUsers = search
    ? users.filter(
        (u) =>
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.id.toLowerCase().includes(search.toLowerCase()),
      )
    : users

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-6 text-red-700 dark:text-red-400">
        {error instanceof Error ? error.message : 'Failed to load users'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Input
          placeholder="Search by email or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm border-[var(--line)]"
        />
        <p className="text-sm text-[var(--sea-ink-soft)]">
          {total} user{total !== 1 ? 's' : ''} total
        </p>
      </div>

      <div className="rounded-xl border border-[var(--line)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[var(--line)] bg-[var(--surface)]">
              <TableHead className="text-[var(--sea-ink-soft)]">Email</TableHead>
              <TableHead className="text-[var(--sea-ink-soft)]">ID</TableHead>
              <TableHead className="text-[var(--sea-ink-soft)]">Created</TableHead>
              <TableHead className="text-right text-[var(--sea-ink-soft)]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-[var(--sea-ink-soft)]">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-[var(--sea-ink)]">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-sm text-[var(--sea-ink-soft)] font-mono">
                    {user.id.slice(0, 8)}…
                  </TableCell>
                  <TableCell className="text-sm text-[var(--sea-ink-soft)]">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 border-[var(--line)]"
                      disabled={impersonateMutation.isPending}
                      onClick={() => impersonateMutation.mutate(user.id)}
                    >
                      <LogIn className="size-4" />
                      Impersonate
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {total > PAGE_SIZE && (
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            disabled={offset === 0}
            onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-[var(--sea-ink-soft)]">
            {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={offset + PAGE_SIZE >= total}
            onClick={() => setOffset((o) => o + PAGE_SIZE)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
