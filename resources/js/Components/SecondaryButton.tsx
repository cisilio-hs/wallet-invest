import { ButtonHTMLAttributes, ReactNode } from 'react';

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}: SecondaryButtonProps) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] shadow-sm transition duration-150 ease-in-out hover:bg-[var(--sidebar-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2 disabled:opacity-25 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
