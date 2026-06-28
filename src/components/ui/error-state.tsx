import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  error?: Error | null;
  onRetry?: () => void;
}

function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  error,
  onRetry,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        className
      )}
      {...props}
    >
      <div className="mb-4 rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {error && (
        <p className="mb-4 max-w-sm text-xs text-muted-foreground">
          {error.message}
        </p>
      )}
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </div>
  );
}

ErrorState.displayName = 'ErrorState';

export { ErrorState };
export type { ErrorStateProps };
