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
    id: number;
    name: string;
    description: string | null;
}

export interface Motorcycle {
    id: number;
    brand: string;
    model: string;
    category_id: number | null;
    daily_rate: number;
    status: string;
    image_path?: string | null;
    plate_number: string;
    engine_no: string;
    chassis_no: string;
    year: number;
    color: string;
    created_at?: string;
    updated_at?: string;
    category?: Category;
}

export interface Customer {
    id: number;
    user_id: number;
    middle_name: string | null;
    gender: string | null;
    date_of_birth: string | null;
    phone: string | null;
    address: string | null;
    license_number: string | null;
    license_expiry_date: string | null;
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
    payment?: Payment;
}

export interface Payment {
    id: number;
    rental_id: number;
    amount: number;
    method: string;
    status: string;
    transaction_id: string | null;
    paid_at: string | null;
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
