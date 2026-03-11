import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { SidebarProvider, useSidebar } from './SidebarContext'

interface AppShellProps {
  children: ReactNode
}

function AppShellContent({ children }: AppShellProps) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div
        className={`flex w-full flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-16' : 'lg:pl-60'
          }`}
      >
        <Header />
        <main className="flex-1 w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppShellContent>{children}</AppShellContent>
    </SidebarProvider>
  )
}
