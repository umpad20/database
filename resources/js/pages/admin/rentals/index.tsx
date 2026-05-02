import { StatusBadge } from '@/components/status-badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle2, Eye, FileText, Search, XCircle } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Rental Management', href: '/admin/rentals' },
];

interface RentalRecord {
    id: number;
    start_date: string;
    end_date: string;
    total_amount: number;
    status: string;
    created_at: string;
    customer?: {
        id: number;
        user?: {
            name: string;
        };
    };
    motorcycle?: {
        brand: string;
        model: string;
    };
}

const statusFilters = ['all', 'pending', 'approved', 'active', 'returned', 'cancelled'];

export default function RentalManagement({ rentals = [] }: { rentals: RentalRecord[] }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filtered = rentals.filter((r) => {
        const customerName = r.customer?.user?.name || '';
        const bikeName = `${r.motorcycle?.brand} ${r.motorcycle?.model}`;
        const matchesSearch = `${customerName} ${bikeName} ${r.id}`.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rental Management" />
            <div className="space-y-6 p-6">
                <div className="animate-fade-in-up">
                    <h1 className="text-2xl font-bold tracking-tight">Rental Management</h1>
                    <p className="text-muted-foreground">Review, approve, and manage all rental requests</p>
                </div>

                {/* Filters */}
                <div className="animate-fade-in-up delay-100 flex flex-col gap-4 sm:flex-row">
                    <div className="flex flex-1 items-center gap-2 rounded-xl border bg-card px-4 shadow-sm">
                        <Search className="h-5 w-5 text-muted-foreground" />
                        <input type="text" placeholder="Search rentals..." className="w-full bg-transparent py-3 text-sm outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {statusFilters.map((s) => (
                            <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-full px-4 py-2 text-xs font-medium capitalize transition-all ${statusFilter === s ? 'bg-primary text-primary-foreground shadow-md' : 'border bg-card text-muted-foreground hover:border-primary'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="animate-fade-in-up delay-200 overflow-hidden rounded-xl border bg-card shadow-sm">
                    {filtered.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/30">
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Motorcycle</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Start</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">End</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filtered.map((r) => (
                                        <tr key={r.id} className="transition-colors hover:bg-muted/30">
                                            <td className="whitespace-nowrap px-4 py-4 text-sm font-medium">#{r.id}</td>
                                            <td className="whitespace-nowrap px-4 py-4 text-sm">{r.customer?.user?.name || 'N/A'}</td>
                                            <td className="whitespace-nowrap px-4 py-4 text-sm">{r.motorcycle?.brand} {r.motorcycle?.model}</td>
                                            <td className="whitespace-nowrap px-4 py-4 text-xs text-muted-foreground">{r.start_date}</td>
                                            <td className="whitespace-nowrap px-4 py-4 text-xs text-muted-foreground">{r.end_date}</td>
                                            <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold">₱{Number(r.total_amount).toLocaleString()}</td>
                                            <td className="whitespace-nowrap px-4 py-4"><StatusBadge status={r.status} /></td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                <div className="flex items-center gap-1">
                                                    <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" title="View"><Eye className="h-4 w-4" /></button>
                                                    {r.status === 'pending' && (
                                                        <>
                                                            <button className="rounded-lg p-2 text-muted-foreground hover:bg-green-100 hover:text-green-600" title="Approve"><CheckCircle2 className="h-4 w-4" /></button>
                                                            <button className="rounded-lg p-2 text-muted-foreground hover:bg-red-100 hover:text-red-600" title="Reject"><XCircle className="h-4 w-4" /></button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileText className="mb-3 h-10 w-10 text-muted-foreground/30" />
                            <p className="text-sm font-medium text-muted-foreground">No rental requests found</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
