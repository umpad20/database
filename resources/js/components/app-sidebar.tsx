import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Banknote, BarChart3, Bike, ClipboardList, FolderOpen, History, LayoutGrid, UserCircle, Users, Wrench } from 'lucide-react';

// Admin/Staff navigation
const adminNavItems: NavItem[] = [
    { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutGrid },
    { title: 'Fleet Management', url: '/admin/motorcycles', icon: Bike },
    { title: 'Rentals', url: '/admin/rentals', icon: ClipboardList },
    { title: 'Payments', url: '/admin/payments', icon: Banknote },
    { title: 'Maintenance', url: '/admin/maintenance', icon: Wrench },

    { title: 'Customers', url: '/admin/customers', icon: UserCircle },
    { title: 'Categories', url: '/admin/categories', icon: FolderOpen },
    { title: 'Reports', url: '/admin/reports', icon: BarChart3 },
];

// Customer navigation
const customerNavItems: NavItem[] = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutGrid },
    { title: 'Browse Bikes', url: '/motorcycles', icon: Bike },
    { title: 'My Rentals', url: '/rentals/create', icon: ClipboardList },
    { title: 'Rental History', url: '/rentals/history', icon: History },
    { title: 'My Profile', url: '/settings/profile', icon: UserCircle },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const userRole = (auth?.user as any)?.role || 'customer';
    const isAdmin = userRole === 'admin';
    const navItems = isAdmin ? adminNavItems : customerNavItems;
    const homeUrl = isAdmin ? '/admin/dashboard' : '/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeUrl} prefetch>
                                <div className="flex items-center gap-2">
                                    <div className="rounded-lg bg-primary p-1.5">
                                        <Bike className="h-4 w-4 text-primary-foreground" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">MotoRent</span>
                                        <span className="truncate text-xs text-muted-foreground">Butuan</span>
                                    </div>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
