import { useState } from 'react'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { apiFetch } from '#/lib/api'
import type { ApiKeyInfo } from '#/types'
import { ApiKeyTable } from '#/components/features/api-keys/ApiKeyTable'
import { CreateApiKeyForm } from '#/components/features/api-keys/CreateApiKeyForm'
import { EmptyState } from '#/components/shared/EmptyState'
import { InlineErrorBanner } from '#/components/shared/InlineErrorBanner'
import { PageHeader } from '#/components/shared/PageHeader'
import { TableSkeleton } from '#/components/shared/PageSkeleton'
import { Key, Plus, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export function ApiKeysPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [keyReveal, setKeyReveal] = useState<{
    name: string
    key: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data: keys, isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: () => apiFetch<ApiKeyInfo[]>('/v1/auth/api-keys'),
  })

  const handleCreated = (_id: string, name: string, key: string) => {
    setCreateOpen(false)
    setKeyReveal({ name, key })
  }

  const handleRotated = (_id: string, name: string, key: string) => {
    setKeyReveal({ name, key })
  }

  return (
    <main className="page-wrap py-10 min-h-[90vh]">
      <PageHeader
        title="API Keys"
        subtitle="Manage secure programmatic access. Keep your keys secret."
        action={
          <Button
            onClick={() => setCreateOpen(true)}
            className="h-11 rounded-xl bg-[var(--lagoon)] hover:bg-[var(--lagoon-deep)] text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 font-semibold px-6"
          >
            <Plus className="mr-2 size-4.5" />
            Create API Key
          </Button>
        }
      />

      {error && (
        <div className="mb-6">
          <InlineErrorBanner message={error} />
        </div>
      )}

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : keys && keys.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="rounded-3xl border border-[var(--line)] bg-[var(--surface-strong)] overflow-hidden shadow-xl backdrop-blur-2xl"
        >
          <ApiKeyTable keys={keys} onRotated={handleRotated} />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-12"
        >
          <EmptyState
            icon={<Key className="size-14 text-[var(--lagoon)] drop-shadow-md" />}
            title="No API keys yet"
            description="Create an API key to securely authenticate programmatic requests to the API."
            action={
              <Button onClick={() => setCreateOpen(true)} className="h-12 rounded-full px-8 bg-[var(--lagoon)] hover:bg-[var(--lagoon-deep)] text-white font-semibold shadow-lg hover:shadow-[0_0_30px_-5px_var(--lagoon)] hover:-translate-y-0.5 transition-all mt-4">
                <Plus className="mr-2 size-5" />
                Generate Key
              </Button>
            }
          />
        </motion.div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-6 shadow-2xl border-[var(--line)] bg-[var(--surface-strong)] backdrop-blur-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl display-title text-[var(--sea-ink)]">Create API key</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <CreateApiKeyForm
              onCreated={handleCreated}
              onError={(msg) => setError(msg)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!keyReveal}
        onOpenChange={(open) => !open && setKeyReveal(null)}
      >
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-8 shadow-2xl border border-[var(--lagoon)]/30 bg-[var(--surface-strong)] backdrop-blur-3xl">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-[var(--lagoon)]/10 text-[var(--lagoon)]">
            <ShieldCheck className="size-8" />
          </div>
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-3xl display-title font-bold text-[var(--sea-ink)] mb-2">Save your API Key</DialogTitle>
            <p className="text-[var(--sea-ink-soft)] font-medium bg-[var(--sea-ink)]/5 p-3 rounded-xl border border-[var(--line)]">
              Store this key somewhere safe. <br /> <strong className="text-[var(--sea-ink)]">You won't be able to see it again.</strong>
            </p>
          </DialogHeader>
          {keyReveal && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                readOnly
                value={keyReveal.key}
                className="h-12 font-mono text-sm tracking-widest bg-white dark:bg-black/50 border-[var(--line)] rounded-xl"
              />
              <Button
                className="h-12 px-6 rounded-xl bg-[var(--lagoon)] hover:bg-[var(--lagoon-deep)] text-white font-semibold shadow-md whitespace-nowrap"
                onClick={() => {
                  navigator.clipboard.writeText(keyReveal.key)
                  toast.success('API Key copied securely to clipboard')
                }}
              >
                Copy Key
              </Button>
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full mt-6 h-12 rounded-xl text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] hover:bg-[var(--surface-strong)]"
            onClick={() => setKeyReveal(null)}
          >
            I've saved it
          </Button>
        </DialogContent>
      </Dialog>
    </main>
  )
}
