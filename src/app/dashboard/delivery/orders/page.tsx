'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Bike,
  MapPin,
  Clock,
  Phone,
  User,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Package,
  Navigation,
  IndianRupee,
  AlertTriangle,
  Utensils,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  restaurant: string;
  restaurantAddress: string;
  items: OrderItem[];
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  distance: string;
  estimatedTime: string;
  amount: number;
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered';
  priority: 'normal' | 'high';
  createdAt: string;
  specialInstructions?: string;
}

const initialOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ZG-A1B2',
    restaurant: 'Punjab Dhaba',
    restaurantAddress: 'Food Court, Level 2, Sector 18, Noida',
    items: [
      { name: 'Butter Chicken', quantity: 1 },
      { name: 'Garlic Naan', quantity: 2 },
      { name: 'Dal Makhani', quantity: 1 },
      { name: 'Gulab Jamun', quantity: 2 },
    ],
    customerName: 'Amit Sharma',
    customerAddress: 'H-45, Sector 12, Near Metro Station, Noida',
    customerPhone: '+91 98765 43210',
    distance: '2.3 km',
    estimatedTime: '12 min',
    amount: 85,
    status: 'pending',
    priority: 'high',
    createdAt: '2 min ago',
    specialInstructions: 'Call before reaching. Gate code: 4521',
  },
  {
    id: '2',
    orderNumber: 'ZG-C3D4',
    restaurant: 'Sushi World',
    restaurantAddress: 'Food Court, Level 1, Sector 18, Noida',
    items: [
      { name: 'California Roll', quantity: 2 },
      { name: 'Miso Soup', quantity: 1 },
      { name: 'Edamame', quantity: 1 },
    ],
    customerName: 'Priya Singh',
    customerAddress: 'Apt 301, Blue Tower, Sector 15, Noida',
    customerPhone: '+91 99887 76655',
    distance: '3.1 km',
    estimatedTime: '15 min',
    amount: 65,
    status: 'accepted',
    priority: 'normal',
    createdAt: '5 min ago',
  },
  {
    id: '3',
    orderNumber: 'ZG-E5F6',
    restaurant: 'Pizza Planet',
    restaurantAddress: 'Food Court, Level 3, Sector 18, Noida',
    items: [
      { name: 'Margherita Pizza (Large)', quantity: 1 },
      { name: 'Garlic Bread', quantity: 2 },
      { name: 'Coca Cola (500ml)', quantity: 2 },
    ],
    customerName: 'Rohit Verma',
    customerAddress: 'House 12, Green Park Colony, Sector 22',
    customerPhone: '+91 88776 65544',
    distance: '1.8 km',
    estimatedTime: '10 min',
    amount: 75,
    status: 'picked_up',
    priority: 'high',
    createdAt: '8 min ago',
  },
  {
    id: '4',
    orderNumber: 'ZG-G7H8',
    restaurant: 'Biryani Blues',
    restaurantAddress: 'Food Court, Level 2, Sector 18, Noida',
    items: [
      { name: 'Hyderabadi Biryani', quantity: 1 },
      { name: 'Raita', quantity: 1 },
      { name: 'Salad', quantity: 1 },
    ],
    customerName: 'Sneha Patel',
    customerAddress: 'C-78, Sector 11, Near City Hospital',
    customerPhone: '+91 77665 54433',
    distance: '4.2 km',
    estimatedTime: '20 min',
    amount: 90,
    status: 'pending',
    priority: 'normal',
    createdAt: '1 min ago',
  },
];

const statusFlow = ['accepted', 'picked_up', 'delivered'] as const;

