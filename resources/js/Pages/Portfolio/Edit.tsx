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

interface EditProps {
    auth: {
        user: User;
    };
    portfolio: Portfolio;
}

export default function Edit({ auth, portfolio }: EditProps) {

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
        if (confirm('Deseja realmente excluir esta alocação?')) {
            // TODO: Implement allocation deletion
            console.log('Delete allocation:', id);
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Configure Portfolio - {portfolio.name}
                </h2>
            }
        >
            <div className="p-6 space-y-6">

                <div className="flex space-x-6 justify">
                    <div className="grow h-full">
                        <Card
                            title="Editar Portfolio"
                            footer={
                                <div className="flex justify gap-4">
                                    <PrimaryButton onClick={submitPortfolio} className="px-4 py-2">
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
                                    value={portfolioForm.data.name}
                                    icon={IdentificationIcon}
                                    onChange={e => portfolioForm.setData('name', e.target.value)}
                                    error={portfolioForm.errors.name}
                                />

                                <FormInputPercentage
                                    label="Target Weight"
                                    variant="top"
                                    placeholder="25.00"
                                    value={portfolioForm.data.target_weight}
                                    onChange={e => portfolioForm.setData("target_weight", Number(e.target.value))}
                                    error={portfolioForm.errors.target_weight}
                                />
                            </div>
                        </Card>
                    </div>
                    <div className="grow">
                        <Card
                            title="Adicionar Alocação"
                            footer={
                                <div className="flex justify gap-4">
                                    <PrimaryButton onClick={createAllocation} className="px-4 py-2">
                                        Save
                                    </PrimaryButton>
                                </div>
                            }
                        >
                            <div className="flex flex-col justify gap-4">
                                <FormInputText
                                    label="Asset ID (Listed)"
                                    variant="top"
                                    placeholder="123"
                                    value={allocationForm.data.asset_id}
                                    onChange={e => allocationForm.setData('asset_id', e.target.value)}
                                    error={allocationForm.errors.asset_id}
                                />

                                <FormInputText
                                    label="Custom Asset ID (Unlisted)"
                                    variant="top"
                                    placeholder="456"
                                    value={allocationForm.data.custom_asset_id}
                                    onChange={e => allocationForm.setData('custom_asset_id', e.target.value)}
                                    error={allocationForm.errors.custom_asset_id}
                                />

                                <FormInputText
                                    label="Score"
                                    variant="top"
                                    placeholder="0"
                                    value={allocationForm.data.score}
                                    onChange={e => allocationForm.setData('score', e.target.value)}
                                    error={allocationForm.errors.score}
                                />
                            </div>
                        </Card>
                    </div>
                </div>

                <Card title="Allocations">
                    <DataTable<WalletAllocation>
                        data={portfolio.walletAllocations || []}
                        columns={[
                            {
                                key: "asset",
                                label: "Asset",
                                grow: true,
                                render: (item) => item.asset?.name || item.customAsset?.name || '-'
                            },
                            {
                                key: "score",
                                label: "Score",
                                render: (item) => item.score.toString()
                            },
                            {
                                key: "type",
                                label: "Type",
                                render: (item) => item.asset_id ? 'Listed' : 'Unlisted'
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
