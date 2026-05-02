import { StatusBadge } from '@/components/status-badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Bike, Calendar, ChevronRight, History, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rental History', href: '/rentals/history' },
];

interface RentalRecord {
    id: number;
    start_date: string;
    end_date: string;
    total_amount: number;
    status: string;
    motorcycle?: {
        brand: string;
        model: string;
        category: string;
    };
}

export default function RentalHistory({ rentals = [] }: { rentals: RentalRecord[] }) {
    const [search, setSearch] = useState('');

    const filtered = rentals.filter(
        (r) => `${r.motorcycle?.brand} ${r.motorcycle?.model} ${r.id}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rental History" />
            
            <div className="mx-auto max-w-5xl p-6 lg:p-8 space-y-8">
                {/* Header Section */}
                <div className="animate-fade-in-up flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Rental History</h1>
                        <p className="mt-2 text-muted-foreground">Manage and track your past and current rentals</p>
                    </div>
                    <Link
                        href="/rentals/create"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5"
                    >
                        <Bike className="h-4 w-4" /> Rent Another Bike
                    </Link>
                </div>

                {/* Filters */}
                <div className="animate-fade-in-up delay-100 flex items-center gap-3 rounded-xl border bg-card px-4 py-2 shadow-sm">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Search by motorcycle or ID..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground" 
                    />
                </div>

                {/* List Section */}
                <div className="space-y-4 animate-fade-in-up delay-200">
                    {filtered.map((rental) => {
                        const start = new Date(rental.start_date);
                        const end = new Date(rental.end_date);
                        const duration = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

                        return (
                            <div key={rental.id} className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-md sm:flex-row items-stretch">
                                
                                {/* Left Section: Visual Indicator */}
                                <div className="hidden sm:flex w-32 shrink-0 items-center justify-center bg-primary/5 border-r">
                                    <div className="rounded-full bg-background p-4 shadow-sm border">
                                        <Bike className="h-8 w-8 text-primary" />
                                    </div>
                                </div>

                                {/* Middle Section: Bike Info */}
                                <div className="flex flex-1 flex-col justify-center p-6 sm:px-8">
                                    <div className="mb-3 flex flex-wrap items-center gap-3">
                                        <span className="rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-semibold tracking-wider text-muted-foreground">
                                            RNT-{String(rental.id).padStart(4, '0')}
                                        </span>
                                        <StatusBadge status={rental.status} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">
                                        {rental.motorcycle?.brand} {rental.motorcycle?.model}
                                    </h3>
                                    <p className="text-sm font-medium text-muted-foreground mb-4">
                                        {rental.motorcycle?.category}
                                    </p>
                                    
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl border border-muted/50 w-fit">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-primary/70" />
                                            <span className="font-medium text-foreground/80">{rental.start_date} &rarr; {rental.end_date}</span>
                                        </div>
                                        <div className="h-4 w-px bg-border hidden sm:block"></div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-foreground/80">{duration} day{duration > 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section: Price & Action */}
                                <div className="flex flex-col justify-between border-t bg-muted/10 p-6 sm:w-64 sm:border-l sm:border-t-0 sm:p-8">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Total Amount</p>
                                        <p className="text-3xl font-black text-primary">₱{Number(rental.total_amount).toLocaleString()}</p>
                                    </div>
                                    <button className="mt-6 sm:mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-background border px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:bg-muted hover:border-primary/30 group-hover:shadow">
                                        View Details <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {filtered.length === 0 && (
                        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-dashed text-center">
                            <div className="mb-4 rounded-full bg-primary/10 p-5">
                                <History className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold">No rentals found</h3>
                            <p className="mb-8 max-w-sm text-muted-foreground">
                                {search ? "We couldn't find any rentals matching your search criteria." : "You haven't rented a motorcycle yet. Start exploring!"}
                            </p>
                            {search ? (
                                <button onClick={() => setSearch('')} className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
                                    Clear Search
                                </button>
                            ) : (
                                <Link href="/motorcycles" className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
                                    Browse Bikes
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
