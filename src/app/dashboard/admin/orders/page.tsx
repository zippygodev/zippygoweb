'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { DataTable } from '@/components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import {
  ClipboardList,
  Search,
  Filter,
  Download,
  Eye,
  XCircle,
  RotateCcw,
  ChevronDown,
  MoreHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface Order {
  id: string;
  restaurant: string;
  customer: string;
  items: number;
  amount: number;
  status: string;
  type: 'DINE_IN' | 'DELIVERY' | 'PICKUP';
  table?: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  deliveryPartner?: string;
}

const orders: Order[] = [
  { id: 'ZG-7A8B', restaurant: 'Punjab Dhaba', customer: 'Rahul S.', items: 4, amount: 1250, status: 'PREPARING', type: 'DINE_IN', table: 'Table 5', paymentMethod: 'UPI', paymentStatus: 'PAID', createdAt: '2024-06-27T10:30:00', deliveryPartner: '-' },
  { id: 'ZG-9C0D', restaurant: 'Sushi World', customer: 'Priya M.', items: 2, amount: 780, status: 'PENDING', type: 'DELIVERY', paymentMethod: 'Card', paymentStatus: 'PAID', createdAt: '2024-06-27T10:25:00', deliveryPartner: 'Vikram D.' },
  { id: 'ZG-1E2F', restaurant: 'Pizza Planet', customer: 'Amit K.', items: 3, amount: 950, status: 'READY', type: 'PICKUP', paymentMethod: 'Cash', paymentStatus: 'PENDING', createdAt: '2024-06-27T10:15:00' },
  { id: 'ZG-3G4H', restaurant: 'Dragon Wok', customer: 'Sneha P.', items: 5, amount: 2100, status: 'PREPARING', type: 'DINE_IN', table: 'Table 3', paymentMethod: 'UPI', paymentStatus: 'PAID', createdAt: '2024-06-27T10:00:00' },
  { id: 'ZG-5I6J', restaurant: 'Punjab Dhaba', customer: 'Vikram D.', items: 2, amount: 640, status: 'COMPLETED', type: 'DELIVERY', paymentMethod: 'Card', paymentStatus: 'PAID', createdAt: '2024-06-27T09:30:00', deliveryPartner: 'Rohit V.' },
  { id: 'ZG-7K8L', restaurant: 'Burger Barn', customer: 'Neha G.', items: 3, amount: 1120, status: 'CANCELLED', type: 'PICKUP', paymentMethod: 'UPI', paymentStatus: 'REFUNDED', createdAt: '2024-06-27T09:15:00' },
  { id: 'ZG-8M9N', restaurant: 'Taco Fiesta', customer: 'Raj P.', items: 4, amount: 1560, status: 'COMPLETED', type: 'DINE_IN', table: 'Table 8', paymentMethod: 'Card', paymentStatus: 'PAID', createdAt: '2024-06-27T09:00:00' },
  { id: 'ZG-0P1Q', restaurant: 'Waffle House', customer: 'Anjali S.', items: 2, amount: 450, status: 'PENDING', type: 'DELIVERY', paymentMethod: 'UPI', paymentStatus: 'PENDING', createdAt: '2024-06-27T08:45:00', deliveryPartner: 'Deepak Y.' },
  { id: 'ZG-2R3S', restaurant: 'Punjab Dhaba', customer: 'Rahul S.', items: 3, amount: 980, status: 'COMPLETED', type: 'DINE_IN', table: 'Table 2', paymentMethod: 'Cash', paymentStatus: 'PAID', createdAt: '2024-06-27T08:30:00' },
  { id: 'ZG-4T5U', restaurant: 'Sushi World', customer: 'Kenji T.', items: 6, amount: 3200, status: 'COMPLETED', type: 'DINE_IN', table: 'Table 1', paymentMethod: 'Card', paymentStatus: 'PAID', createdAt: '2024-06-27T08:00:00' },
];

const statusOptions = ['All', 'PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
const typeOptions = ['All', 'DINE_IN', 'DELIVERY', 'PICKUP'];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  PREPARING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  READY: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  COMPLETED: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const pageSize = 8;

  const filtered = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchesType = typeFilter === 'All' || o.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <button className="flex items-center gap-1" onClick={() => column.toggleSorting()}>
          Order ID
          <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: ({ row }) => <span className="font-medium text-xs">{row.original.id}</span>,
    },
    {
      accessorKey: 'restaurant',
      header: 'Restaurant',
      cell: ({ row }) => <span className="text-sm">{row.original.restaurant}</span>,
    },
    {
      accessorKey: 'customer',
      header: 'Customer',
    },
    {
      accessorKey: 'items',
      header: 'Items',
      cell: ({ row }) => <span className="text-center block">{row.original.items}</span>,
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <button className="flex items-center gap-1" onClick={() => column.toggleSorting()}>
          Amount
          <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: ({ row }) => <span className="font-medium">{formatCurrency(row.original.amount)}</span>,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[11px]">
          {row.original.type.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant="outline" className={cn('text-[11px]', statusColors[row.original.status])}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Time',
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatDate(row.original.createdAt)}</span>,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => { setSelectedOrder(row.original); setShowDetailDialog(true); }}>
              <Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            {(row.original.status === 'PENDING' || row.original.status === 'PREPARING') && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => { setSelectedOrder(row.original); setShowCancelDialog(true); }}>
                  <XCircle className="mr-2 h-4 w-4" /> Cancel
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">View and manage all orders across the mall</p>
        </div>
        <Button variant="outline" size="sm" className="h-9">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, restaurant, or customer..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="h-9 rounded-lg pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[150px]">
              <Filter className="mr-2 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>{s === 'All' ? 'All Status' : s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[140px]">
              <ClipboardList className="mr-2 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((t) => (
                <SelectItem key={t} value={t}>{t === 'All' ? 'All Types' : t.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                    <ClipboardList className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((order) => (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setSelectedOrder(order); setShowDetailDialog(true); }}>
                    <TableCell><span className="font-medium text-xs">{order.id}</span></TableCell>
                    <TableCell className="text-sm">{order.restaurant}</TableCell>
                    <TableCell className="text-sm">{order.customer}</TableCell>
                    <TableCell className="text-center">{order.items}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(order.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[11px]">
                        {order.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-[11px]', statusColors[order.status])}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); setShowDetailDialog(true); }}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          {(order.status === 'PENDING' || order.status === 'PREPARING') && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); setShowCancelDialog(true); }}>
                                <XCircle className="mr-2 h-4 w-4" /> Cancel
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Complete order information.</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">{selectedOrder.id}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(selectedOrder.createdAt, 'long')}</p>
                </div>
                <Badge variant="outline" className={cn('text-[11px]', statusColors[selectedOrder.status])}>
                  {selectedOrder.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-lg border p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Restaurant</p>
                  <p className="text-sm font-medium">{selectedOrder.restaurant}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="text-sm font-medium">{selectedOrder.customer}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-sm font-medium">{selectedOrder.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Table / Partner</p>
                  <p className="text-sm font-medium">{selectedOrder.table || selectedOrder.deliveryPartner || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Payment</p>
                  <p className="text-sm font-medium">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Payment Status</p>
                  <Badge variant="outline" className={cn('text-[11px]', selectedOrder.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700')}>
                    {selectedOrder.paymentStatus}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm font-medium">Total Amount</span>
                <span className="text-xl font-bold">{formatCurrency(selectedOrder.amount)}</span>
              </div>
              {(selectedOrder.status === 'PENDING' || selectedOrder.status === 'PREPARING') && (
                <Button variant="destructive" className="w-full" onClick={() => { setShowDetailDialog(false); setShowCancelDialog(true); }}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Order
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>Are you sure you want to cancel this order? This action may require a refund.</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="rounded-lg border p-3">
                <p className="text-sm"><strong>Order:</strong> {selectedOrder.id}</p>
                <p className="text-sm"><strong>Restaurant:</strong> {selectedOrder.restaurant}</p>
                <p className="text-sm"><strong>Amount:</strong> {formatCurrency(selectedOrder.amount)}</p>
              </div>
              <div className="space-y-2">
                <Label>Reason for cancellation</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="out_of_stock">Out of stock</SelectItem>
                    <SelectItem value="customer_request">Customer request</SelectItem>
                    <SelectItem value="payment_issue">Payment issue</SelectItem>
                    <SelectItem value="restaurant_closed">Restaurant closed</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 p-3 text-sm text-amber-800 dark:text-amber-200">
                <RotateCcw className="h-4 w-4 shrink-0" />
                <span>A refund of {formatCurrency(selectedOrder.amount)} will be processed if payment was already collected.</span>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCancelDialog(false)}>Keep Order</Button>
                <Button variant="destructive">Cancel & Refund</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
