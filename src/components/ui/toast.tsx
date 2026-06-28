import { toast as sonnerToast } from 'sonner';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
};

function toast({ title, description, variant = 'default' }: ToastProps) {
  const options = { description };

  switch (variant) {
    case 'destructive':
      sonnerToast.error(title, options);
      break;
    case 'success':
      sonnerToast.success(title, options);
      break;
    case 'warning':
      sonnerToast.warning(title, options);
      break;
    default:
      sonnerToast(title, options);
  }
}

function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

export { toast, useToast };
export type { ToastProps };
