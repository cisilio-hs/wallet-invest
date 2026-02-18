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
import { t } from '@/i18n';

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

export function getNavigation(): MenuSection[] {
    return [
        {
            items: [
                {
                    label: t('navigation.dashboard'),
                    href: route('dashboard'),
                    routeName: 'dashboard',
                    icon: HomeIcon,
                },
            ],
        },
        {
            header: t('navigation.investments'),
            items: [
                {
                    label: t('navigation.wallets'),
                    href: route('wallets.index'),
                    routeName: 'wallets.index',
                    icon: WalletIcon,
                    children: [
                        {
                            label: t('navigation.all_wallets'),
                            href: route('wallets.index'),
                            routeName: 'wallets.index',
                        },
                        {
                            label: t('navigation.create_new'),
                            href: route('wallets.create'),
                            routeName: 'wallets.create',
                        },
                    ],
                },
                {
                    label: t('navigation.portfolios'),
                    href: route('portfolios.index'),
                    routeName: 'portfolios.index',
                    icon: FolderIcon,
                    children: [
                        {
                            label: t('navigation.all_portfolios'),
                            href: route('portfolios.index'),
                            routeName: 'portfolios.index',
                        },
                    ],
                },
                {
                    label: t('navigation.transactions'),
                    href: '#',
                    icon: ArrowsRightLeftIcon,
                },
                {
                    label: t('navigation.positions'),
                    href: '#',
                    icon: ClipboardDocumentListIcon,
                },
            ],
        },
        {
            header: t('navigation.analysis'),
            items: [
                {
                    label: t('navigation.reports'),
                    href: '#',
                    icon: DocumentChartBarIcon,
                },
                {
                    label: t('navigation.assets'),
                    href: '#',
                    icon: BriefcaseIcon,
                },
                {
                    label: t('navigation.banks_and_brokers'),
                    href: '#',
                    icon: BuildingLibraryIcon,
                },
            ],
        },
        {
            header: t('navigation.system'),
            items: [
                {
                    label: t('navigation.settings'),
                    href: '#',
                    icon: Cog6ToothIcon,
                },
            ],
        },
    ];
}

// Exportação legada para compatibilidade (será removida após migração completa)
export const navigation: MenuSection[] = [];
