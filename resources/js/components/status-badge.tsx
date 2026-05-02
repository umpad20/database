import { cn } from '@/lib/utils';

type StatusType =
    | 'available'
    | 'rented'
    | 'under_maintenance'
    | 'reserved'
    | 'inactive'
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'awaiting_payment'
    | 'paid'
    | 'active'
    | 'returned'
    | 'cancelled'
    | 'failed'
    | 'refunded'
    | 'scheduled'
    | 'in_progress'
    | 'completed'
    | 'blocked';

const statusConfig: Record<StatusType, { label: string; className: string }> = {
    available: { label: 'Available', className: 'bg-green-100 text-green-700 border-green-200' },
    rented: { label: 'Rented', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    under_maintenance: { label: 'Maintenance', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    reserved: { label: 'Reserved', className: 'bg-purple-100 text-purple-700 border-purple-200' },
    inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-600 border-gray-200' },
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    approved: { label: 'Approved', className: 'bg-green-100 text-green-700 border-green-200' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 border-red-200' },
    awaiting_payment: { label: 'Awaiting Payment', className: 'bg-amber-100 text-amber-700 border-amber-200' },
    paid: { label: 'Paid', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    active: { label: 'Active', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    returned: { label: 'Returned', className: 'bg-slate-100 text-slate-700 border-slate-200' },
    cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-600 border-gray-200' },
    failed: { label: 'Failed', className: 'bg-red-100 text-red-700 border-red-200' },
    refunded: { label: 'Refunded', className: 'bg-violet-100 text-violet-700 border-violet-200' },
    scheduled: { label: 'Scheduled', className: 'bg-sky-100 text-sky-700 border-sky-200' },
    in_progress: { label: 'In Progress', className: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    completed: { label: 'Completed', className: 'bg-green-100 text-green-700 border-green-200' },
    blocked: { label: 'Blocked', className: 'bg-red-100 text-red-700 border-red-200' },
};

interface StatusBadgeProps {
    status: StatusType | string;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const normalizedStatus = typeof status === 'string' 
        ? status.toLowerCase().replace(' ', '_') as StatusType 
        : status;
    
    const config = statusConfig[normalizedStatus] || { label: status, className: 'bg-gray-100 text-gray-600 border-gray-200' };

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
                config.className,
                className,
            )}
        >
            <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', config.className.includes('green') ? 'bg-green-500' : config.className.includes('blue') ? 'bg-blue-500' : config.className.includes('red') ? 'bg-red-500' : config.className.includes('yellow') || config.className.includes('amber') ? 'bg-amber-500' : config.className.includes('orange') ? 'bg-orange-500' : config.className.includes('purple') || config.className.includes('violet') ? 'bg-purple-500' : 'bg-gray-400')} />
            {config.label}
        </span>
    );
}
