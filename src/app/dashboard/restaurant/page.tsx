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
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ClipboardList,
  Star,
  Clock,
  ChefHat,
  Eye,
  ArrowRight,
  Plus,
  Utensils,
  Users,
  Percent,
  ShoppingBag,
  Timer,
  Zap,
  Receipt,
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

const statsCards = [
  {
    title: "Today's Orders",
    value: '48',
    change: '+12.5%',
    trend: 'up',
    icon: ClipboardList,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-950/50',
  },
  {
    title: 'Revenue',
    value: '₹24,500',
    change: '+8.2%',
    trend: 'up',
    icon: IndianRupee,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-950/50',
  },
  {
    title: 'Active Orders',
    value: '12',
    change: '-3.1%',
    trend: 'down',
    icon: Timer,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-950/50',
  },
  {
    title: 'Rating',
    value: '4.8',
    change: '+0.2',
    trend: 'up',
    icon: Star,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-950/50',
  },
];

const revenueData = [
  { name: 'Mon', revenue: 18500, orders: 32 },
  { name: 'Tue', revenue: 22300, orders: 45 },
  { name: 'Wed', revenue: 19800, orders: 38 },
  { name: 'Thu', revenue: 25600, orders: 52 },
  { name: 'Fri', revenue: 31200, orders: 61 },
  { name: 'Sat', revenue: 28500, orders: 55 },
  { name: 'Sun', revenue: 24500, orders: 48 },
];

const recentOrders = [
  { id: 'ZG-7A8B', table: 'Table 5', items: 4, amount: 1250, status: 'PREPARING', time: '5m ago', customer: 'Rahul S.' },
  { id: 'ZG-9C0D', table: 'Table 2', items: 2, amount: 780, status: 'PENDING', time: '12m ago', customer: 'Priya M.' },
  { id: 'ZG-1E2F', table: 'Table 8', items: 3, amount: 950, status: 'READY', time: '25m ago', customer: 'Amit K.' },
  { id: 'ZG-3G4H', table: 'Table 3', items: 5, amount: 2100, status: 'PREPARING', time: '30m ago', customer: 'Sneha P.' },
  { id: 'ZG-5I6J', table: 'Table 6', items: 2, amount: 640, status: 'COMPLETED', time: '1h ago', customer: 'Vikram D.' },
];

const popularItems = [
  { name: 'Butter Chicken', orders: 28, revenue: 19600, trend: '+15%' },
  { name: 'Paneer Tikka', orders: 22, revenue: 11000, trend: '+8%' },
  { name: 'Dal Makhani', orders: 18, revenue: 7200, trend: '+12%' },
  { name: 'Naan Combo', orders: 15, revenue: 5250, trend: '+5%' },
  { name: 'Biryani', orders: 12, revenue: 4800, trend: '+20%' },
];

const quickActions = [
  { label: 'New Order', icon: Plus, href: '/dashboard/restaurant/orders', color: 'bg-primary text-primary-foreground hover:bg-primary/90' },
  { label: 'Add Menu Item', icon: Utensils, href: '/dashboard/restaurant/menu', color: 'bg-emerald-600 text-white hover:bg-emerald-700' },
  { label: 'View Reports', icon: Receipt, href: '/dashboard/restaurant/reports', color: 'bg-blue-600 text-white hover:bg-blue-700' },
  { label: 'Manage Staff', icon: Users, href: '/dashboard/restaurant/staff', color: 'bg-purple-600 text-white hover:bg-purple-700' },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  PREPARING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  READY: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  COMPLETED: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export default function RestaurantDashboard() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening at Punjab Dhaba today.
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
            {statsCards.map((card, i) => {
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
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E11D48" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#E11D48" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '13px',
                        }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#E11D48" fill="url(#revenueGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Popular Items</CardTitle>
                <CardDescription>Most ordered items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularItems.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(item.revenue)}</p>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">{item.trend}</span>
                      </div>
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
                  <CardDescription>Latest orders from today</CardDescription>
                </div>
                <Link href="/dashboard/restaurant/orders">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentOrders.map((order) => (
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
                          <span>{order.table}</span>
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
                <CardTitle className="text-base">Quick Actions</CardTitle>
                <CardDescription>Frequently used tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link key={action.label} href={action.href}>
                        <Button
                          variant="outline"
                          className={cn('h-20 w-full flex-col gap-1.5 text-xs font-medium', action.color)}
                        >
                          <Icon className="h-5 w-5" />
                          {action.label}
                        </Button>
                      </Link>
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
