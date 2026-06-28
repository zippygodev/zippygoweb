'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/toast';
import {
  Plus,
  Users,
  Search,
  Edit3,
  Trash2,
  Phone,
  Mail,
  CalendarDays,
  Clock,
  ChefHat,
  UserCircle,
  ShieldCheck,
  UserCog,
  UserPlus,
  UserX,
  MoreHorizontal,
  BadgeCheck,
  BadgeX,
  Star,
  Award,

  Filter,
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  avatar: string;
  active: boolean;
  joinedAt: string;
  shift: string;
  rating: number;
  permissions: string[];
}

const roles = [
  { value: 'admin', label: 'Admin', icon: ShieldCheck },
  { value: 'manager', label: 'Manager', icon: UserCog },
  { value: 'chef', label: 'Chef', icon: ChefHat },
  { value: 'waiter', label: 'Waiter', icon: UserCircle },
  { value: 'cashier', label: 'Cashier', icon: UserCircle },
];

// Removed mock data

const departmentColors: Record<string, string> = {
  Kitchen: 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300',
  Service: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
  Management: 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300',
  Billing: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
};

const emptyStaff: StaffMember = {
  id: '', name: '', email: '', phone: '', role: 'waiter', department: 'Service',
  avatar: '', active: true, joinedAt: new Date().toISOString().split('T')[0] as string,
  shift: 'Morning (8AM-4PM)', rating: 0, permissions: [],
};

