import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';
import { UpdateProfileFormData, User } from '@/types';
import { t } from '@/i18n';

interface PersonData {
    phone: string | null;
    birthday: string | null;
}

interface UpdateProfileInformationProps {
    mustVerifyEmail: boolean;
    status?: string;
    person: PersonData | null;
    className?: string;
}

interface PageProps {
    auth: {
        user: User;
    };
    [key: string]: any;
}

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    person,
    className = '',
}: UpdateProfileInformationProps) {
    const user = usePage<PageProps>().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm<UpdateProfileFormData>({
            name: user.name,
            email: user.email,
            phone: person?.phone || '',
            birthday: person?.birthday || '',
        });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    {t('profile.update_info.title')}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    {t('profile.update_info.description')}
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value={t('profile.update_info.name')} />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoFocus
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value={t('profile.update_info.email')} />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="phone" value={t('profile.update_info.phone')} />

                    <TextInput
                        id="phone"
                        type="tel"
                        className="mt-1 block w-full"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        autoComplete="tel"
                    />

                    <InputError className="mt-2" message={errors.phone} />
                </div>

                <div>
                    <InputLabel htmlFor="birthday" value={t('profile.update_info.birthday')} />

                    <TextInput
                        id="birthday"
                        type="date"
                        className="mt-1 block w-full"
                        value={data.birthday}
                        onChange={(e) => setData('birthday', e.target.value)}
                        autoComplete="bday"
                    />

                    <InputError className="mt-2" message={errors.birthday} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            {t('profile.update_info.unverified')}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                {t('profile.update_info.resend_link')}
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                {t('profile.update_info.link_sent')}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        {t('profile.update_info.save_button')}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            {t('profile.update_info.saved_message')}
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
