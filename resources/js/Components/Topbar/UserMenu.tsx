import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { User } from '@/types';
import { t } from '@/i18n';

interface AuthPageProps {
    auth: {
        user: User;
    };
}

export function UserMenu() {
    const { auth } = usePage().props as unknown as AuthPageProps;
    const user = auth.user;

    // Get first letter of name for avatar fallback
    const avatarLetter = user?.name?.charAt(0).toUpperCase() || 'U';

    return (
        <Menu as="div" className="relative ml-3">
            <MenuButton className="flex items-center gap-2 p-1 rounded-lg hover:bg-[var(--sidebar-hover)] transition-colors duration-200">
                {/* Avatar */}
                <div className="h-8 w-8 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center text-sm font-medium">
                    {avatarLetter}
                </div>
                <span className="hidden md:block text-sm font-medium text-[var(--text-primary)]">
                    {user?.name}
                </span>
            </MenuButton>

            <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-md shadow-lg py-1 focus:outline-none z-50">
                <MenuItem>
                    <Link
                        href={route('profile.edit')}
                        className="block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)]"
                    >
                        {t('components.user_menu.profile')}
                    </Link>
                </MenuItem>
                <MenuItem>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="block w-full text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)]"
                    >
                        {t('components.user_menu.logout')}
                    </Link>
                </MenuItem>
            </MenuItems>
        </Menu>
    );
}
