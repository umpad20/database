import { Link, usePage } from '@inertiajs/react';
import { Bike, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface GuestLayoutProps {
    children: React.ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { auth } = usePage<any>().props;

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <header className="glass sticky top-0 z-50 border-b">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="rounded-lg bg-primary p-1.5">
                            <Bike className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">MotoRent <span className="text-primary">Butuan</span></span>
                    </Link>

                    {/* Desktop Navigation */}
                    {!auth?.user && (
                        <nav className="hidden items-center gap-6 md:flex">
                            <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                                Home
                            </Link>
                            <Link href="/motorcycles" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                                Browse Bikes
                            </Link>
                            <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                                About
                            </Link>
                            <Link href="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                                Contact
                            </Link>
                        </nav>
                    )}

                    <div className="hidden items-center gap-3 md:flex">
                        {auth?.user ? (
                            <Link
                                href={auth.user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="rounded-lg p-2 md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="border-t bg-card p-4 md:hidden">
                        <nav className="flex flex-col gap-3">
                            {!auth?.user && (
                                <>
                                    <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">Home</Link>
                                    <Link href="/motorcycles" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">Browse Bikes</Link>
                                    <Link href="/about" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">About</Link>
                                    <Link href="/contact" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">Contact</Link>
                                    <hr className="my-2" />
                                </>
                            )}
                            {auth?.user ? (
                                <Link href={auth.user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground">Dashboard</Link>
                            ) : (
                                <>
                                    <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">Log in</Link>
                                    <Link href="/register" className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground">Sign up</Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t bg-card">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <div className="rounded-lg bg-primary p-1.5">
                                    <Bike className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <span className="text-lg font-bold">MotoRent Butuan</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Premium motorcycle rental service in Butuan City. Ride with confidence and style.
                            </p>
                        </div>
                        <div>
                            <h4 className="mb-3 text-sm font-semibold">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/motorcycles" className="hover:text-primary">Browse Bikes</Link></li>
                                <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                                <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-3 text-sm font-semibold">Categories</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>Scooter</li>
                                <li>Automatic</li>
                                <li>Manual</li>
                                <li>Big Bike</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-3 text-sm font-semibold">Contact</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>Butuan City, Philippines</li>
                                <li>motorent@example.com</li>
                                <li>+63 912 345 6789</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                        © 2026 MotoRent Butuan. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
