import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { t } from '@/i18n';
import Card from '@/Components/Card';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import useWallet from '@/Hooks/useWallet';
import { Pagination, Position, Wallet, Asset, CustomAsset } from '@/types';
import { ClipboardDocumentListIcon, ArrowPathIcon, EyeIcon } from '@heroicons/react/24/outline';

interface PositionWithAsset {
    id: number;
    wallet_id: number;
    asset_id?: number;
    custom_asset_id?: number;
    quantity: number;
    average_price: number;
    is_dirty: boolean;
    created_at: string;
    updated_at: string;
    asset?: Asset | null;
    custom_asset?: CustomAsset | null;
    wallet?: Wallet;
}

interface IndexProps {
    positions: Pagination & {
        data: PositionWithAsset[];
    };
    wallet: Wallet;
}

export default function Index(props: IndexProps) {
    return (
        <AuthenticatedLayout title={t('positions.title')}>
            <Head title={t('positions.title')} />
            <PositionIndexContent {...props} />
        </AuthenticatedLayout>
    );
}

function PositionIndexContent({ positions: initialPositions, wallet }: IndexProps) {
    const { currentWallet } = useWallet();

    // Redirect when wallet changes
    useEffect(() => {
        if (currentWallet && currentWallet.id !== wallet.id) {
            router.get(route('wallets.positions.index', { wallet: currentWallet.id }));
        }
    }, [currentWallet?.id]);

    const formatCurrency = (value: number, currency: string = 'BRL') => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency,
        }).format(value);
    };

    const getTotalValue = (position: PositionWithAsset) => {
        return position.quantity * position.average_price;
    };

    const hasPositions = initialPositions.data.length > 0;

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        router.get(url);
    };

    const handleRecalculateAll = () => {
        router.post(route('wallets.positions.recalculateAll', { wallet: wallet.id }));
    };

    const handleRecalculate = (positionId: number) => {
        router.post(route('wallets.positions.recalculate', { 
            wallet: wallet.id, 
            position: positionId 
        }));
    };

    const hasDirtyPositions = initialPositions.data.some(p => p.is_dirty);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                        {t('positions.title')}
                    </h2>
                    <p className="text-[var(--text-secondary)] mt-1">
                        {wallet.name}
                    </p>
                </div>
                {hasDirtyPositions && (
                    <PrimaryButton 
                        onClick={handleRecalculateAll}
                        className="flex items-center gap-2"
                    >
                        <ArrowPathIcon className="h-4 w-4" />
                        {t('positions.sync_all')}
                    </PrimaryButton>
                )}
            </div>

            {/* Dirty Warning */}
            {hasDirtyPositions && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                    <div className="flex-shrink-0">
                        <ArrowPathIcon className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-800">
                            {t('positions.dirty_warning')}
                        </p>
                        <p className="text-sm text-yellow-600">
                            {t('positions.dirty_description')}
                        </p>
                    </div>
                </div>
            )}

            {/* Positions Table */}
            <Card>
                {hasPositions ? (
                    <>
                        <DataTable<PositionWithAsset>
                            data={initialPositions.data}
                            columns={[
                                {
                                    key: 'asset',
                                    label: t('positions.fields.asset'),
                                    grow: true,
                                    render: (item) => {
                                        const name = item.asset?.name || item.custom_asset?.name || '-';
                                        const ticker = item.asset?.ticker || '';
                                        return ticker ? `${ticker} - ${name}` : name;
                                    },
                                },
                                {
                                    key: 'quantity',
                                    label: t('positions.fields.quantity'),
                                    render: (item) => item.quantity.toLocaleString('pt-BR', { maximumFractionDigits: 4 }),
                                },
                                {
                                    key: 'average_price',
                                    label: t('positions.fields.average_price'),
                                    render: (item) => {
                                        const currency = item.asset?.currency || item.custom_asset?.currency || 'BRL';
                                        return formatCurrency(item.average_price, currency);
                                    },
                                },
                                {
                                    key: 'total_value',
                                    label: t('positions.fields.total_value'),
                                    render: (item) => {
                                        const currency = item.asset?.currency || item.custom_asset?.currency || 'BRL';
                                        return formatCurrency(getTotalValue(item), currency);
                                    },
                                },
                                {
                                    key: 'is_dirty',
                                    label: t('positions.fields.status'),
                                    render: (item) => item.is_dirty ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                            {t('positions.dirty')}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            {t('positions.synced')}
                                        </span>
                                    ),
                                },
                            ]}
                            actions={(item) => (
                                <div className="flex flex-row space-x-2">
                                    <Link href={route('wallets.positions.show', { wallet: wallet.id, position: item.id })}>
                                        <PrimaryButton className="p-1">
                                            <EyeIcon className="h-4 w-4" />
                                        </PrimaryButton>
                                    </Link>
                                    {item.is_dirty && (
                                        <PrimaryButton 
                                            onClick={() => handleRecalculate(item.id)}
                                            className="p-1 bg-yellow-600"
                                        >
                                            <ArrowPathIcon className="h-4 w-4" />
                                        </PrimaryButton>
                                    )}
                                </div>
                            )}
                        />
                        
                        {/* Pagination */}
                        {initialPositions.links.length > 3 && (
                            <div className="flex justify-center mt-4 space-x-2">
                                {initialPositions.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(link.url)}
                                        disabled={!link.url || link.active}
                                        className={`px-3 py-1 rounded ${
                                            link.active
                                                ? 'bg-[var(--accent-color)] text-white'
                                                : 'bg-[var(--card-bg)] text-[var(--text-primary)] hover:bg-[var(--sidebar-hover)]'
                                        } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <EmptyState walletName={wallet.name} />
                )}
            </Card>
        </div>
    );
}

function EmptyState({ walletName }: { walletName: string }) {
    return (
        <div className="text-center py-12">
            <ClipboardDocumentListIcon className="h-12 w-12 mx-auto text-[var(--text-muted)]" />
            <h3 className="mt-4 text-lg font-medium text-[var(--text-primary)]">
                {t('positions.empty.title')}
            </h3>
            <p className="mt-2 text-[var(--text-secondary)]">
                {t('positions.empty.description')}
            </p>
        </div>
    );
}
