export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  body: string
  author: string
  publishedAt: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'welcome-to-our-blog',
    title: 'Welcome to Our Blog',
    excerpt: 'Introducing our new blog and what you can expect from us in the coming months.',
    body: `We're excited to launch our blog and share insights, product updates, and tips with you.

Our team will be publishing regular content on product releases, best practices, and industry trends. Subscribe or check back often to stay in the loop.

Thank you for being part of our community.`,
    author: 'The Team',
    publishedAt: '2025-01-15',
  },
  {
    slug: 'getting-started-with-organizations',
    title: 'Getting Started with Organizations',
    excerpt: 'Learn how to create your first organization and invite your team.',
    body: `Organizations help you manage teams, workspaces, and billing in one place.

**Create an organization**
1. Navigate to Organizations from the dashboard
2. Click "Create workspace"
3. Name your organization and invite members by email

**Roles and permissions**
Owners can manage billing and members. Admins can manage workspaces. Members get access based on their assigned workspaces.

Need help? Reach out to support@example.com.`,
    author: 'The Team',
    publishedAt: '2025-01-22',
  },
  {
    slug: 'understanding-your-billing',
    title: 'Understanding Your Billing',
    excerpt: 'A quick guide to plans, trials, and managing your subscription.',
    body: `We offer a simple pricing model designed for teams of all sizes.

**Plans**
- Free tier: Core features to get started
- Pro: Full access with advanced features
- Enterprise: Custom limits and dedicated support

**Trials**
New organizations get a 14-day Pro trial. You can upgrade, downgrade, or cancel at any time from the billing settings.

**Payment failed?**
We'll email you with a link to update your payment method. Your access continues during the grace period.`,
    author: 'The Team',
    publishedAt: '2025-02-01',
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}
