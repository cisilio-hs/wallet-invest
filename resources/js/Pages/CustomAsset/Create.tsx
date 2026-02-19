import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { t } from '@/i18n';
import Card from '@/Components/Card';
import FormInputText from '@/Components/FormInputText';
import FormInputSelect from '@/Components/FormInputSelect';
import PrimaryButton from '@/Components/PrimaryButton';

interface AssetType {
    id: number;
    name: string;
}

interface CreateProps {
    assetTypes: AssetType[];
}

export default function Create({ assetTypes }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        asset_type_id: '',
        currency: 'BRL',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('custom-assets.store'));
    };

    return (
        <AuthenticatedLayout title={t('custom_assets.create')}>
            <Head title={t('custom_assets.create')} />

            <div className="p-6 max-w-2xl mx-auto">
                <Card
                    title={t('custom_assets.create')}
                    footer={
                        <div className="flex justify-end">
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
                        <FormInputText
                            label={t('custom_assets.fields.name')}
                            variant="top"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            required
                        />

                        <FormInputSelect
                            label={t('custom_assets.fields.asset_type')}
                            variant="top"
                            value={data.asset_type_id}
                            onChange={(e) => setData('asset_type_id', e.target.value)}
                            error={errors.asset_type_id}
                        >
                            <option value="">{t('common.select')}</option>
                            {assetTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </FormInputSelect>

                        <FormInputSelect
                            label={t('custom_assets.fields.currency')}
                            variant="top"
                            value={data.currency}
                            onChange={(e) => setData('currency', e.target.value)}
                            error={errors.currency}
                            required
                        >
                            <option value="BRL">BRL - Real Brasileiro</option>
                            <option value="USD">USD - Dólar Americano</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - Libra Esterlina</option>
                            <option value="BTC">BTC - Bitcoin</option>
                            <option value="ETH">ETH - Ethereum</option>
                        </FormInputSelect>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
