import { ChevronDownIcon } from '@heroicons/react/24/outline';
import React, { useState, useEffect, useRef } from 'react';
import { useSidebar } from './SidebarContext';
import { SidebarItem } from './SidebarItem';

interface SubMenuItem {
    label: string;
    href: string;
    routeName?: string;
    icon?: React.ComponentType<{ className?: string }>;
    badge?: string | number;
}

interface SidebarSubmenuProps {
    label: string;
    href: string;
    routeName?: string;
    icon?: React.ComponentType<{ className?: string }>;
    items: SubMenuItem[];
}

export function SidebarSubmenu({ label, href: baseHref, routeName: baseRouteName, icon: Icon, items }: SidebarSubmenuProps) {
    const { collapsed, activeSubmenu, setActiveSubmenu } = useSidebar();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number } | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);
    const [enableAnimation, setEnableAnimation] = useState(false);

    const isItemActive = items.some(item => {
        if (!item.routeName) return false;
        try {
            return route().current(item.routeName);
        } catch {
            return false;
        }
    });

    const isBaseActive = (() => {
        if (!baseRouteName) return false;
        try {
            return route().current(baseRouteName);
        } catch {
            return false;
        }
    })();

    const shouldBeOpen = isItemActive || isBaseActive;

    useEffect(() => {
        if (!hasInitialized) {
            setIsOpen(shouldBeOpen);
            setHasInitialized(true);
        }
    }, [shouldBeOpen, hasInitialized]);

    // Atualiza a posição quando o botão é renderizado
    useEffect(() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({ top: rect.top });
        }
    }, []);

    useEffect(() => {
        return () => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
        };
    }, []);

    // Controla quando está animando
    useEffect(() => {
        if (collapsed && activeSubmenu === label) {
            setIsAnimating(true);
        } else {
            // Delay para desativar animação após a transição
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [collapsed, activeSubmenu, label]);

    const showMenu = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({ top: rect.top });
        }
        setActiveSubmenu(label);
    };

    const hideMenu = () => {
        hideTimeoutRef.current = setTimeout(() => {
            setActiveSubmenu((prev) => prev === label ? null : prev);
        }, 150);
    };

    const handleToggle = () => {
        setEnableAnimation(true);
        setIsOpen(!isOpen);
    };

    const isActive = isBaseActive || isItemActive;
    const showDropdown = collapsed && activeSubmenu === label && dropdownPosition !== null;

    if (collapsed) {
        return (
            <div className="relative">
                <button
                    ref={buttonRef}
                    onClick={() => setActiveSubmenu(activeSubmenu === label ? null : label)}
                    onMouseEnter={showMenu}
                    onMouseLeave={hideMenu}
                    className={`
                        flex items-center justify-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                        ${isActive
                            ? 'bg-[var(--sidebar-active)] text-[var(--accent-color)] hover:bg-[var(--sidebar-hover)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)]'
                        }
                    `}
                >
                    {Icon && <Icon className="h-5 w-5" />}
                </button>

                {dropdownPosition && (
                    <div
                        key={`${label}-${isAnimating ? 'visible' : 'hidden'}`}
                        className={`
                            fixed w-48 ml-1 p-1 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-md shadow-xl z-50
                            transition-all duration-200 ease-out
                            ${showDropdown ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}
                        `}
                        style={{
                            left: '64px',
                            top: `${dropdownPosition.top}px`,
                        }}
                        onMouseEnter={showMenu}
                        onMouseLeave={hideMenu}
                    >
                        <div className="px-3 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                            {label}
                        </div>
                        {items.map((item, index) => (
                            <SidebarItem
                                key={index}
                                label={item.label}
                                href={item.href}
                                icon={item.icon}
                                badge={item.badge}
                                active={item.routeName ? ((): boolean => {
                                    try {
                                        return route().current(item.routeName!);
                                    } catch {
                                        return false;
                                    }
                                })() : false}
                                forceShowLabel={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-1">
            <button
                onClick={handleToggle}
                className={`
                    flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${isActive
                        ? 'bg-[var(--sidebar-active)] text-[var(--accent-color)] hover:bg-[var(--sidebar-hover)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)]'
                    }
                `}
            >
                {Icon && <Icon className="h-5 w-5 mr-3" />}
                <span className="flex-1 text-left">{label}</span>
                <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <div
                className={`
                    overflow-hidden
                    ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                    ${enableAnimation ? 'transition-all duration-300 ease-in-out' : ''}
                `}
            >
                <div className="pl-5 space-y-1">
                    {items.map((item, index) => (
                        <SidebarItem
                            key={index}
                            label={item.label}
                            href={item.href}
                            icon={item.icon}
                            badge={item.badge}
                            active={item.routeName ? ((): boolean => {
                                try {
                                    return route().current(item.routeName!);
                                } catch {
                                    return false;
                                }
                            })() : false}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
