import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { Badge } from '#/components/ui/badge'
import type { OrgMember } from '#/types'

interface MemberTableProps {
  members: OrgMember[]
}

export function MemberTable({ members }: MemberTableProps) {
  if (members.length === 0) {
    return <p className="text-sm text-[var(--sea-ink-soft)]">No members yet.</p>
  }

  return (
    <Table className="rounded-lg border border-[var(--line)]">
      <TableHeader>
        <TableRow>
          <TableHead>User ID</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((m) => (
          <TableRow key={m.user_id}>
            <TableCell className="font-mono text-sm">{m.user_id}</TableCell>
            <TableCell>
              <Badge variant="secondary">{m.role}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
