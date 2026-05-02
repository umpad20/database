import { Bike } from 'lucide-react';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-1.5">
                <Bike className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">MotoRent</span>
                <span className="truncate text-xs text-muted-foreground">Butuan</span>
            </div>
        </div>
    );
}
