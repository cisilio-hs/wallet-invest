import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import Card from '@/Components/Card';
import { t } from '@/i18n';

interface PersonData {
    phone: string | null;
    birthday: string | null;
}

interface EditProps {
    mustVerifyEmail: boolean;
    status?: string;
    person: PersonData | null;
}

export default function Edit({ mustVerifyEmail, status, person }: EditProps) {
    return (
        <AuthenticatedLayout title={t('profile.edit.title')}>
            <Head title={t('profile.edit.head_title')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <Card>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            person={person}
                            className="max-w-xl"
                        />
                    </Card>

                    <Card>
                        <UpdatePasswordForm className="max-w-xl" />
                    </Card>

                    <Card>
                        <DeleteUserForm className="max-w-xl" />
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
