'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useDelivery } from './DeliveryClientLayout';
import {
  Bike,
  IndianRupee,
  Star,
  Navigation,
  Clock,
  Package,
  Bell,
  BellRing,
  ArrowRight,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  TrendingUp,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  restaurant: string;
  restaurantAddress: string;
  items: string[];
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  distance: string;
  estimatedTime: string;
  amount: number;
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered';
  priority: 'normal' | 'high';
}

// Removed mock data

function OnlineOfflineToggle() {
  const { isOnline, toggleOnline } = useDelivery();

  return (
    <button
      onClick={toggleOnline}
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border-2 p-6 transition-all',
        isOnline
          ? 'border-emerald-500 bg-emerald-500/5'
          : 'border-muted bg-muted/30'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            'flex h-14 w-14 items-center justify-center rounded-full transition-colors',
            isOnline ? 'bg-emerald-500' : 'bg-muted-foreground/20'
          )}>
            <Bike className={cn('h-7 w-7', isOnline ? 'text-white' : 'text-muted-foreground')} />
          </div>
          <div className="text-left">
            <p className="text-lg font-bold">{isOnline ? "You're Online" : "You're Offline"}</p>
            <p className="text-sm text-muted-foreground">
              {isOnline ? 'Receiving delivery requests' : 'Tap to start receiving orders'}
            </p>
          </div>
        </div>
        <Switch checked={isOnline} onCheckedChange={toggleOnline} className="scale-125" />
      </div>
      {isOnline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-2"
        >
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-emerald-600">3 orders available near you</span>
        </motion.div>
      )}
    </button>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', color)}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NewOrderAlert({ order, onAccept, onReject }: {
  order: Order;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAccept = (id: string) => {
    setActionLoading('accept');
    setTimeout(() => { onAccept(id); setActionLoading(null); }, 500);
  };

  const handleReject = (id: string) => {
    setActionLoading('reject');
    setTimeout(() => { onReject(id); setActionLoading(null); }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        'overflow-hidden rounded-xl border-2 transition-colors',
        order.priority === 'high' ? 'border-primary/30 bg-primary/[0.02]' : 'border-border'
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {order.priority === 'high' && (
                <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                  <AlertTriangle className="mr-0.5 h-3 w-3" />
                  Priority
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {order.distance}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Clock className="mr-0.5 h-3 w-3" />
                {order.estimatedTime}
              </Badge>
            </div>
            <h3 className="mt-2 text-base font-semibold">{order.restaurant}</h3>
            <p className="text-sm text-muted-foreground">#{order.orderNumber}</p>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{order.items.join(', ')}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-emerald-500">₹{order.amount}</p>
            <Badge variant="outline" className="mt-1 text-xs">{order.distance}</Badge>
          </div>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Separator className="my-3" />
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <User className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{order.customerName} | {order.customerPhone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{order.customerAddress}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <ShoppingBag className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{order.items.join(', ')}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-3 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs"
          >
            {showDetails ? 'Hide Details' : 'View Details'}
            <ChevronRight className={cn('ml-1 h-3 w-3 transition-transform', showDetails && 'rotate-90')} />
          </Button>
        </div>
      </div>

      <div className="flex gap-0 border-t">
        <button
          onClick={() => handleReject(order.id)}
          disabled={actionLoading !== null}
          className="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          {actionLoading === 'reject' ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          ) : (
            <XCircle className="h-5 w-5 text-destructive" />
          )}
          Decline
        </button>
        <Separator orientation="vertical" />
        <button
          onClick={() => handleAccept(order.id)}
          disabled={actionLoading !== null}
          className="flex flex-1 items-center justify-center gap-2 bg-primary/5 py-3.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
        >
          {actionLoading === 'accept' ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
            <CheckCircle2 className="h-5 w-5" />
          )}
          Accept
        </button>
      </div>
    </motion.div>
  );
}

