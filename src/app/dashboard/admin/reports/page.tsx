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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  Download,
  FileText,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Users,
  Store,
  ShoppingBag,
  Clock,
  IndianRupee,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const salesData = [
  { month: 'Jan', revenue: 285000, orders: 420, target: 250000 },
  { month: 'Feb', revenue: 312000, orders: 465, target: 280000 },
  { month: 'Mar', revenue: 298000, orders: 438, target: 300000 },
  { month: 'Apr', revenue: 345000, orders: 510, target: 320000 },
  { month: 'May', revenue: 378000, orders: 555, target: 350000 },
  { month: 'Jun', revenue: 362000, orders: 530, target: 380000 },
];

const userGrowthData = [
  { month: 'Jan', customers: 1200, owners: 8, partners: 15 },
  { month: 'Feb', customers: 1800, owners: 12, partners: 22 },
  { month: 'Mar', customers: 2400, owners: 15, partners: 30 },
  { month: 'Apr', customers: 3200, owners: 18, partners: 38 },
  { month: 'May', customers: 4100, owners: 22, partners: 45 },
  { month: 'Jun', customers: 5000, owners: 24, partners: 50 },
];

const peakHoursData = [
  { hour: '8AM', orders: 15 },
  { hour: '9AM', orders: 28 },
  { hour: '10AM', orders: 35 },
  { hour: '11AM', orders: 42 },
  { hour: '12PM', orders: 85 },
  { hour: '1PM', orders: 95 },
  { hour: '2PM', orders: 65 },
  { hour: '3PM', orders: 30 },
  { hour: '4PM', orders: 25 },
  { hour: '5PM', orders: 40 },
  { hour: '6PM', orders: 72 },
  { hour: '7PM', orders: 88 },
  { hour: '8PM', orders: 78 },
  { hour: '9PM', orders: 45 },
];

const restaurantPerformance = [
  { name: 'Punjab Dhaba', revenue: 425000, orders: 342, rating: 4.8, growth: '+15%' },
  { name: 'Sushi World', revenue: 385000, orders: 285, rating: 4.6, growth: '+12%' },
  { name: 'Pizza Planet', revenue: 312000, orders: 268, rating: 4.5, growth: '+8%' },
  { name: 'Dragon Wok', revenue: 278000, orders: 215, rating: 4.7, growth: '+20%' },
  { name: 'Burger Barn', revenue: 195000, orders: 198, rating: 4.3, growth: '+5%' },
  { name: 'Taco Fiesta', revenue: 142000, orders: 156, rating: 4.4, growth: '+18%' },
  { name: 'Waffle House', revenue: 168000, orders: 210, rating: 4.7, growth: '+10%' },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('7d');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">Comprehensive analytics and reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="h-9 w-[130px]">
              <CalendarDays className="mr-2 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="users">User Growth</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurant Performance</TabsTrigger>
          <TabsTrigger value="peak-hours">Peak Hours</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold">{formatCurrency(378000)}</p>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-muted-foreground">Peak Monthly Revenue</span>
                  <span className="flex items-center text-emerald-600"><ArrowUpRight className="h-3 w-3" /> 8.2%</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold">555</p>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-muted-foreground">Peak Orders</span>
                  <span className="flex items-center text-emerald-600"><ArrowUpRight className="h-3 w-3" /> 4.5%</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold">₹682</p>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-muted-foreground">Avg Order Value</span>
                  <span className="flex items-center text-emerald-600"><ArrowUpRight className="h-3 w-3" /> 3.1%</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold">94.2%</p>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-muted-foreground">Order Completion</span>
                  <span className="flex items-center text-emerald-600"><ArrowUpRight className="h-3 w-3" /> 1.2%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Monthly Revenue vs Target</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '13px' }}
                      formatter={(value: number) => [formatCurrency(value), '']}
                    />
                    <Bar dataKey="revenue" fill="#E11D48" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill="#E11D48" fillOpacity={0.2} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">User Growth</CardTitle>
              <CardDescription>Platform user growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowthData}>
                    <defs>
                      <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E11D48" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#E11D48" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '13px' }}
                    />
                    <Area type="monotone" dataKey="customers" stroke="#E11D48" fill="url(#customerGradient)" strokeWidth={2} name="Customers" />
                    <Line type="monotone" dataKey="owners" stroke="#3B82F6" strokeWidth={2} name="Restaurant Owners" />
                    <Line type="monotone" dataKey="partners" stroke="#10B981" strokeWidth={2} name="Delivery Partners" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restaurants" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Restaurant Performance</CardTitle>
              <CardDescription>Revenue and order metrics by restaurant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {restaurantPerformance.map((r, i) => (
                  <div key={r.name} className="flex items-center gap-4 rounded-lg border p-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{r.name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{r.orders} orders</span>
                        <span>{r.rating} ★</span>
                        <span className={cn('font-medium', r.growth.startsWith('+') ? 'text-emerald-600' : 'text-red-600')}>
                          {r.growth}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(r.revenue)}</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Full Report
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="peak-hours" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Peak Hours Analysis</CardTitle>
              <CardDescription>Order volume by hour of day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakHoursData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '13px' }}
                    />
                    <Bar dataKey="orders" fill="#E11D48" radius={[4, 4, 0, 0]}>
                      {peakHoursData.map((entry, i) => (
                        <rect key={i} fill={entry.orders > 80 ? '#E11D48' : entry.orders > 50 ? '#F43F5E' : '#FDA4AF'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-lg font-bold">12 PM - 2 PM</p>
                  <p className="text-xs text-muted-foreground">Lunch Peak</p>
                  <p className="mt-1 text-sm font-medium text-emerald-600">180 orders avg</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-lg font-bold">7 PM - 9 PM</p>
                  <p className="text-xs text-muted-foreground">Dinner Peak</p>
                  <p className="mt-1 text-sm font-medium text-emerald-600">166 orders avg</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-lg font-bold">8 AM - 10 AM</p>
                  <p className="text-xs text-muted-foreground">Breakfast</p>
                  <p className="mt-1 text-sm font-medium text-amber-600">63 orders avg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
