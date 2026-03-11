import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { apiFetch } from '#/lib/api'

interface InviteFormProps {
  orgId: string
  onInvited: () => void
  onError: (msg: string) => void
}

const ROLES = ['member', 'owner', 'admin']

export function InviteForm({ orgId, onInvited, onError }: InviteFormProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await apiFetch<{ token: string }>(`/v1/orgs/${orgId}/invites`, {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), role }),
      })
      toast.success('Invite sent')
      onInvited()
      setEmail('')
    } catch (err: unknown) {
      const apiErr = err as { message?: string; detail?: string }
      const msg = apiErr?.detail ?? apiErr?.message ?? 'Failed to create invite'
      onError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
      <div className="min-w-[200px] space-y-2">
        <Label htmlFor="invite-email">Email</Label>
        <Input
          id="invite-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          required
        />
      </div>
      <div className="min-w-[120px] space-y-2">
        <Label htmlFor="invite-role">Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger id="invite-role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Inviting...' : 'Invite'}
      </Button>
    </form>
  )
}
