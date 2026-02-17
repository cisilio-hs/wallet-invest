import React from 'react';

interface TopbarIconWithBadgeProps {
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    maxCount?: number;
    onClick?: () => void;
}

export function TopbarIconWithBadge({ 
    icon: Icon, 
    count = 0, 
    maxCount = 99,
    onClick 
}: TopbarIconWithBadgeProps) {
    const displayCount = count > maxCount ? `${maxCount}+` : count;
    
    return (
        <button 
            onClick={onClick}
            className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--sidebar-hover)] rounded-lg transition-colors duration-200"
        >
            <Icon className="h-5 w-5" />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 text-xs font-medium bg-red-500 text-white rounded-full flex items-center justify-center">
                    {displayCount}
                </span>
            )}
        </button>
    );
}
