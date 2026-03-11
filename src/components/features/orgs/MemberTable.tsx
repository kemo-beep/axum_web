import { useState } from 'react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { apiFetch } from '#/lib/api'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import type { OrgMember } from '#/types'

const EDITABLE_ROLES = ['admin', 'member'] as const
type EditableRole = (typeof EDITABLE_ROLES)[number]

interface MemberTableProps {
  orgId: string
  members: OrgMember[]
  currentUserId?: string
  onMemberUpdated: () => void
  onMemberRemoved: () => void
}

export function MemberTable({
  orgId,
  members,
  currentUserId,
  onMemberUpdated,
  onMemberRemoved,
}: MemberTableProps) {
  const [removeTarget, setRemoveTarget] = useState<OrgMember | null>(null)
  const [removeLoading, setRemoveLoading] = useState(false)
  const [roleLoading, setRoleLoading] = useState<string | null>(null)

  const currentUserMember = members.find((m) => m.user_id === currentUserId)
  const canManage =
    currentUserMember?.role === 'owner' || currentUserMember?.role === 'admin'

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!EDITABLE_ROLES.includes(newRole as EditableRole)) return
    setRoleLoading(userId)
    try {
      await apiFetch(`/v1/orgs/${orgId}/members/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      })
      toast.success('Role updated')
      onMemberUpdated()
    } catch (err: unknown) {
      const apiErr = err as { message?: string; detail?: string }
      toast.error(apiErr?.detail ?? apiErr?.message ?? 'Failed to update role')
    } finally {
      setRoleLoading(null)
    }
  }

  const handleRemove = async () => {
    if (!removeTarget) return
    setRemoveLoading(true)
    try {
      await apiFetch(`/v1/orgs/${orgId}/members/${removeTarget.user_id}`, {
        method: 'DELETE',
      })
      toast.success('Member removed')
      onMemberRemoved()
      setRemoveTarget(null)
    } catch (err: unknown) {
      const apiErr = err as { message?: string; detail?: string }
      toast.error(apiErr?.detail ?? apiErr?.message ?? 'Failed to remove member')
    } finally {
      setRemoveLoading(false)
    }
  }

  if (members.length === 0) {
    return (
      <p className="p-6 text-sm text-[var(--sea-ink-soft)]">No members yet.</p>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            {canManage && <TableHead className="w-12" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => (
            <TableRow key={m.user_id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-[var(--sea-ink)]">
                    {m.email ?? m.user_id}
                  </span>
                  {m.email && (
                    <span className="text-xs text-[var(--sea-ink-soft)] font-mono">
                      {m.user_id}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {canManage && EDITABLE_ROLES.includes(m.role as EditableRole) ? (
                  <Select
                    value={m.role}
                    onValueChange={(v) => handleRoleChange(m.user_id, v)}
                    disabled={roleLoading === m.user_id}
                  >
                    <SelectTrigger className="w-28 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EDITABLE_ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="secondary">{m.role}</Badge>
                )}
              </TableCell>
              {canManage && (
                <TableCell className="text-right">
                  {m.role !== 'owner' &&
                    (m.user_id !== currentUserId ||
                      (currentUserMember?.role === 'owner' &&
                        members.filter((x) => x.role === 'owner').length > 1)) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            disabled={roleLoading === m.user_id}
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setRemoveTarget(m)}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove member?</DialogTitle>
            <DialogDescription>
              {removeTarget?.email ?? removeTarget?.user_id} will lose access to
              this organization. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRemoveTarget(null)}
              disabled={removeLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={removeLoading}
            >
              {removeLoading ? 'Removing...' : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
