import { StatusBadge } from '@/components/status-badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Eye, Search, UserCircle, Users } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Admin Dashboard', href: '/admin/dashboard' }, { title: 'Customers', href: '/admin/customers' }];

interface CustomerRecord {
    id: number;
    user_id: number;
    phone: string | null;
    address: string | null;
    license_number: string | null;
    created_at: string;
    user?: {
        name: string;
        email: string;
    };
}

export default function CustomerManagement({ customers = [] }: { customers: CustomerRecord[] }) {
    const [search, setSearch] = useState('');
    const filtered = customers.filter((c) => `${c.user?.name} ${c.user?.email} ${c.license_number} ${c.phone}`.toLowerCase().includes(search.toLowerCase()));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer Management" />
            <div className="space-y-6 p-6">
                <div className="animate-fade-in-up"><h1 className="text-2xl font-bold tracking-tight">Customer Management</h1><p className="text-muted-foreground">View and manage all registered customers</p></div>
                <div className="animate-fade-in-up delay-100 flex items-center gap-2 rounded-xl border bg-card px-4 shadow-sm">
                    <Search className="h-5 w-5 text-muted-foreground" /><input type="text" placeholder="Search customers..." className="w-full bg-transparent py-3 text-sm outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="animate-fade-in-up delay-200 overflow-hidden rounded-xl border bg-card shadow-sm">
                    {filtered.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead><tr className="border-b bg-muted/30">
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">License</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Address</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                                </tr></thead>
                                <tbody className="divide-y">
                                    {filtered.map((c) => (
                                        <tr key={c.id} className="transition-colors hover:bg-muted/30">
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10"><UserCircle className="h-5 w-5 text-primary" /></div>
                                                    <div><p className="text-sm font-semibold">{c.user?.name}</p><p className="text-xs text-muted-foreground">Since {new Date(c.created_at).toLocaleDateString()}</p></div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4"><p className="text-sm">{c.user?.email}</p><p className="text-xs text-muted-foreground">{c.phone || 'N/A'}</p></td>
                                            <td className="whitespace-nowrap px-5 py-4"><p className="text-sm font-mono">{c.license_number || 'N/A'}</p></td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm">{c.address || 'N/A'}</td>
                                            <td className="whitespace-nowrap px-5 py-4"><button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Eye className="h-4 w-4" /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Users className="mb-3 h-10 w-10 text-muted-foreground/30" />
                            <p className="text-sm font-medium text-muted-foreground">No customers found</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
