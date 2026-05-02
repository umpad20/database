import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

// Components...
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import HeadingSmall from '@/components/heading-small';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: '' });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    return (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
                <HeadingSmall title="Delete Account" description="Permanently remove your account and all associated data" />
            </div>
            
            <div className="space-y-4">
                <div className="relative space-y-1 text-destructive">
                    <p className="font-semibold">Warning: This action is irreversible</p>
                    <p className="text-sm">Please proceed with caution. Once your account is deleted, all of your resources and data will be permanently wiped.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive" className="rounded-xl px-6">Delete Account</Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl">
                        <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                        <DialogDescription>
                            Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password
                            to confirm you would like to permanently delete your account.
                        </DialogDescription>
                        <form className="space-y-6" onSubmit={deleteUser}>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="sr-only">
                                    Password
                                </Label>

                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Confirm your password"
                                    autoComplete="current-password"
                                    className="rounded-xl"
                                />

                                <InputError message={errors.password} />
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" onClick={closeModal} className="rounded-xl">
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button variant="destructive" disabled={processing} asChild className="rounded-xl">
                                    <button type="submit">Delete Account</button>
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