function OrderCard({ order, onAccept, onReject, onUpdateStatus }: {
  order: Order;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onUpdateStatus: (id: string, status: Order['status']) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const handleAccept = () => {
    setActionLoading('accept');
    setTimeout(() => { onAccept(order.id); setActionLoading(null); }, 500);
  };

  const handleReject = () => {
    setActionLoading('reject');
    setTimeout(() => { onReject(order.id); setActionLoading(null); setRejectDialogOpen(false); }, 500);
  };

  const handleNextStatus = () => {
    const currentIndex = statusFlow.indexOf(order.status as typeof statusFlow[number]);
    if (currentIndex < statusFlow.length - 1) {
      onUpdateStatus(order.id, statusFlow[currentIndex + 1] as any);
    }
  };

  const cancelDialog = rejectDialogOpen && order.status === 'pending' ? (
    <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Decline Order</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to decline order #{order.orderNumber} from {order.restaurant}?
            This will be assigned to another delivery partner.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setRejectDialogOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleReject} className="bg-destructive hover:bg-destructive/90">
            Decline Order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : null;

  const handleRejectClick = () => {
    setRejectDialogOpen(true);
  };

  const statusColor = {
    pending: 'bg-amber-500',
    accepted: 'bg-blue-500',
    picked_up: 'bg-purple-500',
    delivered: 'bg-emerald-500',
  }[order.status];

  const statusLabel = {
    pending: 'New',
    accepted: 'Accepted',
    picked_up: 'Picked Up',
    delivered: 'Delivered',
  }[order.status];

  const statusStep = statusFlow.indexOf(order.status as typeof statusFlow[number]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="overflow-hidden rounded-xl border bg-card"
    >
      {cancelDialog}

      <div className={cn('h-1', statusColor)} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn('h-5 text-[10px]', statusColor)}>{statusLabel}</Badge>
              {order.priority === 'high' && (
                <Badge variant="destructive" className="h-5 text-[10px]">
                  <AlertTriangle className="mr-0.5 h-3 w-3" />
                  Priority
                </Badge>
              )}
              <Badge variant="outline" className="text-[10px]">#{order.orderNumber}</Badge>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Utensils className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{order.restaurant}</p>
                <p className="text-xs text-muted-foreground">{order.createdAt}</p>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-emerald-500">₹{order.amount}</p>
            <p className="text-xs text-muted-foreground">Delivery fee</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Navigation className="h-3.5 w-3.5" />
            {order.distance}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {order.estimatedTime}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {order.customerAddress.substring(0, 20)}...
          </span>
        </div>

        {order.status !== 'pending' && (
          <div className="mt-3">
            <div className="flex items-center justify-between">
              {statusFlow.map((step, i) => (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors',
                      i <= statusStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {i < statusStep ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground capitalize">{step.replace('_', ' ')}</p>
                  </div>
                  {i < statusFlow.length - 1 && (
                    <div className={cn(
                      'mx-1 h-0.5 w-8 sm:w-12',
                      i < statusStep ? 'bg-primary' : 'bg-muted'
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors"
        >
          {expanded ? (
            <><ChevronUp className="h-3.5 w-3.5" /> Hide Details</>
          ) : (
            <><ChevronDown className="h-3.5 w-3.5" /> View Details</>
          )}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Separator className="my-3" />

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Order Items</p>
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
                          {item.name}
                        </span>
                        <span className="text-muted-foreground">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Customer</p>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{order.customerName}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <a href={`tel:${order.customerPhone}`} className="text-primary hover:underline">
                      {order.customerPhone}
                    </a>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Delivery Address</p>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{order.customerAddress}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Restaurant</p>
                  <div className="flex items-start gap-2 text-sm">
                    <Utensils className="mt-0.5 h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{order.restaurantAddress}</span>
                  </div>
                </div>

                {order.specialInstructions && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">Special Instructions</p>
                      <div className="rounded-lg bg-muted/50 p-2.5 text-sm italic">
                        {order.specialInstructions}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Distance from restaurant to customer</p>
                    <p className="text-sm font-medium">{order.distance} · Est. {order.estimatedTime}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-0 border-t">
        {order.status === 'pending' ? (
          <>
            <button
              onClick={handleRejectClick}
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
              onClick={handleAccept}
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
          </>
        ) : order.status !== 'delivered' ? (
          <button
            onClick={handleNextStatus}
            className="flex w-full items-center justify-center gap-2 bg-primary py-3.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            {order.status === 'accepted' ? (
              <>
                <Package className="h-5 w-5" />
                Mark as Picked Up
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <Bike className="h-5 w-5" />
                Mark as Delivered
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 bg-emerald-500/10 py-3.5 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
            Delivered Successfully
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeTab, setActiveTab] = useState('all');

  const handleAccept = (id: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'accepted' as Order['status'] } : o));
  };

  const handleReject = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const handleUpdateStatus = (id: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return o.status === 'pending';
    if (activeTab === 'active') return o.status === 'accepted' || o.status === 'picked_up';
    if (activeTab === 'delivered') return o.status === 'delivered';
    return true;
  });

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const activeCount = orders.filter((o) => o.status === 'accepted' || o.status === 'picked_up').length;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Orders</h1>
        <p className="text-sm text-muted-foreground">Manage your assigned deliveries</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            All
            <Badge variant="secondary" className="ml-1.5 h-4 text-[10px]">{orders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs sm:text-sm relative">
            New
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-1.5 h-4 text-[10px] animate-pulse">{pendingCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs sm:text-sm">
            Active
            {activeCount > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-4 text-[10px]">{activeCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="delivered" className="text-xs sm:text-sm">Done</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Bike className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-muted-foreground">No orders found</p>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                {activeTab === 'pending' ? 'No new orders available right now.' :
                 activeTab === 'active' ? 'No active deliveries.' :
                 activeTab === 'delivered' ? 'No completed deliveries yet.' :
                 'No orders to show.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