function StaffCard({ member, onEdit, onToggle, onDelete }: { member: StaffMember; onEdit: (m: StaffMember) => void; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  const roleConfig = roles.find((r) => r.value === member.role);
  const RoleIcon = roleConfig?.icon || UserCircle;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'rounded-xl border bg-card p-4 transition-all hover:shadow-md',
        !member.active && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={member.avatar} />
          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-bold">{member.name}</span>
            {member.rating >= 4.8 && (
              <Badge variant="default" className="text-[8px] px-1 py-0 h-4">
                <Award className="h-2.5 w-2.5 mr-0.5" />
                TOP
              </Badge>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <RoleIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm capitalize text-muted-foreground">{member.role}</span>
            <Badge variant="outline" className={cn('text-[10px]', departmentColors[member.department] || '')}>
              {member.department}
            </Badge>
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-500" />
              <span>{member.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{member.shift}</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{member.email}</span>
          </div>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch checked={member.active} onCheckedChange={() => onToggle(member.id)} />
          <span className="text-xs text-muted-foreground">{member.active ? 'Active' : 'Inactive'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onEdit(member)}>
            <Edit3 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => onDelete(member.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function StaffDialog({ open, onOpenChange, member, onSave }: { open: boolean; onOpenChange: (open: boolean) => void; member: StaffMember; onSave: (member: StaffMember) => void }) {
  const [form, setForm] = useState<StaffMember>(member);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    onSave({ ...form, id: form.id || crypto.randomUUID() });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{member.id ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
          <DialogDescription>
            {member.id ? 'Update staff details and permissions' : 'Add a new member to your team'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={form.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name || 'new'}`} />
              <AvatarFallback>{form.name ? form.name.split(' ').map(n => n[0]).join('') : '?'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{form.name || 'Staff Name'}</p>
              <p className="text-xs text-muted-foreground capitalize">{form.role}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Full name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="email@example.com" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={form.role} onValueChange={(value) => setForm((prev) => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex items-center gap-2">
                        <role.icon className="h-4 w-4" />
                        <span>{role.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select value={form.department} onValueChange={(value) => setForm((prev) => ({ ...prev, department: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kitchen">Kitchen</SelectItem>
                  <SelectItem value="Service">Service</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Billing">Billing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Shift</label>
              <Select value={form.shift} onValueChange={(value) => setForm((prev) => ({ ...prev, shift: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning (8AM-4PM)">Morning (8AM-4PM)</SelectItem>
                  <SelectItem value="Evening (4PM-12AM)">Evening (4PM-12AM)</SelectItem>
                  <SelectItem value="Night (12AM-8AM)">Night (12AM-8AM)</SelectItem>
                  <SelectItem value="Flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Permissions</label>
            <div className="grid grid-cols-2 gap-2 rounded-lg border p-3">
              {form.role === 'admin' || form.role === 'manager' ? (
                <div className="col-span-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Full access (all permissions)
                </div>
              ) : (
                [
                  { key: 'take_orders', label: 'Take Orders' },
                  { key: 'update_status', label: 'Update Status' },
                  { key: 'process_payments', label: 'Process Payments' },
                  { key: 'view_menu', label: 'View Menu' },
                  { key: 'manage_orders', label: 'Manage Orders' },
                  { key: 'generate_receipts', label: 'Generate Receipts' },
                  { key: 'serve', label: 'Serve Customers' },
                  { key: 'manage_inventory', label: 'Manage Inventory' },
                ].map((perm) => (
                  <label key={perm.key} className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={form.permissions.includes(perm.key)}
                      onCheckedChange={(checked) => {
                        setForm((prev) => ({
                          ...prev,
                          permissions: checked
                            ? [...prev.permissions, perm.key]
                            : prev.permissions.filter((p) => p !== perm.key),
                        }));
                      }}
                    />
                    {perm.label}
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={form.active} onCheckedChange={(checked) => setForm((prev) => ({ ...prev, active: checked }))} />
            <span className="text-sm">Active</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>{member.id ? 'Save Changes' : 'Add Staff'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { addStaff, removeStaff, toggleStaffStatus } from '@/actions/restaurant/staff';

export default function StaffClient({ initialStaff }: { initialStaff: any[] }) {
  const [staff, setStaff] = useState<any[]>(initialStaff);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editMember, setEditMember] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Map server staff model to UI expected model
  const formattedStaff = staff.map(s => ({
    id: s.id,
    name: s.user?.name || 'Unknown',
    email: s.user?.email || '',
    phone: s.user?.phone || '',
    role: s.role?.toLowerCase() || 'staff',
    department: 'Service', // Mocking this as DB doesn't have it
    avatar: s.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.user?.name || 'user'}`,
    active: s.isActive,
    joinedAt: new Date(s.createdAt).toISOString().split('T')[0],
    shift: 'Flexible', // Mock
    rating: 4.5, // Mock
    permissions: s.permissions ? JSON.parse(s.permissions) : [],
  }));

  const filtered = formattedStaff.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSave = async (member: any) => {
    const formData = new FormData();
    formData.append('name', member.name);
    formData.append('email', member.email);
    formData.append('role', member.role.toUpperCase());
    
    // For simplicity, we just add or mock update via addStaff action
    const res = await addStaff(formData);
    
    if (res.success) {
      toast({ title: 'Success', description: `Staff member saved.`, variant: 'success' });
      setDialogOpen(false);
      // Wait for server revalidation to refresh UI
    } else {
      toast({ title: 'Error', description: res.error || 'Failed to save staff.', variant: 'destructive' });
    }
  };

  const handleToggle = async (id: string) => {
    const member = formattedStaff.find(m => m.id === id);
    if (!member) return;
    
    // Optimistic update
    setStaff((prev) => prev.map((m) => m.id === id ? { ...m, isActive: !m.isActive } : m));
    
    const res = await toggleStaffStatus(id, !member.active);
    if (res.success) {
      toast({ title: 'Status Updated', description: `${member.name} status updated.`, variant: 'success' });
    } else {
      // Revert optimistic update
      setStaff((prev) => prev.map((m) => m.id === id ? { ...m, isActive: member.active } : m));
      toast({ title: 'Error', description: res.error || 'Failed to update status.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    const res = await removeStaff(deleteId);
    if (res.success) {
      toast({ title: 'Staff Removed', variant: 'destructive' });
      setDeleteId(null);
    } else {
      toast({ title: 'Error', description: res.error || 'Failed to remove staff.', variant: 'destructive' });
    }
  };

  const handleAdd = () => {
    setEditMember(emptyStaff);
    setDialogOpen(true);
  };

  const activeCount = formattedStaff.filter((m) => m.active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Staff</h1>
          <p className="text-sm text-muted-foreground">Manage your restaurant team</p>
        </div>
        <Button size="sm" className="h-9" onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Staff', value: formattedStaff.length, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Active Now', value: activeCount, icon: BadgeCheck, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-950/50' },
          { label: 'In Kitchen', value: formattedStaff.filter((m) => m.department === 'Kitchen' && m.active).length, icon: ChefHat, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-950/50' },
          { label: 'On Service', value: formattedStaff.filter((m) => m.department === 'Service' && m.active).length, icon: UserCircle, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-950/50' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={cn('rounded-lg p-2.5', stat.bg)}>
                  <Icon className={cn('h-5 w-5', stat.color)} />
                </div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search staff by name, email, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-9 w-[160px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((member) => (
            <StaffCard
              key={member.id}
              member={member as any}
              onEdit={(m) => { setEditMember(m); setDialogOpen(true); }}
              onToggle={handleToggle}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold">No staff found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchQuery || roleFilter !== 'all' ? 'Try adjusting your filters' : 'Add your first staff member'}
          </p>
          {!searchQuery && roleFilter === 'all' && (
            <Button className="mt-4" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          )}
        </div>
      )}

      <StaffDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={editMember || emptyStaff}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this staff member? They will lose access to the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
