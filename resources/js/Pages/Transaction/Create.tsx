import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEvent, useState, useEffect } from 'react';
import { t } from '@/i18n';
import Card from '@/Components/Card';
import FormInputText from '@/Components/FormInputText';
import FormInputSelect from '@/Components/FormInputSelect';
import InputTextSelect from '@/Components/InputTextSelect';
import PrimaryButton from '@/Components/PrimaryButton';
import { AvailableAsset } from '@/Hooks/useAvailableAssets';
import useWallet from '@/Hooks/useWallet';
import { AssetType, TransactionType, User } from '@/types';

interface CreateProps {
    auth: {
        user: User;
    };
    assetTypes: AssetType[];
    transactionTypes: TransactionType[];
}

interface FormProps {
    transactionTypes: TransactionType[];
}

function CreateTransactionForm({ transactionTypes }: FormProps) {
    const { currentWallet, wallets } = useWallet();

    const walletId = currentWallet?.id ?? null;

    const [selectedAsset, setSelectedAsset] = useState<AvailableAsset | null>(null);
    const [assetError, setAssetError] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        wallet_id: walletId,
        transaction_type_id: '',
        asset_id: '',
        custom_asset_id: '',
        quantity: '',
        unit_price: '',
        currency: 'BRL',
        traded_at: new Date().toISOString().slice(0, 16),
    });

    
    console.log(data.wallet_id);

    const selectedType = transactionTypes.find(
        t => t.id.toString() === data.transaction_type_id
    );

    useEffect(() => {
        if (selectedAsset) {
            setData('asset_id', selectedAsset.asset_id?.toString() || '');
            setData('custom_asset_id', selectedAsset.custom_asset_id?.toString() || '');
            setData('currency', selectedAsset.currency || 'BRL');
            setAssetError(null);
        }
    }, [selectedAsset]);

    useEffect(() => {
        if (walletId !== null) {
            setData('wallet_id', walletId);
        }
    }, [walletId]);

    const quantity = parseFloat(data.quantity) || 0;
    const unitPrice = parseFloat(data.unit_price) || 0;
    const grossAmount = quantity * unitPrice;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!selectedAsset) {
            setAssetError(
                t('transactions.validation.asset_required') ||
                'Selecione um ativo'
            );
            return;
        }

        if (!data.transaction_type_id || quantity <= 0) {
            return;
        }

        post(route('transactions.store'));
    };

    const currencyOptions = [
        { value: 'BRL', label: 'BRL - Real Brasileiro' },
        { value: 'USD', label: 'USD - Dólar Americano' },
    ];

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <Card
                title={t('transactions.create')}
                footer={
                    <div className="flex justify-end gap-4">
                        <PrimaryButton
                            onClick={handleSubmit}
                            disabled={processing || !walletId}
                            className="px-6 py-2"
                        >
                            {t('common.save')}
                        </PrimaryButton>
                    </div>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Asset Selection */}
                    {walletId !== null ? (
                        <InputTextSelect
                            walletId={walletId}
                            value={selectedAsset}
                            onSelect={setSelectedAsset}
                            label={t('transactions.fields.asset')}
                            placeholder={
                                t('transactions.select_asset') ||
                                'Buscar ativo...'
                            }
                            error={assetError || undefined}
                        />
                    ) : wallets.length === 0 ? (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
                            Você precisa criar uma carteira primeiro.
                            <Link
                                href={route('wallets.create')}
                                className="ml-2 underline font-medium"
                            >
                                Criar carteira
                            </Link>
                        </div>
                    ) : (
                        <div className="p-4 bg-[var(--sidebar-hover)] rounded-md text-[var(--text-muted)] text-sm">
                            Carregando carteira...
                        </div>
                    )}

                    {/* Asset Preview */}
                    {selectedAsset && (
                        <div className="p-3 bg-[var(--sidebar-hover)] rounded-md text-sm">
                            <div className="font-medium text-[var(--text-primary)]">
                                {t('transactions.asset_preview')}
                            </div>
                            <div className="text-[var(--text-secondary)] mt-1">
                                {selectedAsset.ticker && (
                                    <div><strong>Ticker:</strong> {selectedAsset.ticker}</div>
                                )}
                                <div><strong>Nome:</strong> {selectedAsset.name}</div>
                                {selectedAsset.asset_type && (
                                    <div><strong>Tipo:</strong> {selectedAsset.asset_type}</div>
                                )}
                                {selectedAsset.market && (
                                    <div><strong>Mercado:</strong> {selectedAsset.market}</div>
                                )}
                                <div><strong>Moeda:</strong> {selectedAsset.currency}</div>
                            </div>
                        </div>
                    )}

                    {/* Transaction Type */}
                    <FormInputSelect
                        label={t('transactions.fields.transaction_type')}
                        variant="top"
                        value={data.transaction_type_id}
                        onChange={(e) =>
                            setData('transaction_type_id', e.target.value)
                        }
                        error={errors.transaction_type_id}
                        required
                    >
                        <option value="">
                            {t('common.select')}
                        </option>
                        {transactionTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {t(
                                    `transactions.types.${type.slug}` as any,
                                    { defaultValue: type.name }
                                )}
                            </option>
                        ))}
                    </FormInputSelect>

                    {/* Quantity + Unit Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormInputText
                            label={t('transactions.fields.quantity')}
                            variant="top"
                            type="number"
                            step="any"
                            min="0"
                            value={data.quantity}
                            onChange={(e) =>
                                setData('quantity', e.target.value)
                            }
                            error={errors.quantity}
                            required
                        />

                        <FormInputText
                            label={t('transactions.fields.unit_price')}
                            variant="top"
                            type="number"
                            step="any"
                            min="0"
                            value={data.unit_price}
                            onChange={(e) =>
                                setData('unit_price', e.target.value)
                            }
                            error={errors.unit_price}
                            required
                        />
                    </div>

                    {/* Currency + Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormInputSelect
                            label={t('transactions.fields.currency')}
                            variant="top"
                            value={data.currency}
                            onChange={(e) =>
                                setData('currency', e.target.value)
                            }
                            error={errors.currency}
                            required
                        >
                            {currencyOptions.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </FormInputSelect>

                        <FormInputText
                            label={t('transactions.fields.traded_at')}
                            variant="top"
                            type="datetime-local"
                            value={data.traded_at}
                            onChange={(e) =>
                                setData('traded_at', e.target.value)
                            }
                            error={errors.traded_at}
                            required
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default function Create({ transactionTypes }: CreateProps) {
    return (
        <AuthenticatedLayout title={t('transactions.create')}>
            <Head title={t('transactions.create')} />
            <CreateTransactionForm
                transactionTypes={transactionTypes}
            />
        </AuthenticatedLayout>
    );
}