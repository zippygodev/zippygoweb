'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Building2,
  Store,
  ShoppingBag,
  Users,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  Zap,
  Activity,
  Wifi,
  Database,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
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
} from 'recharts';

const globalStats = [
  {
    title: 'Total Organizations',
    value: '24',
    change: '+3',
    trend: 'up',
    icon: Building2,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-950/50',
  },
  {
    title: 'Total Malls',
    value: '48',
    change: '+5',
    trend: 'up',
    icon: Store,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-950/50',
  },
  {
    title: 'Total Restaurants',
    value: '1,247',
    change: '+12.5%',
    trend: 'up',
    icon: ShoppingBag,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-950/50',
  },
  {
    title: 'Total Users',
    value: '52,340',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-950/50',
  },
  {
    title: 'Total Revenue (MTD)',
    value: '₹1,24,50,000',
    change: '+18.3%',
    trend: 'up',
    icon: IndianRupee,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-100 dark:bg-rose-950/50',
  },
];

const revenue30Data = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  revenue: Math.floor(Math.random() * 500000 + 300000),
  commission: Math.floor(Math.random() * 100000 + 50000),
}));

const signupsData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  orgs: Math.floor(Math.random() * 5 + 1),
  malls: Math.floor(Math.random() * 8 + 2),
  restaurants: Math.floor(Math.random() * 50 + 20),
  users: Math.floor(Math.random() * 5000 + 1000),
}));

const recentActivities = [
  { id: '1', user: 'Rahul Sharma', action: 'Created Organization', target: 'Foodie Group Inc.', time: '5m ago', type: 'create' },
  { id: '2', user: 'Priya Patel', action: 'Approved Restaurant', target: 'Punjab Dhaba - Sector 18', time: '12m ago', type: 'approve' },
  { id: '3', user: 'Amit Kumar', action: 'Updated Plan', target: 'Enterprise Plan - Premium', time: '25m ago', type: 'update' },
  { id: '4', user: 'Sneha Gupta', action: 'Deactivated Mall', target: 'Grand Mall - Noida', time: '30m ago', type: 'deactivate' },
  { id: '5', user: 'Vikram Singh', action: 'Modified Commission', target: 'Spice Junction - 18%', time: '1h ago', type: 'update' },
  { id: '6', user: 'Neha Agarwal', action: 'Created Feature Flag', target: 'dynamic-pricing-rollout', time: '1h ago', type: 'create' },
  { id: '7', user: 'Rajesh Verma', action: 'Resolved System Alert', target: 'Database connection pool', time: '2h ago', type: 'resolve' },
  { id: '8', user: 'System', action: 'Auto-Scale Triggered', target: 'API cluster scaled to 8 nodes', time: '3h ago', type: 'system' },
];

const systemAlerts = [
  { id: '1', severity: 'critical', title: 'Database Connection Pool Exhausted', message: 'Connection pool at 92% capacity. Consider scaling.', time: '15m ago' },
  { id: '2', severity: 'warning', title: 'Payment Gateway Latency', message: 'Razorpay API response time > 2s for 5% of requests.', time: '1h ago' },
  { id: '3', severity: 'info', title: 'SSL Certificate Expiring', message: 'Certificate for *.zippypay.com expires in 14 days.', time: '2h ago' },
  { id: '4', severity: 'warning', title: 'Storage Usage Alert', message: 'Media storage at 78% capacity (450GB/600GB).', time: '3h ago' },
  { id: '5', severity: 'info', title: 'New Version Available', message: 'Platform v2.5.1 is ready for deployment.', time: '5h ago' },
];

const alertColors: Record<string, string> = {
  critical: 'border-red-500/50 bg-red-500/5',
  warning: 'border-amber-500/50 bg-amber-500/5',
  info: 'border-blue-500/50 bg-blue-500/5',
};

const alertIcons: Record<string, typeof XCircle> = {
  critical: XCircle,
  warning: AlertTriangle,
  info: CheckCircle2,
};

const actionTypeColors: Record<string, string> = {
  create: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  approve: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  update: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  deactivate: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  resolve: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  system: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
};

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Super Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Global platform overview. Welcome back, Super Admin.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <CalendarDays className="mr-2 h-4 w-4" />
            MTD
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {globalStats.map((card, i) => {
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

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base">Platform Revenue (30 Days)</CardTitle>
                  <CardDescription>Daily revenue and commission trends</CardDescription>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Revenue
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-primary/40" />
                    Commission
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenue30Data}>
                      <defs>
                        <linearGradient id="saRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E11D48" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#E11D48" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="saCommissionGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E11D48" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#E11D48" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} interval={4} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '13px',
                        }}
                        formatter={(value: number) => [formatCurrency(value), '']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#E11D48" fill="url(#saRevenueGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="commission" stroke="#E11D48" fill="url(#saCommissionGrad)" strokeWidth={2} strokeOpacity={0.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base">New Signups</CardTitle>
                  <CardDescription>Monthly growth across platform</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={signupsData}>
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
                      <Bar dataKey="users" name="Users" fill="#E11D48" radius={[4, 4, 0, 0]} opacity={0.8} />
                      <Bar dataKey="restaurants" name="Restaurants" fill="#E11D48" radius={[4, 4, 0, 0]} opacity={0.5} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                  <CardDescription>Latest admin actions across platform</CardDescription>
                </div>
                <Link href="/dashboard/superadmin/audit-logs">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{activity.user}</span>
                          <Badge variant="outline" className={cn('text-[10px]', actionTypeColors[activity.type] || 'bg-gray-100')}>
                            {activity.action}
                          </Badge>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{activity.target}</span>
                          <span>&middot;</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">System Alerts</CardTitle>
                <CardDescription>Active platform alerts requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {systemAlerts.map((alert) => {
                    const AlertIcon = alertIcons[alert.severity];
                    return (
                      <div
                        key={alert.id}
                        className={cn('flex items-start gap-3 rounded-lg border p-3', alertColors[alert.severity])}
                      >
                        <AlertIcon className={cn(
                          'mt-0.5 h-4 w-4 shrink-0',
                          alert.severity === 'critical' ? 'text-red-500' : alert.severity === 'warning' ? 'text-amber-500' : 'text-blue-500'
                        )} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{alert.title}</p>
                            <Badge variant="outline" className={cn(
                              'text-[10px]',
                              alert.severity === 'critical' ? 'border-red-500 text-red-500' : alert.severity === 'warning' ? 'border-amber-500 text-amber-500' : 'border-blue-500 text-blue-500'
                            )}>
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                        </div>
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
