import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import { User, Wallet } from '@/types';

interface IndexProps {
    auth: {
        user: User;
    };
    wallets: Wallet[];
}

export default function Index({ auth, wallets }: IndexProps) {
    return (
        <AuthenticatedLayout>
            <div className="p-6">
                <h1 className="text-xl mb-4">Minhas Carteiras</h1>

                <Link
                    href={route('wallets.create')}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Nova Carteira
                </Link>

                <table className="mt-4 w-full">
                    <thead>
                        <tr>
                            <th className="text-left">Nome</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {wallets.map(wallet => (
                            <tr key={wallet.id}>
                                <td>{wallet.name}</td>
                                <td>
                                    <Link
                                        href={route('wallets.show', wallet.id)}
                                        className="text-blue-500 mr-2"
                                    >
                                        Entrar
                                    </Link>
                                </td>
                                <td>
                                    <Link
                                        href={route('wallets.edit', wallet.id)}
                                        className="text-blue-500 mr-2"
                                    >
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
