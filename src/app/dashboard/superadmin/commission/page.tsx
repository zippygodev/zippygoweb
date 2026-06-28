'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Percent,
  Building2,
  Store,
  ShoppingBag,
  IndianRupee,
  Plus,
  Search,
  Edit3,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface CommissionRate {
  id: string;
  entity: string;
  type: 'organization' | 'mall' | 'restaurant';
  rate: number;
  type_rate: 'percentage' | 'fixed';
  minAmount: number;
  status: 'active' | 'inactive';
}

const commissionRates: CommissionRate[] = [
  { id: 'CR-001', entity: 'Foodie Group Inc.', type: 'organization', rate: 18, type_rate: 'percentage', minAmount: 10000, status: 'active' },
  { id: 'CR-002', entity: 'Grand Mall - Sector 18', type: 'mall', rate: 20, type_rate: 'percentage', minAmount: 5000, status: 'active' },
  { id: 'CR-003', entity: 'Punjab Dhaba', type: 'restaurant', rate: 18, type_rate: 'percentage', minAmount: 1000, status: 'active' },
  { id: 'CR-004', entity: 'Sushi World', type: 'restaurant', rate: 20, type_rate: 'percentage', minAmount: 1000, status: 'active' },
  { id: 'CR-005', entity: 'MegaFood Parks Ltd.', type: 'organization', rate: 16, type_rate: 'percentage', minAmount: 15000, status: 'active' },
  { id: 'CR-006', entity: 'DineEasy Corp', type: 'organization', rate: 15, type_rate: 'percentage', minAmount: 8000, status: 'inactive' },
];

interface Payout {
  id: string;
  entity: string;
  amount: number;
  period: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  dueDate: string;
}

const payouts: Payout[] = [
  { id: 'PO-001', entity: 'Foodie Group Inc.', amount: 245000, period: 'June 2026', status: 'completed', dueDate: '2026-07-05' },
  { id: 'PO-002', entity: 'MegaFood Parks Ltd.', amount: 420000, period: 'June 2026', status: 'processing', dueDate: '2026-07-05' },
  { id: 'PO-003', entity: 'Spice Route Group', amount: 198000, period: 'June 2026', status: 'pending', dueDate: '2026-07-05' },
  { id: 'PO-004', entity: 'TasteTown Pvt. Ltd.', amount: 156000, period: 'June 2026', status: 'pending', dueDate: '2026-07-05' },
  { id: 'PO-005', entity: 'Foodie Group Inc.', amount: 220000, period: 'May 2026', status: 'completed', dueDate: '2026-06-05' },
  { id: 'PO-006', entity: 'Global Food Courts', amount: 89000, period: 'May 2026', status: 'failed', dueDate: '2026-06-05' },
];

const payoutStatusBadge: Record<string, { variant: 'success' | 'warning' | 'default' | 'destructive'; label: string }> = {
  completed: { variant: 'success', label: 'Completed' },
  processing: { variant: 'warning', label: 'Processing' },
  pending: { variant: 'default', label: 'Pending' },
  failed: { variant: 'destructive', label: 'Failed' },
};

export default function CommissionPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filtered = commissionRates.filter((c) =>
    c.entity.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Commission Management</h1>
          <p className="text-sm text-muted-foreground">Manage commission rates and payouts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="rounded-lg p-2.5 bg-emerald-100 dark:bg-emerald-950/50">
                <IndianRupee className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                <ArrowUpRight className="h-3 w-3" /> +15.2%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{formatCurrency(2600000)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Commission Earned (MTD)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="rounded-lg p-2.5 bg-amber-100 dark:bg-amber-950/50">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{formatCurrency(890000)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Pending Payouts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="rounded-lg p-2.5 bg-blue-100 dark:bg-blue-950/50">
                <Percent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">18.2%</p>
              <p className="mt-1 text-xs text-muted-foreground">Avg. Commission Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rates">
        <TabsList>
          <TabsTrigger value="rates">Commission Rates</TabsTrigger>
          <TabsTrigger value="earnings">Commission Earned</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="rates" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search commission rates..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="h-9 rounded-lg border-none bg-muted pl-10 pr-4 text-sm"
              />
            </div>
            <Button size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" />
              Add Rate
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Rate</TableHead>
                    <TableHead className="text-right">Min. Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((cr) => (
                    <TableRow key={cr.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {cr.type === 'organization' ? <Building2 className="h-4 w-4 text-muted-foreground" /> :
                           cr.type === 'mall' ? <Store className="h-4 w-4 text-muted-foreground" /> :
                           <ShoppingBag className="h-4 w-4 text-muted-foreground" />}
                          <span className="text-sm font-medium">{cr.entity}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{cr.type}</Badge>
                      </TableCell>
                      <TableCell className="text-center font-bold text-lg">
                        {cr.rate}{cr.type_rate === 'percentage' ? '%' : '/order'}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(cr.minAmount)}</TableCell>
                      <TableCell>
                        <Badge variant={cr.status === 'active' ? 'success' : 'warning'}>{cr.status === 'active' ? 'Active' : 'Inactive'}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </TabsContent>

        <TabsContent value="earnings">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Commission Earned Report</CardTitle>
              <CardDescription>Monthly commission breakdown by entity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Array.from({ length: 6 }, (_, i) => ({
                    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
                    commission: Math.floor(Math.random() * 500000 + 200000),
                    target: 350000,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Bar dataKey="commission" name="Commission" fill="#E11D48" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" name="Target" fill="#E11D48" radius={[4, 4, 0, 0]} opacity={0.2} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{payouts.filter(p => p.status === 'pending').length} pending payouts</p>
            <Button size="sm" className="h-9">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Process All
            </Button>
          </div>
          <div className="space-y-3">
            {payouts.map((po) => (
              <div key={po.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{po.entity}</p>
                    <p className="text-xs text-muted-foreground">{po.period} &middot; Due {po.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatCurrency(po.amount)}</p>
                    <Badge variant={payoutStatusBadge[po.status].variant} className="text-[10px]">{payoutStatusBadge[po.status].label}</Badge>
                  </div>
                  {po.status === 'pending' && (
                    <Button size="sm" variant="outline" className="h-8">Process</Button>
                  )}
                  {po.status === 'failed' && (
                    <Button size="sm" variant="outline" className="h-8 text-destructive border-destructive">Retry</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Commission Rules</CardTitle>
              <CardDescription>Define commission calculation rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium">Default Platform Commission</p>
                  <p className="text-xs text-muted-foreground">Applied to all new organizations</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue={18} className="h-8 w-20 text-center" />
                  <span className="text-sm">%</span>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium">Minimum Commission Threshold</p>
                  <p className="text-xs text-muted-foreground">Minimum monthly commission per restaurant</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue={1000} className="h-8 w-24 text-center" />
                  <span className="text-sm">₹</span>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium">Tiered Commission (Enterprise)</p>
                  <p className="text-xs text-muted-foreground">Reduced rate for high-volume organizations</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <span className="text-sm text-muted-foreground">Enabled</span>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium">Commission Cap</p>
                  <p className="text-xs text-muted-foreground">Maximum commission per order</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue={500} className="h-8 w-24 text-center" />
                  <span className="text-sm">₹</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

}
