'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatDate, getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  Users,
  Search,
  Filter,
  Download,
  Ban,
  CheckCircle2,
  Mail,
  Phone,
  CalendarDays,
  Shield,
  UserX,
  UserCheck,
  MoreHorizontal,
  Eye,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'RESTAURANT_OWNER' | 'DELIVERY_PARTNER' | 'ADMIN';
  status: 'ACTIVE' | 'BANNED' | 'SUSPENDED';
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  avatar?: string;
}

const users: User[] = [
  { id: 'U-001', name: 'Rahul Sharma', email: 'rahul.s@email.com', phone: '+91 98765 43201', role: 'CUSTOMER', status: 'ACTIVE', joinedDate: '2024-01-10', totalOrders: 45, totalSpent: 28500 },
  { id: 'U-002', name: 'Priya Mehta', email: 'priya.m@email.com', phone: '+91 98765 43202', role: 'CUSTOMER', status: 'ACTIVE', joinedDate: '2024-02-15', totalOrders: 32, totalSpent: 19200 },
  { id: 'U-003', name: 'Gurpreet Singh', email: 'gurpreet@punjabdhaba.com', phone: '+91 98765 43210', role: 'RESTAURANT_OWNER', status: 'ACTIVE', joinedDate: '2024-01-15', totalOrders: 0, totalSpent: 0 },
  { id: 'U-004', name: 'Amit Kumar', email: 'amit.k@email.com', phone: '+91 98765 43203', role: 'CUSTOMER', status: 'ACTIVE', joinedDate: '2024-03-01', totalOrders: 28, totalSpent: 15600 },
  { id: 'U-005', name: 'Vikram Desai', email: 'vikram.d@email.com', phone: '+91 98765 43204', role: 'DELIVERY_PARTNER', status: 'ACTIVE', joinedDate: '2024-02-20', totalOrders: 156, totalSpent: 0 },
  { id: 'U-006', name: 'Neha Gupta', email: 'neha.g@email.com', phone: '+91 98765 43205', role: 'CUSTOMER', status: 'BANNED', joinedDate: '2024-01-25', totalOrders: 12, totalSpent: 8400 },
  { id: 'U-007', name: 'Raj Patel', email: 'raj.p@email.com', phone: '+91 98765 43206', role: 'RESTAURANT_OWNER', status: 'SUSPENDED', joinedDate: '2024-03-10', totalOrders: 0, totalSpent: 0 },
  { id: 'U-008', name: 'Sneha Patel', email: 'sneha.p@email.com', phone: '+91 98765 43207', role: 'CUSTOMER', status: 'ACTIVE', joinedDate: '2024-04-05', totalOrders: 18, totalSpent: 11200 },
  { id: 'U-009', name: 'Rohit Verma', email: 'rohit.v@email.com', phone: '+91 98765 43208', role: 'DELIVERY_PARTNER', status: 'ACTIVE', joinedDate: '2024-03-15', totalOrders: 98, totalSpent: 0 },
  { id: 'U-010', name: 'Anjali Singh', email: 'anjali.s@email.com', phone: '+91 98765 43209', role: 'CUSTOMER', status: 'ACTIVE', joinedDate: '2024-05-01', totalOrders: 8, totalSpent: 5200 },
  { id: 'U-011', name: 'Kenji Tanaka', email: 'kenji@sushiworld.com', phone: '+91 98765 43211', role: 'RESTAURANT_OWNER', status: 'ACTIVE', joinedDate: '2024-02-01', totalOrders: 0, totalSpent: 0 },
  { id: 'U-012', name: 'Marco Rossi', email: 'marco@pizzaplanet.com', phone: '+91 98765 43212', role: 'RESTAURANT_OWNER', status: 'ACTIVE', joinedDate: '2024-01-20', totalOrders: 0, totalSpent: 0 },
];

const roleOptions = ['All', 'CUSTOMER', 'RESTAURANT_OWNER', 'DELIVERY_PARTNER', 'ADMIN'];
const statusOptions = ['All', 'ACTIVE', 'BANNED', 'SUSPENDED'];

const roleBadge: Record<string, string> = {
  CUSTOMER: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  RESTAURANT_OWNER: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  DELIVERY_PARTNER: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  ADMIN: 'bg-primary/10 text-primary',
};

const userStatusBadge: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  BANNED: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  SUSPENDED: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const pageSize = 8;

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">Manage all platform users</p>
        </div>
        <Button variant="outline" size="sm" className="h-9">
          <Download className="mr-2 h-4 w-4" />
          Export List
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="h-9 rounded-lg pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[160px]">
              <Shield className="mr-2 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((r) => (
                <SelectItem key={r} value={r}>{r === 'All' ? 'All Roles' : r.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    <Users className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((user) => (
                  <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setSelectedUser(user); setShowDetailDialog(true); }}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-[11px]', roleBadge[user.role])}>
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-[11px]', userStatusBadge[user.status])}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{user.role === 'CUSTOMER' ? user.totalOrders : '-'}</TableCell>
                    <TableCell className="text-sm">{user.role === 'CUSTOMER' ? `₹${user.totalSpent.toLocaleString()}` : '-'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(user.joinedDate, 'short')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedUser(user); setShowDetailDialog(true); }}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === 'ACTIVE' ? (
                            <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                              <Ban className="mr-2 h-4 w-4" /> Ban User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Reactivate
                            </DropdownMenuItem>
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
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Detailed information about this user.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="text-lg">{getInitials(selectedUser.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{selectedUser.name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className={cn('text-[11px]', roleBadge[selectedUser.role])}>
                      {selectedUser.role.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className={cn('text-[11px]', userStatusBadge[selectedUser.status])}>
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedUser.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {formatDate(selectedUser.joinedDate, 'long')}</span>
                </div>
              </div>

              {selectedUser.role === 'CUSTOMER' && (
                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedUser.totalOrders}</p>
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">₹{selectedUser.totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                </div>
              )}

              {selectedUser.role === 'DELIVERY_PARTNER' && (
                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedUser.totalOrders}</p>
                    <p className="text-xs text-muted-foreground">Deliveries</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">4.8 ★</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  {selectedUser.status === 'BANNED' ? (
                    <UserX className="h-5 w-5 text-destructive" />
                  ) : (
                    <UserCheck className="h-5 w-5 text-emerald-500" />
                  )}
                  <span className="text-sm font-medium">
                    {selectedUser.status === 'ACTIVE' ? 'Active Account' : selectedUser.status === 'BANNED' ? 'Banned Account' : 'Suspended Account'}
                  </span>
                </div>
                <Button variant={selectedUser.status === 'ACTIVE' ? 'destructive' : 'default'} size="sm">
                  {selectedUser.status === 'ACTIVE' ? 'Ban User' : 'Reactivate'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
