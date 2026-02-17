import Card from '@/Components/Card';
import DataTable from '@/Components/DataTable';
import FormInputPercentage from '@/Components/FormInputPercentage';
import FormInputText from '@/Components/FormInputText';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IdentificationIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useForm, router } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Portfolio, User, WalletAllocation } from '@/types';
import { useI18n } from '@/i18n';

interface EditProps {
    auth: {
        user: User;
    };
    portfolio: Portfolio;
}

export default function Edit({ auth, portfolio }: EditProps) {
    const { t } = useI18n();

    // Form para editar portfolio
    const portfolioForm = useForm({
        name: portfolio.name,
        target_weight: portfolio.target_weight,
    });

    // Form para criar allocation
    const allocationForm = useForm({
        portfolio_id: portfolio.id,
        asset_id: '',
        custom_asset_id: '',
        score: '0',
    });

    function submitPortfolio(e: FormEvent) {
        e.preventDefault();
        portfolioForm.put(route('portfolios.update', portfolio.id));
    }

    function createAllocation(e: FormEvent) {
        e.preventDefault();
        // TODO: Implement allocation creation
        console.log('Create allocation:', allocationForm.data);
    }

    function deleteAllocation(id: number) {
        if (confirm(t('portfolios.edit.delete_confirm'))) {
            // TODO: Implement allocation deletion
            console.log('Delete allocation:', id);
        }
    }

    return (
        <AuthenticatedLayout title={t('portfolios.edit.title', { name: portfolio.name })}>
            <div className="p-6 space-y-6">

                <div className="flex space-x-6 justify">
                    <div className="grow h-full">
                        <Card
                            title={t('portfolios.edit.edit_portfolio')}
                            footer={
                                <div className="flex justify gap-4">
                                    <PrimaryButton onClick={submitPortfolio} className="px-4 py-2">
                                        {t('common.save')}
                                    </PrimaryButton>
                                </div>
                            }
                        >
                            <div className="flex flex-col justify gap-4">
                                <FormInputText
                                    label={t('common.name')}
                                    variant="top"
                                    placeholder={t('wallets.edit.portfolio_name_placeholder')}
                                    value={portfolioForm.data.name}
                                    icon={IdentificationIcon}
                                    onChange={e => portfolioForm.setData('name', e.target.value)}
                                    error={portfolioForm.errors.name}
                                />

                                <FormInputPercentage
                                    label={t('wallets.edit.target_weight_label')}
                                    variant="top"
                                    placeholder={t('wallets.edit.target_weight_placeholder')}
                                    value={portfolioForm.data.target_weight}
                                    onChange={e => portfolioForm.setData("target_weight", Number(e.target.value))}
                                    error={portfolioForm.errors.target_weight}
                                />
                            </div>
                        </Card>
                    </div>
                    <div className="grow">
                        <Card
                            title={t('portfolios.edit.add_allocation')}
                            footer={
                                <div className="flex justify gap-4">
                                    <PrimaryButton onClick={createAllocation} className="px-4 py-2">
                                        {t('common.save')}
                                    </PrimaryButton>
                                </div>
                            }
                        >
                            <div className="flex flex-col justify gap-4">
                                <FormInputText
                                    label={t('portfolios.edit.asset_id_label')}
                                    variant="top"
                                    placeholder={t('portfolios.edit.asset_id_placeholder')}
                                    value={allocationForm.data.asset_id}
                                    onChange={e => allocationForm.setData('asset_id', e.target.value)}
                                    error={allocationForm.errors.asset_id}
                                />

                                <FormInputText
                                    label={t('portfolios.edit.custom_asset_id_label')}
                                    variant="top"
                                    placeholder={t('portfolios.edit.custom_asset_id_placeholder')}
                                    value={allocationForm.data.custom_asset_id}
                                    onChange={e => allocationForm.setData('custom_asset_id', e.target.value)}
                                    error={allocationForm.errors.custom_asset_id}
                                />

                                <FormInputText
                                    label={t('portfolios.edit.score_label')}
                                    variant="top"
                                    placeholder={t('portfolios.edit.score_placeholder')}
                                    value={allocationForm.data.score}
                                    onChange={e => allocationForm.setData('score', e.target.value)}
                                    error={allocationForm.errors.score}
                                />
                            </div>
                        </Card>
                    </div>
                </div>

                <Card title={t('portfolios.edit.allocations_title')}>
                    <DataTable<WalletAllocation>
                        data={portfolio.walletAllocations || []}
                        columns={[
                            {
                                key: "asset",
                                label: t('portfolios.edit.column_asset'),
                                grow: true,
                                render: (item) => item.asset?.name || item.customAsset?.name || '-'
                            },
                            {
                                key: "score",
                                label: t('portfolios.edit.column_score'),
                                render: (item) => item.score.toString()
                            },
                            {
                                key: "type",
                                label: t('portfolios.edit.column_type'),
                                render: (item) => item.asset_id
                                    ? t('portfolios.edit.type_listed')
                                    : t('portfolios.edit.type_unlisted')
                            },
                        ]}
                        actions={(item) => (
                            <div className='flex flex-row space-x-2'>
                                <PrimaryButton
                                    onClick={() => {}}
                                    className="p-1"
                                >
                                    <PencilSquareIcon className="h-4 w-4"/>
                                </PrimaryButton>

                                <PrimaryButton
                                    onClick={() => deleteAllocation(item.id)}
                                    className="p-1 bg-red-800"
                                >
                                    <TrashIcon className="h-4 w-4"/>
                                </PrimaryButton>
                            </div>
                        )}
                    />
                </Card>

            </div>
        </AuthenticatedLayout>
    );
}
