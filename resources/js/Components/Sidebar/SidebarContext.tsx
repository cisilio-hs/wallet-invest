import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
    collapsed: boolean;
    toggleSidebar: () => void;
    setCollapsed: (value: boolean) => void;
    activeSubmenu: string | null;
    setActiveSubmenu: React.Dispatch<React.SetStateAction<string | null>>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
    children: ReactNode;
}

const STORAGE_KEY = 'sidebar_collapsed';

export function SidebarProvider({ children }: SidebarProviderProps) {
    const [collapsed, setCollapsedState] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? stored === 'true' : false;
    });
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

    const setCollapsed = (value: boolean) => {
        setCollapsedState(value);
        localStorage.setItem(STORAGE_KEY, String(value));
    };

    const toggleSidebar = () => {
        const newValue = !collapsed;
        setCollapsed(newValue);
    };

    return (
        <SidebarContext.Provider value={{ collapsed, toggleSidebar, setCollapsed, activeSubmenu, setActiveSubmenu }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
