import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { t } from '@/i18n';
import Card from '@/Components/Card';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import { Position, Wallet, Asset, CustomAsset, Transaction, TransactionType } from '@/types';
import { ArrowPathIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

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

interface TransactionWithType extends Transaction {
    transaction_type?: TransactionType | null;
}

interface ShowProps {
    position: PositionWithAsset;
    wallet: Wallet;
    transactions: TransactionWithType[];
}

export default function Show(props: ShowProps) {
    const { position, wallet, transactions } = props;

    const formatCurrency = (value: number, currency: string = 'BRL') => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getTotalValue = () => {
        return position.quantity * position.average_price;
    };

    const getAssetName = () => {
        return position.asset?.name || position.custom_asset?.name || '-';
    };

    const getTicker = () => {
        return position.asset?.ticker || '';
    };

    const getCurrency = () => {
        return position.asset?.currency || position.custom_asset?.currency || 'BRL';
    };

    const handleRecalculate = () => {
        router.post(
            route('wallets.positions.recalculate', { wallet: wallet.id, position: position.id })
        );
    };

    const hasTransactions = transactions.length > 0;

    return (
        <AuthenticatedLayout title={t('positions.show.title')}>
            <Head title={t('positions.show.title')} />
            
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href={route('wallets.positions.index', wallet.id)}>
                            <PrimaryButton className="p-2">
                                <ArrowLeftIcon className="h-4 w-4" />
                            </PrimaryButton>
                        </Link>
                        <div>
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                {getTicker() ? `${getTicker()} - ${getAssetName()}` : getAssetName()}
                            </h2>
                            <p className="text-[var(--text-secondary)] mt-1">
                                {wallet.name}
                            </p>
                        </div>
                    </div>
                    {position.is_dirty && (
                        <PrimaryButton 
                            onClick={handleRecalculate}
                            className="flex items-center gap-2"
                        >
                            <ArrowPathIcon className="h-4 w-4" />
                            {t('positions.sync')}
                        </PrimaryButton>
                    )}
                </div>

                {/* Dirty Warning */}
                {position.is_dirty && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <ArrowPathIcon className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-800">
                                {t('positions.dirty_warning')}
                            </p>
                            <p className="text-sm text-yellow-600">
                                {t('positions.dirty_position_description')}
                            </p>
                        </div>
                    </div>
                )}

                {/* Position Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
                            {t('positions.details.title')}
                        </h3>
                        <dl className="space-y-4">
                            <div className="flex justify-between">
                                <dt className="text-[var(--text-secondary)]">{t('positions.fields.quantity')}</dt>
                                <dd className="font-medium text-[var(--text-primary)]">
                                    {position.quantity.toLocaleString('pt-BR', { maximumFractionDigits: 4 })}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-[var(--text-secondary)]">{t('positions.fields.average_price')}</dt>
                                <dd className="font-medium text-[var(--text-primary)]">
                                    {formatCurrency(position.average_price, getCurrency())}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-[var(--text-secondary)]">{t('positions.fields.total_value')}</dt>
                                <dd className="font-medium text-[var(--text-primary)]">
                                    {formatCurrency(getTotalValue(), getCurrency())}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-[var(--text-secondary)]">{t('positions.fields.status')}</dt>
                                <dd className="font-medium">
                                    {position.is_dirty ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                            {t('positions.dirty')}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            {t('positions.synced')}
                                        </span>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
                            {t('positions.details.asset_info')}
                        </h3>
                        <dl className="space-y-4">
                            <div className="flex justify-between">
                                <dt className="text-[var(--text-secondary)]">{t('positions.fields.ticker')}</dt>
                                <dd className="font-medium text-[var(--text-primary)]">
                                    {getTicker() || '-'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-[var(--text-secondary)]">{t('positions.fields.name')}</dt>
                                <dd className="font-medium text-[var(--text-primary)]">
                                    {getAssetName()}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-[var(--text-secondary)]">{t('positions.fields.type')}</dt>
                                <dd className="font-medium text-[var(--text-primary)]">
                                    {position.asset?.type?.name || position.custom_asset?.type?.name || '-'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-[var(--text-secondary)]">{t('positions.fields.currency')}</dt>
                                <dd className="font-medium text-[var(--text-primary)]">
                                    {getCurrency()}
                                </dd>
                            </div>
                        </dl>
                    </Card>
                </div>

                {/* Transaction History */}
                <Card>
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
                        {t('positions.transactions_history')}
                    </h3>
                    {hasTransactions ? (
                        <DataTable<TransactionWithType>
                            data={transactions}
                            columns={[
                                {
                                    key: 'traded_at',
                                    label: t('transactions.fields.traded_at'),
                                    render: (item) => formatDate(item.traded_at),
                                },
                                {
                                    key: 'type',
                                    label: t('transactions.fields.transaction_type'),
                                    render: (item) => {
                                        const typeSlug = item.transaction_type?.slug || item.type;
                                        const quantitySign = item.transaction_type?.quantity_sign || 
                                            (item.quantity > 0 ? 'positive' : 'negative');
                                        
                                        return (
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                quantitySign === 'positive'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {t(`transactions.types.${typeSlug}` as any, { defaultValue: item.transaction_type?.name || typeSlug })}
                                            </span>
                                        );
                                    },
                                },
                                {
                                    key: 'quantity',
                                    label: t('transactions.fields.quantity'),
                                    render: (item) => Math.abs(item.quantity).toLocaleString('pt-BR', { maximumFractionDigits: 4 }),
                                },
                                {
                                    key: 'unit_price',
                                    label: t('transactions.fields.unit_price'),
                                    render: (item) => formatCurrency(item.unit_price, item.currency),
                                },
                                {
                                    key: 'gross_amount',
                                    label: t('transactions.fields.gross_amount'),
                                    render: (item) => {
                                        const quantitySign = item.transaction_type?.quantity_sign || 
                                            (item.quantity > 0 ? 'positive' : 'negative');
                                        
                                        return (
                                            <span className={quantitySign === 'negative' ? 'text-green-600' : 'text-red-600'}>
                                                {formatCurrency(Math.abs(item.gross_amount), item.currency)}
                                            </span>
                                        );
                                    },
                                },
                            ]}
                        />
                    ) : (
                        <div className="text-center py-8 text-[var(--text-secondary)]">
                            {t('positions.no_transactions')}
                        </div>
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
