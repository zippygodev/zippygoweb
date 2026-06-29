'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import {
  ClipboardList,
  RefreshCw,
  ChevronRight,
  Bike,
  Utensils,
  Clock,
  Package,
  CheckCircle2,
  CookingPot,
} from 'lucide-react';
import { getMyOrders } from '@/actions/customer/orders';

const statusIcons: Record<string, typeof CookingPot> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle2,
  PREPARING: CookingPot,
  READY: Package,
  OUT_FOR_DELIVERY: Bike,
  DELIVERED: Utensils,
  CANCELLED: Package,
};

function OrderCard({ order, index }: { order: any; index: number }) {
  const router = useRouter();
  const StatusIcon = statusIcons[order.status] || Package;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(`/customer/orders/${order.id}`)}
      className="w-full overflow-hidden rounded-xl border bg-card text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted">
            {order.restaurant?.logoUrl && (
              <img src={order.restaurant.logoUrl} alt={order.restaurant.name} className="h-full w-full object-cover" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{order.restaurant?.name || 'Restaurant'}</p>
              <p className="truncate text-xs text-muted-foreground">
                {order.items.map((i: any) => `${i.productName} x${i.quantity}`).join(', ')}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={cn('gap-1', getStatusColor(order.status))}>
              <StatusIcon className="h-3 w-3" />
              {order.status.replace(/_/g, ' ')}
            </Badge>
            {order.deliveryType === 'TABLE' && order.tableNumber && (
              <Badge variant="outline" className="text-xs">Table {order.tableNumber}</Badge>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">{formatCurrency(Number(order.total))}</p>
            <p className="text-xs text-muted-foreground">{formatDate(order.createdAt, 'short')}</p>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const touchStart = useRef(0);

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const activeOrders = orders.filter((o) => !['DELIVERED', 'CANCELLED', 'COMPLETED'].includes(o.status));
  const pastOrders = orders.filter((o) => ['DELIVERED', 'CANCELLED', 'COMPLETED'].includes(o.status));

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-6 w-24 rounded-full" />
              <div className="space-y-1 text-right">
                <Skeleton className="ml-auto h-4 w-16" />
                <Skeleton className="ml-auto h-3 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="px-4 pt-8">
        <EmptyState
          icon={<ClipboardList className="h-12 w-12" />}
          title="No orders yet"
          description="Your order history will appear here once you place your first order."
          action={{ label: 'Browse Restaurants', onClick: () => router.push('/customer/restaurants') }}
        />
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div
        onTouchStart={(e) => { touchStart.current = e.touches[0]?.clientY ?? 0; }}
        onTouchEnd={(e) => {
          const diff = touchStart.current - (e.changedTouches[0]?.clientY ?? 0);
          if (diff < -80) handleRefresh();
        }}
      >
        {refreshing && (
          <div className="flex items-center justify-center py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Refreshing...
            </div>
          </div>
        )}

        <div className="px-4 pt-4">
          {activeOrders.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Active Orders ({activeOrders.length})
              </h2>
              {activeOrders.map((order, i) => (
                <OrderCard key={order.id} order={order} index={i} />
              ))}
            </div>
          )}

          <div className={cn('space-y-3', activeOrders.length > 0 && 'mt-6')}>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Past Orders ({pastOrders.length})
            </h2>
            {pastOrders.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No past orders yet</p>
            ) : (
              pastOrders.map((order, i) => (
                <OrderCard key={order.id} order={order} index={i} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
