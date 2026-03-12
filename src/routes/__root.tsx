import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { AppLayout } from '../components/layout/AppLayout'
import { RealtimeConnector } from '../components/realtime/RealtimeConnector'
import { AuthProvider } from '../contexts/AuthContext'
import { OrgProvider } from '../contexts/OrgContext'
import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'
import appCss from '../styles.css?url'
import { createSeoMeta, SITE_URL } from '../lib/seo'
import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => {
    const { meta, links } = createSeoMeta({})
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'SaaS App',
      url: SITE_URL,
    }
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        ...meta,
      ],
      links: [{ rel: 'stylesheet', href: appCss }, ...links],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(jsonLd),
        },
      ],
    }
  },
  ssr: false,
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold text-red-600">Something went wrong</h1>
      <p className="text-sm text-zinc-600 max-w-md">
        {error?.message ?? 'An unexpected error occurred'}
      </p>
    </div>
  ),
  pendingComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-2 border-[var(--lagoon)] border-t-transparent" />
    </div>
  ),
  shellComponent: RootShell,
  component: RootDocument,
})

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]" suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootDocument() {
  return (
    <TanStackQueryProvider>
      <AuthProvider>
        <RealtimeConnector />
        <OrgProvider>
          <Toaster richColors position="top-right" />
          <AppLayout>
            <Outlet />
          </AppLayout>
        </OrgProvider>
      </AuthProvider>
    </TanStackQueryProvider>
  )
}
