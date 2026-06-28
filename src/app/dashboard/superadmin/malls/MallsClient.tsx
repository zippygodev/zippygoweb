'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate } from '@/lib/utils';
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
  DialogTrigger,
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
import {
  Store,
  Building2,
  ShoppingBag,
  Users,
  IndianRupee,
  Plus,
  Search,
  Edit3,
  Eye,
  MoreHorizontal,
  MapPin,
  CalendarDays,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { createMall, toggleMallStatus } from '@/actions/superadmin/malls';

export default function MallsClient({ initialMalls, organizations }: { initialMalls: any[], organizations: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [orgFilter, setOrgFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 6;

  const filtered = initialMalls.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrg = orgFilter === 'all' || m.organizationId === orgFilter;
    const mallStatus = m.isActive ? 'active' : 'inactive';
    const matchesStatus = statusFilter === 'all' || mallStatus === statusFilter;
    return matchesSearch && matchesOrg && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const statusBadge: Record<string, { variant: 'success' | 'warning' | 'destructive' | 'default'; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'warning', label: 'Inactive' },
    maintenance: { variant: 'destructive', label: 'Maintenance' },
  };

  async function handleCreateMall(formData: FormData) {
    setIsLoading(true);
    const result = await createMall(formData);
    setIsLoading(false);
    if (result.success) {
      setShowCreate(false);
    } else {
      alert(result.error);
    }
  }

  async function handleToggleStatus(id: string, currentStatus: boolean) {
    await toggleMallStatus(id, !currentStatus);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Malls</h1>
          <p className="text-sm text-muted-foreground">Manage all malls across organizations.</p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" />
              Create Mall
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Mall</DialogTitle>
              <DialogDescription>Add a new mall to an organization.</DialogDescription>
            </DialogHeader>
            <form action={handleCreateMall}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Mall Name</Label>
                  <Input name="name" required placeholder="Enter mall name" />
                </div>
                <div className="grid gap-2">
                  <Label>Organization</Label>
                  <Select name="organizationId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((o) => (
                        <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input name="email" type="email" placeholder="contact@mall.com" />
                </div>
                <div className="grid gap-2">
                  <Label>Phone</Label>
                  <Input name="phone" placeholder="+91-9876543210" />
                </div>
                <div className="grid gap-2">
                  <Label>Address</Label>
                  <Input name="address" placeholder="Street, Area" />
                </div>
                <div className="grid gap-2">
                  <Label>City</Label>
                  <Input name="city" placeholder="City name" />
                </div>
                <div className="grid gap-2">
                  <Label>State</Label>
                  <Input name="state" placeholder="State" />
                </div>
                <div className="grid gap-2">
                  <Label>ZIP Code</Label>
                  <Input name="zipCode" placeholder="ZIP Code" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Mall'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search malls..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="h-9 rounded-lg border-none bg-muted pl-10 pr-4 text-sm"
            />
          </div>
          <Select value={orgFilter} onValueChange={(v) => { setOrgFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Organization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Organizations</SelectItem>
              {organizations.map((o) => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
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
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">{filtered.length} malls found</div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mall</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Restaurants</TableHead>
                <TableHead className="text-center">Users</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((m) => {
                const mallStatus = m.isActive ? 'active' : 'inactive';
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/50">
                          <Store className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{m.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {m.city || 'No city'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{m.organization?.name || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadge[mallStatus].variant}>{statusBadge[mallStatus].label}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">{m._count?.restaurants || 0}</TableCell>
                    <TableCell className="text-center font-medium">0</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(0)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Manage Restaurants</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleStatus(m.id, m.isActive)}>
                              {m.isActive ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
