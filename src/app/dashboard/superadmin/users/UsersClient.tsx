'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Label } from '@/components/ui/label';
import {
  Users,
  Building2,
  Search,
  MoreHorizontal,
  Ban,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  CalendarDays,
  Shield,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { updateUserRole, toggleUserStatus } from '@/actions/superadmin/users';
import { UserRole } from '@prisma/client';

export default function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [banDialog, setBanDialog] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 8;

  const filtered = initialUsers.filter((u) => {
    const matchesSearch = u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const userStatus = u.isActive ? 'active' : 'banned';
    const matchesStatus = statusFilter === 'all' || userStatus === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  async function handleToggleBan() {
    if (!banDialog) return;
    setIsLoading(true);
    await toggleUserStatus(banDialog.id, !banDialog.isActive);
    setIsLoading(false);
    setBanDialog(null);
  }

  async function handleToggleStatusFast(id: string, currentStatus: boolean) {
    await toggleUserStatus(id, !currentStatus);
  }

  const roleBadge: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'success' | 'warning'; label: string }> = {
    SUPER_ADMIN: { variant: 'default', label: 'Super Admin' },
    MALL_ADMIN: { variant: 'success', label: 'Mall Admin' },
    RESTAURANT_OWNER: { variant: 'warning', label: 'Rest. Owner' },
    DELIVERY_PARTNER: { variant: 'secondary', label: 'Delivery' },
    CUSTOMER: { variant: 'outline', label: 'Customer' },
  };

  const statusBadge: Record<string, { variant: 'success' | 'warning' | 'destructive'; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    banned: { variant: 'destructive', label: 'Banned' },
    suspended: { variant: 'warning', label: 'Suspended' },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">Global user management across the platform.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {initialUsers.filter(u => !u.isActive).length} banned/inactive
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="h-9 rounded-lg border-none bg-muted pl-10 pr-4 text-sm"
            />
          </div>
          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              <SelectItem value="MALL_ADMIN">Mall Admin</SelectItem>
              <SelectItem value="RESTAURANT_OWNER">Restaurant Owner</SelectItem>
              <SelectItem value="DELIVERY_PARTNER">Delivery Partner</SelectItem>
              <SelectItem value="CUSTOMER">Customer</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">{filtered.length} users</div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Orders</TableHead>
                <TableHead>Joined At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((u) => {
                const badge = roleBadge[u.role] || { variant: 'outline', label: u.role };
                const uStatus = u.isActive ? 'active' : 'banned';
                const sBadge = statusBadge[uStatus];
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name || u.email}`} />
                          <AvatarFallback className="text-xs">{(u.name || u.email).substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{u.name || 'No name'}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={badge.variant as any}>{badge.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={sBadge.variant as any}>{sBadge.label}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">0</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(u.createdAt.toString(), 'short')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Impersonate">
                          <Eye className="h-4 w-4" />
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
                            <DropdownMenuItem>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Impersonate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {u.isActive ? (
                              <DropdownMenuItem onClick={() => setBanDialog(u)} className="text-amber-500">
                                <Ban className="mr-2 h-4 w-4" />
                                Ban User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleToggleStatusFast(u.id, u.isActive)} className="text-emerald-500">
                                <UserCheck className="mr-2 h-4 w-4" />
                                Unban User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
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

      <Dialog open={!!banDialog} onOpenChange={(o) => { if (!o) setBanDialog(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Ban User
            </DialogTitle>
            <DialogDescription>
              This will restrict {banDialog?.name} from accessing the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg border p-3 text-sm">
              <div className="flex items-center gap-2 mb-1">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px]">{banDialog?.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{banDialog?.name}</span>
              </div>
              <p className="text-muted-foreground">{banDialog?.email}</p>
              <p className="text-muted-foreground">Role: {banDialog?.role.replace('_', ' ')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="notifyUser" defaultChecked />
              <Label htmlFor="notifyUser">Notify user via email</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setBanDialog(null)}>Ban User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
