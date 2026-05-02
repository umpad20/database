import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        url: '/settings/profile',
        icon: null,
    },
    {
        title: 'Password',
        url: '/settings/password',
        icon: null,
    },
    {
        title: 'Appearance',
        url: '/settings/appearance',
        icon: null,
    },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const currentPath = window.location.pathname;

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
            <div className="mb-8 animate-fade-in-up">
                <Heading title="Account Settings" description="Manage your profile, password, and preferences." />
            </div>

            <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                <aside className="w-full lg:w-64 shrink-0 animate-fade-in-up delay-100">
                    <nav className="flex flex-col gap-2">
                        {sidebarNavItems.map((item) => (
                            <Button
                                key={item.url}
                                variant="ghost"
                                asChild
                                className={cn('justify-start rounded-xl px-5 py-6 text-sm font-semibold transition-all hover:bg-muted', {
                                    'bg-primary/10 text-primary hover:bg-primary/15': currentPath === item.url,
                                    'text-muted-foreground': currentPath !== item.url,
                                })}
                            >
                                <Link href={item.url} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="md:hidden" />

                <div className="flex-1 max-w-3xl animate-fade-in-up delay-200">
                    <div className="space-y-8">{children}</div>
                </div>
            </div>
        </div>
    );
}
