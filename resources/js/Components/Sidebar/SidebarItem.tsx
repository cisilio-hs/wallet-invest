import { Link } from '@inertiajs/react';
import React from 'react';
import { useSidebar } from './SidebarContext';

interface SidebarItemProps {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    active?: boolean;
    forceShowLabel?: boolean;
}

export function SidebarItem({ label, href, icon: Icon, badge, active, forceShowLabel = false }: SidebarItemProps) {
    const { collapsed } = useSidebar();
    const showLabel = forceShowLabel || !collapsed;

    return (
        <Link
            href={href}
            className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                ${active 
                    ? 'bg-[var(--sidebar-active)] text-[var(--accent-color)] hover:bg-[var(--sidebar-hover)]' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)]'
                }
                ${collapsed && !forceShowLabel ? 'justify-center' : 'justify-start'}
            `}
        >
            {Icon && (
                <Icon className={`h-5 w-5 ${showLabel ? 'mr-3' : ''}`} />
            )}
            
            {showLabel && (
                <>
                    <span className="flex-1 truncate">{label}</span>
                    {badge && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                            {badge}
                        </span>
                    )}
                </>
            )}
        </Link>
    );
}
