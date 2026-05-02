import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Bike, Calendar, CheckCircle2, ChevronLeft, ChevronRight, FileText, Upload, ShieldCheck, MapPin } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'New Rental Request', href: '/rentals/create' },
];

import { type Motorcycle } from '@/types';

const terms = [
    'A valid driver\'s license is required to rent a motorcycle.',
    'The customer is responsible for any damages incurred during the rental period.',
    'Late returns may incur additional daily charges.',
    'The fuel policy requires returning the motorcycle with the same fuel level.',
    'The motorcycle must be returned in proper working condition.',
    'The unit is subject to inspection before and after rental.',
    'Security deposit may be required depending on the motorcycle.',
    'MotoRent Butuan reserves the right to cancel a rental for safety concerns.',
];

export default function RentalCreate({ motorcycle }: { motorcycle?: Motorcycle }) {
    const selectedBike = motorcycle || { brand: 'Select a', model: 'Motorcycle First', daily_rate: 0, category: 'N/A', image_path: null };
    const [step, setStep] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const totalSteps = 3;
    // Calculate days ensuring both dates are valid and end date is after start date
    let days = 0;
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end >= start) {
            days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
        }
    }
    const totalAmount = days * selectedBike.daily_rate;

    const canProceed = () => {
        if (step === 1) return startDate && endDate && days > 0;
        if (step === 2) return agreedToTerms;
        return true;
    };

    if (submitted) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Request Submitted" />
                <div className="flex min-h-[70vh] items-center justify-center p-6">
                    <div className="animate-fade-in-up max-w-md text-center">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50">
                            <CheckCircle2 className="h-12 w-12 text-green-600" />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold tracking-tight">Request Submitted!</h1>
                        <p className="mb-8 text-muted-foreground">
                            Your rental request is now under review. Our team will verify your documents and notify you via email once approved.
                        </p>
                        
                        <div className="rounded-2xl border bg-card overflow-hidden text-left shadow-sm mb-8">
                            <div className="bg-muted/50 px-6 py-4 border-b">
                                <h3 className="font-semibold">Request Reference #RNT-1031</h3>
                            </div>
                            <div className="p-6 grid gap-4 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Motorcycle</span>
                                    <span className="font-semibold">{selectedBike.brand} {selectedBike.model}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Rental Period</span>
                                    <span className="font-semibold">{days} day{days > 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 border border-yellow-200">Pending Review</span>
                                </div>
                            </div>
                        </div>

                        <Link href="/dashboard" className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:shadow-md">
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Request to Rent" />
            
            <div className="mx-auto max-w-6xl p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8 animate-fade-in-up">
                    <h1 className="text-3xl font-bold tracking-tight">Request to Rent</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Secure your ride in just a few simple steps.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    
                    {/* Left Column: Form Content */}
                    <div className="flex-1 space-y-8 animate-fade-in-up delay-100">
                        
                        {/* Premium Stepper */}
                        <div className="relative">
                            <div className="absolute top-5 left-8 right-8 h-1 bg-muted rounded-full">
                                <div 
                                    className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                                    style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                                />
                            </div>
                            
                            <div className="relative flex justify-between">
                                {[
                                    { num: 1, label: 'Select Dates', icon: Calendar },
                                    { num: 2, label: 'Terms & ID', icon: FileText },
                                    { num: 3, label: 'Review', icon: CheckCircle2 },
                                ].map((s) => {
                                    const isActive = step >= s.num;
                                    const isCurrent = step === s.num;
                                    const Icon = s.icon;
                                    
                                    return (
                                        <div key={s.num} className="flex flex-col items-center gap-3 bg-background px-2">
                                            <div className={`flex h-12 w-12 items-center justify-center rounded-full border-4 transition-all duration-300 ${
                                                isActive 
                                                    ? 'border-primary bg-primary text-primary-foreground shadow-md' 
                                                    : 'border-muted bg-background text-muted-foreground'
                                            } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                                                {step > s.num ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-5 w-5" />}
                                            </div>
                                            <span className={`text-sm font-semibold tracking-wide ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {s.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Step Cards Container */}
                        <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm relative overflow-hidden">
                            {/* Decorative accent */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                            
                            {/* Step 1: Select Dates */}
                            {step === 1 && (
                                <div className="space-y-8 animate-fade-in">
                                    <div>
                                        <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><Calendar className="h-5 w-5 text-primary" /> Rental Period</h2>
                                        <p className="text-sm text-muted-foreground">Select when you want to pick up and return the motorcycle.</p>
                                    </div>
                                    
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Start Date</label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="w-full rounded-xl border bg-background px-4 py-3.5 pl-11 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                />
                                                <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">End Date</label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    className="w-full rounded-xl border bg-background px-4 py-3.5 pl-11 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                />
                                                <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Terms & Documents */}
                            {step === 2 && (
                                <div className="space-y-8 animate-fade-in">
                                    <div>
                                        <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><FileText className="h-5 w-5 text-primary" /> Documents & Terms</h2>
                                        <p className="text-sm text-muted-foreground">Please upload your requirements and accept our rental terms.</p>
                                    </div>

                                    {/* Upload Documents Grid */}
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted p-8 text-center transition-all hover:border-primary hover:bg-primary/5">
                                            <div className="rounded-full bg-primary/10 p-3"><Upload className="h-6 w-6 text-primary" /></div>
                                            <div>
                                                <span className="block text-sm font-semibold">Upload Valid ID</span>
                                                <span className="block text-xs text-muted-foreground mt-1">JPG, PNG (Max 5MB)</span>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" />
                                        </label>
                                        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted p-8 text-center transition-all hover:border-primary hover:bg-primary/5">
                                            <div className="rounded-full bg-primary/10 p-3"><Upload className="h-6 w-6 text-primary" /></div>
                                            <div>
                                                <span className="block text-sm font-semibold">Driver's License</span>
                                                <span className="block text-xs text-muted-foreground mt-1">Required for operation</span>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" />
                                        </label>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <h3 className="font-semibold flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Terms and Conditions</h3>
                                        <div className="max-h-60 space-y-3 overflow-y-auto rounded-xl border bg-muted/20 p-5 scrollbar-thin">
                                            {terms.map((term, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{term}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/50 border-primary/20 bg-primary/5">
                                            <input
                                                type="checkbox"
                                                checked={agreedToTerms}
                                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                                className="h-5 w-5 rounded border-2 border-primary/50 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm font-semibold text-foreground">I have read and agree to all the rental terms and conditions</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review & Submit */}
                            {step === 3 && (
                                <div className="space-y-8 animate-fade-in">
                                    <div>
                                        <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><CheckCircle2 className="h-5 w-5 text-primary" /> Final Review</h2>
                                        <p className="text-sm text-muted-foreground">Please review your rental details before submitting.</p>
                                    </div>
                                    
                                    <div className="rounded-xl border bg-card p-6 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5">
                                            <Bike className="h-32 w-32" />
                                        </div>
                                        <div className="relative space-y-4">
                                            <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">Confirmation Details</h3>
                                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground mb-1">Pick-up Date</p>
                                                    <p className="font-semibold text-base">{startDate}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground mb-1">Return Date</p>
                                                    <p className="font-semibold text-base">{endDate}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground mb-1">Documents</p>
                                                    <p className="font-semibold text-green-600 flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> Uploaded</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground mb-1">Terms</p>
                                                    <p className="font-semibold text-green-600 flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> Accepted</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-5 text-sm text-blue-800 border border-blue-100">
                                        <FileText className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                                        <div>
                                            <p className="font-semibold mb-1">What happens next?</p>
                                            <p className="text-blue-700/80">After submitting, our team will review your ID and request. Once approved, the payment gateway will be unlocked in your dashboard.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Form Navigation Buttons */}
                        <div className="flex items-center justify-between pt-2">
                            <button
                                onClick={() => setStep(Math.max(1, step - 1))}
                                disabled={step === 1}
                                className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                                    step === 1 ? 'opacity-0 pointer-events-none' : 'border border-input bg-background hover:bg-muted text-foreground hover:text-foreground'
                                }`}
                            >
                                <ChevronLeft className="h-4 w-4" /> Back
                            </button>
                            
                            {step < totalSteps ? (
                                <button
                                    onClick={() => setStep(Math.min(totalSteps, step + 1))}
                                    disabled={!canProceed()}
                                    className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    Continue <ChevronRight className="h-4 w-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => setSubmitted(true)}
                                    className="flex items-center gap-2 rounded-xl bg-green-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/25 transition-all hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    <CheckCircle2 className="h-5 w-5" /> Submit Request
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Sticky Order Summary */}
                    <div className="w-full lg:w-[380px] shrink-0 animate-fade-in-up delay-200">
                        <div className="sticky top-24 rounded-2xl border bg-card shadow-sm overflow-hidden flex flex-col h-fit">
                            <div className="bg-muted/30 p-6 border-b">
                                <h3 className="font-bold text-lg mb-1">Your Selection</h3>
                                <p className="text-sm text-muted-foreground">Verify your rental choice</p>
                            </div>
                            
                            <div className="p-6">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                                        {selectedBike.image_path ? (
                                            <img src={`/storage/${selectedBike.image_path}`} alt={selectedBike.model} className="h-full w-full object-cover" />
                                        ) : (
                                            <Bike className="h-8 w-8 text-primary" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg leading-tight">{selectedBike.brand} {selectedBike.model}</h4>
                                        <span className="inline-block mt-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                            {selectedBike.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Daily Rate</span>
                                        <span className="font-semibold">₱{selectedBike.daily_rate.toLocaleString()} / day</span>
                                    </div>
                                    
                                    {days > 0 ? (
                                        <div className="flex items-center justify-between text-sm animate-fade-in">
                                            <span className="text-muted-foreground">Duration</span>
                                            <span className="font-semibold">{days} day{days > 1 ? 's' : ''}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between text-sm opacity-50">
                                            <span className="text-muted-foreground">Duration</span>
                                            <span className="font-medium">--</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="bg-primary/5 p-6 border-t mt-auto">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold">Total Amount</span>
                                    <span className="text-2xl font-black text-primary">
                                        ₱{totalAmount.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <ShieldCheck className="h-3 w-3" /> No hidden fees. Pay after approval.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
