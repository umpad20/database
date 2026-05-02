import GuestLayout from '@/layouts/guest-layout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Bike,
    CheckCircle2,
    ClipboardCheck,
    CreditCard,
    MapPin,
    Search,
    Shield,
    Star,
    Truck,
    Users,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

// Mock categories
const categories = [
    { id: 1, name: 'Scooter', count: 12, icon: '🛵' },
    { id: 2, name: 'Automatic', count: 8, icon: '🏍️' },
    { id: 3, name: 'Manual', count: 6, icon: '⚙️' },
    { id: 4, name: 'Big Bike', count: 4, icon: '🔥' },
    { id: 5, name: 'Electric', count: 3, icon: '⚡' },
];


const testimonials = [
    { name: 'Juan Dela Cruz', rating: 5, text: 'Great service! The motorcycle was in perfect condition and the staff was very accommodating.' },
    { name: 'Maria Santos', rating: 5, text: 'Very professional rental process. I felt safe and confident the entire trip.' },
    { name: 'Pedro Reyes', rating: 4, text: 'Affordable rates and a wide selection of motorcycles. Highly recommended!' },
];

const howItWorks = [
    { step: 1, title: 'Submit Request', description: 'Browse motorcycles, select your dates, and submit a rental request.', icon: ClipboardCheck },
    { step: 2, title: 'Get Approved', description: 'Our staff reviews your request and verifies your documents.', icon: CheckCircle2 },
    { step: 3, title: 'Make Payment', description: 'Once approved, choose your payment method and complete the transaction.', icon: CreditCard },
    { step: 4, title: 'Ride & Enjoy', description: 'Pick up at our branch or have it delivered to your location!', icon: Truck },
];

import { type Motorcycle } from '@/types';

