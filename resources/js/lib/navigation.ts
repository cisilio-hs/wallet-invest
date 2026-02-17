import {
    ChartPieIcon,
    WalletIcon,
    FolderIcon,
    ArrowsRightLeftIcon,
    ClipboardDocumentListIcon,
    DocumentChartBarIcon,
    Cog6ToothIcon,
    HomeIcon,
    BuildingLibraryIcon,
    BriefcaseIcon,
    PlusCircleIcon,
} from '@heroicons/react/24/outline';
import type { TranslationType } from '@/i18n';

export interface MenuItem {
    label: string;
    href: string;
    routeName?: string;
    icon?: React.ComponentType<{ className?: string }>;
    badge?: string | number;
}

export interface SubmenuItem extends MenuItem {
    children?: MenuItem[];
}

export interface MenuSection {
    header?: string;
    items: SubmenuItem[];
}

export function getNavigation(t: (key: keyof TranslationType['navigation']) => string): MenuSection[] {
    return [
        {
            items: [
                {
                    label: t('dashboard'),
                    href: route('dashboard'),
                    routeName: 'dashboard',
                    icon: HomeIcon,
                },
            ],
        },
        {
            header: t('investments'),
            items: [
                {
                    label: t('wallets'),
                    href: route('wallets.index'),
                    routeName: 'wallets.index',
                    icon: WalletIcon,
                    children: [
                        {
                            label: t('all_wallets'),
                            href: route('wallets.index'),
                            routeName: 'wallets.index',
                        },
                        {
                            label: t('create_new'),
                            href: route('wallets.create'),
                            routeName: 'wallets.create',
                        },
                    ],
                },
                {
                    label: t('portfolios'),
                    href: route('portfolios.index'),
                    routeName: 'portfolios.index',
                    icon: FolderIcon,
                    children: [
                        {
                            label: t('all_portfolios'),
                            href: route('portfolios.index'),
                            routeName: 'portfolios.index',
                        },
                    ],
                },
                {
                    label: t('transactions'),
                    href: '#',
                    icon: ArrowsRightLeftIcon,
                },
                {
                    label: t('positions'),
                    href: '#',
                    icon: ClipboardDocumentListIcon,
                },
            ],
        },
        {
            header: t('analysis'),
            items: [
                {
                    label: t('reports'),
                    href: '#',
                    icon: DocumentChartBarIcon,
                },
                {
                    label: t('assets'),
                    href: '#',
                    icon: BriefcaseIcon,
                },
                {
                    label: t('banks_and_brokers'),
                    href: '#',
                    icon: BuildingLibraryIcon,
                },
            ],
        },
        {
            header: t('system'),
            items: [
                {
                    label: t('settings'),
                    href: '#',
                    icon: Cog6ToothIcon,
                },
            ],
        },
    ];
}

// Exportação legada para compatibilidade (será removida após migração completa)
export const navigation: MenuSection[] = [];
function t(key: keyof TranslationType['navigation']): string {
    const labels: Record<keyof TranslationType['navigation'], string> = {
        dashboard: 'Dashboard',
        investments: 'Investments',
        wallets: 'Wallets',
        all_wallets: 'All Wallets',
        create_new: 'Create New',
        portfolios: 'Portfolios',
        all_portfolios: 'All Portfolios',
        transactions: 'Transactions',
        positions: 'Positions',
        analysis: 'Analysis',
        reports: 'Reports',
        assets: 'Assets',
        banks_and_brokers: 'Banks & Brokers',
        system: 'System',
        settings: 'Settings',
    };
    return labels[key];
}
