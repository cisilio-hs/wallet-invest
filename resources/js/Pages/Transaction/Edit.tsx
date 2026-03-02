import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { t } from '@/i18n';
import Card from '@/Components/Card';
import FormInputText from '@/Components/FormInputText';
import FormInputSelect from '@/Components/FormInputSelect';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transaction, AssetType, TransactionType, User } from '@/types';

interface EditProps {
    auth: {
        user: User;
    };
    transaction: Transaction;
    assetTypes: AssetType[];
    transactionTypes: TransactionType[];
}

export default function Edit({ transaction, transactionTypes }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        transaction_type_id: transaction.transaction_type_id?.toString() || '',
        quantity: Math.abs(transaction.quantity).toString(),
        unit_price: transaction.unit_price.toString(),
        currency: transaction.currency,
        traded_at: transaction.traded_at.slice(0, 16), // Format: YYYY-MM-DDTHH:mm
    });

    // Get selected transaction type
    const selectedType = transactionTypes.find(t => t.id.toString() === data.transaction_type_id);

    // Calculate gross amount preview
    const quantity = parseFloat(data.quantity) || 0;
    const unitPrice = parseFloat(data.unit_price) || 0;
    const grossAmount = quantity * unitPrice;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('transactions.update', transaction.id));
    };

    // Get asset name for display
    const assetName = transaction.asset?.name || transaction.custom_asset?.name || '-';
    const assetTicker = transaction.asset?.ticker || '';

    const currencyOptions = [
        { value: 'BRL', label: 'BRL - Real Brasileiro' },
        { value: 'USD', label: 'USD - Dólar Americano' },
        { value: 'EUR', label: 'EUR - Euro' },
        { value: 'GBP', label: 'GBP - Libra Esterlina' },
    ];

    return (
        <AuthenticatedLayout title={t('transactions.edit')}>
            <Head title={t('transactions.edit')} />

            <div className="p-6 max-w-3xl mx-auto">
                <Card
                    title={t('transactions.edit')}
                    footer={
                        <div className="flex justify-end gap-4">
                            <PrimaryButton
                                onClick={handleSubmit}
                                disabled={processing}
                                className="px-6 py-2"
                            >
                                {t('common.save')}
                            </PrimaryButton>
                        </div>
                    }
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Asset Info (Read-only) */}
                        <div className="p-3 bg-[var(--sidebar-hover)] rounded-md">
                            <div className="text-sm text-[var(--text-muted)]">
                                {t('transactions.fields.asset')}
                            </div>
                            <div className="text-lg font-medium text-[var(--text-primary)]">
                                {assetTicker ? `${assetTicker} - ${assetName}` : assetName}
                            </div>
                            <div className="text-xs text-[var(--text-muted)] mt-1">
                                {t('transactions.asset_readonly') || 'O ativo não pode ser alterado. Exclua e crie uma nova transação se necessário.'}
                            </div>
                        </div>

                        {/* Transaction Type */}
                        <FormInputSelect
                            label={t('transactions.fields.transaction_type')}
                            variant="top"
                            value={data.transaction_type_id}
                            onChange={(e) => setData('transaction_type_id', e.target.value)}
                            error={errors.transaction_type_id}
                            required
                        >
                            <option value="">{t('common.select') || 'Selecionar'}</option>
                            {transactionTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {t(`transactions.types.${type.slug}` as any, { defaultValue: type.name })}
                                    {' '}
                                    {type.quantity_sign === 'positive' ? '(+)' : type.quantity_sign === 'negative' ? '(-)' : '(=)'}
                                </option>
                            ))}
                        </FormInputSelect>

                        {/* Quantity hint */}
                        <p className="text-xs text-[var(--text-muted)] -mt-4">
                            {t('transactions.quantity_hint') || 'Quantidade sempre positiva. O sinal é definido pelo tipo.'}
                        </p>

                        {/* Quantity and Unit Price in Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormInputText
                                label={t('transactions.fields.quantity')}
                                variant="top"
                                type="number"
                                step="any"
                                min="0"
                                placeholder="0"
                                value={data.quantity}
                                onChange={(e) => setData('quantity', e.target.value)}
                                error={errors.quantity}
                                required
                            />

                            <FormInputText
                                label={t('transactions.fields.unit_price')}
                                variant="top"
                                type="number"
                                step="any"
                                min="0"
                                placeholder="0.00"
                                value={data.unit_price}
                                onChange={(e) => setData('unit_price', e.target.value)}
                                error={errors.unit_price}
                                required
                            />
                        </div>

                        {/* Gross Amount Preview */}
                        {grossAmount > 0 && selectedType && (
                            <div className="p-3 bg-[var(--sidebar-hover)] rounded-md">
                                <div className="flex justify-between items-center">
                                    <span className="text-[var(--text-secondary)]">
                                        {t('transactions.fields.gross_amount')}:
                                    </span>
                                    <span className={`text-lg font-semibold ${
                                        selectedType.quantity_sign === 'negative' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {selectedType.quantity_sign === 'negative' ? '-' : '+'}
                                        {new Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: data.currency,
                                        }).format(grossAmount)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Currency and Date in Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormInputSelect
                                label={t('transactions.fields.currency')}
                                variant="top"
                                value={data.currency}
                                onChange={(e) => setData('currency', e.target.value)}
                                error={errors.currency}
                                required
                            >
                                {currencyOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </FormInputSelect>

                            <FormInputText
                                label={t('transactions.fields.traded_at')}
                                variant="top"
                                type="datetime-local"
                                value={data.traded_at}
                                onChange={(e) => setData('traded_at', e.target.value)}
                                error={errors.traded_at}
                                required
                            />
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