export default function Welcome({ motorcycles = [] }: { motorcycles: Motorcycle[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <GuestLayout>
            <Head title="Premium Motorcycle Rental" />

            {/* ===== HERO SECTION ===== */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
                <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div className="animate-fade-in-up">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                                <Zap className="h-4 w-4" /> Premium Motorcycle Rental in Butuan
                            </div>
                            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                                Ride the City
                                <br />
                                <span className="text-primary">Your Way</span>
                            </h1>
                            <p className="mb-8 max-w-lg text-lg text-muted-foreground">
                                Explore Butuan City with our premium fleet of motorcycles. Affordable daily rates, flexible pickup options, and top-notch customer service.
                            </p>

                            {/* Search Bar */}
                            <div className="mb-6 flex items-center gap-2 rounded-xl border bg-card p-2 shadow-lg">
                                <div className="flex flex-1 items-center gap-2 px-3">
                                    <Search className="h-5 w-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search by brand, model, or category..."
                                        className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Link
                                    href="/motorcycles"
                                    className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                                >
                                    Search
                                </Link>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-primary" />
                                    <span>Verified Units</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>Butuan City</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-primary" />
                                    <span>500+ Customers</span>
                                </div>
                            </div>
                        </div>

                        <div className="animate-fade-in-up delay-200 hidden lg:block">
                            <div className="relative">
                                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 to-primary/5 blur-2xl" />
                                <div className="relative rounded-2xl bg-card p-8 shadow-2xl">
                                    <div className="mb-6 flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">Available Now</h3>
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">30+ Units</span>
                                    </div>
                                    <div className="space-y-4">
                                        {motorcycles.slice(0, 3).map((bike) => (
                                            <div key={bike.id} className="flex items-center gap-4 rounded-xl border p-3 transition-colors hover:bg-muted/50">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 overflow-hidden">
                                                    {bike.image_path ? (
                                                        <img src={`/storage/${bike.image_path}`} alt={bike.model} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <Bike className="h-6 w-6 text-primary" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold">{bike.brand} {bike.model}</p>
                                                    <p className="text-xs text-muted-foreground">{bike.category} • {bike.year}</p>
                                                </div>
                                                <p className="text-sm font-bold text-primary">₱{Number(bike.daily_rate).toLocaleString()}/day</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative gradient blob */}
                <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
            </section>

            {/* ===== CATEGORIES ===== */}
            <section className="border-t bg-card py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <h2 className="mb-2 text-3xl font-bold tracking-tight">Browse by Category</h2>
                        <p className="text-muted-foreground">Find the perfect motorcycle for your needs</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                        {categories.map((cat, i) => (
                            <Link
                                key={cat.id}
                                href={`/motorcycles?category=${cat.id}`}
                                className={`animate-fade-in-up card-hover flex flex-col items-center gap-3 rounded-xl border bg-background p-6 text-center delay-${(i + 1) * 100}`}
                            >
                                <span className="text-3xl">{cat.icon}</span>
                                <div>
                                    <p className="font-semibold">{cat.name}</p>
                                    <p className="text-xs text-muted-foreground">{cat.count} units</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-2 text-3xl font-bold tracking-tight">How Rental Works</h2>
                        <p className="text-muted-foreground">Simple, secure, and straightforward process</p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-4">
                        {howItWorks.map((step, i) => (
                            <div key={step.step} className={`animate-fade-in-up delay-${(i + 1) * 100} relative text-center`}>
                                {i < howItWorks.length - 1 && (
                                    <div className="absolute right-0 top-8 hidden h-0.5 w-full translate-x-1/2 bg-gradient-to-r from-primary/30 to-primary/10 md:block" />
                                )}
                                <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                                    <step.icon className="h-7 w-7 text-primary" />
                                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                        {step.step}
                                    </span>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURED MOTORCYCLES ===== */}
            <section className="border-t bg-card py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex items-center justify-between">
                        <div>
                            <h2 className="mb-2 text-3xl font-bold tracking-tight">Featured Motorcycles</h2>
                            <p className="text-muted-foreground">Top-rated units ready for rental</p>
                        </div>
                        <Link
                            href="/motorcycles"
                            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
                        >
                            View all <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {motorcycles.map((bike, i) => (
                            <div key={bike.id} className={`animate-fade-in-up delay-${(i + 1) * 100} card-hover group overflow-hidden rounded-xl border bg-background`}>
                                <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 h-48 flex items-center justify-center overflow-hidden p-8">
                                    {bike.image_path ? (
                                        <img src={`/storage/${bike.image_path}`} alt={bike.model} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <Bike className="mx-auto h-20 w-20 text-primary/40 transition-transform group-hover:scale-110" />
                                    )}
                                    <span className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${bike.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {bike.status}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <div className="mb-1 flex items-center justify-between">
                                        <h3 className="font-semibold">{bike.brand} {bike.model}</h3>
                                        <span className="text-xs text-muted-foreground">{bike.year}</span>
                                    </div>
                                    <div className="mb-4 flex items-center gap-2">
                                        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{bike.category}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-bold text-primary">₱{Number(bike.daily_rate).toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/day</span></p>
                                        <Link
                                            href={`/motorcycles/${bike.id}`}
                                            className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 text-center sm:hidden">
                        <Link href="/motorcycles" className="text-sm font-medium text-primary hover:underline">
                            View all motorcycles →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className="py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <h2 className="mb-2 text-3xl font-bold tracking-tight">What Our Customers Say</h2>
                        <p className="text-muted-foreground">Real reviews from real riders</p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {testimonials.map((t, i) => (
                            <div key={i} className={`animate-fade-in-up delay-${(i + 1) * 100} rounded-xl border bg-card p-6 shadow-sm`}>
                                <div className="mb-3 flex gap-0.5">
                                    {Array.from({ length: t.rating }).map((_, j) => (
                                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="mb-4 text-sm text-muted-foreground">"{t.text}"</p>
                                <p className="text-sm font-semibold">— {t.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="border-t bg-gradient-to-r from-primary to-primary/80 py-16 text-primary-foreground sm:py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight">Ready to Ride?</h2>
                    <p className="mb-8 text-lg opacity-90">Create an account and submit your first rental request today.</p>
                    <div className="flex items-center justify-center gap-4">
                        <Link
                            href="/register"
                            className="rounded-xl bg-white px-8 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/motorcycles"
                            className="rounded-xl border border-white/30 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
                        >
                            Browse Bikes
                        </Link>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
