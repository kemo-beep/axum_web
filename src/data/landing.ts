import { Hexagon, Layers, ShieldCheck } from 'lucide-react'

export const HOME_FEATURES = [
  {
    title: 'Organizations',
    desc: 'Fluid workspace and team management built for scale.',
    Icon: Layers,
  },
  {
    title: 'Billing',
    desc: 'Painless subscriptions and seamless integrated payments.',
    Icon: Hexagon,
  },
  {
    title: 'API Keys',
    desc: 'Enterprise-grade secure programmatic access.',
    Icon: ShieldCheck,
  },
] as const

export const INTEGRATION_LOGOS = [
  'Slack',
  'GitHub',
  'Linear',
  'Notion',
  'Figma',
  'Stripe',
  'Vercel',
  'AWS',
] as const
