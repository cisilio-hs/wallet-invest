import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { User, WalletFormData } from '@/types';
import { useI18n } from '@/i18n';

interface CreateProps {
    auth: {
        user: User;
    };
}

export default function Create({ auth }: CreateProps) {
    const { t } = useI18n();
    const { data, setData, post, errors } = useForm<WalletFormData>({
        name: ''
    });

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('wallets.store'));
    }

    return (
        <AuthenticatedLayout title={t('wallets.create.title')}>
            <div className="p-6">
                <form onSubmit={submit}>
                    <input
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="border p-2"
                        placeholder={t('wallets.create.name_placeholder')}
                    />

                    {errors.name && (
                        <div className="text-red-500">{errors.name}</div>
                    )}

                    <button className="block mt-4 bg-green-500 text-white px-4 py-2">
                        {t('wallets.create.save_button')}
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
