import { cn } from '@/lib/utils';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 px-6 py-16 text-center', className)}>
            <div className="mb-4 rounded-full bg-primary/10 p-4">
                {icon || <FileQuestion className="h-8 w-8 text-primary" />}
            </div>
            <h3 className="mb-1 text-lg font-semibold">{title}</h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
            {action}
        </div>
    );
}
