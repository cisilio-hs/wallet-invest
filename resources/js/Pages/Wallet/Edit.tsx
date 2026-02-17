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
        if (confirm('Deseja realmente excluir este portfolio?')) {
            router.delete(route('portfolios.destroy', id));
        }
    }

    return (
        <AuthenticatedLayout title={`Configure Wallet: ${wallet.name}`}>
            <div className="p-6 space-y-6">

                <div className="flex space-x-6 justify">
                    <div className="grow h-full">
                        <Card
                            title="Editar Carteira"
                            footer={
                                <div className="flex justify gap-4">
                                    <PrimaryButton onClick={submitWallet} className="px-4 py-2">
                                        Save
                                    </PrimaryButton>
                                </div>
                            }
                        >
                            <div>
                                <FormInputText
                                    label="Name"
                                    variant="top"
                                    placeholder="My Agressive Wallet"
                                    value={walletForm.data.name}
                                    icon={WalletIcon}
                                    onChange={e => walletForm.setData('name', e.target.value)}
                                    error={walletForm.errors.name}
                                />
                            </div>
                        </Card>
                    </div>
                    <div className="grow">
                        <Card
                            title="Adicionar Portfolio"
                            footer={
                                <div className="flex justify gap-4">
                                    <PrimaryButton onClick={(createPortfolio)} className="px-4 py-2">
                                        Save
                                    </PrimaryButton>
                                </div>
                            }
                        >
                            <div className="flex flex-col justify gap-4">
                                <FormInputText
                                    label="Name"
                                    variant="top"
                                    placeholder="Stocks"
                                    value={createForm.data.name}
                                    icon={FolderIcon}
                                    onChange={e => createForm.setData('name', e.target.value)}
                                    error={createForm.errors.name}
                                />

                                <FormInputPercentage
                                    label="Target Weight"
                                    variant="top"
                                    placeholder="25.00"
                                    value={createForm.data.target_weight}
                                    onChange={e => createForm.setData("target_weight", Number(e.target.value))}
                                    error={createForm.errors.target_weight}
                                />
                            </div>
                        </Card>
                    </div>
                </div>
                <Card 
                    title={
                        <div className='flex justify-between'>
                            <span> Portfolios </span>
                            <span> Total: { wallet.portfolios?.reduce((acc, p)=> acc + p.target_weight, 0) }% </span>
                        </div>
                        }>
                    <DataTable<Portfolio>
                        data={wallet.portfolios || []}
                        columns={[
                            { key: "name", label: "Name", grow: true },
                            {
                                key: "wallet_assets",
                                label: "Assets",
                                render: (item) => `${item.walletAllocations?.length || 0}`
                            },
                            { 
                                key: "target_weight", 
                                label: "Target %",
                                render: (item) => `${item.target_weight}%`
                            }
                        ]}
                        actions={(item) => (
                            <div className='flex flex-row space-x-2'>
                                <PrimaryButton
                                    onClick={() => router.get(route('portfolios.edit', item.id))}
                                    className="p-1 bg-blue-600"
                                    title="View Portfolio"
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
                    title="Edit Portfolio"
                    footer={
                        <div className="flex flex-row-reverse justify">
                            <PrimaryButton
                                onClick={updatePortfolio}
                                className="px-4 py-2"
                            >
                                Salvar
                            </PrimaryButton>
                            <div className='grow' />
                            <PrimaryButton
                                onClick={closeModal}
                                className="px-4 py-2 bg-red-600"
                            >
                                Cancelar
                            </PrimaryButton>
                        </div>
                    }
                >
                    <div className="flex flex-col justify space-y-6">
                        <FormInputText
                            label="Name"
                            variant="top"
                            value={editForm.data.name}
                            onChange={e =>
                                editForm.setData("name", e.target.value)
                            }
                            error={editForm.errors.name}
                        />

                        <FormInputPercentage
                            label="Target Weight"
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
