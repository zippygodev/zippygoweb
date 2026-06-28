'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  CalendarDays,
  ArrowUpDown,
  IndianRupee,
  ShoppingBag,
  Users,
  Star,
  FileText,
  Printer,
  ChevronDown,
  Filter,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const salesData = [
  { month: 'Jan', revenue: 420000, orders: 320, profit: 168000 },
  { month: 'Feb', revenue: 380000, orders: 290, profit: 152000 },
  { month: 'Mar', revenue: 510000, orders: 380, profit: 204000 },
  { month: 'Apr', revenue: 460000, orders: 350, profit: 184000 },
  { month: 'May', revenue: 540000, orders: 410, profit: 216000 },
  { month: 'Jun', revenue: 480000, orders: 360, profit: 192000 },
];

const popularItemsReport = [
  { name: 'Butter Chicken', orders: 156, revenue: 70200, percentage: 18 },
  { name: 'Paneer Tikka', orders: 142, revenue: 53960, percentage: 16 },
  { name: 'Dal Makhani', orders: 128, revenue: 44800, percentage: 14 },
  { name: 'Chicken Biryani', orders: 115, revenue: 43700, percentage: 13 },
  { name: 'Garlic Naan', orders: 98, revenue: 5880, percentage: 11 },
  { name: 'Gulab Jamun', orders: 76, revenue: 9120, percentage: 9 },
  { name: 'Mango Lassi', orders: 65, revenue: 7800, percentage: 7 },
  { name: 'Others', orders: 112, revenue: 33600, percentage: 12 },
];

const ordersReport = [
  { date: 'Mon', dineIn: 28, pickup: 12, delivery: 8, total: 48 },
  { date: 'Tue', dineIn: 32, pickup: 15, delivery: 10, total: 57 },
  { date: 'Wed', dineIn: 26, pickup: 10, delivery: 6, total: 42 },
  { date: 'Thu', dineIn: 35, pickup: 18, delivery: 12, total: 65 },
  { date: 'Fri', dineIn: 42, pickup: 22, delivery: 16, total: 80 },
  { date: 'Sat', dineIn: 48, pickup: 25, delivery: 18, total: 91 },
  { date: 'Sun', dineIn: 38, pickup: 20, delivery: 14, total: 72 },
];

const PIE_COLORS = ['#E11D48', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#6B7280'];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('7d');
  const [reportType, setReportType] = useState('sales');

  const handleExport = (format: 'csv' | 'pdf') => {
    toast({ title: 'Export Started', description: `Downloading ${format.toUpperCase()} report...`, variant: 'success' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">Analyze your restaurant performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="h-9 w-[140px]">
              <CalendarDays className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">This year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9" onClick={() => handleExport('csv')}>
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button size="sm" className="h-9" onClick={() => handleExport('pdf')}>
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Revenue', value: '₹4,85,000', change: '+12.5%', trend: 'up', icon: IndianRupee },
          { label: 'Total Orders', value: '2,140', change: '+8.3%', trend: 'up', icon: ShoppingBag },
          { label: 'Avg Order Value', value: '₹227', change: '+3.8%', trend: 'up', icon: TrendingUp },
          { label: 'Conversion Rate', value: '68%', change: '-2.1%', trend: 'down', icon: BarChart3 },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className={cn(
                    'inline-flex items-center gap-0.5 text-xs font-medium',
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  )}>
                    {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.change}
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={reportType} onValueChange={setReportType}>
        <TabsList>
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="popular">Popular Items</TabsTrigger>
          <TabsTrigger value="orders">Orders Report</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Revenue & Profit Trends</CardTitle>
              <CardDescription>Monthly revenue and profit analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
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
                    <Bar dataKey="profit" fill="#10B981" radius={[4, 4, 0, 0]} name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Monthly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {salesData.slice(-3).reverse().map((month) => (
                    <div key={month.month} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{month.month} 2024</p>
                        <p className="text-xs text-muted-foreground">{month.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(month.revenue)}</p>
                        <p className="text-xs text-emerald-600">Profit: {formatCurrency(month.profit)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie data={[
                        { name: 'Dine In', value: 65 },
                        { name: 'Delivery', value: 20 },
                        { name: 'Pickup', value: 15 },
                      ]} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                        {PIE_COLORS.slice(0, 3).map((color, i) => (
                          <Cell key={i} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Most Popular Items</CardTitle>
              <CardDescription>Top selling items by order count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularItemsReport.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm font-medium">{formatCurrency(item.revenue)}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.orders} orders</span>
                        <span>{item.percentage}% of sales</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Orders Overview</CardTitle>
              <CardDescription>Daily order breakdown by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ordersReport}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '13px',
                      }}
                    />
                    <Bar dataKey="dineIn" fill="#E11D48" radius={[4, 4, 0, 0]} name="Dine In" stackId="a" />
                    <Bar dataKey="pickup" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Pickup" stackId="a" />
                    <Bar dataKey="delivery" fill="#10B981" radius={[4, 4, 0, 0]} name="Delivery" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Dine In', value: '249', percentage: '65%', color: 'bg-primary' },
                  { label: 'Delivery', value: '76', percentage: '20%', color: 'bg-blue-500' },
                  { label: 'Pickup', value: '57', percentage: '15%', color: 'bg-emerald-500' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className={cn('mx-auto mb-2 h-2 w-full rounded-full bg-muted')}>
                      <div className={cn('h-full rounded-full', item.color)} style={{ width: item.percentage }} />
                    </div>
                    <p className="text-lg font-bold">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.percentage}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
