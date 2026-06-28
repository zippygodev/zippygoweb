'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/toast';
import {
  Clock,
  ChefHat,
  CheckCircle2,
  Timer,
  MessageSquare,
  AlertCircle,
  Play,
  Utensils,
  ArrowRight,
  Coffee,
  Flame,
  Snowflake,
  BellRing,
  User,
} from 'lucide-react';

interface KitchenOrderItem {
  name: string;
  quantity: number;
  variant?: string;
  note?: string;
}

interface KitchenOrder {
  id: string;
  orderNumber: string;
  table: string;
  items: KitchenOrderItem[];
  status: 'PENDING' | 'PREPARING' | 'READY';
  elapsed: number;
  priority: 'normal' | 'rush' | 'delayed';
  timerStartedAt: number;
  notes?: string;
}

const orderPool: KitchenOrder[] = [
  { id: '1', orderNumber: 'ZG-7A8B', table: 'Table 5', items: [{ name: 'Butter Chicken', quantity: 2, note: 'Extra creamy' }, { name: 'Naan', quantity: 4 }, { name: 'Dal Makhani', quantity: 1 }], status: 'PENDING', elapsed: 5, priority: 'normal', timerStartedAt: Date.now() - 300000 },
  { id: '2', orderNumber: 'ZG-9C0D', table: 'Table 2', items: [{ name: 'Paneer Tikka', quantity: 1 }, { name: 'Biryani', quantity: 1 }], status: 'PENDING', elapsed: 12, priority: 'rush', timerStartedAt: Date.now() - 720000 },
  { id: '3', orderNumber: 'ZG-1E2F', table: 'Takeaway #4', items: [{ name: 'Chicken Tandoori', quantity: 1 }, { name: 'Naan Combo', quantity: 2 }, { name: 'Raita', quantity: 1 }], status: 'PREPARING', elapsed: 8, priority: 'normal', timerStartedAt: Date.now() - 480000 },
  { id: '4', orderNumber: 'ZG-3G4H', table: 'Table 3', items: [{ name: 'Chicken Curry', quantity: 2 }, { name: 'Rice', quantity: 3 }, { name: 'Gulab Jamun', quantity: 3 }], status: 'PREPARING', elapsed: 15, priority: 'delayed', timerStartedAt: Date.now() - 900000, notes: 'No onions in curry' },
  { id: '5', orderNumber: 'ZG-8M9N', table: 'Table 1', items: [{ name: 'Naan Combo', quantity: 3 }, { name: 'Dal Makhani', quantity: 1 }, { name: 'Mix Veg', quantity: 1 }], status: 'PREPARING', elapsed: 3, priority: 'normal', timerStartedAt: Date.now() - 180000 },
  { id: '6', orderNumber: 'ZG-0P1Q', table: 'Table 4', items: [{ name: 'Paneer Lababdar', quantity: 1 }, { name: 'Butter Naan', quantity: 2 }], status: 'READY', elapsed: 2, priority: 'normal', timerStartedAt: Date.now() - 120000 },
  { id: '7', orderNumber: 'ZG-2R3S', table: 'Table 7', items: [{ name: 'Biryani', quantity: 2 }, { name: 'Raita', quantity: 2 }], status: 'READY', elapsed: 5, priority: 'normal', timerStartedAt: Date.now() - 300000 },
  { id: '8', orderNumber: 'ZG-4T5U', table: 'Delivery #2', items: [{ name: 'Chicken Curry', quantity: 1 }, { name: 'Rice', quantity: 2 }], status: 'PENDING', elapsed: 8, priority: 'normal', timerStartedAt: Date.now() - 480000 },
];

