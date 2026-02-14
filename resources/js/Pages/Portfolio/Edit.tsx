import Card from '@/Components/Card';
import DataTable from '@/Components/DataTable';
import FormInputPercentage from '@/Components/FormInputPercentage';
import FormInputText from '@/Components/FormInputText';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IdentificationIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useForm, router } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Portfolio, User, WalletAsset } from '@/types';

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

    // Form para criar asset
    const assetForm = useForm({
        portfolio_id: portfolio.id,
        asset_id: '',
        custom_name: '',
        quantity: '',
        average_price: '',
    });

    function submitPortfolio(e: FormEvent) {
        e.preventDefault();
        portfolioForm.put(route('portfolios.update', portfolio.id));
    }

    function createAsset(e: FormEvent) {
        e.preventDefault();
        // TODO: Implement asset creation
        console.log('Create asset:', assetForm.data);
    }

    function deleteAsset(id: number) {
        if (confirm('Deseja realmente excluir este asset?')) {
            router.delete(route('wallet-assets.destroy', id));
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
                            title="Adicionar Asset"
                            footer={
                                <div className="flex justify gap-4">
                                    <PrimaryButton onClick={createAsset} className="px-4 py-2">
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
                                    value={assetForm.data.asset_id}
                                    onChange={e => assetForm.setData('asset_id', e.target.value)}
                                    error={assetForm.errors.asset_id}
                                />

                                <FormInputText
                                    label="Custom Name (Unlisted)"
                                    variant="top"
                                    placeholder="Physical Gold"
                                    value={assetForm.data.custom_name}
                                    onChange={e => assetForm.setData('custom_name', e.target.value)}
                                    error={assetForm.errors.custom_name}
                                />

                                <FormInputText
                                    label="Quantity"
                                    variant="top"
                                    placeholder="10"
                                    value={assetForm.data.quantity}
                                    onChange={e => assetForm.setData('quantity', e.target.value)}
                                    error={assetForm.errors.quantity}
                                />

                                <FormInputText
                                    label="Average Price"
                                    variant="top"
                                    placeholder="50.00"
                                    value={assetForm.data.average_price}
                                    onChange={e => assetForm.setData('average_price', e.target.value)}
                                    error={assetForm.errors.average_price}
                                />
                            </div>
                        </Card>
                    </div>
                </div>

                <Card title="Assets">
                    <DataTable<WalletAsset>
                        data={portfolio.wallet_assets || []}
                        columns={[
                            {
                                key: "display_name",
                                label: "Name",
                                grow: true,
                                render: (item) => item.display_name
                            },
                            {
                                key: "quantity",
                                label: "Quantity",
                                render: (item) => item.quantity.toString()
                            },
                            {
                                key: "average_price",
                                label: "Avg Price",
                                render: (item) => `R$ ${item.average_price.toFixed(2)}`
                            },
                            {
                                key: "is_listed",
                                label: "Type",
                                render: (item) => item.is_listed ? 'Listed' : 'Unlisted'
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
                                    onClick={() => deleteAsset(item.id)}
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
