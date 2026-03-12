import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { createSeoMeta, SITE_URL } from '#/lib/seo'
import { getPostBySlug } from '#/data/blog'
import { BlogPage } from '#/components/pages/BlogPage'

export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug)
    if (!post) throw notFound()
    return post
  },
  head: ({ loaderData }) => {
    const { meta, links } = createSeoMeta({
      title: loaderData.title,
      description: loaderData.excerpt,
      path: `/blog/${loaderData.slug}`,
      type: 'article',
    })
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: loaderData.title,
      description: loaderData.excerpt,
      author: { '@type': 'Person', name: loaderData.author },
      datePublished: loaderData.publishedAt,
      url: `${SITE_URL.replace(/\/$/, '')}/blog/${loaderData.slug}`,
    }
    return {
      meta,
      links,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(jsonLd),
        },
      ],
    }
  },
  component: BlogPostRoute,
})

function BlogPostRoute() {
  const post = Route.useLoaderData()

  const paragraphs = post.body.split('\n\n').filter(Boolean)

  return (
    <BlogPage>
      <article>
        <Link
          to="/blog"
          className="mb-6 inline-block text-sm text-[var(--lagoon)] hover:underline"
        >
          ← Back to blog
        </Link>
        <h2 className="display-title mb-4 text-3xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-4xl">
          {post.title}
        </h2>
        <p className="mb-8 text-sm text-[var(--sea-ink-soft)]">
          {post.author} · {post.publishedAt}
        </p>
        <div className="prose prose-lg dark:prose-invert prose-headings:text-[var(--sea-ink)] prose-p:text-[var(--sea-ink-soft)]">
          {paragraphs.map((para, i) => {
            if (para.startsWith('**') && para.endsWith('**')) {
              return (
                <h3 key={i} className="mt-6 text-lg font-semibold text-[var(--sea-ink)]">
                  {para.slice(2, -2)}
                </h3>
              )
            }
            return (
              <p key={i} className="mb-4">
                {para}
              </p>
            )
          })}
        </div>
      </article>
    </BlogPage>
  )
}
