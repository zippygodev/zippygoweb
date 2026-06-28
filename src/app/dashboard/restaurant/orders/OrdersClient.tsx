'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { toast } from '@/components/ui/toast';
import {
  Search,
  Clock,
  CheckCircle2,
  ChefHat,
  XCircle,
  Phone,
  MapPin,
  MessageSquare,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Printer,
  Send,
  AlertCircle,
  Timer,
  Utensils,
  ShoppingBag,
  ArrowLeft,
  Plus,
  ClipboardList,
} from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  variant?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  table: string;
  customer: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  type: 'DINE_IN' | 'PICKUP' | 'DELIVERY';
  time: string;
  elapsed: string;
  notes?: string;
}

// Removed mock data

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  PENDING: { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' },
  CONFIRMED: { label: 'Confirmed', icon: CheckCircle2, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  PREPARING: { label: 'Preparing', icon: ChefHat, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
  READY: { label: 'Ready', icon: CheckCircle2, color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800' },
  COMPLETED: { label: 'Completed', icon: CheckCircle2, color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800' },
};

const typeConfig: Record<string, { label: string; icon: any }> = {
  DINE_IN: { label: 'Dine In', icon: Utensils },
  PICKUP: { label: 'Pickup', icon: ShoppingBag },
  DELIVERY: { label: 'Delivery', icon: MapPin },
};

const orderTabs = [
  { value: 'active', label: 'Active' },
  { value: 'ready', label: 'Ready' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

function OrderCard({ order, onView, onStatusUpdate }: { order: Order; onView: (o: Order) => void; onStatusUpdate: (id: string, status: Order['status']) => void }) {
  const StatusIcon = statusConfig[order.status]?.icon || Clock;
  const TypeIcon = typeConfig[order.type]?.icon || Utensils;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative overflow-hidden rounded-xl border bg-card p-4 transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-bold">{order.orderNumber}</span>
            <Badge variant="outline" className={cn('text-[10px]', statusConfig[order.status]?.color)}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {statusConfig[order.status]?.label}
            </Badge>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <TypeIcon className="h-3.5 w-3.5" />
            <span>{order.table}</span>
            <span className="text-muted-foreground/50">|</span>
            <span>{order.customer}</span>
          </div>
          <div className="mt-2 space-y-1">
            {order.items.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            {order.items.length > 3 && (
              <p className="text-xs text-muted-foreground">+{order.items.length - 3} more items</p>
            )}
          </div>
          {order.notes && (
            <div className="mt-2 flex items-start gap-1.5 rounded-md bg-amber-50 p-2 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
              <MessageSquare className="mt-0.5 h-3 w-3 shrink-0" />
              <span>{order.notes}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-lg font-bold">{formatCurrency(order.total)}</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Timer className="h-3 w-3" />
            {order.elapsed}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onView(order)}>
          <Eye className="mr-1 h-3.5 w-3.5" />
          Details
        </Button>
        {order.status === 'PENDING' && (
          <Button size="sm" className="h-8" onClick={() => onStatusUpdate(order.id, 'CONFIRMED')}>
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            Confirm
          </Button>
        )}
        {order.status === 'CONFIRMED' && (
          <Button size="sm" className="h-8" onClick={() => onStatusUpdate(order.id, 'PREPARING')}>
            <ChefHat className="mr-1 h-3.5 w-3.5" />
            Start Preparing
          </Button>
        )}
        {order.status === 'PREPARING' && (
          <Button size="sm" className="h-8" onClick={() => onStatusUpdate(order.id, 'READY')}>
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            Mark Ready
          </Button>
        )}
        {order.status === 'READY' && (
          <Button size="sm" className="h-8" onClick={() => onStatusUpdate(order.id, 'COMPLETED')}>
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            Complete
          </Button>
        )}
        <Button variant="outline" size="sm" className="h-8" onClick={() => onStatusUpdate(order.id, 'CANCELLED')}>
          <XCircle className="mr-1 h-3.5 w-3.5" />
          Cancel
        </Button>
      </div>
    </motion.div>
  );
}

function OrderDetailDialog({ order, open, onOpenChange, onStatusUpdate }: { order: Order | null; open: boolean; onOpenChange: (open: boolean) => void; onStatusUpdate: (id: string, status: Order['status']) => void }) {
  if (!order) return null;
  const StatusIcon = statusConfig[order.status]?.icon || Clock;
  const TypeIcon = typeConfig[order.type]?.icon || Utensils;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {order.orderNumber}
              <Badge variant="outline" className={cn('text-[10px]', statusConfig[order.status]?.color)}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {statusConfig[order.status]?.label}
              </Badge>
            </DialogTitle>
          </div>
          <DialogDescription>
            Placed at {order.time} &middot; {order.elapsed} ago
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <TypeIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{order.table}</p>
              <p className="text-xs text-muted-foreground">{order.type === 'DINE_IN' ? 'Dine In' : order.type === 'PICKUP' ? 'Takeaway' : 'Delivery'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{order.customer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{order.customer}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                {order.customerPhone}
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Order Items</h4>
            <div className="space-y-2 rounded-lg border p-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-muted text-xs font-medium">
                      {item.quantity}
                    </span>
                    <div>
                      <span>{item.name}</span>
                      {item.variant && <span className="text-xs text-muted-foreground"> ({item.variant})</span>}
                    </div>
                  </div>
                  <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-2">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
              <div className="flex items-start gap-2 text-sm">
                <MessageSquare className="mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-300">Special Instructions</p>
                  <p className="text-amber-700 dark:text-amber-400">{order.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <div className="flex gap-2">
            {order.status === 'PENDING' && (
              <Button size="sm" onClick={() => { onStatusUpdate(order.id, 'CONFIRMED'); onOpenChange(false); }}>
                Confirm Order
              </Button>
            )}
            {order.status === 'CONFIRMED' && (
              <Button size="sm" onClick={() => { onStatusUpdate(order.id, 'PREPARING'); onOpenChange(false); }}>
                Start Preparing
              </Button>
            )}
            {order.status === 'PREPARING' && (
              <Button size="sm" onClick={() => { onStatusUpdate(order.id, 'READY'); onOpenChange(false); }}>
                Mark as Ready
              </Button>
            )}
            {order.status === 'READY' && (
              <Button size="sm" onClick={() => { onStatusUpdate(order.id, 'COMPLETED'); onOpenChange(false); }}>
                Complete Order
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { updateOrderStatus } from '@/actions/restaurant/orders';

export default function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  // Format order objects for UI
  const formattedOrders = orders.map(order => ({
    ...order,
    orderNumber: order.orderNumber || order.id,
    table: order.tableId ? `Table ${order.tableId}` : (order.type === 'DELIVERY' ? 'Delivery' : 'Takeaway'),
    customer: order.customer?.name || 'Walk-in Customer',
    customerPhone: order.customer?.phone || '',
    items: order.items || [],
    total: order.total || 0,
    time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    elapsed: '...', // Can calculate relative time here if needed
  }));

  const filteredOrders = formattedOrders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.table.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || order.type === typeFilter;

    let matchesTab = true;
    if (activeTab === 'active') matchesTab = ['PENDING', 'CONFIRMED', 'PREPARING'].includes(order.status);
    else if (activeTab === 'ready') matchesTab = order.status === 'READY';
    else if (activeTab === 'completed') matchesTab = ['COMPLETED'].includes(order.status);
    else if (activeTab === 'cancelled') matchesTab = order.status === 'CANCELLED';

    return matchesSearch && matchesType && matchesTab;
  }).sort((a, b) => {
    return sortOrder === 'newest' ? -1 : 1;
  });

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    // Optimistic Update
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    
    // Call server action
    const res = await updateOrderStatus(id, newStatus);
    if (!res.success) {
      toast({
        title: 'Error',
        description: res.error || 'Failed to update order status',
        variant: 'destructive',
      });
      // Optionally rollback here if needed
    } else {
      toast({
        title: 'Order Updated',
        description: `Order status changed to ${newStatus}`,
        variant: 'success',
      });
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const counts = {
    active: formattedOrders.filter((o) => ['PENDING', 'CONFIRMED', 'PREPARING'].includes(o.status)).length,
    ready: formattedOrders.filter((o) => o.status === 'READY').length,
    completed: formattedOrders.filter((o) => o.status === 'COMPLETED').length,
    cancelled: formattedOrders.filter((o) => o.status === 'CANCELLED').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">Manage and track all restaurant orders</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders, customers, tables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-9 w-[130px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="DINE_IN">Dine In</SelectItem>
              <SelectItem value="PICKUP">Pickup</SelectItem>
              <SelectItem value="DELIVERY">Delivery</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto">
          {orderTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="relative">
              {tab.label}
              <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                {counts[tab.value as keyof typeof counts]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {orderTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {filteredOrders.length === 0 ? (
              <EmptyState
                icon={<ClipboardList className="h-10 w-10" />}
                title={`No ${tab.label} Orders`}
                description={searchQuery ? 'Try adjusting your search' : `No orders in ${tab.label.toLowerCase()} status`}
                action={{ label: 'View All Orders', onClick: () => { setSearchQuery(''); setActiveTab('active'); } }}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filteredOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order as any}
                      onView={handleViewOrder}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <OrderDetailDialog
        order={selectedOrder}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}


