import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role?: 'admin' | 'customer';
    [key: string]: unknown;
}

// ===== ERD ENTITY TYPES =====

export interface Category {
    category_id: number;
    category_name: string;
}

export interface Motorcycle {
    id: number;
    brand: string;
    model: string;
    category: string;
    daily_rate: number;
    status: string;
    image_path?: string | null;
    plate_number: string;
    year: number;
    created_at?: string;
    updated_at?: string;
}

export interface Customer {
    id: number;
    user_id: number;
    phone: string | null;
    address: string | null;
    license_number: string | null;
    created_at?: string;
    updated_at?: string;
    user?: User;
}

export interface Admin {
    admin_id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    created_at?: string;
    updated_at?: string;
}

export interface Rental {
    id: number;
    customer_id: number;
    motorcycle_id: number;
    start_date: string;
    end_date: string;
    total_amount: number;
    status: string;
    created_at?: string;
    updated_at?: string;
    customer?: Customer;
    motorcycle?: Motorcycle;
}

export interface Payment {
    payment_id: number;
    rental_id: number;
    payment_date: string;
    payment_method: 'cash' | 'gcash' | 'bank_transfer' | 'cod';
    amount: number;
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    rental?: Rental;
}

export interface Maintenance {
    maintenance_id: number;
    motorcycle_id: number;
    admin_id: number;
    service_date: string;
    maintenance_type: 'oil_change' | 'tire_replacement' | 'brake_repair' | 'engine_check' | 'cleaning' | 'inspection' | 'accident_repair';
    cost: number;
    description?: string;
    next_service_date?: string;
    status?: 'scheduled' | 'in_progress' | 'completed';
    motorcycle?: Motorcycle;
    admin?: Admin;
}

// ===== PAGE PROPS =====
export interface PageProps {
    auth: Auth;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}
