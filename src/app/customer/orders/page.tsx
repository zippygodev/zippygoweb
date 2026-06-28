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
  Store,
  Bike,
  Utensils,
  Clock,
  Package,
  CheckCircle2,
  CookingPot,
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  restaurant: string;
  restaurantLogo: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  type: 'PICKUP' | 'TABLE' | 'ROBOT';
  date: string;
  tableNumber?: string;
}

const orders: Order[] = [
  {
    id: '1',
    orderNumber: 'ZG-2A3B-4C5D',
    restaurant: 'Pizza Palace',
    restaurantLogo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop',
    items: [
      { name: 'Margherita Pizza', quantity: 2, price: 349 },
      { name: 'Garlic Breadsticks', quantity: 1, price: 149 },
    ],
    total: 889.55,
    status: 'PREPARING',
    type: 'TABLE',
    date: '2024-03-15T18:30:00Z',
    tableNumber: '12',
  },
  {
    id: '2',
    orderNumber: 'ZG-4E5F-6G7H',
    restaurant: 'Sushi Master',
    restaurantLogo: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop',
    items: [
      { name: 'California Roll', quantity: 1, price: 449 },
      { name: 'Salmon Nigiri', quantity: 2, price: 399 },
    ],
    total: 1310.85,
    status: 'DELIVERED',
    type: 'PICKUP',
    date: '2024-03-14T13:00:00Z',
  },
  {
    id: '3',
    orderNumber: 'ZG-8I9J-0K1L',
    restaurant: 'Burger Barn',
    restaurantLogo: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=100&h=100&fit=crop',
    items: [
      { name: 'Double Cheeseburger', quantity: 1, price: 249 },
      { name: 'French Fries', quantity: 1, price: 99 },
      { name: 'Coke', quantity: 2, price: 59 },
    ],
    total: 487.15,
    status: 'CANCELLED',
    type: 'ROBOT',
    date: '2024-03-13T19:45:00Z',
  },
  {
    id: '4',
    orderNumber: 'ZG-2M3N-4O5P',
    restaurant: 'Sweet Tooth',
    restaurantLogo: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=100&h=100&fit=crop',
    items: [
      { name: 'Chocolate Lava Cake', quantity: 2, price: 199 },
    ],
    total: 417.9,
    status: 'DELIVERED',
    type: 'PICKUP',
    date: '2024-03-12T15:20:00Z',
  },
  {
    id: '5',
    orderNumber: 'ZG-6Q7R-8S9T',
    restaurant: 'Tandoori Nights',
    restaurantLogo: 'https://images.unsplash.com/photo-1601050690597-df0568f7095c?w=100&h=100&fit=crop',
    items: [
      { name: 'Butter Chicken', quantity: 1, price: 399 },
      { name: 'Naan', quantity: 3, price: 49 },
      { name: 'Biryani', quantity: 1, price: 299 },
    ],
    total: 841.55,
    status: 'CONFIRMED',
    type: 'TABLE',
    date: '2024-03-15T20:00:00Z',
    tableNumber: '5',
  },
];

const statusIcons: Record<string, typeof CookingPot> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle2,
  PREPARING: CookingPot,
  READY: Package,
  OUT_FOR_DELIVERY: Bike,
  DELIVERED: Utensils,
  CANCELLED: Package,
};

function OrderCard({ order, index }: { order: Order; index: number }) {
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
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
            <img src={order.restaurantLogo} alt={order.restaurant} className="h-full w-full object-cover" />
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{order.restaurant}</p>
              <p className="truncate text-xs text-muted-foreground">
                {order.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
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
            {order.type === 'TABLE' && order.tableNumber && (
              <Badge variant="outline" className="text-xs">Table {order.tableNumber}</Badge>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">{formatCurrency(order.total)}</p>
            <p className="text-xs text-muted-foreground">{formatDate(order.date, 'short')}</p>
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
  const touchStart = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const activeOrders = orders.filter((o) => !['DELIVERED', 'CANCELLED'].includes(o.status));
  const pastOrders = orders.filter((o) => ['DELIVERED', 'CANCELLED'].includes(o.status));

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
