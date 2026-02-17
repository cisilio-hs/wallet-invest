import React, { ReactNode } from 'react';

interface TopbarProps {
    children: ReactNode;
}

export function Topbar({ children }: TopbarProps) {
    return (
        <header className="h-16 bg-[var(--content-bg)] border-b border-[var(--border-color)] flex items-center justify-between pl-2 pr-6 sticky top-0 z-30">
            {children}
        </header>
    );
}
