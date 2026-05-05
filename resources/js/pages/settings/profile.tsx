import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        middle_name: (auth.user as any).customer?.middle_name || '',
        gender: (auth.user as any).customer?.gender || '',
        date_of_birth: (auth.user as any).customer?.date_of_birth || '',
        phone: (auth.user as any).customer?.phone || '',
        address: (auth.user as any).customer?.address || '',
        license_number: (auth.user as any).customer?.license_number || '',
        license_expiry_date: (auth.user as any).customer?.license_expiry_date || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
                    <div className="mb-6">
                        <HeadingSmall title="Profile Information" description="Update your name and email address" />
                    </div>

                    <form onSubmit={submit} className="space-y-8">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    className="mt-1 block w-full rounded-xl bg-background px-4 py-2"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="middle_name">Middle Name (Optional)</Label>
                                <Input
                                    id="middle_name"
                                    className="mt-1 block w-full rounded-xl bg-background px-4 py-2"
                                    value={data.middle_name}
                                    onChange={(e) => setData('middle_name', e.target.value)}
                                />
                                <InputError message={errors.middle_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full rounded-xl bg-background px-4 py-2"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    className="mt-1 block w-full rounded-xl bg-background px-4 py-2"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="09123456789"
                                />
                                <InputError message={errors.phone} />
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-muted-foreground/10">
                            <div className="grid gap-2">
                                <Label htmlFor="gender">Gender</Label>
                                <select 
                                    id="gender"
                                    className="mt-1 block w-full rounded-xl border border-input bg-background px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <InputError message={errors.gender} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="date_of_birth">Date of Birth</Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    className="mt-1 block w-full rounded-xl bg-background px-4 py-2"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                />
                                <InputError message={errors.date_of_birth} />
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-muted-foreground/10">
                            <div className="grid gap-2">
                                <Label htmlFor="license_number">License Number</Label>
                                <Input
                                    id="license_number"
                                    className="mt-1 block w-full rounded-xl bg-background px-4 py-2 font-mono"
                                    value={data.license_number}
                                    onChange={(e) => setData('license_number', e.target.value)}
                                    placeholder="N01-XX-XXXXXX"
                                />
                                <InputError message={errors.license_number} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="license_expiry_date">License Expiry</Label>
                                <Input
                                    id="license_expiry_date"
                                    type="date"
                                    className="mt-1 block w-full rounded-xl bg-background px-4 py-2"
                                    value={data.license_expiry_date}
                                    onChange={(e) => setData('license_expiry_date', e.target.value)}
                                />
                                <InputError message={errors.license_expiry_date} />
                            </div>
                        </div>

                        <div className="grid gap-2 pt-4 border-t border-muted-foreground/10">
                            <Label htmlFor="address">Permanent Address</Label>
                            <textarea
                                id="address"
                                className="mt-1 block w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none min-h-[100px]"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Full Address"
                            />
                            <InputError message={errors.address} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
                                <p>
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="font-semibold underline hover:text-yellow-900"
                                    >
                                        Click here to re-send the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4 pt-4 border-t border-muted-foreground/10">
                            <Button disabled={processing} className="rounded-xl px-10 py-6 text-base font-bold shadow-lg transition-all hover:scale-[1.02]">
                                {processing ? 'Saving...' : 'Update My Profile'}
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out duration-300"
                                enterFrom="opacity-0 translate-y-1"
                                leave="transition ease-in-out duration-300"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <p className="text-sm font-bold text-green-600 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></span>
                                    Saved successfully!
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
