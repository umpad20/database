import { StatusBadge } from '@/components/status-badge';
import GuestLayout from '@/layouts/guest-layout';
import { Head, Link } from '@inertiajs/react';
import { Bike, Filter, Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

// Mock data
const allCategories = [
    { id: 0, name: 'All' },
    { id: 1, name: 'Scooter' },
    { id: 2, name: 'Automatic' },
    { id: 3, name: 'Manual' },
    { id: 4, name: 'Big Bike' },
    { id: 5, name: 'Electric' },
];

import { type Motorcycle } from '@/types';

export default function MotorcycleIndex({ motorcycles = [] }: { motorcycles: Motorcycle[] }) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');

    const filtered = motorcycles
        .filter((m) => {
            const matchesSearch = `${m.brand} ${m.model}`.toLowerCase().includes(search.toLowerCase());
            const categoryName = typeof m.category === 'string' ? m.category : m.category?.name;
            const matchesCategory = selectedCategory === 0 || categoryName === allCategories.find(c => c.id === selectedCategory)?.name;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'price-asc') return a.daily_rate - b.daily_rate;
            if (sortBy === 'price-desc') return b.daily_rate - a.daily_rate;
            return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
        });

    return (
        <GuestLayout>
            <Head title="Browse Motorcycles" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8 animate-fade-in-up">
                    <h1 className="mb-2 text-3xl font-bold tracking-tight">Motorcycle Catalog</h1>
                    <p className="text-muted-foreground">Browse our premium fleet and find your perfect ride</p>
                </div>

                {/* Search & Filters */}
                <div className="mb-6 animate-fade-in-up delay-100 space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex flex-1 items-center gap-2 rounded-xl border bg-card px-4 shadow-sm">
                            <Search className="h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by brand or model..."
                                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                            <select
                                className="rounded-xl border bg-card px-4 py-3 text-sm shadow-sm outline-none"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            >
                                <option value="name">Sort by Name</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Category Chips */}
                    <div className="flex flex-wrap gap-2">
                        {allCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                                    selectedCategory === cat.id
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'border bg-card text-muted-foreground hover:border-primary hover:text-primary'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="font-semibold text-foreground">{filtered.length}</span> motorcycles
                    </p>
                </div>

                {/* Motorcycle Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((bike, i) => (
                        <div key={bike.id} className={`animate-fade-in-up delay-${Math.min((i + 1) * 100, 500)} card-hover group overflow-hidden rounded-xl border bg-card shadow-sm`}>
                            <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 h-48 flex items-center justify-center overflow-hidden p-8">
                                {bike.image_path ? (
                                    <img src={`/storage/${bike.image_path}`} alt={bike.model} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <Bike className="mx-auto h-20 w-20 text-primary/30 transition-transform duration-300 group-hover:scale-110" />
                                )}
                                <div className="absolute right-3 top-3">
                                    <StatusBadge status={bike.status} />
                                </div>
                                <span className="absolute left-3 top-3 rounded-md bg-card/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                                    {typeof bike.category === 'string' ? bike.category : bike.category?.name || 'N/A'}
                                </span>
                            </div>
                            <div className="p-5">
                                <h3 className="mb-1 text-lg font-semibold">{bike.brand} {bike.model}</h3>
                                <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                    <span>{bike.year}</span>
                                    <span>•</span>
                                    <span>{bike.plate_number}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-bold text-primary">₱{Number(bike.daily_rate).toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">per day</p>
                                    </div>
                                    <Link
                                        href={`/motorcycles/${bike.id}`}
                                        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md"
                                    >
                                        {bike.status === 'Available' ? 'Rent Now' : 'View'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 py-16 text-center">
                        <Bike className="mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-1 text-lg font-semibold">No motorcycles found</h3>
                        <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
