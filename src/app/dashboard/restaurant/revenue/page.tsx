'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/toast';
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  CreditCard,
  Smartphone,
  Wallet,
  Download,
  PieChart,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Landmark,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';

const revenueData = [
  { day: 'Mon', revenue: 18500, orders: 32, avgOrder: 578 },
  { day: 'Tue', revenue: 22300, orders: 45, avgOrder: 496 },
  { day: 'Wed', revenue: 19800, orders: 38, avgOrder: 521 },
  { day: 'Thu', revenue: 25600, orders: 52, avgOrder: 492 },
  { day: 'Fri', revenue: 31200, orders: 61, avgOrder: 511 },
  { day: 'Sat', revenue: 28500, orders: 55, avgOrder: 518 },
  { day: 'Sun', revenue: 24500, orders: 48, avgOrder: 510 },
];

const weeklyData = [
  { week: 'Week 1', revenue: 142000, commission: 7100, payout: 134900 },
  { week: 'Week 2', revenue: 158000, commission: 7900, payout: 150100 },
  { week: 'Week 3', revenue: 135000, commission: 6750, payout: 128250 },
  { week: 'Week 4', revenue: 165000, commission: 8250, payout: 156750 },
];

const monthlyData = [
  { month: 'Jan', revenue: 420000, commission: 21000, payout: 399000 },
  { month: 'Feb', revenue: 380000, commission: 19000, payout: 361000 },
  { month: 'Mar', revenue: 510000, commission: 25500, payout: 484500 },
  { month: 'Apr', revenue: 460000, commission: 23000, payout: 437000 },
  { month: 'May', revenue: 540000, commission: 27000, payout: 513000 },
  { month: 'Jun', revenue: 480000, commission: 24000, payout: 456000 },
];

const paymentMethods = [
  { name: 'UPI', value: 45, amount: 1091250, color: '#E11D48' },
  { name: 'Credit Card', value: 25, amount: 606250, color: '#3B82F6' },
  { name: 'Cash', value: 18, amount: 436500, color: '#10B981' },
  { name: 'Debit Card', value: 8, amount: 194000, color: '#F59E0B' },
  { name: 'Wallet', value: 4, amount: 97000, color: '#8B5CF6' },
];

const payoutHistory = [
  { id: 'PYT-001', period: 'Jun 16-30, 2024', amount: 156750, status: 'COMPLETED', date: '2024-07-05', method: 'Bank Transfer' },
  { id: 'PYT-002', period: 'Jun 1-15, 2024', amount: 148200, status: 'COMPLETED', date: '2024-06-20', method: 'Bank Transfer' },
  { id: 'PYT-003', period: 'May 16-31, 2024', amount: 162400, status: 'COMPLETED', date: '2024-06-05', method: 'Bank Transfer' },
  { id: 'PYT-004', period: 'May 1-15, 2024', amount: 139800, status: 'COMPLETED', date: '2024-05-20', method: 'Bank Transfer' },
  { id: 'PYT-005', period: 'Apr 16-30, 2024', amount: 153600, status: 'PENDING', date: '2024-07-05', method: 'Bank Transfer' },
];

const PIE_COLORS = ['#E11D48', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

export default function RevenuePage() {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [period, setPeriod] = useState('this-month');

  const chartData = viewMode === 'daily' ? revenueData : viewMode === 'weekly' ? weeklyData : monthlyData;
  const dataKeyX = viewMode === 'daily' ? 'day' : viewMode === 'weekly' ? 'week' : 'month';
  const totalRevenue = chartData.reduce((sum, d: any) => sum + d.revenue, 0);
  const totalCommission = chartData.reduce((sum, d: any) => sum + (d.commission || 0), 0);
  const totalPayout = chartData.reduce((sum, d: any) => sum + (d.payout || 0), 0);
  const totalOrders = chartData.reduce((sum, d: any) => sum + (d.orders || 0), 0);

  const handleExport = () => {
    toast({ title: 'Export Started', description: 'Downloading revenue report...', variant: 'success' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Revenue</h1>
          <p className="text-sm text-muted-foreground">Track earnings, commissions, and payouts</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-9 w-[150px]">
              <CalendarDays className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), change: '+12.5%', trend: 'up', icon: IndianRupee, bg: 'bg-emerald-100 dark:bg-emerald-950/50', color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Commission', value: formatCurrency(totalCommission), change: '-', trend: 'up', icon: Landmark, bg: 'bg-blue-100 dark:bg-blue-950/50', color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Net Payout', value: formatCurrency(totalPayout), change: '+10.8%', trend: 'up', icon: Wallet, bg: 'bg-purple-100 dark:bg-purple-950/50', color: 'text-purple-600 dark:text-purple-400' },
          { label: 'Total Orders', value: totalOrders.toString(), change: '+8.3%', trend: 'up', icon: TrendingUp, bg: 'bg-amber-100 dark:bg-amber-950/50', color: 'text-amber-600 dark:text-amber-400' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={cn('rounded-lg p-2', stat.bg)}>
                    <Icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                  <span className={cn(
                    'inline-flex items-center gap-0.5 text-xs font-medium',
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  )}>
                    {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.change}
                  </span>
                </div>
                <p className="mt-3 text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-1 w-fit">
        {(['daily', 'weekly', 'monthly'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              viewMode === mode ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue Trend</CardTitle>
            <CardDescription>{viewMode === 'daily' ? 'Daily' : viewMode === 'weekly' ? 'Weekly' : 'Monthly'} revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E11D48" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#E11D48" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey={dataKeyX} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#E11D48" fill="url(#revGradient)" strokeWidth={2} name="Revenue" />
                  {(viewMode === 'weekly' || viewMode === 'monthly') && (
                    <Area type="monotone" dataKey="payout" stroke="#10B981" fill="none" strokeWidth={2} name="Payout" />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Payment Methods</CardTitle>
            <CardDescription>Breakdown by payment type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={paymentMethods} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                    {paymentMethods.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {paymentMethods.map((method) => (
                <div key={method.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[paymentMethods.indexOf(method)] }} />
                    <span>{method.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(method.amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {viewMode === 'monthly' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Commission Details</CardTitle>
            <CardDescription>Platform commission at 5% per transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                  <Bar dataKey="revenue" fill="#E11D48" radius={[4, 4, 0, 0]} name="Revenue" />
                  <Bar dataKey="commission" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Commission" />
                  <Bar dataKey="payout" fill="#10B981" radius={[4, 4, 0, 0]} name="Payout" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Payout History</CardTitle>
              <CardDescription>Recent payouts to your account</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8">
              <FileText className="mr-2 h-4 w-4" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payoutHistory.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg',
                    payout.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-950/50' : 'bg-amber-100 dark:bg-amber-950/50'
                  )}>
                    {payout.status === 'COMPLETED' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{payout.period}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{payout.id}</span>
                      <span>{payout.method}</span>
                      <Badge variant={payout.status === 'COMPLETED' ? 'success' : 'warning'} className="text-[10px]">
                        {payout.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatCurrency(payout.amount)}</p>
                  <p className="text-xs text-muted-foreground">{payout.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
