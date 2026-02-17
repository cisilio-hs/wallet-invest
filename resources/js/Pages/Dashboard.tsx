import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout title="Dashboard">
            <Head title="Dashboard" />

            <Card className='py-12'>
                <div className="text-center">
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                        Welcome to Wallet Invest!
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                        You're logged in and ready to manage your investments.
                    </p>
                </div>
            </Card>
        </AuthenticatedLayout>
    );
}
