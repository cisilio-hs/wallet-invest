import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState, FormEvent } from 'react';
import { DeleteUserFormData } from '@/types';
import { t } from '@/i18n';

interface DeleteUserFormProps {
    className?: string;
}

export default function DeleteUserForm({ className = '' }: DeleteUserFormProps) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState<boolean>(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm<DeleteUserFormData>({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    {t('profile.delete_account.title')}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    {t('profile.delete_account.description')}
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                {t('profile.delete_account.button')}
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        {t('profile.delete_account.modal_title')}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        {t('profile.delete_account.modal_description')}
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value={t('profile.delete_account.password_label')}
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            autoFocus
                            placeholder={t('profile.delete_account.password_placeholder')}
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            {t('profile.delete_account.cancel_button')}
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            {t('profile.delete_account.confirm_button')}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
