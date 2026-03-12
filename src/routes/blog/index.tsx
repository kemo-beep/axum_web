import { createFileRoute, Link } from '@tanstack/react-router'
import { BlogPage } from '#/components/pages/BlogPage'
import { createSeoMeta } from '#/lib/seo'
import { BLOG_POSTS } from '#/data/blog'

export const Route = createFileRoute('/blog/')({
  head: () => {
    const { meta, links } = createSeoMeta({
      title: 'Blog',
      description: 'Insights, updates, and product news from our team.',
      path: '/blog',
    })
    return { meta, links }
  },
  component: BlogListPage,
})

function BlogListPage() {
  return (
    <BlogPage>
      <div className="grid gap-8 sm:grid-cols-1">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="block rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)]/50 p-6 transition hover:border-[var(--lagoon)]/50 hover:bg-[var(--surface-strong)]"
          >
            <h2 className="mb-2 text-xl font-semibold text-[var(--sea-ink)]">
              {post.title}
            </h2>
            <p className="mb-3 text-sm text-[var(--sea-ink-soft)]">
              {post.excerpt}
            </p>
            <p className="text-xs text-[var(--sea-ink-soft)]/80">
              {post.author} · {post.publishedAt}
            </p>
          </Link>
        ))}
      </div>
    </BlogPage>
  )
}
