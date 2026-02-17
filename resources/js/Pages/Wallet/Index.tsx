import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router, useForm } from '@inertiajs/react';
import { User, Wallet } from '@/types';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Card from '@/Components/Card';
import FormInputText from '@/Components/FormInputText';
import { FormEvent } from 'react';

interface IndexProps {
    auth: {
        user: User;
    };
    wallets: Wallet[];
}

export default function Index({ auth, wallets }: IndexProps) {

    const walletForm = useForm({
        name: ''
    });
    
    function submitWallet(e: FormEvent) {
        e.preventDefault();
        walletForm.post(route('wallets.store'), {
            onSuccess: () => walletForm.reset()
        });
    }

    function deleteWallet(id: number) {
        if (confirm('Deseja realmente excluir este Wallet?')) {
            router.delete(route('wallets.destroy', id));
        }
    }

    return (
        <AuthenticatedLayout title="My Wallets">
            <div className="p-6 space-y-6">

                <Card
                    title="Add Wallet"
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
                            onChange={e => walletForm.setData('name', e.target.value)}
                            error={walletForm.errors.name}
                        />
                    </div>
                </Card>

                <Card title="Wallets">
                    <DataTable<Wallet>
                        data={wallets || []}
                        columns={[
                            { key: "name", label: "Name", grow: true },
                            { 
                                key: "portfolios",
                                label: "Portfolios",
                                render: (item) => `${item.portfolios?.length || 0}`
                            },
                        ]}
                        actions={(item) => (
                            <div className='flex flex-row space-x-2'>
                            
                                <PrimaryButton
                                    onClick={() => router.get(route('wallets.edit', item.id))}
                                    className="p-1"
                                >
                                    <PencilSquareIcon className="h-4 w-4"/>
                                </PrimaryButton>
                                <PrimaryButton
                                    onClick={() => deleteWallet(item.id)}
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
