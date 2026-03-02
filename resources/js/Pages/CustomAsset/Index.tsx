import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { t } from '@/i18n';
import Card from '@/Components/Card';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import useWallet from '@/Hooks/useWallet';
import { PlusIcon, PencilSquareIcon, TrashIcon, BriefcaseIcon, WalletIcon } from '@heroicons/react/24/outline';

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

export default function Index(props: IndexProps) {
    return (
        <AuthenticatedLayout title={t('custom_assets.title')}>
            <Head title={t('custom_assets.title')} />
            <CustomAssetIndexContent {...props} />
        </AuthenticatedLayout>
    );
}

function CustomAssetIndexContent({ customAssets: initialCustomAssets }: IndexProps) {
    const { currentWallet } = useWallet();
    const [customAssets, setCustomAssets] = useState(initialCustomAssets);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Load custom assets when wallet changes
    useEffect(() => {
        if (!currentWallet) return;

        // Only reload if wallet changed from initial load
        const urlParams = new URLSearchParams(window.location.search);
        const currentWalletId = urlParams.get('wallet_id');

        if (currentWalletId === String(currentWallet.id)) {
            setCustomAssets(initialCustomAssets);
            return;
        }

        setLoading(true);
        router.get(
            route('custom-assets.index'),
            { wallet_id: currentWallet.id },
            {
                preserveState: true,
                replace: true,
                onFinish: () => setLoading(false),
            }
        );
    }, [currentWallet?.id, initialCustomAssets]);

    const handleDelete = (id: number) => {
        if (confirm(t('portfolios.edit.delete_confirm'))) {
            setDeletingId(id);
            router.delete(route('custom-assets.destroy', id), {
                onFinish: () => setDeletingId(null),
            });
        }
    };

    if (!currentWallet) {
        return (
            <div className="p-6">
                <Card>
                    <div className="text-center py-12">
                        <WalletIcon className="h-12 w-12 mx-auto text-[var(--text-muted)]" />
                        <h3 className="mt-4 text-lg font-medium text-[var(--text-primary)]">
                            {t('transactions.select_wallet_title')}
                        </h3>
                        <p className="mt-2 text-[var(--text-secondary)]">
                            {t('transactions.select_wallet_description')}
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-6">
                <Card>
                    <div className="text-center py-12">
                        <div className="animate-spin h-8 w-8 border-2 border-[var(--accent-color)] border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-[var(--text-secondary)]">
                            {t('common.loading')}
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    const hasAssets = customAssets.length > 0;

    return (
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
