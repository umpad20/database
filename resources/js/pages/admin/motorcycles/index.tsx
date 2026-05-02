import { EmptyState } from '@/components/empty-state';
import { StatusBadge } from '@/components/status-badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Bike, Edit, Eye, Plus, Search, Trash2, Wrench, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Fleet Management', href: '/admin/motorcycles' },
];

import { type Motorcycle } from '@/types';

export default function FleetManagement({ motorcycles = [] }: { motorcycles: Motorcycle[] }) {
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [viewingMotorcycle, setViewingMotorcycle] = useState<Motorcycle | null>(null);
    const [editingMotorcycle, setEditingMotorcycle] = useState<Motorcycle | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        plate_number: '',
        daily_rate: '',
        category: 'Scooter',
        status: 'Available',
        image: null as File | null,
    });

    const filtered = motorcycles.filter(
        (m) => `${m.brand} ${m.model} ${m.plate_number}`.toLowerCase().includes(search.toLowerCase()),
    );

    const openAddModal = () => {
        setEditingMotorcycle(null);
        reset();
        clearErrors();
        setShowModal(true);
    };

    const openEditModal = (motorcycle: Motorcycle) => {
        setEditingMotorcycle(motorcycle);
        setData({
            brand: motorcycle.brand,
            model: motorcycle.model,
            year: motorcycle.year,
            plate_number: motorcycle.plate_number,
            daily_rate: motorcycle.daily_rate.toString(),
            category: motorcycle.category,
            status: motorcycle.status,
            image: null,
        });
        clearErrors();
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMotorcycle) {
            // For file uploads in PUT requests, Laravel/Inertia sometimes needs _method: 'PUT' with a POST
            // But if no file is present, put() works fine. 
            // However, useForm's put doesn't support multipart/form-data well in some versions.
            // Let's use post with _method if there's an image.
            if (data.image) {
                router.post(route('admin.motorcycles.update', editingMotorcycle.id), {
                    ...data,
                    _method: 'PUT',
                }, {
                    onSuccess: () => {
                        setShowModal(false);
                        reset();
                    }
                });
            } else {
                put(route('admin.motorcycles.update', editingMotorcycle.id), {
                    onSuccess: () => {
                        setShowModal(false);
                        reset();
                    },
                });
            }
        } else {
            post(route('admin.motorcycles.store'), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this motorcycle? This action cannot be undone.')) {
            router.delete(route('admin.motorcycles.destroy', id));
        }
    };

    const handleToggleMaintenance = (id: number) => {
        router.patch(route('admin.motorcycles.maintenance', id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fleet Management" />
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="animate-fade-in-up">
                        <h1 className="text-2xl font-bold tracking-tight">Fleet Management</h1>
                        <p className="text-muted-foreground">Manage your motorcycle inventory</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="animate-fade-in-up delay-100 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                    >
                        <Plus className="h-4 w-4" /> Add Motorcycle
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="animate-fade-in-up delay-100 grid gap-4 sm:grid-cols-4">
                    {[
                        { label: 'Total', value: motorcycles.length, color: 'bg-primary/10 text-primary' },
                        { label: 'Available', value: motorcycles.filter((m) => m.status === 'Available').length, color: 'bg-green-100 text-green-700' },
                        { label: 'Rented', value: motorcycles.filter((m) => m.status === 'Rented').length, color: 'bg-blue-100 text-blue-700' },
                        { label: 'Maintenance', value: motorcycles.filter((m) => m.status === 'Maintenance').length, color: 'bg-orange-100 text-orange-700' },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-xl border bg-card p-4 text-center shadow-sm">
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="animate-fade-in-up delay-200 flex items-center gap-2 rounded-xl border bg-card px-4 shadow-sm">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by brand, model, or plate number..."
                        className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="animate-fade-in-up delay-300 overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Motorcycle</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plate</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Daily Rate</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filtered.map((bike) => (
                                    <tr key={bike.id} className="transition-colors hover:bg-muted/30">
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-primary/10 p-2 overflow-hidden flex items-center justify-center h-10 w-10">
                                                    {bike.image_path ? (
                                                        <img src={`/storage/${bike.image_path}`} alt={bike.model} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <Bike className="h-5 w-5 text-primary" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{bike.brand} {bike.model}</p>
                                                    <p className="text-xs text-muted-foreground">{bike.year}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-mono">{bike.plate_number}</td>
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">{bike.category}</span>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold">₱{Number(bike.daily_rate).toLocaleString()}</td>
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <StatusBadge status={bike.status} />
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <div className="flex items-center gap-1">
                                                <button 
                                                    onClick={() => setViewingMotorcycle(bike)}
                                                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => openEditModal(bike)}
                                                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleToggleMaintenance(bike.id)}
                                                    className={`rounded-lg p-2 transition-colors ${bike.status === 'Maintenance' ? 'bg-orange-100 text-orange-600' : 'text-muted-foreground hover:bg-orange-100 hover:text-orange-600'}`} 
                                                    title={bike.status === 'Maintenance' ? 'Finish Maintenance' : 'Start Maintenance'}
                                                >
                                                    <Wrench className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(bike.id)}
                                                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-100 hover:text-red-600" title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="animate-fade-in-up w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl relative">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <h2 className="mb-6 text-xl font-bold">{editingMotorcycle ? 'Edit Motorcycle' : 'Add New Motorcycle'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Brand</label>
                                        <input 
                                            className={`w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary ${errors.brand ? 'border-destructive' : ''}`}
                                            placeholder="e.g. Honda"
                                            value={data.brand}
                                            onChange={e => setData('brand', e.target.value)}
                                        />
                                        {errors.brand && <p className="mt-1 text-xs text-destructive">{errors.brand}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Model</label>
                                        <input 
                                            className={`w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary ${errors.model ? 'border-destructive' : ''}`}
                                            placeholder="e.g. Click 160"
                                            value={data.model}
                                            onChange={e => setData('model', e.target.value)}
                                        />
                                        {errors.model && <p className="mt-1 text-xs text-destructive">{errors.model}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Year</label>
                                        <input 
                                            type="number" 
                                            className={`w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary ${errors.year ? 'border-destructive' : ''}`}
                                            placeholder="e.g. 2025"
                                            value={data.year}
                                            onChange={e => setData('year', parseInt(e.target.value))}
                                        />
                                        {errors.year && <p className="mt-1 text-xs text-destructive">{errors.year}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Plate Number</label>
                                        <input 
                                            className={`w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary ${errors.plate_number ? 'border-destructive' : ''}`}
                                            placeholder="e.g. ABC-1234"
                                            value={data.plate_number}
                                            onChange={e => setData('plate_number', e.target.value)}
                                        />
                                        {errors.plate_number && <p className="mt-1 text-xs text-destructive">{errors.plate_number}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Daily Rate (₱)</label>
                                        <input 
                                            type="number" 
                                            className={`w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary ${errors.daily_rate ? 'border-destructive' : ''}`}
                                            placeholder="e.g. 500"
                                            value={data.daily_rate}
                                            onChange={e => setData('daily_rate', e.target.value)}
                                        />
                                        {errors.daily_rate && <p className="mt-1 text-xs text-destructive">{errors.daily_rate}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Category</label>
                                        <select 
                                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                                            value={data.category}
                                            onChange={e => setData('category', e.target.value)}
                                        >
                                            <option>Scooter</option>
                                            <option>Automatic</option>
                                            <option>Manual</option>
                                            <option>Big Bike</option>
                                            <option>Electric</option>
                                        </select>
                                    </div>
                                    {editingMotorcycle && (
                                        <div className="sm:col-span-2">
                                            <label className="mb-1 block text-sm font-medium">Status</label>
                                            <select 
                                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                            >
                                                <option>Available</option>
                                                <option>Rented</option>
                                                <option>Maintenance</option>
                                                <option>Unavailable</option>
                                            </select>
                                        </div>
                                    )}
                                    <div className="sm:col-span-2">
                                        <label className="mb-1 block text-sm font-medium">Image {editingMotorcycle && '(Optional - Leave empty to keep current)'}</label>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                                            onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                                        />
                                        {errors.image && <p className="mt-1 text-xs text-destructive">{errors.image}</p>}
                                    </div>
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
                                        disabled={processing}
                                        className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : editingMotorcycle ? 'Update Motorcycle' : 'Save Motorcycle'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Modal */}
                {viewingMotorcycle && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="animate-fade-in-up w-full max-w-lg rounded-2xl bg-card overflow-hidden shadow-2xl relative">
                            <button 
                                onClick={() => setViewingMotorcycle(null)}
                                className="absolute right-4 top-4 rounded-full p-2 bg-black/20 text-white hover:bg-black/40 z-10"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            
                            <div className="h-48 bg-primary/10 relative flex items-center justify-center overflow-hidden">
                                {viewingMotorcycle.image_path ? (
                                    <img src={`/storage/${viewingMotorcycle.image_path}`} alt={viewingMotorcycle.model} className="h-full w-full object-cover" />
                                ) : (
                                    <Bike className="h-20 w-20 text-primary/30" />
                                )}
                                <div className="absolute bottom-4 left-4">
                                    <StatusBadge status={viewingMotorcycle.status} />
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold">{viewingMotorcycle.brand} {viewingMotorcycle.model}</h2>
                                    <p className="text-muted-foreground">{viewingMotorcycle.year} • {viewingMotorcycle.category}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-xl border p-4">
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Plate Number</p>
                                        <p className="text-sm font-mono font-bold">{viewingMotorcycle.plate_number}</p>
                                    </div>
                                    <div className="rounded-xl border p-4">
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Daily Rate</p>
                                        <p className="text-sm font-bold">₱{Number(viewingMotorcycle.daily_rate).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button 
                                        onClick={() => { setViewingMotorcycle(null); openEditModal(viewingMotorcycle); }}
                                        className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                                    >
                                        Edit Details
                                    </button>
                                    <button 
                                        onClick={() => setViewingMotorcycle(null)}
                                        className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
