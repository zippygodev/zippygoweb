'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import {
  Percent,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  TrendingUp,
  CalendarDays,
  Users,
  ShoppingBag,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

// Removed mock data

const statusBadge: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  SCHEDULED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  EXPIRED: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  DISABLED: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
};

import { createCoupon, deleteCoupon, toggleCouponStatus } from '@/actions/admin/coupons';

export default function CouponsClient({ initialCoupons }: { initialCoupons: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 6;

  // Normalize data to match the UI logic
  const normalizedCoupons = initialCoupons.map(c => {
    let status = 'DISABLED';
    if (c.isActive) {
      const now = new Date();
      if (c.startsAt && new Date(c.startsAt) > now) {
        status = 'SCHEDULED';
      } else if (c.expiresAt && new Date(c.expiresAt) < now) {
        status = 'EXPIRED';
      } else {
        status = 'ACTIVE';
      }
    }
    return {
      ...c,
      status,
      description: c.description || '', // Placeholder
      discountType: c.type,
      discountValue: c.value,
      startsAt: c.validUntil?.toISOString() || new Date().toISOString(), // Mocking for now since validUntil is our only field
      expiresAt: c.validUntil?.toISOString() || new Date(Date.now() + 86400000 * 30).toISOString(),
    };
  });

  const filtered = normalizedCoupons.filter((c) => {
    const matchesSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalUsage = normalizedCoupons.reduce((s, c) => s + (c.usedCount || 0), 0);
  const totalLimit = normalizedCoupons.reduce((s, c) => s + (c.usageLimit || 1000), 0);

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this coupon?')) {
      await deleteCoupon(id);
    }
  }

  async function handleCreate(formData: FormData) {
    setIsLoading(true);
    const result = await createCoupon(formData);
    setIsLoading(false);
    if (result.success) {
      setShowCreateDialog(false);
    } else {
      alert(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Coupons</h1>
          <p className="text-sm text-muted-foreground">Create and manage promotional coupons</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Coupon</DialogTitle>
              <DialogDescription>Set up a new promotional coupon.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Coupon Code</Label>
                  <Input placeholder="e.g. SUMMER50" />
                </div>
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                      <SelectItem value="FIXED">Fixed (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Discount Value</Label>
                  <Input type="number" placeholder="e.g. 20" />
                </div>
                <div className="space-y-2">
                  <Label>Max Discount (optional)</Label>
                  <Input type="number" placeholder="e.g. 200" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Brief description of the coupon" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Order Value</Label>
                  <Input type="number" placeholder="e.g. 299" />
                </div>
                <div className="space-y-2">
                  <Label>Usage Limit</Label>
                  <Input type="number" placeholder="e.g. 1000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Applicable to all restaurants</Label>
                <Switch defaultChecked />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button>Create Coupon</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{normalizedCoupons.filter(c => c.status === 'ACTIVE').length}</p>
            <p className="text-xs text-muted-foreground">Active Coupons</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{totalUsage.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Uses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{((totalUsage / totalLimit) * 100 || 0).toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Redemption Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{normalizedCoupons.filter(c => c.expiresAt < '2024-07-01').length}</p>
            <p className="text-xs text-muted-foreground">Expiring Soon</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by code or description..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="h-9 rounded-lg pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="h-9 w-[150px]">
            <Filter className="mr-2 h-3.5 w-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {['All', 'ACTIVE', 'SCHEDULED', 'EXPIRED', 'DISABLED'].map((s) => (
              <SelectItem key={s} value={s}>{s === 'All' ? 'All Status' : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((coupon, i) => {
          const usagePercent = (coupon.usedCount / coupon.usageLimit) * 100;
          const isActive = coupon.status === 'ACTIVE';
          return (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className={cn('transition-shadow hover:shadow-md', !isActive && 'opacity-70')}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', isActive ? 'bg-primary/10' : 'bg-muted')}>
                        <Percent className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-muted-foreground')} />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold tracking-wider">{coupon.code}</p>
                        <p className="text-xs text-muted-foreground">{coupon.description}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem><Edit3 className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant="outline" className={cn('text-[11px]', statusBadge[coupon.status])}>
                      {coupon.status}
                    </Badge>
                    <Badge variant="outline" className="text-[11px]">
                      {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% Off` : `₹${coupon.discountValue} Off`}
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Min order: {formatCurrency(coupon.minOrder)}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(coupon.startsAt, 'short')} - {formatDate(coupon.expiresAt, 'short')}
                    </div>
                    {coupon.maxDiscount && (
                      <div className="flex items-center gap-1">
                        <Zap className="h-3.5 w-3.5" />
                        Max discount: {formatCurrency(coupon.maxDiscount)}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Usage</span>
                      <span className="font-medium">{coupon.usedCount}/{coupon.usageLimit}</span>
                    </div>
                    <Progress value={usagePercent} className="mt-1 h-1.5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
}
