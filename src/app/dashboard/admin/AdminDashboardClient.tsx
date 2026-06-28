'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ClipboardList,
  Users,
  Store,
  ArrowRight,
  ShoppingBag,
  Timer,
  Zap,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Utensils,
  Activity,
  Wifi,
  Database,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AdminDashboardClient({ metrics }: { metrics: any }) {
  const [loading, setLoading] = useState(false);

  // Dynamic mapped values based on metrics
  const displayStats = [
    {
      title: 'Total Restaurants',
      value: metrics?.totalRestaurants || '0',
      change: '+0',
      trend: 'up',
      icon: Store,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-950/50',
    },
    {
      title: 'Active Orders',
      value: metrics?.activeOrders || '0',
      change: '+0%',
      trend: 'up',
      icon: ClipboardList,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-950/50',
    },
    {
      title: 'Total Users',
      value: metrics?.totalUsers || '0',
      change: '+0%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-950/50',
    },
    {
      title: "Today's Revenue",
      value: `₹${(metrics?.todaysRevenue || 0).toLocaleString()}`,
      change: '+0%',
      trend: 'up',
      icon: IndianRupee,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-100 dark:bg-emerald-950/50',
    },
  ];

  const recentOrdersList = metrics?.recentOrders || [];
  const topRestaurantsList = metrics?.topRestaurants || [];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  PREPARING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  READY: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  COMPLETED: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const orderTypeData = [
  { name: 'Dine-in', value: 45 },
  { name: 'Delivery', value: 30 },
  { name: 'Pickup', value: 25 },
];

const COLORS = ['#E11D48', '#3B82F6', '#10B981'];

const systemHealth = [
  { label: 'Server Uptime', value: '99.9%', icon: Wifi, status: 'healthy' },
  { label: 'Database', value: '2.3ms', icon: Database, status: 'healthy' },
  { label: 'Payment Gateway', value: 'Active', icon: Activity, status: 'healthy' },
  { label: 'Avg Response', value: '145ms', icon: Timer, status: 'healthy' },
];

const revenueData = [
  { name: 'Mon', revenue: 4000, orders: 24 },
  { name: 'Tue', revenue: 3000, orders: 13 },
  { name: 'Wed', revenue: 2000, orders: 98 },
  { name: 'Thu', revenue: 2780, orders: 39 },
  { name: 'Fri', revenue: 1890, orders: 48 },
  { name: 'Sat', revenue: 2390, orders: 38 },
  { name: 'Sun', revenue: 3490, orders: 43 },
];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening at Grand Mall today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <CalendarDays className="mr-2 h-4 w-4" />
            Today
          </Button>
          <Button size="sm" className="h-9">
            <Zap className="mr-2 h-4 w-4" />
            Quick Actions
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <LoadingSpinner size="lg" text="Loading dashboard..." />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {displayStats.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="relative overflow-hidden transition-shadow hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className={cn('rounded-lg p-2.5', card.bg)}>
                          <Icon className={cn('h-5 w-5', card.color)} />
                        </div>
                        <span className={cn(
                          'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium',
                          card.trend === 'up'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                        )}>
                          {card.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {card.change}
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-2xl font-bold">{card.value}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{card.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base">Revenue Overview</CardTitle>
                  <CardDescription>Last 7 days</CardDescription>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Revenue
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-primary/30" />
                    Orders
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="adRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E11D48" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#E11D48" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '13px',
                        }}
                        formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#E11D48" fill="url(#adRevenueGradient)" strokeWidth={2} />
                      <Line type="monotone" dataKey="orders" stroke="#E11D48" strokeWidth={2} strokeOpacity={0.4} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Order Distribution</CardTitle>
                <CardDescription>By order type</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {orderTypeData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '13px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex w-full justify-center gap-4">
                  {orderTypeData.map((item, i) => (
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

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base">Recent Orders</CardTitle>
                  <CardDescription>Latest orders across all restaurants</CardDescription>
                </div>
                <Link href="/dashboard/admin/orders">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentOrdersList.map((order: any) => (
                    <div
                      key={order.id}
                      className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{order.id}</span>
                          <Badge variant="outline" className={cn('text-[10px]', statusColors[order.status])}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{order.restaurant}</span>
                          <span>{order.customer}</span>
                          <span>{order.items} items</span>
                          <span>{order.time}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{formatCurrency(order.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Top Restaurants</CardTitle>
                <CardDescription>By revenue this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topRestaurantsList.map((r: any, i: number) => (
                    <div key={r.name} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{r.image}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{r.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{r.orders} orders</span>
                          <span>&middot;</span>
                          <span>{r.rating} ★</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(r.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">System Health</CardTitle>
                <CardDescription>Platform status overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {systemHealth.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-3 rounded-lg border p-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/50">
                          <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400">{item.value}</p>
                        </div>
                        <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
