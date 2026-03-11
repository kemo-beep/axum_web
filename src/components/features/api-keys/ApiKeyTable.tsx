import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '#/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { apiFetch } from '#/lib/api'
import type { ApiKeyInfo } from '#/types'

interface ApiKeyTableProps {
  keys: ApiKeyInfo[]
  onRotated?: (id: string, name: string, key: string) => void
}

export function ApiKeyTable({ keys, onRotated }: ApiKeyTableProps) {
  const queryClient = useQueryClient()

  const revokeMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/v1/auth/api-keys/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })

  const rotateMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch<{ id: string; name: string; key: string }>(
        `/v1/auth/api-keys/${id}/rotate`,
        { method: 'POST' }
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
      onRotated?.(data.id, data.name, data.key)
    },
  })

  const formatDate = (s?: string) => {
    if (!s) return '-'
    try {
      return new Date(s).toLocaleString()
    } catch {
      return s
    }
  }

  if (keys.length === 0) {
    return (
      <p className="text-sm text-[var(--sea-ink-soft)]">No API keys yet.</p>
    )
  }

  return (
    <Table className="rounded-lg border border-[var(--line)]">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Scope</TableHead>
          <TableHead>Permissions</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Last used</TableHead>
          <TableHead className="w-[180px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {keys.map((k) => (
          <TableRow key={k.id}>
            <TableCell>{k.name}</TableCell>
            <TableCell>
              {k.org_id ? `Org: ${k.org_id}` : k.workspace_id ? `Workspace` : 'User'}
            </TableCell>
            <TableCell>
              <span className="text-xs">
                {k.permissions?.join(', ') ?? '-'}
              </span>
            </TableCell>
            <TableCell>{formatDate(k.expires_at)}</TableCell>
            <TableCell>{formatDate(k.last_used_at)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => rotateMutation.mutate(k.id)}
                  disabled={rotateMutation.isPending}
                >
                  Rotate
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => revokeMutation.mutate(k.id)}
                  disabled={revokeMutation.isPending}
                >
                  Revoke
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
