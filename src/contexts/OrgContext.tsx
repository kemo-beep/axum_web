import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '#/lib/api'
import type { Org } from '#/types'
import { useAuth } from '#/hooks/useAuth'

const SELECTED_ORG_KEY = 'selected_org_id'

interface OrgContextValue {
  orgs: Org[]
  selectedOrgId: string | null
  selectedOrg: Org | null
  setSelectedOrgId: (id: string | null) => void
  refetchOrgs: () => void
  isLoading: boolean
}

const OrgContext = createContext<OrgContextValue | null>(null)

export function OrgProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [selectedOrgId, setSelectedOrgIdState] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(SELECTED_ORG_KEY)
  })

  const { data: orgs = [], refetch, isLoading: orgsLoading } = useQuery({
    queryKey: ['orgs'],
    queryFn: () => apiFetch<Org[]>('/v1/orgs'),
    enabled: !!user && !authLoading,
  })

  const setSelectedOrgId = useCallback((id: string | null) => {
    setSelectedOrgIdState(id)
    if (typeof window !== 'undefined') {
      if (id) localStorage.setItem(SELECTED_ORG_KEY, id)
      else localStorage.removeItem(SELECTED_ORG_KEY)
    }
  }, [])

  // Validate selectedOrgId: clear if not in orgs list
  useEffect(() => {
    if (!selectedOrgId || orgs.length === 0) return
    const found = orgs.some((o) => o.id === selectedOrgId)
    if (!found) {
      const fallback = orgs[0]?.id ?? null
      setSelectedOrgId(fallback)
    }
  }, [orgs, selectedOrgId, setSelectedOrgId])

  // Auto-select first org when orgs load and none selected
  useEffect(() => {
    if (!selectedOrgId && orgs.length > 0) {
      setSelectedOrgId(orgs[0].id)
    }
  }, [orgs, selectedOrgId, setSelectedOrgId])

  const selectedOrg = useMemo(
    () => orgs.find((o) => o.id === selectedOrgId) ?? null,
    [orgs, selectedOrgId],
  )

  const refetchOrgs = useCallback(() => {
    refetch()
  }, [refetch])

  const value = useMemo<OrgContextValue>(
    () => ({
      orgs,
      selectedOrgId,
      selectedOrg,
      setSelectedOrgId,
      refetchOrgs,
      isLoading: authLoading || orgsLoading,
    }),
    [
      orgs,
      selectedOrgId,
      selectedOrg,
      setSelectedOrgId,
      refetchOrgs,
      authLoading,
      orgsLoading,
    ],
  )

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>
}

export function useOrgContext() {
  const ctx = useContext(OrgContext)
  if (!ctx) {
    throw new Error('useOrgContext must be used within OrgProvider')
  }
  return ctx
}
