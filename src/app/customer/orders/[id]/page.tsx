'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  CheckCircle2,
  Clock,
  CookingPot,
  Package,
  Bike,
  Utensils,
  XCircle,
  Phone,
  MapPin,
  Store,
  QrCode,
  RefreshCw,
  ChevronLeft,
  Copy,
  Check,
  Ban,
  Wallet,
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  restaurant: string;
  restaurantImage: string;
  cuisine: string;
  location: string;
  phone: string;
  items: { name: string; quantity: number; price: number; image: string; variant: string }[];
  total: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  status: string;
  type: 'PICKUP' | 'TABLE' | 'ROBOT';
  date: string;
  tableNumber?: string;
  paymentMethod: string;
  timeline: { status: string; time: string; completed: boolean }[];
}

const orderData: Record<string, Order> = {
  '1': {
    id: '1',
    orderNumber: 'ZG-2A3B-4C5D',
    restaurant: 'Pizza Palace',
    restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=200&fit=crop',
    cuisine: 'Italian • Pizza',
    location: 'Food Court, Level 2, Stall 12',
    phone: '+91 98765 43210',
    items: [
      { name: 'Margherita Pizza', quantity: 2, price: 349, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&h=100&fit=crop', variant: 'Large' },
      { name: 'Garlic Breadsticks', quantity: 1, price: 149, image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa125d2?w=100&h=100&fit=crop', variant: '8 Pcs' },
      { name: 'Coke (500ml)', quantity: 2, price: 59, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=100&h=100&fit=crop', variant: 'Regular' },
    ],
    total: 997.55,
    subtotal: 965,
    tax: 48.25,
    deliveryFee: 0,
    discount: 15.7,
    status: 'PREPARING',
    type: 'TABLE',
    date: '2024-03-15T18:30:00Z',
    tableNumber: '12',
    paymentMethod: 'Razorpay (UPI)',
    timeline: [
      { status: 'Order Placed', time: '6:30 PM', completed: true },
      { status: 'Confirmed', time: '6:32 PM', completed: true },
      { status: 'Preparing', time: '6:35 PM', completed: true },
      { status: 'Ready', time: 'Est. 7:00 PM', completed: false },
      { status: 'Delivered', time: 'Pending', completed: false },
    ],
  },
  '2': {
    id: '2',
    orderNumber: 'ZG-4E5F-6G7H',
    restaurant: 'Sushi Master',
    restaurantImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=200&fit=crop',
    cuisine: 'Japanese • Sushi',
    location: 'Food Court, Level 1, Stall 5',
    phone: '+91 98765 43211',
    items: [
      { name: 'California Roll', quantity: 1, price: 449, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop', variant: '12 Pcs' },
      { name: 'Salmon Nigiri', quantity: 2, price: 399, image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=100&h=100&fit=crop', variant: '4 Pcs' },
    ],
    total: 1310.85,
    subtotal: 1247,
    tax: 62.35,
    deliveryFee: 0,
    discount: 0,
    status: 'DELIVERED',
    type: 'PICKUP',
    date: '2024-03-14T13:00:00Z',
    paymentMethod: 'Cash on Delivery',
    timeline: [
      { status: 'Order Placed', time: '1:00 PM', completed: true },
      { status: 'Confirmed', time: '1:02 PM', completed: true },
      { status: 'Preparing', time: '1:05 PM', completed: true },
      { status: 'Ready', time: '1:25 PM', completed: true },
      { status: 'Picked Up', time: '1:30 PM', completed: true },
    ],
  },
};

const statusIcons: Record<string, typeof Clock> = {
  'Order Placed': Clock,
  Confirmed: CheckCircle2,
  Preparing: CookingPot,
  Ready: Package,
  'Picked Up': Utensils,
  Delivered: Utensils,
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [copied, setCopied] = useState(false);

  const order = orderData[params['id'] as string];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCancel = () => {
    setCancelling(true);
    setTimeout(() => {
      setCancelling(false);
      setShowCancelDialog(false);
    }, 1500);
  };

  const handleReorder = () => {
    router.push(`/customer/restaurants/${order?.id}`);
  };

  const handleCopyOrder = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4">
        <ErrorState
          title="Order not found"
          description="We couldn't find this order. It may have been removed."
          onRetry={() => router.push('/customer/orders')}
        />
      </div>
    );
  }

  const isActive = !['DELIVERED', 'CANCELLED'].includes(order.status);
  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);

  return (
    <div className="pb-8">
      {/* Restaurant Header */}
      <div className="relative h-40 overflow-hidden">
        <img src={order.restaurantImage} alt={order.restaurant} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-lg font-bold text-white">{order.restaurant}</h1>
          <p className="text-sm text-white/80">{order.cuisine}</p>
        </div>
      </div>

      {/* Order Info */}
      <div className="mx-4 -mt-6 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Order Number</p>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold">{order.orderNumber}</p>
              <button onClick={handleCopyOrder} className="text-muted-foreground hover:text-foreground">
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <Badge className={cn('gap-1', getStatusColor(order.status))}>
            {order.status.replace(/_/g, ' ')}
          </Badge>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatDate(order.date, 'long')}</span>
          <span className="text-sm font-bold text-primary">{formatCurrency(order.total)}</span>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="mx-4 mt-4 rounded-xl border bg-card p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Order Status</h3>
        <div className="relative">
          <div className="absolute left-[11px] top-2 h-[calc(100%-24px)] w-0.5 bg-muted" />
          <div className="space-y-5">
            {order.timeline.map((step, i) => {
              const Icon = statusIcons[step.status] || Clock;
              const isCompleted = step.completed;
              const isLast = i === order.timeline.length - 1;
              return (
                <div key={step.status} className="flex items-start gap-3">
                  <div
                    className={cn(
                      'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                      isCompleted
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        isCompleted ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {step.status}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mx-4 mt-4 overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2.5">
          <span className="text-sm font-semibold">Items ({order.items.length})</span>
          <span className="text-xs text-muted-foreground">{order.type === 'TABLE' ? `Table ${order.tableNumber}` : order.type}</span>
        </div>
        <div className="divide-y">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">x{item.quantity} • {item.variant}</p>
                </div>
                <span className="shrink-0 text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="mx-4 mt-4 space-y-2 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{order.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{order.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{order.paymentMethod}</span>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="mx-4 mt-4 rounded-xl border bg-card p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>{order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* QR Code for Pickup */}
      {order.type === 'PICKUP' && (
        <div className="mx-4 mt-4 flex flex-col items-center rounded-xl border bg-card p-6 shadow-sm">
          <QrCode className="h-24 w-24 text-primary" />
          <p className="mt-3 text-sm font-medium">Show this code at pickup</p>
          <p className="text-xs text-muted-foreground">{order.orderNumber}</p>
        </div>
      )}

      {/* Actions */}
      <div className="mx-4 mt-6 flex gap-3">
        <Button
          variant="outline"
          className="flex-1 rounded-xl"
          onClick={handleReorder}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reorder
        </Button>
        {canCancel && (
          <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1 rounded-xl">
                <Ban className="mr-2 h-4 w-4" />
                Cancel Order
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this order? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Keep Order</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
