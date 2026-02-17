import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useI18n } from '@/i18n';

export default function Dashboard() {
    const { t } = useI18n();

    return (
        <AuthenticatedLayout title={t('dashboard.title')}>
            <Head title={t('dashboard.title')} />

            <Card className='py-12'>
                <div className="text-center">
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                        {t('dashboard.welcome_title')}
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                        {t('dashboard.welcome_description')}
                    </p>
                </div>
            </Card>
        </AuthenticatedLayout>
    );
}
