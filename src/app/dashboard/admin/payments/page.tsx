'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate } from '@/lib/utils';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  IndianRupee,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Transaction {
  id: string;
  orderId: string;
  restaurant: string;
  amount: number;
  fee: number;
  netAmount: number;
  method: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
  date: string;
  type: 'PAYMENT' | 'REFUND' | 'SETTLEMENT';
}

const transactions: Transaction[] = [
  { id: 'TXN-001', orderId: 'ZG-7A8B', restaurant: 'Punjab Dhaba', amount: 1250, fee: 225, netAmount: 1025, method: 'UPI', status: 'COMPLETED', date: '2024-06-27T10:30:00', type: 'PAYMENT' },
  { id: 'TXN-002', orderId: 'ZG-9C0D', restaurant: 'Sushi World', amount: 780, fee: 156, netAmount: 624, method: 'Card', status: 'COMPLETED', date: '2024-06-27T10:25:00', type: 'PAYMENT' },
  { id: 'TXN-003', orderId: 'ZG-1E2F', restaurant: 'Pizza Planet', amount: 950, fee: 0, netAmount: 950, method: 'Cash', status: 'PENDING', date: '2024-06-27T10:15:00', type: 'PAYMENT' },
  { id: 'TXN-004', orderId: 'ZG-7K8L', restaurant: 'Burger Barn', amount: 1120, fee: 0, netAmount: -1120, method: 'UPI', status: 'REFUNDED', date: '2024-06-27T09:15:00', type: 'REFUND' },
  { id: 'TXN-005', orderId: 'ZG-5I6J', restaurant: 'Punjab Dhaba', amount: 640, fee: 115, netAmount: 525, method: 'Card', status: 'COMPLETED', date: '2024-06-27T09:30:00', type: 'PAYMENT' },
  { id: 'TXN-006', orderId: 'ZG-8M9N', restaurant: 'Taco Fiesta', amount: 1560, fee: 281, netAmount: 1279, method: 'Card', status: 'COMPLETED', date: '2024-06-27T09:00:00', type: 'PAYMENT' },
  { id: 'TXN-007', orderId: 'ZG-0P1Q', restaurant: 'Waffle House', amount: 450, fee: 68, netAmount: 382, method: 'UPI', status: 'COMPLETED', date: '2024-06-27T08:45:00', type: 'PAYMENT' },
  { id: 'TXN-008', orderId: 'ZG-4T5U', restaurant: 'Sushi World', amount: 3200, fee: 640, netAmount: 2560, method: 'Card', status: 'COMPLETED', date: '2024-06-27T08:00:00', type: 'PAYMENT' },
  { id: 'TXN-009', orderId: 'SET-001', restaurant: 'Punjab Dhaba', amount: 42500, fee: 0, netAmount: 34850, method: 'Bank Transfer', status: 'COMPLETED', date: '2024-06-26T00:00:00', type: 'SETTLEMENT' },
  { id: 'TXN-010', orderId: 'SET-002', restaurant: 'Sushi World', amount: 38500, fee: 0, netAmount: 30800, method: 'Bank Transfer', status: 'COMPLETED', date: '2024-06-26T00:00:00', type: 'SETTLEMENT' },
];

const revenueData = [
  { name: 'Mon', revenue: 42500, fees: 7200 },
  { name: 'Tue', revenue: 52300, fees: 8800 },
  { name: 'Wed', revenue: 46800, fees: 7500 },
  { name: 'Thu', revenue: 55600, fees: 9200 },
  { name: 'Fri', revenue: 61200, fees: 10200 },
  { name: 'Sat', revenue: 58500, fees: 9800 },
  { name: 'Sun', revenue: 52400, fees: 8600 },
];

const methodData = [
  { name: 'UPI', value: 45 },
  { name: 'Card', value: 30 },
  { name: 'Cash', value: 15 },
  { name: 'Wallet', value: 10 },
];

const COLORS = ['#E11D48', '#3B82F6', '#10B981', '#F59E0B'];

const statusBadge: Record<string, string> = {
  COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  FAILED: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  REFUNDED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
};

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filtered = transactions.filter((t) => {
    const matchesSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const stats = {
    totalRevenue: transactions.filter(t => t.type === 'PAYMENT').reduce((s, t) => s + t.amount, 0),
    totalFees: transactions.filter(t => t.type === 'PAYMENT').reduce((s, t) => s + t.fee, 0),
    totalRefunds: transactions.filter(t => t.type === 'REFUND').reduce((s, t) => s + Math.abs(t.amount), 0),
    pendingSettlements: transactions.filter(t => t.type === 'SETTLEMENT' && t.status === 'PENDING').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground">Manage transactions, refunds, and settlements</p>
        </div>
        <Button variant="outline" size="sm" className="h-9">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-emerald-100 dark:bg-emerald-950/50 p-2.5">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-blue-100 dark:bg-blue-950/50 p-2.5">
                <IndianRupee className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold">{formatCurrency(stats.totalFees)}</p>
            <p className="text-xs text-muted-foreground">Platform Fees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-purple-100 dark:bg-purple-950/50 p-2.5">
                <RotateCcw className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold">{formatCurrency(stats.totalRefunds)}</p>
            <p className="text-xs text-muted-foreground">Total Refunds</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-amber-100 dark:bg-amber-950/50 p-2.5">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold">{stats.pendingSettlements}</p>
            <p className="text-xs text-muted-foreground">Pending Settlements</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue vs Fees</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '13px' }}
                    formatter={(value: number) => [formatCurrency(value), '']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#E11D48" strokeWidth={2} dot={{ fill: '#E11D48' }} />
                  <Line type="monotone" dataKey="fees" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Payment Methods</CardTitle>
            <CardDescription>Distribution</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={methodData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {methodData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '13px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex w-full justify-center gap-3">
              {methodData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="settlements">Settlements</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
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
                {['All', 'COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'].map((s) => (
                  <SelectItem key={s} value={s}>{s === 'All' ? 'All Status' : s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Net</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                        <IndianRupee className="mx-auto h-8 w-8 mb-2 opacity-50" />
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="text-xs font-medium">{txn.id}</TableCell>
                        <TableCell className="text-xs">{txn.orderId}</TableCell>
                        <TableCell className="text-sm">{txn.restaurant}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(txn.amount)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{txn.fee > 0 ? formatCurrency(txn.fee) : '-'}</TableCell>
                        <TableCell className={cn('font-medium', txn.netAmount < 0 ? 'text-red-500' : 'text-emerald-600')}>
                          {txn.netAmount < 0 ? '-' : ''}{formatCurrency(Math.abs(txn.netAmount))}
                        </TableCell>
                        <TableCell className="text-xs">{txn.method}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('text-[11px]', statusBadge[txn.status])}>
                            {txn.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{formatDate(txn.date)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settlements">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Settlement ID</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Gross Amount</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Net Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.filter(t => t.type === 'SETTLEMENT').map((stl) => (
                    <TableRow key={stl.id}>
                      <TableCell className="text-xs font-medium">{stl.id}</TableCell>
                      <TableCell>{stl.restaurant}</TableCell>
                      <TableCell>{formatCurrency(stl.amount)}</TableCell>
                      <TableCell className="text-muted-foreground">{formatCurrency(stl.amount - stl.netAmount)}</TableCell>
                      <TableCell className="font-medium text-emerald-600">{formatCurrency(stl.netAmount)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('text-[11px]', statusBadge[stl.status])}>{stl.status}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(stl.date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
}
