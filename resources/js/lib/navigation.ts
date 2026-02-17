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

export const navigation: MenuSection[] = [
    {
        items: [
            {
                label: 'Dashboard',
                href: route('dashboard'),
                routeName: 'dashboard',
                icon: HomeIcon,
            },
        ],
    },
    {
        header: 'Investments',
        items: [
            {
                label: 'Wallets',
                href: route('wallets.index'),
                routeName: 'wallets.index',
                icon: WalletIcon,
                children: [
                    {
                        label: 'All Wallets',
                        href: route('wallets.index'),
                        routeName: 'wallets.index',
                        icon: PlusCircleIcon,
                    },
                    {
                        label: 'Create New',
                        href: route('wallets.create'),
                        routeName: 'wallets.create',
                        icon: PlusCircleIcon,
                    },
                ],
            },
            {
                label: 'Portfolios',
                href: route('portfolios.index'),
                routeName: 'portfolios.index',
                icon: FolderIcon,
                children: [
                    {
                        label: 'All Portfolios',
                        href: route('portfolios.index'),
                        routeName: 'portfolios.index',
                    },
                ],
            },
            {
                label: 'Transactions',
                href: '#',
                icon: ArrowsRightLeftIcon,
            },
            {
                label: 'Positions',
                href: '#',
                icon: ClipboardDocumentListIcon,
            },
        ],
    },
    {
        header: 'Analysis',
        items: [
            {
                label: 'Reports',
                href: '#',
                icon: DocumentChartBarIcon,
            },
            {
                label: 'Assets',
                href: '#',
                icon: BriefcaseIcon,
            },
            {
                label: 'Banks & Brokers',
                href: '#',
                icon: BuildingLibraryIcon,
            },
        ],
    },
    {
        header: 'System',
        items: [
            {
                label: 'Settings',
                href: '#',
                icon: Cog6ToothIcon,
            },
        ],
    },
];
