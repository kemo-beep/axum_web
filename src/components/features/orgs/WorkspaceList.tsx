import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { apiFetch } from '#/lib/api'
import type { Workspace } from '#/types'

interface WorkspaceListProps {
  orgId: string
  workspaces: Workspace[]
  onCreated: () => void
  onError: (msg: string) => void
}

export function WorkspaceList({
  orgId,
  workspaces,
  onCreated,
  onError,
}: WorkspaceListProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      await apiFetch<Workspace>(`/v1/orgs/${orgId}/workspaces`, {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || undefined,
        }),
      })
      onCreated()
      setName('')
      setSlug('')
      setShowForm(false)
    } catch (err: unknown) {
      const apiErr = err as { message?: string; detail?: string }
      onError(apiErr?.detail ?? apiErr?.message ?? 'Failed to create workspace')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {workspaces.length === 0 ? (
        <p className="text-sm text-[var(--sea-ink-soft)]">No workspaces yet.</p>
      ) : (
        <Table className="rounded-lg border border-[var(--line)]">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workspaces.map((ws) => (
              <TableRow key={ws.id}>
                <TableCell>{ws.name}</TableCell>
                <TableCell className="font-mono text-sm">{ws.slug}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border p-4"
        >
          <div className="space-y-2">
            <Label htmlFor="ws-name">Name</Label>
            <Input
              id="ws-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Workspace"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ws-slug">Slug (optional)</Label>
            <Input
              id="ws-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="my-workspace"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" onClick={() => setShowForm(true)}>
          Add workspace
        </Button>
      )}
    </div>
  )
}
