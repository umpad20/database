import { StatusBadge } from '@/components/status-badge';
import GuestLayout from '@/layouts/guest-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Bike, Calendar, CheckCircle2, Fuel, Hash, MapPin, Shield } from 'lucide-react';
import { type Motorcycle } from '@/types';

export default function MotorcycleShow({ motorcycle }: { motorcycle: Motorcycle }) {
    const specs = [
        { label: 'Brand', value: motorcycle.brand, icon: Bike },
        { label: 'Model', value: motorcycle.model, icon: Bike },
        { label: 'Category', value: typeof motorcycle.category === 'string' ? motorcycle.category : motorcycle.category?.name || 'N/A', icon: Shield },
        { label: 'Year', value: motorcycle.year, icon: Calendar },
        { label: 'Plate Number', value: motorcycle.plate_number, icon: Hash },
    ];

    return (
        <GuestLayout>
            <Head title={`${motorcycle.brand} ${motorcycle.model}`} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link href="/motorcycles" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    <ArrowLeft className="h-4 w-4" /> Back to Catalog
                </Link>

                <div className="grid gap-8 lg:grid-cols-5">
                    {/* Left: Image / Visual */}
                    <div className="lg:col-span-3">
                        <div className="animate-fade-in-up overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm flex items-center justify-center">
                            {motorcycle.image_path ? (
                                <img src={`/storage/${motorcycle.image_path}`} alt={motorcycle.model} className="w-full h-[500px] object-cover" />
                            ) : (
                                <div className="p-16 sm:p-24">
                                    <Bike className="h-40 w-40 text-primary/30" />
                                </div>
                            )}
                        </div>

                        {/* Specifications */}
                        <div className="mt-6 animate-fade-in-up delay-200 rounded-xl border bg-card p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold">Specifications</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {specs.map((spec) => (
                                    <div key={spec.label} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                                        <spec.icon className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">{spec.label}</p>
                                            <p className="text-sm font-semibold">{spec.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Details + Action */}
                    <div className="lg:col-span-2">
                        <div className="animate-fade-in-up delay-100 sticky top-24 space-y-6">
                            {/* Main Info Card */}
                            <div className="rounded-xl border bg-card p-6 shadow-sm">
                                <div className="mb-4 flex items-start justify-between">
                                    <div>
                                        <span className="mb-1 inline-block rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                            {typeof motorcycle.category === 'string' ? motorcycle.category : motorcycle.category?.name || 'N/A'}
                                        </span>
                                        <h1 className="text-2xl font-bold">{motorcycle.brand} {motorcycle.model}</h1>
                                        <p className="text-sm text-muted-foreground">{motorcycle.year} • {motorcycle.plate_number}</p>
                                    </div>
                                    <StatusBadge status={motorcycle.status} />
                                </div>

                                <div className="mb-6 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 p-4">
                                    <p className="text-sm text-muted-foreground">Daily Rental Rate</p>
                                    <p className="text-3xl font-bold text-primary">₱{Number(motorcycle.daily_rate).toLocaleString()}<span className="text-base font-normal text-muted-foreground">/day</span></p>
                                </div>

                                {motorcycle.status === 'Available' ? (
                                    <Link
                                        href={`/rentals/create?motorcycle=${motorcycle.id}`}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
                                    >
                                        <CheckCircle2 className="h-5 w-5" />
                                        Submit Rental Request
                                    </Link>
                                ) : (
                                    <button disabled className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-muted py-3.5 text-sm font-semibold text-muted-foreground">
                                        Currently Unavailable
                                    </button>
                                )}
                            </div>

                            {/* Rental Info */}
                            <div className="rounded-xl border bg-card p-6 shadow-sm">
                                <h3 className="mb-3 text-sm font-semibold">Rental Information</h3>
                                <ul className="space-y-2.5 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
                                        Valid driver's license required
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
                                        Security deposit may apply
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                                        Pickup at branch or delivery available
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Fuel className="mt-0.5 h-4 w-4 text-amber-500" />
                                        Return with same fuel level
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