const priorityConfig = {
  normal: { border: 'border-l-transparent', bg: '' },
  rush: { border: 'border-l-red-500', bg: 'bg-red-50 dark:bg-red-950/20' },
  delayed: { border: 'border-l-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
};

function TimerDisplay({ startTime }: { startTime: number }) {
  const [elapsed, setElapsed] = useState('0:00');

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - startTime) / 1000);
      const mins = Math.floor(diff / 60);
      const secs = diff % 60;
      setElapsed(`${mins}:${secs.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const diff = Math.floor((Date.now() - startTime) / 60000);
  const isUrgent = diff > 15;

  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-mono font-medium', isUrgent ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground')}>
      <Timer className="h-3 w-3" />
      {elapsed}
    </span>
  );
}

function KitchenOrderCard({ order, onStatusUpdate }: { order: KitchenOrder; onStatusUpdate: (id: string, status: KitchenOrder['status']) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const priority = priorityConfig[order.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'rounded-xl border-l-4 bg-card p-4 shadow-sm transition-all hover:shadow-md',
        order.status === 'PENDING' && 'border-l-yellow-500',
        order.status === 'PREPARING' && 'border-l-blue-500',
        order.status === 'READY' && 'border-l-green-500',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-bold">{order.orderNumber}</span>
            {order.priority === 'rush' && (
              <Badge variant="warning" className="text-[10px]">
                <Flame className="mr-1 h-3 w-3" />
                Rush
              </Badge>
            )}
            {order.priority === 'delayed' && (
              <Badge variant="destructive" className="text-[10px]">
                <AlertCircle className="mr-1 h-3 w-3" />
                Delayed
              </Badge>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Utensils className="h-3.5 w-3.5" />
            <span>{order.table}</span>
          </div>
        </div>
        <TimerDisplay startTime={order.timerStartedAt} />
      </div>

      <div className="mt-3 space-y-1.5">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-medium">
                {item.quantity}
              </span>
              <span className="truncate">{item.name}</span>
              {item.variant && (
                <span className="text-xs text-muted-foreground">({item.variant})</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="mt-2 flex items-start gap-1.5 rounded-md bg-amber-50 p-2 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          <MessageSquare className="mt-0.5 h-3 w-3 shrink-0" />
          <span>{order.notes}</span>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        {order.status === 'PENDING' && (
          <Button size="sm" className="h-8 w-full" onClick={() => onStatusUpdate(order.id, 'PREPARING')}>
            <Play className="mr-1 h-3.5 w-3.5" />
            Start Cooking
          </Button>
        )}
        {order.status === 'PREPARING' && (
          <Button size="sm" className="h-8 w-full" onClick={() => onStatusUpdate(order.id, 'READY')}>
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            Mark as Ready
          </Button>
        )}
        {order.status === 'READY' && (
          <div className="flex w-full items-center gap-2 rounded-lg bg-green-50 p-2 dark:bg-green-950/30">
            <BellRing className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">Ready for pickup</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>(orderPool);

  const handleStatusUpdate = (id: string, newStatus: KitchenOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status: newStatus, timerStartedAt: newStatus === 'PREPARING' ? Date.now() : o.timerStartedAt }
          : o
      )
    );
    toast({
      title: 'Order Updated',
      description: `Order status changed to ${newStatus}`,
      variant: 'success',
    });
  };

  const columns = [
    { title: 'Pending', status: 'PENDING' as const, icon: Clock, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-950/20' },
    { title: 'Preparing', status: 'PREPARING' as const, icon: ChefHat, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20' },
    { title: 'Ready', status: 'READY' as const, icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/20' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Kitchen Queue</h1>
          <p className="text-sm text-muted-foreground">Real-time kitchen display system</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            {orders.filter((o) => o.status === 'PENDING').length} Pending
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            {orders.filter((o) => o.status === 'PREPARING').length} Preparing
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            {orders.filter((o) => o.status === 'READY').length} Ready
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((col) => {
          const columnOrders = orders.filter((o) => o.status === col.status);
          const Icon = col.icon;
          return (
            <div key={col.status} className="flex flex-col gap-3">
              <div className={cn('flex items-center gap-2 rounded-lg px-3 py-2', col.bg)}>
                <Icon className={cn('h-4 w-4', col.color)} />
                <span className={cn('text-sm font-semibold', col.color)}>{col.title}</span>
                <span className={cn('ml-auto rounded-full px-2 py-0.5 text-xs font-bold', col.bg, col.color)}>
                  {columnOrders.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {columnOrders.map((order) => (
                    <KitchenOrderCard
                      key={order.id}
                      order={order}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                </AnimatePresence>
                {columnOrders.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center">
                    <CheckCircle2 className="mb-2 h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium text-muted-foreground">No {col.title.toLowerCase()} orders</p>
                    <p className="text-xs text-muted-foreground/70">All caught up!</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Kitchen Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Avg Prep Time', value: '14 min', icon: Timer, color: 'text-blue-600' },
              { label: 'Orders Today', value: '32', icon: ChefHat, color: 'text-purple-600' },
              { label: 'Completion Rate', value: '94%', icon: CheckCircle2, color: 'text-green-600' },
              { label: 'Delayed Orders', value: '2', icon: AlertCircle, color: 'text-red-600' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border p-3">
                  <Icon className={cn('h-5 w-5', item.color)} />
                  <div>
                    <p className="text-lg font-bold">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
