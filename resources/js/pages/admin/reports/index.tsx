import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BarChart3, Download, FileText, Printer } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Admin Dashboard', href: '/admin/dashboard' }, { title: 'Reports', href: '/admin/reports' }];

const reports = [
    { id: 1, title: 'Rental Report', description: 'Summary of all rentals by date range, status, and customer.', icon: '📋', color: 'bg-blue-100 text-blue-700' },
    { id: 2, title: 'Payment Report', description: 'Revenue breakdown by payment method, status, and period.', icon: '💰', color: 'bg-green-100 text-green-700' },
    { id: 3, title: 'Customer Report', description: 'Customer registration trends and rental frequency analysis.', icon: '👥', color: 'bg-purple-100 text-purple-700' },
    { id: 4, title: 'Motorcycle Utilization', description: 'Fleet usage rates, idle time, and most popular units.', icon: '🏍️', color: 'bg-amber-100 text-amber-700' },
    { id: 5, title: 'Maintenance Cost Report', description: 'Total maintenance expenses by type and motorcycle.', icon: '🔧', color: 'bg-orange-100 text-orange-700' },
    { id: 6, title: 'Staff Activity Report', description: 'Staff workload, approvals handled, and maintenance logged.', icon: '👤', color: 'bg-sky-100 text-sky-700' },
];

interface SummaryStat {
    label: string;
    value: string | number;
    period: string;
}

export default function ReportsPage({ summaryData = [] }: { summaryData: SummaryStat[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports & Analytics" />
            <div className="space-y-6 p-6">
                <div className="animate-fade-in-up">
                    <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
                    <p className="text-muted-foreground">Generate and export system reports</p>
                </div>

                {/* Summary Stats */}
                <div className="animate-fade-in-up delay-100 grid gap-4 sm:grid-cols-4">
                    {summaryData.map((d) => (
                        <div key={d.label} className="rounded-xl border bg-card p-4 shadow-sm text-center">
                            <p className="text-xs text-muted-foreground">{d.period}</p>
                            <p className="text-2xl font-bold">{d.value}</p>
                            <p className="text-sm text-muted-foreground">{d.label}</p>
                        </div>
                    ))}
                    {summaryData.length === 0 && (
                        <div className="col-span-full py-4 text-center text-sm text-muted-foreground">No data available</div>
                    )}
                </div>

                {/* Report Cards */}
                <div className="animate-fade-in-up delay-200 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {reports.map((r) => (
                        <div key={r.id} className="card-hover rounded-xl border bg-card p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <span className="text-2xl">{r.icon}</span>
                                <h3 className="font-semibold">{r.title}</h3>
                            </div>
                            <p className="mb-5 text-sm text-muted-foreground">{r.description}</p>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                                    <BarChart3 className="h-3.5 w-3.5" /> Generate
                                </button>
                                <button className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted">
                                    <Download className="h-3.5 w-3.5" /> PDF
                                </button>
                                <button className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted">
                                    <FileText className="h-3.5 w-3.5" /> Excel
                                </button>
                                <button className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted">
                                    <Printer className="h-3.5 w-3.5" /> Print
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
