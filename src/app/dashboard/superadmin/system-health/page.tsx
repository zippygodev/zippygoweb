'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  Wifi,
  Database,
  CreditCard,
  Cloud,
  Server,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Zap,
  HardDrive,
  Globe,
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
} from 'recharts';

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: string;
  uptime: string;
  icon: typeof Wifi;
  lastIncident: string;
}

const services: ServiceStatus[] = [
  { name: 'API Gateway', status: 'healthy', latency: '45ms', uptime: '99.99%', icon: Globe, lastIncident: '14 days ago' },
  { name: 'Web Server', status: 'healthy', latency: '12ms', uptime: '99.97%', icon: Server, lastIncident: '30 days ago' },
  { name: 'Database (Primary)', status: 'healthy', latency: '2.3ms', uptime: '99.99%', icon: Database, lastIncident: '60 days ago' },
  { name: 'Database (Replica)', status: 'healthy', latency: '3.1ms', uptime: '99.95%', icon: Database, lastIncident: '7 days ago' },
  { name: 'Storage (CDN)', status: 'degraded', latency: '180ms', uptime: '99.80%', icon: Cloud, lastIncident: '2 days ago' },
  { name: 'Payment Gateway', status: 'healthy', latency: '210ms', uptime: '99.92%', icon: CreditCard, lastIncident: '5 days ago' },
  { name: 'Redis Cache', status: 'healthy', latency: '0.8ms', uptime: '99.99%', icon: Zap, lastIncident: '45 days ago' },
  { name: 'File Storage', status: 'healthy', latency: '65ms', uptime: '99.93%', icon: HardDrive, lastIncident: '10 days ago' },
];

const errorRateData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  errors: Math.floor(Math.random() * 15 + 1),
  latency: Math.floor(Math.random() * 150 + 30),
}));

const uptimeData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  uptime: 99.9 + Math.random() * 0.09,
}));

const statusConfig: Record<string, { color: string; bg: string; icon: typeof CheckCircle2; label: string }> = {
  healthy: { color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-950/50', icon: CheckCircle2, label: 'Operational' },
  degraded: { color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-950/50', icon: AlertTriangle, label: 'Degraded' },
  down: { color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-950/50', icon: XCircle, label: 'Down' },
};

export default function SystemHealthPage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const healthyCount = services.filter(s => s.status === 'healthy').length;
  const degradedCount = services.filter(s => s.status === 'degraded').length;
  const downCount = services.filter(s => s.status === 'down').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">System Health</h1>
          <p className="text-sm text-muted-foreground">Monitor platform infrastructure and services.</p>
        </div>
        <Button variant="outline" size="sm" className="h-9" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={cn('mr-2 h-4 w-4', refreshing && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2">{healthyCount}/{services.length}</p>
            <p className="text-xs text-muted-foreground">Services Healthy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/50">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2">{degradedCount}</p>
            <p className="text-xs text-muted-foreground">Services Degraded</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2">{downCount}</p>
            <p className="text-xs text-muted-foreground">Services Down</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/50">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2">99.94%</p>
            <p className="text-xs text-muted-foreground">Overall Uptime (30d)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Service Status</CardTitle>
          <CardDescription>Current status of all platform services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const StatusIcon = statusConfig[service.status].icon;
              const config = statusConfig[service.status];
              const Icon = service.icon;
              return (
                <div key={service.name} className={cn('rounded-lg border p-4', service.status === 'degraded' && 'border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/10')}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{service.name}</span>
                    </div>
                    <StatusIcon className={cn('h-4 w-4', config.color)} />
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Latency</span>
                      <span className={cn('font-medium', service.status === 'degraded' ? 'text-amber-500' : 'text-emerald-500')}>{service.latency}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Uptime</span>
                      <span className="font-medium">{service.uptime}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant={service.status === 'healthy' ? 'success' : service.status === 'degraded' ? 'warning' : 'destructive'} className="text-[10px]">
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Error Rate (Last 24h)</CardTitle>
            <CardDescription>API error count and latency trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={errorRateData}>
                  <defs>
                    <linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E11D48" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#E11D48" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} interval={3} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '13px' }}
                  />
                  <Area type="monotone" dataKey="errors" stroke="#E11D48" fill="url(#errGrad)" strokeWidth={2} name="Errors" />
                  <Line type="monotone" dataKey="latency" stroke="#3B82F6" strokeWidth={2} name="Latency (ms)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Uptime (30 Days)</CardTitle>
            <CardDescription>Daily platform availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={uptimeData}>
                  <defs>
                    <linearGradient id="upGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} interval={4} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[99.8, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '13px' }}
                    formatter={(value: number) => [`${value.toFixed(2)}%`, 'Uptime']}
                  />
                  <Area type="monotone" dataKey="uptime" stroke="#10B981" fill="url(#upGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Resource Usage</CardTitle>
          <CardDescription>Platform resource consumption</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>CPU Usage</span>
                <span className="font-medium">42%</span>
              </div>
              <Progress value={42} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Memory Usage</span>
                <span className="font-medium">68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Disk Usage</span>
                <span className="font-medium">72%</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
