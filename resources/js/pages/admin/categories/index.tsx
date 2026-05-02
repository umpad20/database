import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Bike, Edit, FolderOpen, Plus, Tag, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Categories', href: '/admin/categories' },
];

interface CategoryItem {
    id: number;
    name: string;
    count: number;
    description: string;
}

export default function CategoryManagement({ categories = [] }: { categories: CategoryItem[] }) {
    const [newCategory, setNewCategory] = useState('');

    const totalCategories = categories.length;
    const totalBikes = categories.reduce((sum, cat) => sum + cat.count, 0);
    const popularCategory = categories.length > 0 ? categories.reduce((prev, current) => (prev.count > current.count) ? prev : current).name : 'N/A';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Category Management" />
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="animate-fade-in-up">
                        <h1 className="text-2xl font-bold tracking-tight">Category Management</h1>
                        <p className="text-muted-foreground">Manage motorcycle categories and classifications</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="animate-fade-in-up delay-100 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-2"><FolderOpen className="h-5 w-5 text-primary" /></div>
                            <div><p className="text-xs text-muted-foreground">Total Categories</p><p className="text-xl font-bold">{totalCategories}</p></div>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2"><Bike className="h-5 w-5 text-blue-600" /></div>
                            <div><p className="text-xs text-muted-foreground">Total Motorcycles</p><p className="text-xl font-bold">{totalBikes}</p></div>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2"><Tag className="h-5 w-5 text-green-600" /></div>
                            <div><p className="text-xs text-muted-foreground">Most Popular</p><p className="text-xl font-bold">{popularCategory}</p></div>
                        </div>
                    </div>
                </div>

                {/* Add Category Form */}
                <div className="animate-fade-in-up delay-200 rounded-xl border bg-card p-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Enter new category name..."
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
                            <Plus className="h-4 w-4" /> Add Category
                        </button>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="animate-fade-in-up delay-300 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <div key={cat.id} className="card-hover flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm">
                                <div>
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <FolderOpen className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex gap-1">
                                            <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Edit className="h-4 w-4" /></button>
                                            <button className="rounded-lg p-2 text-muted-foreground hover:bg-red-100 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-lg">{cat.name}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
                                </div>
                                <div className="mt-4 border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">Inventory count</span>
                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                            {cat.count} Units
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                            <FolderOpen className="mb-3 h-10 w-10 text-muted-foreground/30" />
                            <p className="text-sm font-medium text-muted-foreground">No categories found</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
