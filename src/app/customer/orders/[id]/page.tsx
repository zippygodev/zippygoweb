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
  CheckCircle2,
  Clock,
  CookingPot,
  Package,
  Bike,
  Utensils,
  XCircle,
  Phone,
  MapPin,
  RefreshCw,
  ChevronLeft,
  Copy,
  Check,
  Ban,
  Wallet,
} from 'lucide-react';
import { getOrderById } from '@/actions/customer/orders';
import toast from 'react-hot-toast';

const statusIcons: Record<string, typeof CookingPot> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle2,
  PREPARING: CookingPot,
  READY: Package,
  OUT_FOR_DELIVERY: Bike,
  DELIVERED: Utensils,
  CANCELLED: Package,
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const id = params['id'] as string;

  const fetchOrder = async () => {
    try {
      const res = await getOrderById(id);
      if (res.success && res.data) {
        setOrder(res.data);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleCopyOrder = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    toast.success('Order number copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-44 w-full rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4">
        <ErrorState
          title="Order not found"
          description="The order details could not be retrieved."
          onRetry={() => router.push('/customer/orders')}
        />
      </div>
    );
  }

  // Generate dynamic timeline based on DB status
  const statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED'];
  const statusLabels: Record<string, string> = {
    PENDING: 'Order Placed',
    CONFIRMED: 'Confirmed',
    PREPARING: 'Preparing',
    READY: 'Ready for Collection',
    DELIVERED: 'Delivered',
  };
  const currentStatusIdx = statuses.indexOf(order.status);
  const timeline = statuses.map((s, idx) => ({
    status: statusLabels[s] || s,
    time: idx <= currentStatusIdx ? new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending',
    completed: idx <= currentStatusIdx,
  }));

  if (order.status === 'CANCELLED') {
    timeline.push({
      status: 'Cancelled',
      time: new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completed: true,
    });
  }

  return (
    <div className="pb-8">
      {/* Cover Header */}
      <div className="relative h-40 overflow-hidden bg-muted">
        {order.restaurant?.logoUrl && (
          <img src={order.restaurant.logoUrl} alt={order.restaurant.name} className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-lg font-bold text-white">{order.restaurant?.name || 'Restaurant'}</h1>
          <p className="text-sm text-white/80">{order.restaurant?.cuisineType || 'Cuisine'}</p>
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
          <span>{formatDate(order.createdAt, 'long')}</span>
          <span className="text-sm font-bold text-primary">{formatCurrency(Number(order.total))}</span>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="mx-4 mt-4 rounded-xl border bg-card p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Order Status</h3>
        <div className="relative">
          <div className="absolute left-[11px] top-2 h-[calc(100%-24px)] w-0.5 bg-muted" />
          <div className="space-y-5">
            {timeline.map((step, i) => {
              const isCompleted = step.completed;
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
          <span className="text-sm font-semibold">Items ({order.items?.length || 0})</span>
          <span className="text-xs text-muted-foreground">{order.deliveryType === 'TABLE' ? `Table ${order.tableNumber}` : order.deliveryType}</span>
        </div>
        <div className="divide-y">
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                {item.product?.imageUrl && (
                  <img src={item.product.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">x{item.quantity} {item.variantName ? `• ${item.variantName}` : ''}</p>
                </div>
                <span className="shrink-0 text-sm font-medium">{formatCurrency(Number(item.totalPrice))}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment & Summary */}
      <div className="mx-4 mt-4 rounded-xl border bg-card p-4 shadow-sm space-y-3">
        <h3 className="text-sm font-semibold">Payment Details</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Payment Method</span>
          <span className="font-medium text-foreground">{order.paymentMethod}</span>
        </div>
        <Separator />
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between">
            <span>GST / Taxes (5%)</span>
            <span>{formatCurrency(Number(order.gst))}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>{formatCurrency(Number(order.deliveryFee))}</span>
          </div>
          {Number(order.discount) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(Number(order.discount))}</span>
            </div>
          )}
        </div>
        <Separator />
        <div className="flex items-center justify-between text-sm font-bold">
          <span>Total Amount</span>
          <span className="text-primary">{formatCurrency(Number(order.total))}</span>
        </div>
      </div>
    </div>
  );
}
