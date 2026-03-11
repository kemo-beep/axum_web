import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface SidebarContextType {
    isCollapsed: boolean
    toggleSidebar: () => void
    setIsCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true) // Default to collapsed per requirements

    useEffect(() => {
        // Optional: Load state from localStorage on mount if desired
        const saved = localStorage.getItem('sidebar_collapsed')
        if (saved !== null) {
            setIsCollapsed(saved === 'true')
        }
    }, [])

    const handleSetIsCollapsed = (collapsed: boolean) => {
        setIsCollapsed(collapsed)
        localStorage.setItem('sidebar_collapsed', String(collapsed))
    }

    const toggleSidebar = () => handleSetIsCollapsed(!isCollapsed)

    return (
        <SidebarContext.Provider
            value={{
                isCollapsed,
                toggleSidebar,
                setIsCollapsed: handleSetIsCollapsed,
            }}
        >
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider')
    }
    return context
}
