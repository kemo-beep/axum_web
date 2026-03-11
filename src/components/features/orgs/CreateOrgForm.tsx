import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { apiFetch } from '#/lib/api'
import type { Org } from '#/types'

interface CreateOrgFormProps {
  onCreated: (org: Org) => void
  onError: (msg: string) => void
}

export function CreateOrgForm({ onCreated, onError }: CreateOrgFormProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const org = await apiFetch<Org>('/v1/orgs', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || undefined,
        }),
      })
      toast.success('Organization created')
      onCreated(org)
      setName('')
      setSlug('')
    } catch (err: unknown) {
      const apiErr = err as { message?: string; detail?: string }
      const msg = apiErr?.detail ?? apiErr?.message ?? 'Failed to create org'
      toast.error(msg)
      onError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="org-name">Name</Label>
        <Input
          id="org-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Organization"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="org-slug">Slug (optional)</Label>
        <Input
          id="org-slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="my-org"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create org'}
      </Button>
    </form>
  )
}
