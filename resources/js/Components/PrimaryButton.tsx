import { ButtonHTMLAttributes, ReactNode } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export default function PrimaryButton({
    className = '',
    disabled = false,
    children,
    ...props
}: PrimaryButtonProps) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent bg-[var(--accent-color)] text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-[var(--accent-hover)] focus:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-[var(--accent-hover)] ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