function ActiveOrderCard({ order, onStatusUpdate }: { order: any, onStatusUpdate: (id: string, status: string) => void }) {
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);

  const statusConfig: Record<string, any> = {
    OUT_FOR_DELIVERY: { label: 'Out for Delivery', icon: Bike, color: 'bg-purple-500', next: 'DELIVERED', nextLabel: 'Mark Delivered' },
    DELIVERED: { label: 'Delivered', icon: CheckCircle2, color: 'bg-emerald-500', next: null, nextLabel: '' },
  };

  // Fallback if status doesn't match
  const config = statusConfig[currentStatus] || statusConfig['OUT_FOR_DELIVERY'];

  const handleNext = async () => {
    if (config.next) {
      setLoading(true);
      await onStatusUpdate(order.id, config.next);
      setCurrentStatus(config.next);
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className={cn('h-1', config.color)} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{order.restaurant}</p>
              <Badge variant="outline" className="text-[10px]">#{order.orderNumber}</Badge>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {order.distance}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {order.estimatedTime}
              </span>
              <span className="font-medium text-emerald-500">₹{order.amount}</span>
            </div>
          </div>
          <Badge className={cn('h-6', config.color)}>{config.label}</Badge>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-lg bg-muted/50 p-3">
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', config.color)}>
            <config.icon className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">
              {currentStatus === 'OUT_FOR_DELIVERY' ? 'On the way to customer' : 'Delivered successfully'}
            </p>
            <p className="text-sm font-medium">
              {currentStatus === 'OUT_FOR_DELIVERY' ? order.customerAddress : 'Completed'}
            </p>
          </div>
        </div>

        {currentStatus !== 'DELIVERED' && (
          <Button
            onClick={handleNext}
            disabled={loading}
            className="mt-3 w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {loading ? 'Updating...' : config.nextLabel}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Link
        href="/dashboard/delivery/earnings"
        className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center hover:bg-muted/50 transition-colors"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
          <IndianRupee className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <p className="text-sm font-medium">Earnings</p>
          <p className="text-xs text-muted-foreground">View your pay</p>
        </div>
      </Link>
      <Link
        href="/dashboard/delivery/history"
        className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center hover:bg-muted/50 transition-colors"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
          <Clock className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-medium">History</p>
          <p className="text-xs text-muted-foreground">Past deliveries</p>
        </div>
      </Link>
      <Link
        href="/dashboard/delivery/profile"
        className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center hover:bg-muted/50 transition-colors"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
          <Star className="h-5 w-5 text-purple-500" />
        </div>
        <div>
          <p className="text-sm font-medium">Rating</p>
          <p className="text-xs text-muted-foreground">4.8 ★</p>
        </div>
      </Link>
      <Link
        href="#"
        className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center hover:bg-muted/50 transition-colors"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
          <Phone className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <p className="text-sm font-medium">Support</p>
          <p className="text-xs text-muted-foreground">Get help</p>
        </div>
      </Link>
    </div>
  );
}

import { acceptOrder, updateDeliveryStatus } from '@/actions/delivery/orders';

export default function DeliveryClient({ initialAvailableOrders, initialActiveOrders }: { initialAvailableOrders: any[], initialActiveOrders: any[] }) {
  const { isOnline } = useDelivery();
  const [availableOrders, setAvailableOrders] = useState<any[]>(initialAvailableOrders);
  const [activeOrders, setActiveOrders] = useState<any[]>(initialActiveOrders);

  // Format orders for UI
  const formatOrder = (o: any) => ({
    id: o.id,
    orderNumber: o.orderNumber || o.id,
    restaurant: o.restaurant?.name || 'Unknown Restaurant',
    restaurantAddress: o.restaurant?.address || 'Restaurant Address',
    items: o.items?.map((i: any) => i.name) || ['Items...'],
    customerName: o.customer?.name || 'Customer',
    customerAddress: o.deliveryAddress || 'Customer Address',
    customerPhone: o.customer?.phone || '',
    distance: 'Calculating...', // Needs real geocoding in a real app
    estimatedTime: o.restaurant?.deliveryTime ? `${o.restaurant.deliveryTime} min` : '30 min',
    amount: o.total || 0,
    status: o.status,
    priority: o.total > 1000 ? 'high' : 'normal',
  });

  const formattedAvailableOrders = availableOrders.map(formatOrder);
  const formattedActiveOrders = activeOrders.map(formatOrder);
  const completedCount = 0; // You could fetch this from history

  const handleAccept = async (id: string) => {
    // Optimistic UI could be added, but for now we'll just wait for the server action
    const res = await acceptOrder(id);
    if (res.success) {
      // Find the order that was accepted
      const order = availableOrders.find((o) => o.id === id);
      if (order) {
        setAvailableOrders((prev) => prev.filter((o) => o.id !== id));
        setActiveOrders((prev) => [...prev, { ...order, status: 'OUT_FOR_DELIVERY' }]);
      }
    } else {
      console.error(res.error);
    }
  };

  const handleReject = (id: string) => {
    setAvailableOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    const res = await updateDeliveryStatus(id, status);
    if (res.success) {
      if (status === 'DELIVERED') {
         setActiveOrders((prev) => prev.filter((o) => o.id !== id));
      } else {
         setActiveOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
      }
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Delivery Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5">
          <BellRing className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{formattedAvailableOrders.length} new</span>
        </div>
      </div>

      <OnlineOfflineToggle />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={Bike}
          label="Deliveries"
          value={formattedActiveOrders.length + completedCount}
          sub={`${formattedActiveOrders.length} active`}
          color="bg-primary"
        />
        <StatCard
          icon={IndianRupee}
          label="Earnings"
          value="₹0" // Mock
          sub="Today"
          color="bg-emerald-500"
        />
        <StatCard
          icon={Star}
          label="Rating"
          value="4.8"
          sub="Last 30 days"
          color="bg-yellow-500"
        />
        <StatCard
          icon={Navigation}
          label="Distance"
          value="32 km"
          sub="Today"
          color="bg-blue-500"
        />
      </div>

      {!isOnline ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Bike className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">You&apos;re offline</p>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Go online to start receiving delivery requests and earning money
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {formattedAvailableOrders.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">New Orders</h2>
                <Badge variant="destructive" className="animate-pulse">{formattedAvailableOrders.length} pending</Badge>
              </div>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {formattedAvailableOrders.map((order) => (
                    <NewOrderAlert
                      key={order.id}
                      order={order as any}
                      onAccept={handleAccept}
                      onReject={handleReject}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}

          {formattedActiveOrders.length > 0 && (
            <section>
              <h2 className="mb-3 font-semibold">Active Deliveries</h2>
              <div className="space-y-3">
                {formattedActiveOrders.map((order) => (
                  <ActiveOrderCard key={order.id} order={order as any} onStatusUpdate={handleStatusUpdate} />
                ))}
              </div>
            </section>
          )}

          {formattedAvailableOrders.length === 0 && formattedActiveOrders.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <p className="text-lg font-medium">All caught up!</p>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  No orders available right now. New orders will appear here automatically.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <section>
        <h2 className="mb-3 font-semibold">Quick Actions</h2>
        <QuickActions />
      </section>
    </div>
  );
}
