import { StatusBadge } from '@/components/status-badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Bike, CheckCircle2, CreditCard, Eye, FileText, Image, Play, Search, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

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
    id_document_path?: string | null;
    license_document_path?: string | null;
    fulfillment_type?: string;
    pickup_location?: string;
    return_location?: string;
    payment?: {
        id: number;
        method: string;
        amount: number;
        status: string;
        transaction_id?: string | null;
        paid_at?: string | null;
    } | null;
    customer?: {
        id: number;
        phone: string;
        address: string;
        license_number: string;
        middle_name?: string | null;
        gender?: string | null;
        date_of_birth?: string | null;
        license_expiry_date?: string | null;
        user?: {
            name: string;
            email: string;
        };
    };
    motorcycle?: {
        brand: string;
        model: string;
        image_path: string | null;
    };
}

const statusFilters = ['all', 'pending', 'approved', 'active', 'returned', 'cancelled'];

export default function RentalManagement({ rentals = [] }: { rentals: RentalRecord[] }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedRental, setSelectedRental] = useState<RentalRecord | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (id) {
            const rental = rentals.find(r => r.id === Number(id));
            if (rental) setSelectedRental(rental);
        }
    }, [rentals]);

    const filtered = rentals.filter((r) => {
        const customerName = r.customer?.user?.name || '';
        const bikeName = `${r.motorcycle?.brand} ${r.motorcycle?.model}`;
        const matchesSearch = `${customerName} ${bikeName} ${r.id}`.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleAction = (id: number, action: string) => {
        if (confirm(`Are you sure you want to ${action} this rental?`)) {
            router.patch(`/admin/rentals/${id}/${action}`, {}, {
                onSuccess: () => setSelectedRental(null)
            });
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-PH', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

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
                        <input type="text" placeholder="Search rentals by customer or bike..." className="w-full bg-transparent py-3 text-sm outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                                    <tr className="border-b bg-muted/30 text-left">
                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ID</th>
                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Motorcycle</th>
                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Period</th>
                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filtered.map((r) => (
                                        <tr key={r.id} className="transition-colors hover:bg-muted/30">
                                            <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-primary">#{r.id}</td>
                                            <td className="whitespace-nowrap px-4 py-4 text-sm">
                                                <div className="font-semibold">{r.customer?.user?.name || 'N/A'}</div>
                                                <div className="text-xs text-muted-foreground">{r.customer?.phone}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-sm font-medium">{r.motorcycle?.brand} {r.motorcycle?.model}</td>
                                            <td className="whitespace-nowrap px-4 py-4 text-xs text-muted-foreground">
                                                {formatDate(r.start_date)} - {formatDate(r.end_date)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-blue-600">₱{Number(r.total_amount).toLocaleString()}</td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <StatusBadge status={r.status} />
                                                    {r.status === 'active' && new Date(r.end_date) < new Date() && (
                                                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 animate-pulse">
                                                            LATE
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => setSelectedRental(r)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    {r.status === 'pending' && (
                                                        <div className="flex gap-1 border-l pl-1 ml-1">
                                                            <button onClick={() => handleAction(r.id, 'approve')} className="flex h-8 w-8 items-center justify-center rounded-lg text-green-600 hover:bg-green-100" title="Approve"><CheckCircle2 className="h-4 w-4" /></button>
                                                            <button onClick={() => handleAction(r.id, 'reject')} className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-100" title="Reject"><XCircle className="h-4 w-4" /></button>
                                                        </div>
                                                    )}
                                                    {r.status === 'paid' && (
                                                        <button onClick={() => handleAction(r.id, 'start')} className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-100 border-l ml-1 pl-1" title="Start Rental"><Play className="h-4 w-4" /></button>
                                                    )}
                                                    {r.status === 'active' && (
                                                        <button onClick={() => handleAction(r.id, 'complete')} className="flex h-8 w-8 items-center justify-center rounded-lg text-purple-600 hover:bg-purple-100 border-l ml-1 pl-1" title="Mark as Returned"><CheckCircle2 className="h-4 w-4" /></button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <FileText className="mb-3 h-10 w-10 opacity-20" />
                            <p className="text-sm font-medium">No rental requests matching your criteria</p>
                        </div>
                    )}
                </div>
            </div>

            {/* View Details Modal */}
            {selectedRental && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all animate-in fade-in duration-200">
                    <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-card shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b p-5">
                            <h2 className="text-xl font-bold">Rental Request Details <span className="text-muted-foreground font-normal ml-2">#{selectedRental.id}</span></h2>
                            <button onClick={() => setSelectedRental(null)} className="rounded-full p-2 hover:bg-muted transition-colors"><XCircle className="h-6 w-6 text-muted-foreground" /></button>
                        </div>
                        
                        <div className="max-h-[80vh] overflow-y-auto p-6 scrollbar-thin">
                            <div className="grid gap-8 lg:grid-cols-2">
                                {/* Customer Info */}
                                <div className="space-y-6">
                                    <section>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Customer Information</h3>
                                        <div className="space-y-4 rounded-xl border bg-muted/20 p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">{selectedRental.customer?.user?.name?.[0]}</div>
                                                <div>
                                                    <p className="font-bold">
                                                        {selectedRental.customer?.user?.name} {selectedRental.customer?.middle_name ? `(${selectedRental.customer.middle_name})` : ''}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{selectedRental.customer?.user?.email}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-muted">
                                                <div>
                                                    <p className="text-muted-foreground text-[10px] uppercase font-bold">Gender</p>
                                                    <p className="font-medium">{selectedRental.customer?.gender || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground text-[10px] uppercase font-bold">Birth Date</p>
                                                    <p className="font-medium">{selectedRental.customer?.date_of_birth ? formatDate(selectedRental.customer.date_of_birth) : 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground text-[10px] uppercase font-bold">Phone</p>
                                                    <p className="font-medium">{selectedRental.customer?.phone || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground text-[10px] uppercase font-bold">License #</p>
                                                    <p className="font-medium">{selectedRental.customer?.license_number || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground text-[10px] uppercase font-bold">License Expiry</p>
                                                    <p className="font-bold text-orange-600">{selectedRental.customer?.license_expiry_date ? formatDate(selectedRental.customer.license_expiry_date) : 'N/A'}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-muted-foreground text-[10px] uppercase font-bold">Address</p>
                                                    <p className="font-medium">{selectedRental.customer?.address || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Fulfillment Details</h3>
                                        <div className="space-y-4 rounded-xl border bg-primary/5 p-5 border-primary/10">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    {selectedRental.fulfillment_type === 'delivery' ? <FileText className="h-5 w-5 text-primary" /> : <Bike className="h-5 w-5 text-primary" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold capitalize">{selectedRental.fulfillment_type} Service</p>
                                                    <p className="text-xs text-muted-foreground">Logistics preference for this unit</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3 text-sm pt-2 border-t border-primary/10">
                                                <div>
                                                    <p className="text-muted-foreground text-[10px] uppercase font-bold">Release/Pickup Location</p>
                                                    <p className="font-semibold text-primary">{selectedRental.pickup_location || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground text-[10px] uppercase font-bold">Return Location</p>
                                                    <p className="font-semibold text-primary">{selectedRental.return_location || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Rental Details</h3>
                                        <div className="space-y-4 rounded-xl border bg-muted/20 p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-20 rounded-lg bg-white overflow-hidden border">
                                                    {selectedRental.motorcycle?.image_path ? (
                                                        <img src={`/storage/${selectedRental.motorcycle.image_path}`} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center bg-muted"><Bike className="h-6 w-6 opacity-20" /></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg">{selectedRental.motorcycle?.brand} {selectedRental.motorcycle?.model}</p>
                                                    <StatusBadge status={selectedRental.status} />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-muted">
                                                <div>
                                                    <p className="text-muted-foreground text-[10px] uppercase font-bold">Pick-up Date</p>
                                                    <p className="font-bold">{formatDate(selectedRental.start_date)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground text-[10px] uppercase font-bold">Return Date</p>
                                                    <p className="font-bold">{formatDate(selectedRental.end_date)}</p>
                                                </div>
                                                <div className="col-span-2 bg-blue-50 p-3 rounded-lg border border-blue-100 flex justify-between items-center">
                                                    <span className="text-blue-700 font-bold uppercase text-[10px]">Total Amount</span>
                                                    <span className="text-xl font-black text-blue-800">₱{Number(selectedRental.total_amount).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {selectedRental.payment && (
                                        <section>
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Payment Information</h3>
                                            <div className="space-y-4 rounded-xl border border-green-100 bg-green-50/50 p-5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                                            <CreditCard className="h-5 w-5 text-green-700" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold">{selectedRental.payment.method}</p>
                                                            <p className="text-xs text-muted-foreground">Payment Method</p>
                                                        </div>
                                                    </div>
                                                    <StatusBadge status={selectedRental.payment.status} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 text-sm pt-2 border-t border-green-100">
                                                    <div>
                                                        <p className="text-muted-foreground text-[10px] uppercase font-bold">Transaction ID</p>
                                                        <p className="font-mono text-xs">{selectedRental.payment.transaction_id || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground text-[10px] uppercase font-bold">Paid Date</p>
                                                        <p className="text-xs">{selectedRental.payment.paid_at ? formatDate(selectedRental.payment.paid_at) : 'Waiting for Cash'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    )}
                                </div>

                                {/* Documents */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Submitted Documents</h3>
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground px-1">Valid Identification</p>
                                            <div 
                                                className="group relative h-48 cursor-zoom-in overflow-hidden rounded-xl border bg-muted transition-all hover:ring-2 hover:ring-primary/50"
                                                onClick={() => setPreviewImage(selectedRental.id_document_path ? `/storage/${selectedRental.id_document_path}` : null)}
                                            >
                                                {selectedRental.id_document_path ? (
                                                    <img src={`/storage/${selectedRental.id_document_path}`} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                                ) : (
                                                    <div className="flex h-full flex-col items-center justify-center gap-2 opacity-30"><Image className="h-8 w-8" /><p className="text-xs">No ID provided</p></div>
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100"><Eye className="h-8 w-8 text-white" /></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground px-1">Driver's License</p>
                                            <div 
                                                className="group relative h-48 cursor-zoom-in overflow-hidden rounded-xl border bg-muted transition-all hover:ring-2 hover:ring-primary/50"
                                                onClick={() => setPreviewImage(selectedRental.license_document_path ? `/storage/${selectedRental.license_document_path}` : null)}
                                            >
                                                {selectedRental.license_document_path ? (
                                                    <img src={`/storage/${selectedRental.license_document_path}`} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                                ) : (
                                                    <div className="flex h-full flex-col items-center justify-center gap-2 opacity-30"><Image className="h-8 w-8" /><p className="text-xs">No License provided</p></div>
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100"><Eye className="h-8 w-8 text-white" /></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t bg-muted/10 p-5">
                            {selectedRental.status === 'pending' ? (
                                <>
                                    <button onClick={() => handleAction(selectedRental.id, 'reject')} className="rounded-xl border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100">Reject Request</button>
                                    <button onClick={() => handleAction(selectedRental.id, 'approve')} className="rounded-xl bg-green-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 hover:bg-green-700">Approve Request</button>
                                </>
                            ) : (
                                <button onClick={() => setSelectedRental(null)} className="rounded-xl border bg-card px-6 py-2.5 text-sm font-bold">Close Window</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Image Preview Lightbox */}
            {previewImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-300" onClick={() => setPreviewImage(null)}>
                    <button className="absolute top-8 right-8 text-white/70 hover:text-white"><XCircle className="h-10 w-10" /></button>
                    <img src={previewImage} className="max-h-full max-w-full rounded-lg shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </AppLayout>
    );
}
