import React, { ReactNode } from 'react';
import { useSidebar } from './SidebarContext';

interface SidebarProps {
    children: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
    const { collapsed } = useSidebar();

    return (
        <aside
            className={`
                fixed left-0 top-0 h-screen bg-[var(--sidebar-bg)] border-r border-[var(--border-color)]
                transition-all duration-300 ease-in-out z-40 flex flex-col box-border overflow-x-hidden
                ${collapsed ? 'w-16' : 'w-64'}
            `}
        >
            {/* Logo Area */}
            <div className={`h-16 flex items-center justify-center border-b border-[var(--border-color)] ${collapsed ? 'px-2' : 'px-4'}`}>
                {collapsed ? (
                    <span className="text-xl font-bold text-[var(--accent-color)]">W</span>
                ) : (
                    <span className="text-xl font-bold text-[var(--text-primary)]">Wallet Invest</span>
                )}
            </div>

            {/* Menu Content */}
            <div className={`flex-1 ${collapsed ? 'overflow-hidden px-1' : 'overflow-y-auto px-2'} py-4 space-y-4`}>
                {children}
            </div>

            {/* Bottom Area (optional) */}
            <div className={`border-t border-[var(--border-color)] ${collapsed ? 'p-2' : 'p-4'}`}>
                {!collapsed && (
                    <div className="text-xs text-[var(--text-muted)] text-center">
                        v1.0.0
                    </div>
                )}
            </div>
        </aside>
    );
}
