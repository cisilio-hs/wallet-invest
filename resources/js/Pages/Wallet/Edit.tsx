import Card from '@/Components/Card';
import DataTable from '@/Components/DataTable';
import FormInputSelect from '@/Components/FormInputSelect';
import FormInputText from '@/Components/FormInputText';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { CurrencyDollarIcon, IdentificationIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useForm, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import { User, Wallet } from '@/types';

interface Portfolio {
    id: number;
    name: string;
    currency: string;
}

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
        currency: ''
    });

    //Estado para editar o Portfolio
    const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);

    const editForm = useForm({
        id: 0,
        name: '',
        currency: '',
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
            currency: portfolio.currency,
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
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Configure Wallet - {wallet.name}
                </h2>
            }
        >
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
                                    // icon={IdentificationIcon}
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
                                    <PrimaryButton onClick={createPortfolio} className="px-4 py-2">
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
                                    icon={IdentificationIcon}
                                    onChange={e => createForm.setData('name', e.target.value)}
                                    error={createForm.errors.name}
                                />

                                <FormInputSelect
                                    label="Currency"
                                    variant="top"
                                    error={createForm.errors.currency}
                                    value={createForm.data.currency}
                                    onChange={e => createForm.setData("currency", e.target.value)}
                                    icon={CurrencyDollarIcon}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="BRL">BRL</option>
                                    <option value="USD">USD</option>
                                </FormInputSelect>
                            </div>
                        </Card>
                    </div>
                </div>
                <Card title="Portfolios">
                    <DataTable<Portfolio>
                        data={wallet.portfolios || []}
                        columns={[
                            { key: "name", label: "Name", grow: true },
                            { key: "currency", label: "Currency" },
                        ]}
                        actions={(item) => (
                            <div className='flex flex-row space-x-2'>
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

                        <FormInputSelect
                            label="Currency"
                            variant="top"
                            error={editForm.errors.currency}
                            value={editForm.data.currency}
                            onChange={e => editForm.setData("currency", e.target.value)}
                            icon={CurrencyDollarIcon}
                        >
                            <option value="">Selecione...</option>
                            <option value="BRL">BRL</option>
                            <option value="USD">USD</option>
                        </FormInputSelect>
                    </div>
                </Card>


            </Modal>

        </AuthenticatedLayout>
    );
}
