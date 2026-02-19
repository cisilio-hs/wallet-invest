import Card from '@/Components/Card';
import DataTable from '@/Components/DataTable';
import FormInputPercentage from '@/Components/FormInputPercentage';
import FormInputText from '@/Components/FormInputText';
import InputTextSelect from '@/Components/InputTextSelect';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AvailableAsset } from '@/Hooks/useAvailableAssets';
import { IdentificationIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useForm, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import { Portfolio, User, WalletAllocation } from '@/types';
import { t } from '@/i18n';

interface EditProps {
    auth: {
        user: User;
    };
    portfolio: Portfolio;
}

export default function Edit({ auth, portfolio }: EditProps) {
    const [selectedAsset, setSelectedAsset] = useState<AvailableAsset | null>(null);
    const [editingAllocation, setEditingAllocation] = useState<WalletAllocation | null>(null);
    const [assetError, setAssetError] = useState<string | null>(null);

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
        score: '',
    });

    // Form para editar score
    const editScoreForm = useForm({
        score: '',
    });

    function submitPortfolio(e: FormEvent) {
        e.preventDefault();
        portfolioForm.put(route('portfolios.update', portfolio.id));
    }

    function handleAssetSelect(asset: AvailableAsset | null) {
        setSelectedAsset(asset);
        setAssetError(null);
        if (asset) {
            allocationForm.setData({
                ...allocationForm.data,
                asset_id: asset.asset_id?.toString() || '',
                custom_asset_id: asset.custom_asset_id?.toString() || '',
            });
        } else {
            allocationForm.setData({
                ...allocationForm.data,
                asset_id: '',
                custom_asset_id: '',
            });
        }
    }

    function createAllocation(e: FormEvent) {
        e.preventDefault();
        
        if (!selectedAsset) {
            setAssetError(t('portfolios.edit.validation.asset_required'));
            return;
        }

        const score = parseInt(allocationForm.data.score);
        if (isNaN(score) || score < 0) {
            allocationForm.setError('score', t('portfolios.edit.validation.score_min'));
            return;
        }

        allocationForm.post(route('wallet-allocations.store'), {
            onSuccess: () => {
                allocationForm.reset();
                setSelectedAsset(null);
                setAssetError(null);
            },
            onError: (errors) => {
                if (errors.asset) {
                    setAssetError(errors.asset);
                }
            },
        });
    }

    function deleteAllocation(id: number) {
        if (confirm(t('portfolios.edit.delete_confirm'))) {
            router.delete(route('wallet-allocations.destroy', id), {
                onSuccess: () => {
                    // Toast notification will be handled by Laravel flash messages
                },
            });
        }
    }

    function openEditScoreModal(allocation: WalletAllocation) {
        setEditingAllocation(allocation);
        editScoreForm.setData({ score: allocation.score.toString() });
    }

    function closeEditScoreModal() {
        setEditingAllocation(null);
        editScoreForm.reset();
    }

    function updateScore(e: FormEvent) {
        e.preventDefault();
        
        if (!editingAllocation) return;

        const score = parseInt(editScoreForm.data.score);
        if (isNaN(score) || score < 0) {
            editScoreForm.setError('score', t('portfolios.edit.validation.score_min'));
            return;
        }

        editScoreForm.put(route('wallet-allocations.update', editingAllocation.id), {
            onSuccess: () => {
                closeEditScoreModal();
            },
        });
    }

    // Get wallet ID from portfolio
    const walletId = portfolio.wallet_id;

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
                                <InputTextSelect
                                    walletId={walletId}
                                    value={selectedAsset}
                                    onSelect={handleAssetSelect}
                                    label={t('portfolios.edit.column_asset')}
                                    placeholder={t('portfolios.edit.select_asset')}
                                    error={assetError || undefined}
                                />

                                {selectedAsset && (
                                    <div className="p-3 bg-[var(--sidebar-hover)] rounded-md text-sm">
                                        <div className="font-medium text-[var(--text-primary)]">
                                            {t('portfolios.edit.asset_preview')}
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
                                            <div className="mt-1">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                    selectedAsset.source === 'listed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {selectedAsset.source === 'listed'
                                                        ? t('portfolios.edit.type_listed')
                                                        : t('portfolios.edit.type_unlisted')
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <FormInputText
                                    label={t('portfolios.edit.score_label')}
                                    variant="top"
                                    placeholder={t('portfolios.edit.score_placeholder')}
                                    type="number"
                                    min="0"
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
                        data={portfolio.wallet_allocations || []}
                        columns={[
                            {
                                key: "asset",
                                label: t('portfolios.edit.column_ticker'),
                                render: (item) => item.asset?.ticker
                            },
                            {
                                key: "name",
                                label: t('portfolios.edit.column_asset'),
                                grow: true,
                                render: (item) => item.asset?.name || item.custom_asset?.name || '-'
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
                                    onClick={() => openEditScoreModal(item)}
                                    className="p-1"
                                    title={t('portfolios.edit.edit_score')}
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

            {/* Edit Score Modal */}
            <Modal show={!!editingAllocation} onClose={closeEditScoreModal}>
                <Card
                    title={t('portfolios.edit.edit_score_title')}
                    footer={
                        <div className="flex justify-end gap-2">
                            <PrimaryButton
                                onClick={closeEditScoreModal}
                                className="px-4 py-2 bg-gray-600"
                            >
                                {t('common.cancel')}
                            </PrimaryButton>
                            <PrimaryButton
                                onClick={updateScore}
                                className="px-4 py-2"
                                disabled={editScoreForm.processing}
                            >
                                {t('common.save')}
                            </PrimaryButton>
                        </div>
                    }
                >
                    <FormInputText
                        label={t('portfolios.edit.score_label')}
                        variant="top"
                        type="number"
                        min="0"
                        value={editScoreForm.data.score}
                        onChange={e => editScoreForm.setData('score', e.target.value)}
                        error={editScoreForm.errors.score}
                        autoFocus
                    />
                </Card>
            </Modal>
        </AuthenticatedLayout>
    );
}
