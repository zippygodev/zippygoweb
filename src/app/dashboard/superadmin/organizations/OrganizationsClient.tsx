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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination } from '@/components/ui/pagination';
import {
  Building2,
  Store,
  ShoppingBag,
  Users,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { createOrganization, toggleOrganizationStatus } from '@/actions/superadmin/organizations';

export default function OrganizationsClient({ initialOrganizations }: { initialOrganizations: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [orgDialog, setOrgDialog] = useState<'create' | 'edit' | 'details' | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const pageSize = 6;
  
  const [isLoading, setIsLoading] = useState(false);

  const filtered = initialOrganizations.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (org.email && org.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      org.id.toLowerCase().includes(searchQuery.toLowerCase());
    const orgStatus = org.isActive ? 'active' : 'inactive';
    const matchesStatus = statusFilter === 'all' || orgStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const statusBadge: Record<string, { variant: 'success' | 'warning' | 'destructive' | 'default'; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'warning', label: 'Inactive' },
    suspended: { variant: 'destructive', label: 'Suspended' },
  };

  async function handleCreateOrg(formData: FormData) {
    setIsLoading(true);
    const result = await createOrganization(formData);
    setIsLoading(false);
    if (result.success) {
      setOrgDialog(null);
    } else {
      alert(result.error);
    }
  }

  async function handleToggleStatus(id: string, currentStatus: boolean) {
    await toggleOrganizationStatus(id, !currentStatus);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Organizations</h1>
          <p className="text-sm text-muted-foreground">Manage all organizations on the platform.</p>
        </div>
        <Dialog open={orgDialog === 'create'} onOpenChange={(o) => setOrgDialog(o ? 'create' : null)}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" />
              Create Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Organization</DialogTitle>
              <DialogDescription>Add a new organization to the platform.</DialogDescription>
            </DialogHeader>
            <form action={handleCreateOrg}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Organization Name</Label>
                  <Input name="name" required placeholder="Enter organization name" />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input name="email" type="email" placeholder="admin@organization.com" />
                </div>
                <div className="grid gap-2">
                  <Label>Phone</Label>
                  <Input name="phone" placeholder="+91-9876543210" />
                </div>
                <div className="grid gap-2">
                  <Label>Address</Label>
                  <Input name="address" placeholder="City, State" />
                </div>
                <div className="grid gap-2">
                  <Label>Website</Label>
                  <Input name="website" placeholder="https://..." />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOrgDialog(null)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Organization'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="h-9 rounded-lg border-none bg-muted pl-10 pr-4 text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              {['Enterprise', 'Professional', 'Standard', 'Basic'].map((p: string) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          {filtered.length} organizations found
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Malls</TableHead>
                <TableHead className="text-center">Restaurants</TableHead>
                <TableHead className="text-center">Users</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((org, i) => {
                const orgStatus = org.isActive ? 'active' : 'inactive';
                return (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {org.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{org.name}</p>
                          <p className="text-xs text-muted-foreground">{org.email || 'No email'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">No Plan</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadge[orgStatus].variant}>{statusBadge[orgStatus].label}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Store className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">{org._count?.malls || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">0</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">0</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(0)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedOrg(org); setOrgDialog('details'); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedOrg(org); setOrgDialog('edit'); }}>
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
                            <DropdownMenuItem onClick={() => handleToggleStatus(org.id, org.isActive)}>
                              {org.isActive ? (
                                <><XCircle className="mr-2 h-4 w-4 text-red-500" /> Deactivate</>
                              ) : (
                                <><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" /> Activate</>
                              )}
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

      <Dialog open={orgDialog === 'details'} onOpenChange={(o) => { if (!o) setOrgDialog(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedOrg?.name}</DialogTitle>
            <DialogDescription>Organization details and statistics.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="malls">Malls</TabsTrigger>
              <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {selectedOrg?.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {selectedOrg?.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm font-medium flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {selectedOrg?.address}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm font-medium flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {selectedOrg?.createdAt}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Store className="mx-auto h-5 w-5 text-muted-foreground" />
                    <p className="text-xl font-bold mt-1">{selectedOrg?.mallsCount}</p>
                    <p className="text-xs text-muted-foreground">Malls</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <ShoppingBag className="mx-auto h-5 w-5 text-muted-foreground" />
                    <p className="text-xl font-bold mt-1">{selectedOrg?.restaurantsCount}</p>
                    <p className="text-xs text-muted-foreground">Restaurants</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="mx-auto h-5 w-5 text-muted-foreground" />
                    <p className="text-xl font-bold mt-1">{selectedOrg?.usersCount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Users</p>
                  </CardContent>
                </Card>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Current Plan</p>
                  <p className="text-xs text-muted-foreground">{selectedOrg?.plan}</p>
                </div>
                <Select defaultValue={selectedOrg?.plan}>
                  <SelectTrigger className="w-[160px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Enterprise', 'Professional', 'Standard', 'Basic'].map((p: string) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            <TabsContent value="malls">
              <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                Mall list for {selectedOrg?.name} would display here.
              </div>
            </TabsContent>
            <TabsContent value="restaurants">
              <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                Restaurant list for {selectedOrg?.name} would display here.
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
