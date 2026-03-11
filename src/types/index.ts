export interface User {
  id: string
  email: string
  roles: string[]
  permissions: string[]
}

export interface Org {
  id: string
  name: string
  slug: string
}

export interface OrgMember {
  user_id: string
  email?: string
  role: string
}

export interface Workspace {
  id: string
  org_id: string
  name: string
  slug: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  stripe_price_id: string
  interval: string
  amount_cents: number
  currency: string
  features?: unknown
}

export interface SubscriptionWithPlan {
  id: string
  status: string
  current_period_start?: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  trial_start?: string | null
  trial_end?: string | null
  canceled_at?: string | null
  last_payment_at?: string | null
  paused_at?: string | null
  plan: {
    id: string
    name: string
    stripe_price_id: string
    interval: string
    amount_cents: number
    currency: string
  } | null
}

export interface TokenPackage {
  id: string
  name: string
  stripe_price_id: string
  tokens: number
  amount_cents: number
  currency: string
}

export interface ApiKeyInfo {
  id: string
  name: string
  org_id?: string
  workspace_id?: string
  permissions: string[]
  expires_at?: string
  last_used_at?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}
