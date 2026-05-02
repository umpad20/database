import { StatsCard } from '@/components/stats-card';
import { StatusBadge } from '@/components/status-badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Rental } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Bike, Calendar, CreditCard, Clock, FileText, History, UserCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface DashboardProps {
    stats: {
        pending_requests: number;
        active_rentals: number;
        total_rentals: number;
        payment_due: number;
    };
    recentRentals: (Rental & { motorcycle?: { brand: string; model: string } })[];
    currentRental: (Rental & { motorcycle?: { brand: string; model: string; daily_rate: number } }) | null;
}

export default function Dashboard({ stats, recentRentals = [], currentRental }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer Dashboard" />
            <div className="space-y-6 p-6">
                {/* Welcome Header */}
                <div className="animate-fade-in-up">
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back! 👋</h1>
                    <p className="text-muted-foreground">Here's an overview of your rental activity.</p>
                </div>

                {/* KPI Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard title="Pending Requests" value={stats.pending_requests} icon={Clock} className="animate-fade-in-up delay-100" />
                    <StatsCard title="Active Rentals" value={stats.active_rentals} icon={Bike} className="animate-fade-in-up delay-200" />
                    <StatsCard title="Payment Due" value={`₱${Number(stats.payment_due).toLocaleString()}`} icon={CreditCard} className="animate-fade-in-up delay-300" />
                    <StatsCard title="Total Rentals" value={stats.total_rentals} icon={History} className="animate-fade-in-up delay-400" />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Current Rental */}
                    <div className="animate-fade-in-up delay-200 lg:col-span-2">
                        <div className="rounded-xl border bg-card shadow-sm">
                            <div className="flex items-center justify-between border-b p-5">
                                <h2 className="text-lg font-semibold">Current Rental</h2>
                                {currentRental && <StatusBadge status={currentRental.status || 'pending'} />}
                            </div>
                            <div className="p-5">
                                {currentRental ? (
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-xl bg-primary/10 p-4">
                                            <Bike className="h-8 w-8 text-primary" />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    {currentRental.motorcycle?.brand} {currentRental.motorcycle?.model}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">Rental #{currentRental.id}</p>
                                            </div>
                                            <div className="grid gap-3 sm:grid-cols-3">
                                                <div className="rounded-lg bg-muted/50 p-3">
                                                    <p className="text-xs text-muted-foreground">Start Date</p>
                                                    <p className="text-sm font-semibold">{currentRental.start_date}</p>
                                                </div>
                                                <div className="rounded-lg bg-muted/50 p-3">
                                                    <p className="text-xs text-muted-foreground">End Date</p>
                                                    <p className="text-sm font-semibold">{currentRental.end_date}</p>
                                                </div>
                                                <div className="rounded-lg bg-muted/50 p-3">
                                                    <p className="text-xs text-muted-foreground">Total Amount</p>
                                                    <p className="text-sm font-semibold">₱{Number(currentRental.total_amount).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <Bike className="mb-3 h-12 w-12 text-muted-foreground/30" />
                                        <p className="text-sm font-medium text-muted-foreground">No active rental</p>
                                        <Link href="/motorcycles" className="mt-3 text-sm font-medium text-primary hover:underline">
                                            Browse motorcycles →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="animate-fade-in-up delay-300">
                        <div className="rounded-xl border bg-card shadow-sm">
                            <div className="border-b p-5">
                                <h2 className="text-lg font-semibold">Quick Actions</h2>
                            </div>
                            <div className="space-y-2 p-4">
                                <Link href="/motorcycles" className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted">
                                    <Bike className="h-5 w-5 text-primary" />
                                    <span className="flex-1 text-sm font-medium">Browse Motorcycles</span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                                <Link href="/rentals/create" className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <span className="flex-1 text-sm font-medium">New Rental Request</span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                                <Link href="/rentals/history" className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <span className="flex-1 text-sm font-medium">Rental History</span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                                <Link href="/settings/profile" className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted">
                                    <UserCircle className="h-5 w-5 text-primary" />
                                    <span className="flex-1 text-sm font-medium">My Profile</span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Rentals Table */}
                <div className="animate-fade-in-up delay-400 rounded-xl border bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b p-5">
                        <h2 className="text-lg font-semibold">Recent Rentals</h2>
                        <Link href="/rentals/history" className="text-sm font-medium text-primary hover:underline">
                            View all
                        </Link>
                    </div>
                    {recentRentals.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/30">
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rental ID</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Motorcycle</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {recentRentals.map((rental) => (
                                        <tr key={rental.id} className="transition-colors hover:bg-muted/30">
                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-medium">#{rental.id}</td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm">
                                                {rental.motorcycle?.brand} {rental.motorcycle?.model}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">{rental.start_date}</td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold">₱{Number(rental.total_amount).toLocaleString()}</td>
                                            <td className="whitespace-nowrap px-5 py-4"><StatusBadge status={rental.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <History className="mb-3 h-10 w-10 text-muted-foreground/30" />
                            <p className="text-sm font-medium text-muted-foreground">No rental history yet</p>
                            <Link href="/motorcycles" className="mt-3 text-sm font-medium text-primary hover:underline">
                                Start your first rental →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
