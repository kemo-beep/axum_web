import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import {
  EllipsisVertical,
  FileText,
  ExternalLink,
  Download,
} from 'lucide-react'

interface TransactionItem {
  id: string
  kind?: string
  event_type?: string
  amount_cents?: number
  currency?: string
  receipt_url?: string
  hosted_invoice_url?: string
  invoice_pdf_url?: string
  status?: string
  billing_email?: string
  occurred_at: string
}

interface TransactionTableProps {
  subscriptionTransactions: TransactionItem[]
  creditTransactions: TransactionItem[]
}

export function TransactionTable({
  subscriptionTransactions,
  creditTransactions,
}: TransactionTableProps) {
  const formatDate = (s: string) => {
    try {
      return new Date(s).toLocaleDateString()
    } catch {
      return s
    }
  }

  const formatAmount = (cents?: number, currency?: string) => {
    if (cents == null) return '-'
    const curr = currency ?? 'usd'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr.toUpperCase(),
    }).format(cents / 100)
  }

  const all = [
    ...subscriptionTransactions.map((t) => ({
      ...t,
      source: 'subscription' as const,
    })),
    ...creditTransactions.map((t) => ({ ...t, source: 'credit' as const })),
  ].sort(
    (a, b) =>
      new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime(),
  )

  if (all.length === 0) {
    return (
      <p className="text-sm text-[var(--sea-ink-soft)]">No transactions yet.</p>
    )
  }

  const invoiceUrl = (t: TransactionItem) =>
    t.hosted_invoice_url ?? t.receipt_url

  const [detailsTransaction, setDetailsTransaction] = useState<
    (TransactionItem & { source: 'subscription' | 'credit' }) | null
  >(null)

  return (
    <>
      <Table className="rounded-lg border border-[var(--line)]">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {all.map((t) => (
            <TableRow key={`${t.source}-${t.id}`}>
              <TableCell>{formatDate(t.occurred_at)}</TableCell>
              <TableCell>
                {t.event_type ?? t.kind ?? '-'}
                {t.source === 'credit' ? ' (credit)' : ''}
              </TableCell>
              <TableCell>{formatAmount(t.amount_cents, t.currency)}</TableCell>
              <TableCell>{t.status ?? '-'}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="h-8 w-8"
                      aria-label="Transaction actions"
                    >
                      <EllipsisVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setDetailsTransaction(t)}
                      className="gap-2"
                    >
                      <FileText className="size-4" />
                      View details
                    </DropdownMenuItem>
                    {invoiceUrl(t) ? (
                      <DropdownMenuItem asChild>
                        <a
                          href={invoiceUrl(t)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <ExternalLink className="size-4" />
                          Invoice URL
                        </a>
                      </DropdownMenuItem>
                    ) : null}
                    {t.invoice_pdf_url ? (
                      <DropdownMenuItem asChild>
                        <a
                          href={t.invoice_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <Download className="size-4" />
                          Download invoice
                        </a>
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Sheet
        open={!!detailsTransaction}
        onOpenChange={(open) => !open && setDetailsTransaction(null)}
      >
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Transaction details</SheetTitle>
          </SheetHeader>
          {detailsTransaction && (
            <dl className="mt-4 grid gap-3 text-sm">
              <div>
                <dt className="text-[var(--sea-ink-soft)]">Date</dt>
                <dd>{formatDate(detailsTransaction.occurred_at)}</dd>
              </div>
              <div>
                <dt className="text-[var(--sea-ink-soft)]">Type</dt>
                <dd>
                  {detailsTransaction.event_type ??
                    detailsTransaction.kind ??
                    '-'}
                  {detailsTransaction.source === 'credit' ? ' (credit)' : ''}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--sea-ink-soft)]">Amount</dt>
                <dd>
                  {formatAmount(
                    detailsTransaction.amount_cents,
                    detailsTransaction.currency,
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--sea-ink-soft)]">Status</dt>
                <dd>{detailsTransaction.status ?? '-'}</dd>
              </div>
              {detailsTransaction.billing_email && (
                <div>
                  <dt className="text-[var(--sea-ink-soft)]">Billing email</dt>
                  <dd>{detailsTransaction.billing_email}</dd>
                </div>
              )}
              {invoiceUrl(detailsTransaction) && (
                <div>
                  <dt className="text-[var(--sea-ink-soft)]">Invoice URL</dt>
                  <dd>
                    <a
                      href={invoiceUrl(detailsTransaction)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--lagoon)] underline hover:opacity-80"
                    >
                      Open invoice
                    </a>
                  </dd>
                </div>
              )}
              {detailsTransaction.invoice_pdf_url && (
                <div>
                  <dt className="text-[var(--sea-ink-soft)]">PDF</dt>
                  <dd>
                    <a
                      href={detailsTransaction.invoice_pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--lagoon)] underline hover:opacity-80"
                    >
                      Download invoice
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
