import { StatusBadge } from '@/components/status-badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Bike, Calendar, ChevronRight, History, Search, MapPin, CreditCard, FileText, X, CheckCircle2, AlertCircle, Star } from 'lucide-react';
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
    fulfillment_type: string;
    pickup_location: string;
    return_location: string;
    motorcycle?: {
        brand: string;
        model: string;
        category: string;
        image_path: string;
    };
    payment?: {
        method: string;
        status: string;
        transaction_id: string;
        paid_at: string;
    };
    review?: {
        id: number;
        rating: number;
        comment: string;
    };
}

export default function RentalHistory({ rentals = [] }: { rentals: RentalRecord[] }) {
    const [search, setSearch] = useState('');
    const [selectedRental, setSelectedRental] = useState<RentalRecord | null>(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewingRental, setReviewingRental] = useState<RentalRecord | null>(null);

    const { data: reviewData, setData: setReviewData, post: postReview, processing: reviewProcessing, reset: resetReview } = useForm({
        rental_id: 0,
        rating: 5,
        comment: '',
    });

    const filtered = rentals.filter(
        (r) => `${r.motorcycle?.brand} ${r.motorcycle?.model} ${r.id}`.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpenReview = (rental: RentalRecord) => {
        setReviewingRental(rental);
        setReviewData({
            rental_id: rental.id,
            rating: 5,
            comment: '',
        });
        setShowReviewModal(true);
    };

    const submitReview = (e: React.FormEvent) => {
        e.preventDefault();
        postReview(route('reviews.store'), {
            onSuccess: () => {
                setShowReviewModal(false);
                setReviewingRental(null);
                resetReview();
            },
        });
    };

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
                                        {rental.status === 'returned' && !rental.review && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                                <Star className="h-2.5 w-2.5 fill-amber-500" /> Awaiting Review
                                            </span>
                                        )}
                                        {rental.review && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                                <CheckCircle2 className="h-2.5 w-2.5" /> Reviewed
                                            </span>
                                        )}
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
                                    <div className="mb-4">
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Total Amount</p>
                                        <p className="text-3xl font-black text-primary">₱{Number(rental.total_amount).toLocaleString()}</p>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2">
                                        {rental.status === 'returned' && !rental.review && (
                                            <button 
                                                onClick={() => handleOpenReview(rental)}
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-amber-600"
                                            >
                                                <Star className="h-3.5 w-3.5" /> Rate Service
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => setSelectedRental(rental)}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-background border px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:bg-muted hover:border-primary/30 group-hover:shadow"
                                        >
                                            View Details <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
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

            {/* Details Modal */}
            {selectedRental && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-card shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b p-6">
                            <div>
                                <h2 className="text-xl font-bold">Rental Summary</h2>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1 font-bold">Transaction #RNT-{String(selectedRental.id).padStart(4, '0')}</p>
                            </div>
                            <button onClick={() => setSelectedRental(null)} className="rounded-full p-2 hover:bg-muted transition-colors"><X className="h-6 w-6 text-muted-foreground" /></button>
                        </div>
                        
                        <div className="max-h-[70vh] overflow-y-auto p-8 scrollbar-thin">
                            <div className="grid gap-8">
                                {/* Bike & Status */}
                                <div className="flex items-start gap-6 pb-6 border-b">
                                    <div className="h-24 w-32 rounded-2xl bg-muted flex items-center justify-center border shadow-inner">
                                        {selectedRental.motorcycle?.image_path ? (
                                            <img src={`/storage/${selectedRental.motorcycle.image_path}`} className="h-full w-full object-cover rounded-2xl" />
                                        ) : (
                                            <Bike className="h-10 w-10 opacity-20" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-2xl font-black">{selectedRental.motorcycle?.brand} {selectedRental.motorcycle?.model}</h3>
                                            <StatusBadge status={selectedRental.status} />
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium uppercase tracking-wider">
                                            <span>{selectedRental.motorcycle?.category}</span>
                                            <span className="opacity-30">•</span>
                                            <span className="text-primary font-bold">₱{Number(selectedRental.total_amount).toLocaleString()} Total</span>
                                        </div>
                                    </div>
                                </div>

                                {selectedRental.review && (
                                    <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-amber-700">Your Service Feedback</h4>
                                            <div className="flex gap-0.5">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={`h-3.5 w-3.5 ${i < selectedRental.review!.rating ? 'fill-amber-500 text-amber-500' : 'text-amber-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm italic text-amber-900">"{selectedRental.review.comment}"</p>
                                    </div>
                                )}

                                {/* Details Grid */}
                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <section>
                                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                                                <Calendar className="h-3.5 w-3.5" /> Rental Period
                                            </h4>
                                            <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10">
                                                <p className="text-sm font-bold">{selectedRental.start_date} &mdash; {selectedRental.end_date}</p>
                                                <p className="text-xs text-muted-foreground mt-1">Total Duration: {Math.max(1, Math.ceil((new Date(selectedRental.end_date).getTime() - new Date(selectedRental.start_date).getTime()) / (1000 * 60 * 60 * 24)))} Days</p>
                                            </div>
                                        </section>

                                        <section>
                                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                                                <MapPin className="h-3.5 w-3.5" /> Fulfillment
                                            </h4>
                                            <div className="space-y-3 p-4 rounded-2xl bg-primary/5 border border-primary/10 text-sm">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold text-primary/70 mb-0.5">Method</p>
                                                    <p className="font-bold capitalize">{selectedRental.fulfillment_type}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold text-primary/70 mb-0.5">Pickup/Release</p>
                                                    <p className="font-semibold text-primary">{selectedRental.pickup_location}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold text-primary/70 mb-0.5">Return Location</p>
                                                    <p className="font-semibold text-primary">{selectedRental.return_location}</p>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    <div className="space-y-6">
                                        <section>
                                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                                                <CreditCard className="h-3.5 w-3.5" /> Payment Status
                                            </h4>
                                            {selectedRental.payment ? (
                                                <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10 space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold uppercase text-muted-foreground">Method</span>
                                                        <span className="text-sm font-black text-foreground uppercase">{selectedRental.payment.method}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold uppercase text-muted-foreground">Status</span>
                                                        <StatusBadge status={selectedRental.payment.status} />
                                                    </div>
                                                    {selectedRental.payment.transaction_id && (
                                                        <div className="pt-2 border-t border-muted-foreground/10">
                                                            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Ref ID</p>
                                                            <p className="text-xs font-mono break-all">{selectedRental.payment.transaction_id}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-yellow-50 border border-yellow-100 text-yellow-700">
                                                    <AlertCircle className="h-5 w-5" />
                                                    <p className="text-sm font-bold">No payment record found</p>
                                                </div>
                                            )}
                                        </section>

                                        <section>
                                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                                                <FileText className="h-3.5 w-3.5" /> Handover Status
                                            </h4>
                                            <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10 flex items-center gap-3">
                                                <div className={`h-3 w-3 rounded-full ${selectedRental.status === 'active' || selectedRental.status === 'returned' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-muted-foreground/30'}`}></div>
                                                <span className="text-sm font-bold">
                                                    {selectedRental.status === 'returned' ? 'Unit Safely Returned' : 
                                                     selectedRental.status === 'active' ? 'Currently in Use' : 
                                                     'Awaiting Collection'}
                                                </span>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && reviewingRental && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-8 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
                                <Star className="h-8 w-8 text-amber-600 fill-amber-600" />
                            </div>
                            <h2 className="text-2xl font-black">Rate Our Service</h2>
                            <p className="mt-2 text-sm text-muted-foreground">How was your overall experience with MotoRent Butuan?</p>
                            
                            <form onSubmit={submitReview} className="mt-8 space-y-6">
                                {/* Star Rating */}
                                <div className="flex items-center justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewData('rating', star)}
                                            className="transition-transform active:scale-90"
                                        >
                                            <Star className={`h-10 w-10 ${reviewData.rating >= star ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/20'}`} />
                                        </button>
                                    ))}
                                </div>

                                <div className="text-left">
                                    <label className="mb-2 block text-xs font-black uppercase tracking-widest text-muted-foreground">Your Feedback</label>
                                    <textarea
                                        required
                                        className="w-full min-h-[120px] rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="Tell us what you liked or how we can improve..."
                                        value={reviewData.comment}
                                        onChange={e => setReviewData('comment', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        type="submit"
                                        disabled={reviewProcessing}
                                        className="flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {reviewProcessing ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowReviewModal(false)}
                                        className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
