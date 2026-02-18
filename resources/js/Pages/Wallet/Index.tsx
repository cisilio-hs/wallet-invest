import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router, useForm } from '@inertiajs/react';
import { User, Wallet } from '@/types';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Card from '@/Components/Card';
import FormInputText from '@/Components/FormInputText';
import { FormEvent } from 'react';
import { t } from '@/i18n';

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
        if (confirm(t('wallets.index.delete_confirm'))) {
            router.delete(route('wallets.destroy', id));
        }
    }

    return (
        <AuthenticatedLayout title={t('wallets.index.title')}>
            <div className="p-6 space-y-6">

                <Card
                    title={t('wallets.index.add_wallet')}
                    footer={
                        <div className="flex justify gap-4">
                            <PrimaryButton onClick={submitWallet} className="px-4 py-2">
                                {t('common.save')}
                            </PrimaryButton>
                        </div>
                    }
                >
                    <div>
                        <FormInputText
                            label={t('wallets.index.name_label')}
                            variant="top"
                            placeholder={t('wallets.index.name_placeholder')}
                            value={walletForm.data.name}
                            onChange={e => walletForm.setData('name', e.target.value)}
                            error={walletForm.errors.name}
                        />
                    </div>
                </Card>

                <Card title={t('wallets.index.list_title')}>
                    <DataTable<Wallet>
                        data={wallets || []}
                        columns={[
                            { key: "name", label: t('wallets.index.column_name'), grow: true },
                            {
                                key: "portfolios",
                                label: t('wallets.index.column_portfolios'),
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
