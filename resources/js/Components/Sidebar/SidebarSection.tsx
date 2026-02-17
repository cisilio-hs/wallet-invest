import React, { ReactNode } from 'react';
import { useSidebar } from './SidebarContext';

interface SidebarSectionProps {
    header?: string;
    children: ReactNode;
}

export function SidebarSection({ header, children }: SidebarSectionProps) {
    const { collapsed } = useSidebar();

    return (
        <div className="space-y-1">
            {header && !collapsed && (
                <div className="px-3 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    {header}
                </div>
            )}
            {collapsed && header && (
                <div className="px-3 py-2 flex justify-center">
                    <div className="w-8 h-px bg-[var(--border-color)]" />
                </div>
            )}
            {children}
        </div>
    );
}
