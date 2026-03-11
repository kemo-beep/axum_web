import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { apiFetch } from '#/lib/api'

interface CreateApiKeyFormProps {
  onCreated: (id: string, name: string, key: string) => void
  onError: (msg: string) => void
}

const DEFAULT_PERMISSIONS = ['files:read', 'files:write']

export function CreateApiKeyForm({ onCreated, onError }: CreateApiKeyFormProps) {
  const [name, setName] = useState('')
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS.join(', '))
  const [expiresInDays, setExpiresInDays] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const perms = permissions
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
      if (perms.length === 0) {
        const msg = 'At least one permission is required'
        toast.error(msg)
        onError(msg)
        setLoading(false)
        return
      }
      const body: Record<string, unknown> = {
        name: name.trim(),
        permissions: perms,
      }
      if (expiresInDays) {
        const days = parseInt(expiresInDays, 10)
        if (!isNaN(days) && days > 0) body.expires_in_days = days
      }
      const res = await apiFetch<{ id: string; name: string; key: string }>(
        '/v1/auth/api-keys',
        {
          method: 'POST',
          body: JSON.stringify(body),
        }
      )
      toast.success('API key created')
      onCreated(res.id, res.name, res.key)
      setName('')
      setPermissions(DEFAULT_PERMISSIONS.join(', '))
      setExpiresInDays('')
    } catch (err: unknown) {
      const apiErr = err as { message?: string; detail?: string }
      const msg = apiErr?.detail ?? apiErr?.message ?? 'Failed to create key'
      toast.error(msg)
      onError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="key-name">Name</Label>
        <Input
          id="key-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My API key"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="key-permissions">
          Permissions (comma-separated)
        </Label>
        <Input
          id="key-permissions"
          value={permissions}
          onChange={(e) => setPermissions(e.target.value)}
          placeholder="files:read, files:write"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="key-expires">Expires in days (optional)</Label>
        <Input
          id="key-expires"
          type="number"
          min="1"
          value={expiresInDays}
          onChange={(e) => setExpiresInDays(e.target.value)}
          placeholder="90"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create key'}
      </Button>
    </form>
  )
}
