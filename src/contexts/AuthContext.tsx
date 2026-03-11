import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '#/types'
import { apiFetch, setApiAuth } from '#/lib/api'

const TOKEN_KEY = 'auth_token'

interface AuthContextValue {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string, user?: User) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
  })
  const [loading, setLoading] = useState(true)

  const setToken = useCallback((t: string | null) => {
    setTokenState(t)
    if (typeof window !== 'undefined') {
      if (t) localStorage.setItem(TOKEN_KEY, t)
      else localStorage.removeItem(TOKEN_KEY)
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }, [setToken])

  const refreshInFlightRef = useRef(false)
  const refreshUser = useCallback(async () => {
    const t = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : token
    if (!t) {
      setUser(null)
      setLoading(false)
      return
    }
    if (refreshInFlightRef.current) return
    refreshInFlightRef.current = true
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15_000)
      const me = await apiFetch<User>('/v1/auth/me', { signal: controller.signal })
      clearTimeout(timeout)
      setUser(me)
    } catch {
      setToken(null)
      setUser(null)
    } finally {
      refreshInFlightRef.current = false
      setLoading(false)
    }
  }, [token, setToken])

  useEffect(() => {
    setApiAuth({
      getToken: () => localStorage.getItem(TOKEN_KEY),
      onUnauthorized: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY)
          window.location.href = '/login'
        }
      },
    })
  }, [])

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
    if (!t) {
      setLoading(false)
      return
    }
    refreshUser()
  }, [refreshUser])

  const login = useCallback(
    (newToken: string, newUser?: User) => {
      setToken(newToken)
      if (newUser) {
        setUser(newUser)
      }
      // User fetch is handled by the token-change useEffect via refreshUser
    },
    [setToken]
  )

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, loading, login, logout, refreshUser }),
    [user, token, loading, login, logout, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return ctx
}
