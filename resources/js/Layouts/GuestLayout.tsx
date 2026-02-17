import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface GuestLayoutProps {
    children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[var(--content-bg)] pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-[var(--accent-color)]" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-[var(--card-bg)] px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg border border-[var(--border-color)]">
                {children}
            </div>
        </div>
    );
}
