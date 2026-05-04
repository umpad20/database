import { StatusBadge } from '@/components/status-badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { CreditCard, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Payments', href: '/admin/payments' }
];

interface PaymentRecord {
    id: number;
    rental_id: number;
    customer_name: string;
    motorcycle_name: string;
    date: string | null;
    method: 'cash' | 'gcash' | 'bank_transfer' | 'cod';
    amount: number;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
}

const methodLabels: Record<string, string> = { 
    cash: 'Cash', 
    gcash: 'GCash', 
    bank_transfer: 'Bank Transfer', 
    cod: 'Cash on Delivery',
    'GCash': 'GCash',
    'Bank Transfer': 'Bank Transfer',
    'Cash on Pickup': 'Cash on Pickup'
};

const methodColors: Record<string, string> = { 
    cash: 'bg-green-100 text-green-700', 
    gcash: 'bg-blue-100 text-blue-700', 
    'GCash': 'bg-blue-100 text-blue-700',
    bank_transfer: 'bg-purple-100 text-purple-700', 
    'Bank Transfer': 'bg-purple-100 text-purple-700',
    cod: 'bg-amber-100 text-amber-700',
    'Cash on Pickup': 'bg-amber-100 text-amber-700'
};

export default function PaymentManagement({ payments = [] }: { payments: PaymentRecord[] }) {
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        rental_id: '',
        amount: '',
        method: 'cash',
        status: 'paid',
        transaction_id: '',
    });

    const filtered = payments.filter((p) => 
        `${p.customer_name} ${p.motorcycle_name} ${p.rental_id}`.toLowerCase().includes(search.toLowerCase())
    );

    const totalPaid = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
    const totalPending = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.payments.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Management" />
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="animate-fade-in-up">
                        <h1 className="text-2xl font-bold tracking-tight">Payment Management</h1>
                        <p className="text-muted-foreground">Track and manage all payment transactions</p>
                    </div>
                </div>

                <div className="animate-fade-in-up delay-100 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-600">₱{totalPaid.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold text-amber-600">₱{totalPending.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <p className="text-sm text-muted-foreground">Transactions</p>
                        <p className="text-2xl font-bold">{payments.length}</p>
                    </div>
                </div>

                <div className="animate-fade-in-up delay-200 flex items-center gap-2 rounded-xl border bg-card px-4 shadow-sm">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Search payments by customer or motorcycle..." 
                        className="w-full bg-transparent py-3 text-sm outline-none" 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                    />
                </div>

                <div className="animate-fade-in-up delay-300 overflow-hidden rounded-xl border bg-card shadow-sm">
                    {filtered.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/30">
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment ID</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rental</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Method</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filtered.map((p) => (
                                        <tr key={p.id} className="transition-colors hover:bg-muted/30">
                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-medium">#{p.id}</td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm">#{p.rental_id}</td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <p className="text-sm font-semibold">{p.customer_name}</p>
                                                <p className="text-xs text-muted-foreground">{p.motorcycle_name}</p>
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <span className={`rounded-md px-2 py-1 text-xs font-medium ${methodColors[p.method] || 'bg-gray-100'}`}>
                                                    {methodLabels[p.method] || p.method}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">{p.date || '—'}</td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-blue-600">₱{p.amount.toLocaleString()}</td>
                                            <td className="whitespace-nowrap px-5 py-4"><StatusBadge status={p.status} /></td>
                                            <td className="whitespace-nowrap px-5 py-4 text-right">
                                                {p.status === 'pending' && (
                                                    <button 
                                                        onClick={() => {
                                                            if(confirm('Mark this payment as received?')) {
                                                                router.patch(`/admin/payments/${p.id}/paid`);
                                                            }
                                                        }}
                                                        className="rounded-lg bg-green-50 px-3 py-1 text-xs font-bold text-green-700 hover:bg-green-100 border border-green-200"
                                                    >
                                                        Mark as Paid
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <CreditCard className="mb-3 h-10 w-10 text-muted-foreground/30" />
                            <p className="text-sm font-medium text-muted-foreground">No payment records found</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
