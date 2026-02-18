import Card from '@/Components/Card';
import DataTable from '@/Components/DataTable';
import FormInputPercentage from '@/Components/FormInputPercentage';
import FormInputText from '@/Components/FormInputText';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { EyeIcon, FolderIcon, PencilSquareIcon, TrashIcon, WalletIcon } from '@heroicons/react/24/outline';
import { useForm, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import { Portfolio, User, Wallet } from '@/types';
import { FloppyDiskIcon } from '@sidekickicons/react/24/outline';
import { t } from '@/i18n';

interface EditProps {
    auth: {
        user: User;
    };
    wallet: Wallet;
}

export default function Edit({ auth, wallet }: EditProps) {
    // Form da Wallet
    const walletForm = useForm({
        name: wallet.name
    });

    // Form para criar portfolio
    const createForm = useForm({
        wallet_id: wallet.id,
        name: '',
        target_weight: 0.0,
    });

    //Estado para editar o Portfolio
    const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);

    const editForm = useForm({
        id: 0,
        name: '',
        target_weight: 0.0,
    });

    function submitWallet(e: FormEvent) {
        e.preventDefault();
        walletForm.put(route('wallets.update', wallet.id));
    }

    function createPortfolio(e: FormEvent) {
        e.preventDefault();
        createForm.post(route('portfolios.store'), {
            onSuccess: () => createForm.reset()
        });
    }

    function openEditModal(portfolio: Portfolio) {
        setEditingPortfolio(portfolio);

        editForm.setData({
            name: portfolio.name,
            target_weight: portfolio.target_weight,
        });
    }

    function closeModal() {
        setEditingPortfolio(null);
        editForm.reset();
    }

    function updatePortfolio() {
        editingPortfolio && editForm.put(route('portfolios.update', editingPortfolio.id), {
            onSuccess: () => setEditingPortfolio(null)
        });
    }

    function deletePortfolio(id: number) {
        if (confirm(t('wallets.edit.delete_confirm'))) {
            router.delete(route('portfolios.destroy', id));
        }
    }

    const totalWeight = wallet.portfolios?.reduce((acc, p) => acc + p.target_weight, 0) || 0;

    return (
        <AuthenticatedLayout title={t('wallets.edit.title', { name: wallet.name })}>
            <div className="p-6 space-y-6">

                <div className="flex space-x-6 justify">
                    <div className="grow h-full">
                        <Card
                            title={t('wallets.edit.edit_wallet')}
                            footerClass='flex justify gap-4'
                            footer={
                                <PrimaryButton onClick={submitWallet} className="px-4 py-2 gap-2">
                                    <FloppyDiskIcon className="h-4 w-4"/>
                                    {t('wallets.edit.save_button')}
                                </PrimaryButton>
                            }
                        >
                            <FormInputText
                                label={t('common.name')}
                                variant="top"
                                placeholder={t('wallets.index.name_placeholder')}
                                value={walletForm.data.name}
                                icon={WalletIcon}
                                onChange={e => walletForm.setData('name', e.target.value)}
                                error={walletForm.errors.name}
                            />
                        </Card>
                    </div>
                    <div className="grow">
                        <Card
                            title={t('wallets.edit.add_portfolio')}
                            footerClass='flex justify gap-4'
                            footer={
                                <PrimaryButton onClick={(createPortfolio)} className="px-4 py-2">
                                    {t('common.save')}
                                </PrimaryButton>
                            }
                            childrenClass='flex flex-col justify gap-4'
                        >
                            <FormInputText
                                label={t('common.name')}
                                variant="top"
                                placeholder={t('wallets.edit.portfolio_name_placeholder')}
                                value={createForm.data.name}
                                icon={FolderIcon}
                                onChange={e => createForm.setData('name', e.target.value)}
                                error={createForm.errors.name}
                            />

                            <FormInputPercentage
                                label={t('wallets.edit.target_weight_label')}
                                variant="top"
                                placeholder={t('wallets.edit.target_weight_placeholder')}
                                value={createForm.data.target_weight}
                                onChange={e => createForm.setData("target_weight", Number(e.target.value))}
                                error={createForm.errors.target_weight}
                            />
                        </Card>
                    </div>
                </div>
                <Card
                    title={
                        <div className='flex justify-between'>
                            <span>{t('wallets.edit.portfolios_title')}</span>
                            <span>{t('wallets.edit.total_weight', { total: totalWeight })}</span>
                        </div>
                        }>
                    <DataTable<Portfolio>
                        data={wallet.portfolios || []}
                        columns={[
                            { key: "name", label: t('wallets.edit.column_name'), grow: true },
                            {
                                key: "wallet_assets",
                                label: t('wallets.edit.column_assets'),
                                render: (item) => `${item.walletAllocations?.length || 0}`
                            },
                            {
                                key: "target_weight",
                                label: t('wallets.edit.column_target'),
                                render: (item) => `${item.target_weight}%`
                            }
                        ]}
                        actions={(item) => (
                            <div className='flex flex-row space-x-2'>
                                <PrimaryButton
                                    onClick={() => router.get(route('portfolios.edit', item.id))}
                                    className="p-1 bg-blue-600"
                                    title={t('wallets.edit.view_portfolio')}
                                >
                                    <EyeIcon className="h-4 w-4"/>
                                </PrimaryButton>

                                <PrimaryButton
                                    onClick={() => openEditModal(item)}
                                    className="p-1"
                                >
                                    <PencilSquareIcon className="h-4 w-4"/>
                                </PrimaryButton>

                                <PrimaryButton
                                    onClick={() => deletePortfolio(item.id)}
                                    className="p-1 bg-red-800"
                                >
                                    <TrashIcon className="h-4 w-4"/>
                                </PrimaryButton>
                            </div>
                        )}
                    />
                </Card>

            </div>

            <Modal show={!!editingPortfolio} onClose={closeModal}>
                <Card
                    title={t('wallets.edit.modal_title')}
                    footer={
                        <div className="flex flex-row-reverse justify">
                            <PrimaryButton
                                onClick={updatePortfolio}
                                className="px-4 py-2"
                            >
                                {t('wallets.edit.modal_save')}
                            </PrimaryButton>
                            <div className='grow' />
                            <PrimaryButton
                                onClick={closeModal}
                                className="px-4 py-2 bg-red-600"
                            >
                                {t('wallets.edit.modal_cancel')}
                            </PrimaryButton>
                        </div>
                    }
                >
                    <div className="flex flex-col justify space-y-6">
                        <FormInputText
                            label={t('wallets.edit.modal_name_label')}
                            variant="top"
                            value={editForm.data.name}
                            onChange={e =>
                                editForm.setData("name", e.target.value)
                            }
                            error={editForm.errors.name}
                        />

                        <FormInputPercentage
                            label={t('wallets.edit.modal_target_weight_label')}
                            variant="top"
                            value={editForm.data.target_weight}
                            onChange={e => editForm.setData("target_weight", Number(e.target.value))}
                            error={editForm.errors.target_weight}
                        />
                    </div>
                </Card>


            </Modal>

        </AuthenticatedLayout>
    );
}
