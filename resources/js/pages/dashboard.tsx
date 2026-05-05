import { StatsCard } from '@/components/stats-card';
import { StatusBadge } from '@/components/status-badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Rental } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Bike, Calendar, CreditCard, Clock, FileText, History, UserCircle, CheckCircle2, X, AlertCircle, Timer } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface DashboardProps {
    stats: {
        pending_requests: number;
        active_rentals: number;
        total_rentals: number;
        payment_due: number;
    };
    recentRentals: (Rental & { motorcycle?: { brand: string; model: string } })[];
    currentRental: (Rental & { id: number; status: string; fulfillment_type: string; total_amount: number; start_date: string; end_date: string; motorcycle?: { brand: string; model: string; daily_rate: number } }) | null;
}

export default function Dashboard({ stats, recentRentals = [], currentRental }: DashboardProps) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    
    const { data, setData, post, processing } = useForm({
        method: 'GCash',
        transaction_id: '',
    });

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentRental) return;
        
        post(`/rentals/${currentRental.id}/pay`, {
            onSuccess: () => setShowPaymentModal(false),
        });
    };

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
                        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between border-b p-5 bg-muted/10">
                                <h2 className="text-lg font-semibold">
                                    {currentRental?.status === 'pending' ? 'Pending Rental Request' : 'Ongoing Rental Details'}
                                </h2>
                                {currentRental && <StatusBadge status={currentRental.status || 'pending'} />}
                            </div>
                            <div className="p-5">
                                {currentRental ? (
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="rounded-xl bg-primary/10 p-4 shrink-0">
                                                <Bike className="h-8 w-8 text-primary" />
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-xl font-bold">
                                                            {currentRental.motorcycle?.brand} {currentRental.motorcycle?.model}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">Rental ID: #{currentRental.id}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Amount</p>
                                                        <p className="text-xl font-black text-primary">₱{Number(currentRental.total_amount).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    <div className="rounded-xl border bg-muted/20 p-4">
                                                        <p className="text-xs text-muted-foreground mb-1 uppercase font-bold">Rental Period</p>
                                                        <p className="text-sm font-semibold flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 opacity-50" />
                                                            {new Date(currentRental.start_date).toLocaleDateString()} → {new Date(currentRental.end_date).toLocaleDateString()}
                                                        </p>
                                                    </div>

                                                    {currentRental.status === 'active' && (
                                                        <div className={`rounded-xl border p-4 flex items-center gap-3 ${
                                                            new Date(currentRental.end_date) < new Date() 
                                                                ? 'bg-red-50 border-red-100 text-red-700' 
                                                                : 'bg-blue-50 border-blue-100 text-blue-700'
                                                        }`}>
                                                            {new Date(currentRental.end_date) < new Date() ? (
                                                                <AlertCircle className="h-5 w-5" />
                                                            ) : (
                                                                <Timer className="h-5 w-5" />
                                                            )}
                                                            <div>
                                                                <p className="text-[10px] uppercase font-bold opacity-70">Time Status</p>
                                                                <p className="text-sm font-bold">
                                                                    {(() => {
                                                                        const end = new Date(currentRental.end_date);
                                                                        const now = new Date();
                                                                        const diff = end.getTime() - now.getTime();
                                                                        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                                                                        
                                                                        if (days < 0) return `OVERDUE by ${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''}`;
                                                                        if (days === 0) return "DUE TODAY";
                                                                        return `${days} day${days > 1 ? 's' : ''} remaining`;
                                                                    })()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {currentRental.status === 'approved' && (
                                                        <div className="flex items-end">
                                                            <button 
                                                                onClick={() => setShowPaymentModal(true)}
                                                                className="w-full h-[52px] rounded-xl bg-green-600 font-bold text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-700 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                                            >
                                                                <CreditCard className="h-5 w-5" /> Pay to Confirm
                                                            </button>
                                                        </div>
                                                    )}
                                                    
                                                    {currentRental.status === 'pending' && (
                                                        <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 flex items-center gap-3">
                                                            <Clock className="h-5 w-5 text-amber-600" />
                                                            <p className="text-xs text-amber-800 leading-tight font-medium">Waiting for admin to review and approve your documents.</p>
                                                        </div>
                                                    )}

                                                    {currentRental.status === 'paid' && (
                                                        <div className="rounded-xl bg-green-50 border border-green-100 p-4 flex items-center gap-3">
                                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                            <div>
                                                                <p className="text-xs text-green-800 leading-tight font-bold mb-0.5">
                                                                    {currentRental.payment?.status === 'pending' ? 'Request Confirmed!' : 'Confirmation Received!'}
                                                                </p>
                                                                <p className="text-[11px] text-green-700 leading-tight">
                                                                    {currentRental.payment?.method === 'Cash on Pickup' 
                                                                        ? (currentRental.fulfillment_type === 'delivery' 
                                                                            ? "Confirmed! Please prepare your payment. Our team will deliver the unit to your address shortly."
                                                                            : "Please proceed to the shop to pay and pick up your unit.")
                                                                        : (currentRental.fulfillment_type === 'delivery' 
                                                                            ? "Payment received! Our team will deliver the unit to your address shortly."
                                                                            : "Payment received! Please proceed to the shop for unit pickup.")
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                                            <Bike className="h-10 w-10 text-muted-foreground/30" />
                                        </div>
                                        <p className="text-lg font-bold text-muted-foreground">Ready for a ride?</p>
                                        <p className="text-sm text-muted-foreground mb-6">You don't have any ongoing rental requests.</p>
                                        <Link href="/motorcycles" className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all">
                                            Find a Motorcycle
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="animate-fade-in-up delay-300">
                        <div className="rounded-xl border bg-card shadow-sm h-full">
                            <div className="border-b p-5 bg-muted/5">
                                <h2 className="text-lg font-semibold">Quick Actions</h2>
                            </div>
                            <div className="space-y-2 p-4">
                                <Link href="/motorcycles" className="flex items-center gap-3 rounded-xl p-4 transition-all hover:bg-muted group border border-transparent hover:border-muted-foreground/10">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100"><Bike className="h-5 w-5" /></div>
                                    <span className="flex-1 text-sm font-bold">Browse Motorcycles</span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link href="/rentals/history" className="flex items-center gap-3 rounded-xl p-4 transition-all hover:bg-muted group border border-transparent hover:border-muted-foreground/10">
                                    <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100"><History className="h-5 w-5" /></div>
                                    <span className="flex-1 text-sm font-bold">My Rental History</span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link href="/settings/profile" className="flex items-center gap-3 rounded-xl p-4 transition-all hover:bg-muted group border border-transparent hover:border-muted-foreground/10">
                                    <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-100"><UserCircle className="h-5 w-5" /></div>
                                    <span className="flex-1 text-sm font-bold">Account Settings</span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Rentals Table */}
                <div className="animate-fade-in-up delay-400 rounded-xl border bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between border-b p-5 bg-muted/5">
                        <h2 className="text-lg font-semibold">Recent Rentals</h2>
                        <Link href="/rentals/history" className="text-sm font-medium text-primary hover:underline">
                            View all
                        </Link>
                    </div>
                    {recentRentals.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/30 text-left">
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rental ID</th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Motorcycle</th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {recentRentals.map((rental) => (
                                        <tr key={rental.id} className="transition-colors hover:bg-muted/30">
                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-primary">#{rental.id}</td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-medium">
                                                {rental.motorcycle?.brand} {rental.motorcycle?.model}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-xs text-muted-foreground">{rental.start_date}</td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-bold">₱{Number(rental.total_amount).toLocaleString()}</td>
                                            <td className="whitespace-nowrap px-5 py-4"><StatusBadge status={rental.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <History className="mb-3 h-10 w-10 opacity-20" />
                            <p className="text-sm font-medium text-muted-foreground">No rental history yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && currentRental && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all animate-in fade-in duration-200">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b p-5">
                            <h2 className="text-xl font-bold">Secure Payment</h2>
                            <button onClick={() => setShowPaymentModal(false)} className="rounded-full p-2 hover:bg-muted transition-colors"><X className="h-5 w-5 text-muted-foreground" /></button>
                        </div>
                        
                        <form onSubmit={handlePayment} className="p-6 space-y-6">
                            <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Amount to Pay</p>
                                <p className="text-3xl font-black text-primary">₱{Number(currentRental.total_amount).toLocaleString()}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Select Payment Method</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['GCash', 'Bank Transfer', 'Cash on Pickup'].map((m) => (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => setData('method', m)}
                                                className={`rounded-xl border p-3 text-xs font-bold transition-all ${data.method === m ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-muted hover:border-muted-foreground/30'}`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {data.method !== 'Cash on Pickup' && (
                                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                        <label className="text-sm font-bold">Reference / Transaction ID</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.transaction_id}
                                            onChange={(e) => setData('transaction_id', e.target.value)}
                                            placeholder="Enter your transaction receipt ID"
                                            className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                        <p className="text-[10px] text-muted-foreground px-1 italic">Please send the exact amount to 09XX-XXX-XXXX before submitting.</p>
                                    </div>
                                )}

                                {data.method === 'Cash on Pickup' && (
                                    <div className="rounded-xl bg-blue-50 p-4 border border-blue-100 text-blue-800 text-xs animate-in slide-in-from-top-2 duration-200">
                                        <p className="font-bold mb-1">Important:</p>
                                        <p>You can pay the full amount at our shop when you pick up the motorcycle. Please bring a valid ID.</p>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-primary py-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:-translate-y-0.5 disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : 'Confirm Payment'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
