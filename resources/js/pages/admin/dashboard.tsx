import { StatsCard } from '@/components/stats-card';
import { StatusBadge } from '@/components/status-badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Banknote, Bike, CheckCircle2, Clock, CreditCard, History, Users, Wrench } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Admin Dashboard', href: '/admin/dashboard' }];

interface AdminStats {
    totalCustomers: number;
    totalMotorcycles: number;
    availableMotorcycles: number;
    activeRentals: number;
    pendingApprovals: number;
    underMaintenance: number;
    pendingPayments: number;
    monthlyRevenue: number;
}

interface RecentRequest {
    id: number;
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

interface AdminDashboardProps {
    stats: AdminStats;
    recentRequests: RecentRequest[];
}

export default function AdminDashboard({ stats, recentRequests = [] }: AdminDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="animate-fade-in-up">
                    <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">System overview and analytics</p>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard title="Total Customers" value={stats.totalCustomers} icon={Users} className="animate-fade-in-up delay-100" />
                    <StatsCard title="Available Motorcycles" value={`${stats.availableMotorcycles}/${stats.totalMotorcycles}`} icon={Bike} className="animate-fade-in-up delay-200" />
                    <StatsCard title="Active Rentals" value={stats.activeRentals} icon={CheckCircle2} className="animate-fade-in-up delay-300" />
                    <StatsCard title="Monthly Revenue" value={`₱${Number(stats.monthlyRevenue).toLocaleString()}`} icon={Banknote} className="animate-fade-in-up delay-400" />
                </div>

                {/* Second Row KPIs */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <StatsCard title="Pending Approvals" value={stats.pendingApprovals} icon={Clock} className="animate-fade-in-up delay-200" />
                    <StatsCard title="Under Maintenance" value={stats.underMaintenance} icon={Wrench} className="animate-fade-in-up delay-300" />
                    <StatsCard title="Pending Payments" value={stats.pendingPayments} icon={CreditCard} className="animate-fade-in-up delay-400" />
                </div>

                {/* Recent Rental Requests */}
                <div className="animate-fade-in-up delay-400 rounded-xl border bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b p-5">
                        <h2 className="text-lg font-semibold">Recent Rental Requests</h2>
                        <Link href="/admin/rentals" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                            View all <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    {recentRequests.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/30">
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">ID</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Motorcycle</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {recentRequests.map((req) => (
                                        <tr key={req.id} className="transition-colors hover:bg-muted/30">
                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-medium">#{req.id}</td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm">{req.customer?.user?.name || 'N/A'}</td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm">
                                                {req.motorcycle?.brand} {req.motorcycle?.model}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                                                {req.created_at ? new Date(req.created_at).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4"><StatusBadge status={req.status} /></td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <Link href={`/admin/rentals/${req.id}`} className="text-sm font-medium text-primary hover:underline">
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <History className="mb-3 h-10 w-10 text-muted-foreground/30" />
                            <p className="text-sm font-medium text-muted-foreground">No rental requests yet</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
