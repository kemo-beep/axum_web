/**
 * SEO defaults and helpers for meta tags, OpenGraph, and Twitter Cards.
 * Use with TanStack Router route `head`.
 */

const SITE_NAME = 'SaaS App'
const DEFAULT_DESCRIPTION =
  'A modern SaaS platform with organizations, billing, and team collaboration.'

/** Base URL for canonical links and OG tags. Set VITE_SITE_URL in env. */
export const SITE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) ||
  'https://example.com'

export type SeoOptions = {
  title?: string
  description?: string
  image?: string
  path?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

/**
 * Build meta array for TanStack Router head.
 * Includes title, description, OpenGraph, and Twitter Card tags.
 */
export function createSeoMeta(options: SeoOptions = {}) {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    image,
    path = '',
    type = 'website',
    noIndex = false,
  } = options

  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const url = `${SITE_URL.replace(/\/$/, '')}${path ? (path.startsWith('/') ? path : `/${path}`) : ''}`
  const defaultImage = '/logo512.png'
  const rawImage = image ?? defaultImage
  const imageUrl = rawImage.startsWith('http') ? rawImage : `${SITE_URL}${rawImage.startsWith('/') ? rawImage : `/${rawImage}`}`

  const meta: Array<{ title?: string; name?: string; property?: string; content?: string }> = [
    { title: fullTitle },
    { name: 'description', content: description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: SITE_NAME },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
  ]

  meta.push(
    { property: 'og:image', content: imageUrl },
    { name: 'twitter:image', content: imageUrl },
  )

  if (noIndex) {
    meta.push({ name: 'robots', content: 'noindex, nofollow' })
  }

  const links: Array<{ rel: string; href: string }> = [{ rel: 'canonical', href: url }]

  return { meta, links }
}
