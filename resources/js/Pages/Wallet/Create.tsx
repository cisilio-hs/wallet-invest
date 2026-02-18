import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { User, WalletFormData } from '@/types';
import { t } from '@/i18n';
import Card from '@/Components/Card';
import PrimaryButton from '@/Components/PrimaryButton';
import { FloppyDiskIcon } from '@sidekickicons/react/24/outline';
import FormInputText from '@/Components/FormInputText';
import { WalletIcon } from '@heroicons/react/24/outline';

interface CreateProps {
    auth: {
        user: User;
    };
}

export default function Create({ auth }: CreateProps) {
    const { data, setData, post, errors } = useForm<WalletFormData>({
        name: ''
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(route('wallets.store'));
    }

    return (
        <AuthenticatedLayout title={t('wallets.create.title')}>
            <Card
                title={t('wallets.edit.edit_wallet')}
                footer={
                    <PrimaryButton onClick={submit} className="px-4 py-2 gap-2">
                        <FloppyDiskIcon className="h-4 w-4"/>
                        {t('wallets.edit.save_button')}
                    </PrimaryButton>
                }
                footerClass='flex justify gap-4'
            >
                <FormInputText
                    label={t('common.name')}
                    variant="top"
                    placeholder={t('wallets.index.name_placeholder')}
                    value={data.name}
                    icon={WalletIcon}
                    onChange={e => setData('name', e.target.value)}
                    error={errors.name}
                />
            </Card>
        </AuthenticatedLayout>
    );
}
