import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { User, WalletFormData } from '@/types';

interface CreateProps {
    auth: {
        user: User;
    };
}

export default function Create({ auth }: CreateProps) {
    const { data, setData, post, errors } = useForm<WalletFormData>({
        name: ''
    });

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('wallets.store'));
    }

    return (
        <AuthenticatedLayout>
            <div className="p-6">
                <h1 className="text-xl mb-4">Nova Carteira</h1>

                <form onSubmit={submit}>
                    <input
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="border p-2"
                        placeholder="Nome da carteira"
                    />

                    {errors.name && (
                        <div className="text-red-500">{errors.name}</div>
                    )}

                    <button className="block mt-4 bg-green-500 text-white px-4 py-2">
                        Salvar
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
