'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Download,
  CalendarDays,
  Building2,
  Store,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  revenue: Math.floor(Math.random() * 5000000 + 2000000),
  commission: Math.floor(Math.random() * 1000000 + 500000),
  orders: Math.floor(Math.random() * 50000 + 20000),
}));

const quarterlyRevenue = [
  { quarter: 'Q1 2025', revenue: 8500000, commission: 1800000 },
  { quarter: 'Q2 2025', revenue: 9200000, commission: 1950000 },
  { quarter: 'Q3 2025', revenue: 10100000, commission: 2100000 },
  { quarter: 'Q4 2025', revenue: 11500000, commission: 2400000 },
  { quarter: 'Q1 2026', revenue: 9800000, commission: 2050000 },
  { quarter: 'Q2 2026', revenue: 11200000, commission: 2350000 },
];

const yearlyRevenue = [
  { year: '2022', revenue: 25000000, commission: 5200000 },
  { year: '2023', revenue: 42000000, commission: 8800000 },
  { year: '2024', revenue: 68000000, commission: 14200000 },
  { year: '2025', revenue: 92000000, commission: 19200000 },
  { year: '2026', revenue: 52000000, commission: 10900000 },
];

const revenueByOrg = [
  { name: 'MegaFood Parks Ltd.', revenue: 4200000, share: 34 },
  { name: 'Spice Route Group', revenue: 2750000, share: 22 },
  { name: 'Foodie Group Inc.', revenue: 2450000, share: 20 },
  { name: 'TasteTown Pvt. Ltd.', revenue: 1980000, share: 16 },
  { name: 'Others', revenue: 1100000, share: 8 },
];

const revenueByMall = [
  { name: 'Forum Mall', revenue: 1250000 },
  { name: 'Select Citywalk', revenue: 920000 },
  { name: 'Grand Mall - Sector 18', revenue: 890000 },
  { name: 'DLF Avenue', revenue: 780000 },
  { name: 'City Center Mall', revenue: 620000 },
  { name: 'Phoenix MarketCity', revenue: 560000 },
  { name: 'Pacific Mall', revenue: 480000 },
];

const COLORS = ['#E11D48', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

export default function RevenuePage() {
  const [period, setPeriod] = useState('monthly');
  const [view, setView] = useState('overview');

  const revenueData = period === 'monthly' ? monthlyRevenue : period === 'quarterly' ? quarterlyRevenue : yearlyRevenue;
  const dataKey = period === 'monthly' ? 'month' : period === 'quarterly' ? 'quarter' : 'year';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Revenue Overview</h1>
          <p className="text-sm text-muted-foreground">Global platform revenue analytics.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="rounded-lg p-2.5 bg-rose-100 dark:bg-rose-950/50">
                <IndianRupee className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                <ArrowUpRight className="h-3 w-3" /> +18.3%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{formatCurrency(12450000)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Total Revenue (MTD)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="rounded-lg p-2.5 bg-blue-100 dark:bg-blue-950/50">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                <ArrowUpRight className="h-3 w-3" /> +12.5%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{formatCurrency(2600000)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Platform Commission (MTD)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="rounded-lg p-2.5 bg-amber-100 dark:bg-amber-950/50">
                <ShoppingBag className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                <ArrowUpRight className="h-3 w-3" /> +8.7%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">48,234</p>
              <p className="mt-1 text-xs text-muted-foreground">Total Orders (MTD)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="rounded-lg p-2.5 bg-purple-100 dark:bg-purple-950/50">
                <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                <ArrowUpRight className="h-3 w-3" /> +5.2%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{formatCurrency(258)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Avg. Order Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Revenue Trend</CardTitle>
              <CardDescription>
                {period === 'monthly' ? 'Monthly' : period === 'quarterly' ? 'Quarterly' : 'Yearly'} revenue and commission
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-primary" /> Revenue</div>
              <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-primary/40" /> Commission</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="saRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E11D48" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E11D48" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey={dataKey} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '13px' }}
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E11D48" fill="url(#saRevGrad)" strokeWidth={2} name="Revenue" />
                <Area type="monotone" dataKey="commission" stroke="#E11D48" fill="none" strokeWidth={2} strokeOpacity={0.4} name="Commission" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue by Organization</CardTitle>
            <CardDescription>Top organizations by revenue contribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueByOrg.map((org, i) => (
                <div key={org.name} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: COLORS[i] + '20', color: COLORS[i] }}>
                    {org.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{org.name}</p>
                      <p className="text-sm font-medium">{formatCurrency(org.revenue)}</p>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-muted">
                        <div className="h-full rounded-full" style={{ width: `${org.share}%`, backgroundColor: COLORS[i] }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{org.share}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue by Mall</CardTitle>
            <CardDescription>Top malls by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueByMall.map((mall) => (
                <div key={mall.name} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{mall.name}</span>
                  </div>
                  <span className="text-sm font-bold">{formatCurrency(mall.revenue)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Revenue Distribution</CardTitle>
          <CardDescription>By organization share</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByOrg}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="revenue"
                  nameKey="name"
                >
                  {revenueByOrg.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '13px' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {revenueByOrg.map((org, i) => (
              <div key={org.name} className="flex items-center gap-1.5 text-xs">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-muted-foreground">{org.name}</span>
                <span className="font-medium">{org.share}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
