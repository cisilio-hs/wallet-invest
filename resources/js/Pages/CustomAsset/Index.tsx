import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { t } from '@/i18n';
import Card from '@/Components/Card';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import { PlusIcon, PencilSquareIcon, TrashIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

interface CustomAsset {
    id: number;
    name: string;
    currency: string;
    type: {
        id: number;
        name: string;
    } | null;
}

interface IndexProps {
    customAssets: CustomAsset[];
}

export default function Index({ customAssets }: IndexProps) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        if (confirm(t('portfolios.edit.delete_confirm'))) {
            setDeletingId(id);
            router.delete(route('custom-assets.destroy', id), {
                onFinish: () => setDeletingId(null),
            });
        }
    };

    const hasAssets = customAssets.length > 0;

    return (
        <AuthenticatedLayout title={t('custom_assets.title')}>
            <Head title={t('custom_assets.title')} />

            <div className="p-6 space-y-6">
                {/* Header with Create Button */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                            {t('custom_assets.title')}
                        </h2>
                        <p className="text-[var(--text-secondary)] mt-1">
                            {t('custom_assets.subtitle')}
                        </p>
                    </div>
                    <Link href={route('custom-assets.create')}>
                        <PrimaryButton className="flex items-center gap-2">
                            <PlusIcon className="h-4 w-4" />
                            {t('custom_assets.create')}
                        </PrimaryButton>
                    </Link>
                </div>

                {/* Custom Assets Table or Empty State */}
                <Card>
                    {hasAssets ? (
                        <DataTable<CustomAsset>
                            data={customAssets}
                            columns={[
                                {
                                    key: 'name',
                                    label: t('custom_assets.fields.name'),
                                    grow: true,
                                },
                                {
                                    key: 'type',
                                    label: t('custom_assets.fields.asset_type'),
                                    render: (item) => item.type?.name || '-',
                                },
                                {
                                    key: 'currency',
                                    label: t('custom_assets.fields.currency'),
                                    render: (item) => item.currency,
                                },
                            ]}
                            actions={(item) => (
                                <div className="flex flex-row space-x-2">
                                    <Link href={route('custom-assets.edit', item.id)}>
                                        <PrimaryButton className="p-1">
                                            <PencilSquareIcon className="h-4 w-4" />
                                        </PrimaryButton>
                                    </Link>
                                    <PrimaryButton
                                        onClick={() => handleDelete(item.id)}
                                        className="p-1 bg-red-800"
                                        disabled={deletingId === item.id}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </PrimaryButton>
                                </div>
                            )}
                        />
                    ) : (
                        <EmptyState />
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

function EmptyState() {
    return (
        <div className="text-center py-12">
            <BriefcaseIcon className="h-12 w-12 mx-auto text-[var(--text-muted)]" />
            <h3 className="mt-4 text-lg font-medium text-[var(--text-primary)]">
                Nenhum ativo customizado
            </h3>
            <p className="mt-2 text-[var(--text-secondary)]">
                Comece criando seu primeiro ativo customizado.
            </p>
            <div className="mt-6">
                <Link href={route('custom-assets.create')}>
                    <PrimaryButton className="flex items-center gap-2 mx-auto">
                        <PlusIcon className="h-4 w-4" />
                        {t('custom_assets.create')}
                    </PrimaryButton>
                </Link>
            </div>
        </div>
    );
}
