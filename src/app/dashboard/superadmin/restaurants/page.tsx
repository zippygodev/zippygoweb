'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Switch } from '@/components/ui/switch';
import {
  ShoppingBag,
  Building2,
  Store,
  Search,
  Eye,
  MoreHorizontal,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  IndianRupee,
  Percent,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Restaurant {
  id: string;
  name: string;
  organization: string;
  mall: string;
  cuisine: string;
  rating: number;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  commission: number;
  revenue: number;
  orders: number;
  createdAt: string;
}

const restaurants: Restaurant[] = [
  { id: 'RES-001', name: 'Punjab Dhaba', organization: 'Foodie Group Inc.', mall: 'Grand Mall - Sector 18', cuisine: 'North Indian', rating: 4.8, status: 'active', commission: 18, revenue: 425000, orders: 342, createdAt: '2025-01-25' },
  { id: 'RES-002', name: 'Sushi World', organization: 'Foodie Group Inc.', mall: 'Grand Mall - Sector 18', cuisine: 'Japanese', rating: 4.6, status: 'active', commission: 20, revenue: 385000, orders: 285, createdAt: '2025-02-01' },
  { id: 'RES-003', name: 'Pizza Planet', organization: 'DineEasy Corp', mall: 'Pacific Mall', cuisine: 'Italian', rating: 4.5, status: 'active', commission: 15, revenue: 312000, orders: 268, createdAt: '2025-03-10' },
  { id: 'RES-004', name: 'Dragon Wok', organization: 'MegaFood Parks Ltd.', mall: 'Forum Mall', cuisine: 'Chinese', rating: 4.7, status: 'active', commission: 18, revenue: 278000, orders: 215, createdAt: '2024-12-15' },
  { id: 'RES-005', name: 'Burger Barn', organization: 'Foodie Group Inc.', mall: 'City Center Mall', cuisine: 'Fast Food', rating: 4.3, status: 'inactive', commission: 15, revenue: 195000, orders: 198, createdAt: '2025-02-20' },
  { id: 'RES-006', name: 'Spice Junction', organization: 'Spice Route Group', mall: 'Select Citywalk', cuisine: 'Mughlai', rating: 4.4, status: 'pending', commission: 20, revenue: 0, orders: 0, createdAt: '2026-06-20' },
  { id: 'RES-007', name: 'Green Bowl', organization: 'TasteTown Pvt. Ltd.', mall: 'Phoenix MarketCity', cuisine: 'Healthy', rating: 4.2, status: 'pending', commission: 18, revenue: 0, orders: 0, createdAt: '2026-06-22' },
  { id: 'RES-008', name: 'Taco Fiesta', organization: 'MegaFood Parks Ltd.', mall: 'DLF Avenue', cuisine: 'Mexican', rating: 4.1, status: 'rejected', commission: 15, revenue: 0, orders: 0, createdAt: '2026-05-30' },
  { id: 'RES-009', name: 'Biryani Blues', organization: 'Spice Route Group', mall: 'Select Citywalk', cuisine: 'Hyderabadi', rating: 4.9, status: 'active', commission: 22, revenue: 520000, orders: 410, createdAt: '2025-04-25' },
  { id: 'RES-010', name: 'Dosa Express', organization: 'MegaFood Parks Ltd.', mall: 'Forum Mall', cuisine: 'South Indian', rating: 4.5, status: 'active', commission: 16, revenue: 245000, orders: 189, createdAt: '2025-01-15' },
];

const statusBadge: Record<string, { variant: 'success' | 'warning' | 'destructive' | 'default' | 'outline'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'warning', label: 'Inactive' },
  pending: { variant: 'outline', label: 'Pending' },
  rejected: { variant: 'destructive', label: 'Rejected' },
};

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [orgFilter, setOrgFilter] = useState('all');
  const [mallFilter, setMallFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [commissionDialog, setCommissionDialog] = useState<Restaurant | null>(null);
  const [commissionValue, setCommissionValue] = useState(0);
  const pageSize = 8;

  const orgs = [...new Set(restaurants.map(r => r.organization))];
  const malls = [...new Set(restaurants.map(r => r.mall))];

  const filtered = restaurants.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrg = orgFilter === 'all' || r.organization === orgFilter;
    const matchesMall = mallFilter === 'all' || r.mall === mallFilter;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesOrg && matchesMall && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openCommissionDialog = (r: Restaurant) => {
    setCommissionValue(r.commission);
    setCommissionDialog(r);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Restaurants</h1>
          <p className="text-sm text-muted-foreground">Global restaurant management across all malls.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-amber-500" /> {restaurants.filter(r => r.status === 'pending').length} Pending</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="h-9 rounded-lg border-none bg-muted pl-10 pr-4 text-sm"
            />
          </div>
          <Select value={orgFilter} onValueChange={(v) => { setOrgFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="Organization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Organizations</SelectItem>
              {orgs.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={mallFilter} onValueChange={(v) => { setMallFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="Mall" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Malls</SelectItem>
              {malls.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">{filtered.length} restaurants</div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Restaurant</TableHead>
                <TableHead>Mall / Organization</TableHead>
                <TableHead>Cuisine</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Commission</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {r.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-sm flex items-center gap-1"><Store className="h-3 w-3 text-muted-foreground" /> {r.mall}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" /> {r.organization}</p>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-sm">{r.cuisine}</span></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{r.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadge[r.status].variant}>{statusBadge[r.status].label}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => openCommissionDialog(r)}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      <Percent className="h-3 w-3" />
                      {r.commission}%
                    </button>
                  </TableCell>
                  <TableCell className="text-right font-medium">{r.revenue > 0 ? formatCurrency(r.revenue) : '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {r.status === 'pending' && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500">
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openCommissionDialog(r)}>
                            <Percent className="mr-2 h-4 w-4" />
                            Commission Override
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {r.status === 'active' ? (
                            <DropdownMenuItem>
                              <XCircle className="mr-2 h-4 w-4 text-amber-500" />
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                              Activate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <Dialog open={!!commissionDialog} onOpenChange={(o) => { if (!o) setCommissionDialog(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Commission Override</DialogTitle>
            <DialogDescription>Set custom commission rate for {commissionDialog?.name}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Current Commission</Label>
              <p className="text-sm text-muted-foreground">{commissionDialog?.commission}%</p>
            </div>
            <div className="grid gap-2">
              <Label>New Commission Rate (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={commissionValue}
                onChange={(e) => setCommissionValue(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="applyToAll" />
              <Label htmlFor="applyToAll">Apply to all restaurants in this mall</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCommissionDialog(null)}>Cancel</Button>
            <Button onClick={() => setCommissionDialog(null)}>Save Override</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
