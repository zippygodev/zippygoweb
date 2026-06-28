'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  Store,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Star,
  DollarSign,
  Percent,
  Users,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { createRestaurant, toggleRestaurantStatus } from '@/actions/admin/restaurants';

const categoryOptions = ['All', 'North Indian', 'Japanese', 'Italian', 'Chinese', 'Fast Food', 'Indian', 'Mexican', 'Desserts'];
const statusOptions = ['All', 'ACTIVE', 'INACTIVE', 'PENDING'];

export default function RestaurantsClient({ initialRestaurants }: { initialRestaurants: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 6;

  const filtered = initialRestaurants.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const rStatus = r.isActive ? 'ACTIVE' : 'INACTIVE';
    const matchesStatus = statusFilter === 'All' || rStatus === statusFilter;
    const matchesCategory = categoryFilter === 'All' || r.cuisineType === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
      INACTIVE: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
    };
    return styles[status] ?? '';
  };

  async function handleToggleStatus(id: string, currentStatus: boolean) {
    await toggleRestaurantStatus(id, !currentStatus);
  }

  async function handleCreate(formData: FormData) {
    setIsLoading(true);
    const result = await createRestaurant(formData);
    setIsLoading(false);
    if (result.success) {
      setShowAddDialog(false);
    } else {
      alert(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Restaurants</h1>
          <p className="text-sm text-muted-foreground">Manage all restaurants in the mall</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" />
              Add Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Restaurant</DialogTitle>
              <DialogDescription>Fill in the details to register a new restaurant.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Restaurant Name</Label>
                  <Input placeholder="e.g. Punjab Dhaba" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categoryOptions.filter(c => c !== 'All').map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Owner Name</Label>
                  <Input placeholder="Full name" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="email@example.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label>Commission Rate (%)</Label>
                  <Input type="number" placeholder="18" defaultValue={18} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="e.g. Food Court, Level 2" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button>Add Restaurant</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search restaurants or owners..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="h-9 rounded-lg pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[140px]">
              <Filter className="mr-2 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>{s === 'All' ? 'All Status' : s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[150px]">
              <Store className="mr-2 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((c) => (
                <SelectItem key={c} value={c}>{c === 'All' ? 'All Categories' : c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((restaurant, i) => (
          <motion.div
            key={restaurant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${restaurant.name}`} />
                      <AvatarFallback>{getInitials(restaurant.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{restaurant.name}</p>
                      <p className="text-xs text-muted-foreground">{restaurant.category}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => { setSelectedRestaurant(restaurant); setShowDetailDialog(true); }}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit3 className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{restaurant.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{restaurant.phone}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="outline" className={cn('text-[11px]', statusBadge(restaurant.status))}>
                    {restaurant.status}
                  </Badge>
                  {restaurant.status === 'ACTIVE' && (
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{restaurant.rating}</span>
                    </div>
                  )}
                </div>

                {restaurant.status === 'ACTIVE' && (
                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-2">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Orders</p>
                      <p className="text-sm font-bold">{restaurant.totalOrders.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-sm font-bold">{formatCurrency(restaurant.revenue)}</p>
                    </div>
                  </div>
                )}

                {restaurant.status === 'PENDING' && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="flex-1 h-8 text-xs">
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                      <XCircle className="mr-1 h-3.5 w-3.5" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {paginated.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Store className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">No restaurants found</p>
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Restaurant Details</DialogTitle>
            <DialogDescription>Detailed information about the restaurant.</DialogDescription>
          </DialogHeader>
          {selectedRestaurant && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedRestaurant.name}`} />
                  <AvatarFallback className="text-lg">{getInitials(selectedRestaurant.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{selectedRestaurant.name}</h3>
                  <Badge variant="outline" className={cn('mt-1', statusBadge(selectedRestaurant.status))}>
                    {selectedRestaurant.status}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedRestaurant.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedRestaurant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedRestaurant.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedRestaurant.category}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Owner: {selectedRestaurant.owner}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span>Rating: {selectedRestaurant.rating || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Joined: {formatDate(selectedRestaurant.joinedDate, 'long')}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="mb-3 text-sm font-semibold">Commission Settings</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Commission Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      defaultValue={selectedRestaurant.commissionRate}
                      className="h-8 w-20 text-right"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                    <Button size="sm" variant="outline" className="h-8">Update</Button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="mb-3 text-sm font-semibold">Performance</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedRestaurant.totalOrders.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatCurrency(selectedRestaurant.revenue)}</p>
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatCurrency(selectedRestaurant.revenue * selectedRestaurant.commissionRate / 100)}</p>
                    <p className="text-xs text-muted-foreground">Commission Earned</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Restaurant Status</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked={selectedRestaurant.status === 'ACTIVE'} />
                  <span className="text-sm">{selectedRestaurant.status === 'ACTIVE' ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
