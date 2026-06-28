import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg';
  text?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  default: 'h-6 w-6',
  lg: 'h-8 w-8',
};

function LoadingSpinner({
  size = 'default',
  text,
  className,
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-2', className)}
      {...props}
    >
      <Loader2
        className={cn('animate-spin text-muted-foreground', sizeMap[size])}
      />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
}

LoadingSpinner.displayName = 'LoadingSpinner';

export { LoadingSpinner };
export type { LoadingSpinnerProps };
