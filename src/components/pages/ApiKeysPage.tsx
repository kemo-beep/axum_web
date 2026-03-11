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
import { TableSkeleton } from '#/components/shared/PageSkeleton'
import { Key } from 'lucide-react'
import { Plus } from 'lucide-react'

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

  const handleCreated = (id: string, name: string, key: string) => {
    setCreateOpen(false)
    setKeyReveal({ name, key })
  }

  const handleRotated = (id: string, name: string, key: string) => {
    setKeyReveal({ name, key })
  }

  return (
    <main className="page-wrap">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">
          API Keys
        </h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          Create key
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : keys && keys.length > 0 ? (
        <ApiKeyTable keys={keys} onRotated={handleRotated} />
      ) : (
        <EmptyState
          icon={<Key className="size-12" />}
          title="No API keys yet"
          description="Create an API key to authenticate requests to the API."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 size-4" />
              Create API key
            </Button>
          }
        />
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API key</DialogTitle>
          </DialogHeader>
          <CreateApiKeyForm
            onCreated={handleCreated}
            onError={(msg) => setError(msg)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!keyReveal}
        onOpenChange={(open) => !open && setKeyReveal(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API key</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[var(--sea-ink-soft)]">
            Copy this key now. You won&apos;t be able to see it again.
          </p>
          {keyReveal && (
            <div className="flex gap-2">
              <Input
                readOnly
                value={keyReveal.key}
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(keyReveal.key)
                  toast.success('Copied to clipboard')
                }}
              >
                Copy
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
