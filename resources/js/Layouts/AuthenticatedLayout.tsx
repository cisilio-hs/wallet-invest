import React, { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import { ThemeProvider } from '@/Contexts/ThemeContext';
import { WalletProvider } from '@/Contexts/WalletContext';
import { SidebarProvider, useSidebar, Sidebar, SidebarItem, SidebarSubmenu, SidebarSection } from '@/Components/Sidebar';
import { Topbar, UserMenu, ThemeToggle, TopbarIconWithBadge } from '@/Components/Topbar';
import WalletSelector from '@/Components/WalletSelector';
import { getNavigation } from '@/lib/navigation';
import { t } from '@/i18n';
import { BellIcon, Bars3Icon } from '@heroicons/react/24/outline';

interface AuthenticatedLayoutProps {
    children: ReactNode;
    title?: string;
}

// Componente interno que usa o contexto do sidebar
function LayoutContent({ children, title }: AuthenticatedLayoutProps) {
    const { collapsed, toggleSidebar } = useSidebar();
    const navigation = getNavigation();

    return (
        <div className="min-h-screen flex">
            <Head title={title} />

            {/* Sidebar */}
            <Sidebar>
                {navigation.map((section, sectionIndex) => (
                    <SidebarSection key={sectionIndex} header={section.header}>
                        {section.items.map((item, itemIndex) => (
                            item.children ? (
                                <SidebarSubmenu
                                    key={itemIndex}
                                    label={item.label}
                                    href={item.href}
                                    routeName={item.routeName}
                                    icon={item.icon}
                                    items={item.children}
                                />
                            ) : (
                                <SidebarItem
                                    key={itemIndex}
                                    label={item.label}
                                    href={item.href}
                                    icon={item.icon}
                                    badge={item.badge}
                                    active={item.routeName ? route().current(item.routeName) : false}
                                />
                            )
                        ))}
                    </SidebarSection>
                ))}
            </Sidebar>

            {/* Main Content - margin-left dinâmico baseado no estado do sidebar */}
            <div 
                className={`
                    flex-1 flex flex-col min-h-screen transition-all duration-300
                    ${collapsed ? 'ml-16' : 'ml-64'}
                `}
            >
                {/* Topbar */}
                <Topbar>
                    <div className="flex items-center gap-4">
                        {/* Botão de Toggle do Sidebar */}
                        <button
                            onClick={toggleSidebar}
                            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--sidebar-hover)] rounded-lg transition-colors duration-200"
                            aria-label={collapsed ? t('components.layout.expand_menu') : t('components.layout.collapse_menu')}
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>

                        {/* Page Title */}
                        <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                            {title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Wallet Selector */}
                        <WalletSelector />

                        {/* Theme Toggle */}
                        <ThemeToggle />
                        
                        {/* Notifications */}
                        <TopbarIconWithBadge
                            icon={BellIcon}
                            count={0}
                        />
                        
                        {/* User Menu */}
                        <UserMenu />
                    </div>
                </Topbar>

                {/* Page Content */}
                <main className="flex-1 p-6 bg-[var(--content-bg)] overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function AuthenticatedLayout({ children, title }: AuthenticatedLayoutProps) {
    return (
        <ThemeProvider>
            <WalletProvider>
                <SidebarProvider>
                    <LayoutContent title={title}>
                        {children}
                    </LayoutContent>
                </SidebarProvider>
            </WalletProvider>
        </ThemeProvider>
    );
}
