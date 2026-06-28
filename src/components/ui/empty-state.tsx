import * as React from 'react';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        className
      )}
      {...props}
    >
      <div className="mb-4 rounded-full bg-muted p-4">
        {icon || <Inbox className="h-10 w-10 text-muted-foreground" />}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}

EmptyState.displayName = 'EmptyState';

export { EmptyState };
export type { EmptyStateProps };
