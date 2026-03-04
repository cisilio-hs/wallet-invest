import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { t } from '@/i18n';
import Card from '@/Components/Card';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import useWallet from '@/Hooks/useWallet';
import { PlusIcon, PencilSquareIcon, TrashIcon, ArrowsRightLeftIcon, WalletIcon } from '@heroicons/react/24/outline';
import { Pagination, Transaction, Asset, CustomAsset, TransactionType, Wallet } from '@/types';

interface TransactionWithAsset extends Transaction {
    asset?: Asset | null;
    custom_asset?: CustomAsset | null;
    transaction_type?: TransactionType | null;
}

interface IndexProps {
    transactions: Pagination & {
        data: TransactionWithAsset[];
    };
    wallet: Wallet;
}

export default function Index(props: IndexProps) {
    return (
        <AuthenticatedLayout title={t('transactions.title')}>
            <Head title={t('transactions.title')} />
            <TransactionIndexContent {...props} />
        </AuthenticatedLayout>
    );
}

function TransactionIndexContent({ transactions, wallet }: IndexProps) {
    const { currentWallet } = useWallet();
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        if (currentWallet && currentWallet.id !== wallet.id) {
            router.get(route('wallets.transactions.index', { wallet: currentWallet.id }));
        }
    }, [currentWallet?.id]);

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        router.get(url);
    };

    const handleDelete = (id: number) => {
        if (confirm(t('transactions.delete_confirm'))) {
            setDeletingId(id);
            router.delete(route('wallets.transactions.destroy', { wallet: wallet.id, transaction: id }), {
                preserveState: false,
                preserveScroll: true,
                onFinish: () => setDeletingId(null),
            });
        }
    };

    const formatCurrency = (value: number, currency: string) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency,
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

    const hasTransactions = transactions.data.length > 0;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                        {t('transactions.title')}
                    </h2>
                    <p className="text-[var(--text-secondary)] mt-1">
                        {wallet.name}
                    </p>
                </div>
                <Link href={route('wallets.transactions.create', { wallet: wallet.id })}>
                    <PrimaryButton className="flex items-center gap-2">
                        <PlusIcon className="h-4 w-4" />
                        {t('transactions.create')}
                    </PrimaryButton>
                </Link>
            </div>

            <Card>
                {hasTransactions ? (
                    <>
                        <DataTable<TransactionWithAsset>
                            data={transactions.data}
                            columns={[
                                {
                                    key: 'traded_at',
                                    label: t('transactions.fields.traded_at'),
                                    render: (item) => formatDate(item.traded_at),
                                },
                                {
                                    key: 'asset',
                                    label: t('transactions.fields.asset'),
                                    grow: true,
                                    render: (item) => {
                                        const assetName = item.asset?.name || item.custom_asset?.name || '-';
                                        const ticker = item.asset?.ticker || '';
                                        return ticker ? `${ticker} - ${assetName}` : assetName;
                                    },
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
                                                    : quantitySign === 'negative'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {t(`transactions.types.${typeSlug}` as any, { defaultValue: item.transaction_type?.name || typeSlug })}
                                            </span>
                                        );
                                    },
                                },
                                {
                                    key: 'quantity',
                                    label: t('transactions.fields.quantity'),
                                    render: (item) => Math.abs(item.quantity).toString(),
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
                            actions={(item) => (
                                <div className="flex flex-row space-x-2">
                                    <Link href={route('wallets.transactions.edit', { wallet: wallet.id, transaction: item.id })}>
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
                        
                        {transactions.links.length > 3 && (
                            <div className="flex justify-center mt-4 space-x-2">
                                {transactions.links.map((link, index) => (
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
                    <div className="text-center py-12">
                        <ArrowsRightLeftIcon className="h-12 w-12 mx-auto text-[var(--text-muted)]" />
                        <h3 className="mt-4 text-lg font-medium text-[var(--text-primary)]">
                            Nenhuma transação
                        </h3>
                        <p className="mt-2 text-[var(--text-secondary)]">
                            Comece registrando sua primeira compra ou venda.
                        </p>
                    </div>
                )}
            </Card>
        </div>
    );
}
