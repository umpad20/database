import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: { children: React.ReactNode; breadcrumbs?: BreadcrumbItem[] }) {
    const { flash } = usePage().props as any;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                
                {/* Flash Messages */}
                {visible && (flash?.success || flash?.error) && (
                    <div className="fixed top-4 right-4 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className={`flex items-center gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md ${
                            flash.success ? 'bg-green-50/90 border-green-200 text-green-800' : 'bg-red-50/90 border-red-200 text-red-800'
                        }`}>
                            {flash.success ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                            <p className="text-sm font-semibold">{flash.success || flash.error}</p>
                            <button onClick={() => setVisible(false)} className="ml-2 hover:opacity-70 transition-opacity">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                {children}
            </AppContent>
        </AppShell>
    );
}
