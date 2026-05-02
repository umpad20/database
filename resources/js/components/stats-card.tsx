import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    className?: string;
}

export function StatsCard({ title, value, description, icon: Icon, trend, trendValue, className }: StatsCardProps) {
    return (
        <div className={cn('card-hover rounded-xl border bg-card p-6 shadow-sm', className)}>
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold tracking-tight">{value}</p>
                    {description && <p className="text-xs text-muted-foreground">{description}</p>}
                    {trend && trendValue && (
                        <div className="flex items-center gap-1 pt-1">
                            <span
                                className={cn(
                                    'text-xs font-medium',
                                    trend === 'up' && 'text-green-600',
                                    trend === 'down' && 'text-red-500',
                                    trend === 'neutral' && 'text-muted-foreground',
                                )}
                            >
                                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
                            </span>
                        </div>
                    )}
                </div>
                <div className="rounded-xl bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
            </div>
        </div>
    );
}
