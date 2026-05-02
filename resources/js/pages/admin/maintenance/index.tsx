import { StatusBadge } from '@/components/status-badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Motorcycle } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Bike, Calendar, CheckCircle, DollarSign, Plus, Search, Wrench, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Maintenance', href: '/admin/maintenance' },
];

interface MaintenanceRecord {
    id: number;
    motorcycle_id: number;
    motorcycle_name: string;
    plate_number: string;
    admin_name: string;
    date: string;
    type: string;
    cost: number;
    status: string;
    description: string;
}

const typeLabels: Record<string, string> = {
    oil_change: 'Oil Change',
    tire_replacement: 'Tire Replacement',
    brake_repair: 'Brake Repair',
    engine_check: 'Engine Check',
    cleaning: 'General Cleaning',
    inspection: 'Inspection',
    accident_repair: 'Accident Repair',
};

const typeColors: Record<string, string> = {
    oil_change: 'bg-amber-100 text-amber-700',
    tire_replacement: 'bg-blue-100 text-blue-700',
    brake_repair: 'bg-red-100 text-red-700',
    engine_check: 'bg-purple-100 text-purple-700',
    cleaning: 'bg-green-100 text-green-700',
    inspection: 'bg-sky-100 text-sky-700',
    accident_repair: 'bg-rose-100 text-rose-700',
};

export default function MaintenanceManagement({ 
    maintenanceRecords = [], 
    availableMotorcycles = [] 
}: { 
    maintenanceRecords: MaintenanceRecord[],
    availableMotorcycles: Motorcycle[]
}) {
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        motorcycle_id: '',
        type: 'inspection',
        cost: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
    });

    const totalCost = maintenanceRecords.reduce((sum, r) => sum + r.cost, 0);
    const filtered = maintenanceRecords.filter(
        (m) => `${m.motorcycle_name} ${m.plate_number} ${m.admin_name}`.toLowerCase().includes(search.toLowerCase()),
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.maintenance.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const handleComplete = (id: number) => {
        if (confirm('Mark this maintenance as complete and return motorcycle to fleet?')) {
            router.patch(route('admin.maintenance.update', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Maintenance Management" />
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="animate-fade-in-up">
                        <h1 className="text-2xl font-bold tracking-tight">Maintenance Management</h1>
                        <p className="text-muted-foreground">Track repairs, servicing, and inspections</p>
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="animate-fade-in-up delay-100 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" /> Log Service
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="animate-fade-in-up delay-100 grid gap-4 sm:grid-cols-4">
                    <div className="rounded-xl border bg-card p-4 shadow-sm text-center">
                        <p className="text-sm text-muted-foreground">Active Services</p>
                        <p className="text-2xl font-bold">{maintenanceRecords.filter(r => r.status === 'in_progress').length}</p>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm text-center">
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-2xl font-bold text-green-600">{maintenanceRecords.filter(r => r.status === 'completed').length}</p>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm text-center">
                        <p className="text-sm text-muted-foreground">Total Records</p>
                        <p className="text-2xl font-bold">{maintenanceRecords.length}</p>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm text-center">
                        <p className="text-sm text-muted-foreground">Total Cost</p>
                        <p className="text-2xl font-bold text-blue-600">₱{totalCost.toLocaleString()}</p>
                    </div>
                </div>

                <div className="animate-fade-in-up delay-200 flex items-center gap-2 rounded-xl border bg-card px-4 shadow-sm">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <input type="text" placeholder="Search by motorcycle, plate, or admin..." className="w-full bg-transparent py-3 text-sm outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                <div className="animate-fade-in-up delay-300 overflow-hidden rounded-xl border bg-card shadow-sm">
                    {filtered.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/30">
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Motorcycle</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cost</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filtered.map((r) => (
                                        <tr key={r.id} className="transition-colors hover:bg-muted/30">
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <p className="text-sm font-semibold">{r.motorcycle_name}</p>
                                                <p className="text-xs text-muted-foreground font-mono">{r.plate_number}</p>
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <span className={`rounded-md px-2 py-1 text-xs font-medium ${typeColors[r.type] || 'bg-gray-100 text-gray-700'}`}>
                                                    {typeLabels[r.type] || r.type}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm">{r.admin_name}</td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">{r.date}</td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-blue-600">₱{r.cost.toLocaleString()}</td>
                                            <td className="whitespace-nowrap px-5 py-4"><StatusBadge status={r.status} /></td>
                                            <td className="whitespace-nowrap px-5 py-4 text-right">
                                                {r.status === 'in_progress' ? (
                                                    <button 
                                                        onClick={() => handleComplete(r.id)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 transition-colors hover:bg-green-100"
                                                    >
                                                        <CheckCircle className="h-3.5 w-3.5" /> Complete
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">Finished</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Wrench className="mb-3 h-10 w-10 text-muted-foreground/30" />
                            <p className="text-sm font-medium text-muted-foreground">No maintenance records found</p>
                        </div>
                    )}
                </div>

                {/* Log Service Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="animate-fade-in-up w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl relative">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <h2 className="mb-6 text-xl font-bold text-center">Log New Service</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Select Motorcycle</label>
                                    <select 
                                        className={`w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary ${errors.motorcycle_id ? 'border-destructive' : ''}`}
                                        value={data.motorcycle_id}
                                        onChange={e => setData('motorcycle_id', e.target.value)}
                                    >
                                        <option value="">Choose available motorcycle...</option>
                                        {availableMotorcycles.map(m => (
                                            <option key={m.id} value={m.id}>{m.brand} {m.model} ({m.plate_number})</option>
                                        ))}
                                    </select>
                                    {errors.motorcycle_id && <p className="mt-1 text-xs text-destructive">{errors.motorcycle_id}</p>}
                                </div>
                                
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Service Type</label>
                                        <select 
                                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                                            value={data.type}
                                            onChange={e => setData('type', e.target.value)}
                                        >
                                            {Object.entries(typeLabels).map(([val, label]) => (
                                                <option key={val} value={val}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Service Cost (₱)</label>
                                        <input 
                                            type="number"
                                            className={`w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary ${errors.cost ? 'border-destructive' : ''}`}
                                            placeholder="0.00"
                                            value={data.cost}
                                            onChange={e => setData('cost', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">Service Date</label>
                                    <input 
                                        type="date"
                                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                                        value={data.date}
                                        onChange={e => setData('date', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">Description (Optional)</label>
                                    <textarea 
                                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary min-h-[100px]"
                                        placeholder="Add repair details here..."
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                    />
                                </div>

                                <div className="mt-6 flex gap-3 justify-end">
                                    <button 
                                        type="button"
                                        onClick={() => setShowModal(false)} 
                                        className="rounded-lg border px-5 py-2 text-sm font-medium hover:bg-muted"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={processing || !data.motorcycle_id}
                                        className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        {processing ? 'Logging...' : 'Log Service Record'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
