'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Calendar,
  ChevronRight,
  Banknote,
  Clock,
  Bike,
  Star,
  ArrowUpRight,
  Wallet,
  Download,
  CreditCard,
} from 'lucide-react';

interface EarningsDay {
  day: string;
  amount: number;
  deliveries: number;
}

interface Transaction {
  id: string;
  type: 'delivery' | 'bonus' | 'adjustment' | 'payout';
  description: string;
  amount: number;
  date: string;
  time: string;
  status: 'completed' | 'pending';
  orderNumber?: string;
}

const weeklyEarnings: EarningsDay[] = [
  { day: 'Mon', amount: 520, deliveries: 8 },
  { day: 'Tue', amount: 680, deliveries: 10 },
  { day: 'Wed', amount: 450, deliveries: 7 },
  { day: 'Thu', amount: 720, deliveries: 11 },
  { day: 'Fri', amount: 845, deliveries: 12 },
  { day: 'Sat', amount: 600, deliveries: 9 },
  { day: 'Sun', amount: 380, deliveries: 5 },
];

const transactions: Transaction[] = [
  { id: 't1', type: 'delivery', description: 'Delivery #ZG-A1B2 - Punjab Dhaba', amount: 85, date: '2026-06-27', time: '12:30 PM', status: 'completed', orderNumber: 'ZG-A1B2' },
  { id: 't2', type: 'delivery', description: 'Delivery #ZG-C3D4 - Sushi World', amount: 65, date: '2026-06-27', time: '11:15 AM', status: 'completed', orderNumber: 'ZG-C3D4' },
  { id: 't3', type: 'delivery', description: 'Delivery #ZG-E5F6 - Pizza Planet', amount: 75, date: '2026-06-27', time: '10:00 AM', status: 'completed', orderNumber: 'ZG-E5F6' },
  { id: 't4', type: 'bonus', description: 'Peak Hour Bonus (12-2 PM)', amount: 50, date: '2026-06-27', time: '2:00 PM', status: 'completed' },
  { id: 't5', type: 'delivery', description: 'Delivery #ZG-G7H8 - Biryani Blues', amount: 90, date: '2026-06-26', time: '7:45 PM', status: 'completed', orderNumber: 'ZG-G7H8' },
  { id: 't6', type: 'delivery', description: 'Delivery #ZG-I9J0 - Taco Bell', amount: 55, date: '2026-06-26', time: '6:30 PM', status: 'completed', orderNumber: 'ZG-I9J0' },
  { id: 't7', type: 'adjustment', description: 'Wait Time Adjustment (Order #ZG-G7H8)', amount: 20, date: '2026-06-26', time: '8:00 PM', status: 'completed' },
  { id: 't8', type: 'payout', description: 'Weekly Payout - Week 25', amount: -3200, date: '2026-06-25', time: '10:00 AM', status: 'completed' },
  { id: 't9', type: 'delivery', description: 'Delivery #ZG-K1L2 - Dominoes', amount: 70, date: '2026-06-25', time: '8:00 PM', status: 'completed', orderNumber: 'ZG-K1L2' },
  { id: 't10', type: 'bonus', description: '5★ Rating Bonus', amount: 100, date: '2026-06-25', time: '9:00 PM', status: 'completed' },
];

function EarningsChart({ data }: { data: EarningsDay[] }) {
  const maxAmount = Math.max(...data.map((d) => d.amount));

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between" style={{ height: 140 }}>
        {data.map((day, i) => {
          const height = (day.amount / maxAmount) * 100;
          const isToday = i === data.length - 1;
          return (
            <div key={day.day} className="flex flex-col items-center gap-1.5 flex-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
                className={cn(
                  'w-full max-w-[32px] rounded-t-md transition-colors',
                  isToday ? 'bg-primary' : 'bg-primary/30 hover:bg-primary/50'
                )}
                style={{ minHeight: 4 }}
              />
              <span className={cn('text-[10px] font-medium', isToday ? 'text-primary' : 'text-muted-foreground')}>
                {day.day}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Total: ₹{data.reduce((s, d) => s + d.amount, 0)}</span>
        <span>Avg: ₹{Math.round(data.reduce((s, d) => s + d.amount, 0) / data.length)}/day</span>
      </div>
    </div>
  );
}

function TransactionRow({ tx }: { tx: Transaction }) {
  const isPayout = tx.type === 'payout';
  const isBonus = tx.type === 'bonus';
  const isPositive = tx.amount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
    >
      <div className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
        tx.type === 'delivery' ? 'bg-primary/10' :
        tx.type === 'bonus' ? 'bg-emerald-500/10' :
        tx.type === 'payout' ? 'bg-blue-500/10' :
        'bg-amber-500/10'
      )}>
        {tx.type === 'delivery' ? (
          <Bike className="h-4 w-4 text-primary" />
        ) : tx.type === 'bonus' ? (
          <Star className="h-4 w-4 text-emerald-500" />
        ) : tx.type === 'payout' ? (
          <Banknote className="h-4 w-4 text-blue-500" />
        ) : (
          <IndianRupee className="h-4 w-4 text-amber-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{tx.description}</p>
        <p className="text-xs text-muted-foreground">{tx.date} at {tx.time}</p>
      </div>

      <div className="text-right shrink-0">
        <p className={cn(
          'text-sm font-semibold',
          isPositive ? 'text-emerald-500' : 'text-destructive'
        )}>
          {isPositive ? '+' : ''}₹{tx.amount}
        </p>
        <Badge variant={tx.status === 'completed' ? 'secondary' : 'outline'} className="h-4 text-[9px]">
          {tx.status === 'completed' ? 'Cleared' : 'Pending'}
        </Badge>
      </div>
    </motion.div>
  );
}

export default function EarningsPage() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

  const earningsData = {
    today: { total: 845, deliveries: 12, hours: 4.5, rating: 4.8, bonus: 50 },
    week: { total: 4195, deliveries: 62, hours: 28, rating: 4.7, bonus: 250 },
    month: { total: 18200, deliveries: 260, hours: 120, rating: 4.8, bonus: 1200 },
  };

  const data = earningsData[period];
  const weeklyTotal = weeklyEarnings.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Earnings</h1>
        <p className="text-sm text-muted-foreground">Track your income and payouts</p>
      </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total {period === 'today' ? "Today's" : period === 'week' ? 'Weekly' : 'Monthly'} Earnings</p>
              <p className="mt-1 text-4xl font-bold tracking-tight">
                ₹{data.total.toLocaleString()}
              </p>
              <div className="mt-1 flex items-center gap-2 text-sm text-emerald-500">
                <ArrowUpRight className="h-4 w-4" />
                <span>+12% vs last {period === 'today' ? 'yesterday' : period}</span>
              </div>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <IndianRupee className="h-7 w-7 text-primary" />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Deliveries</p>
              <p className="text-lg font-bold">{data.deliveries}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hours Online</p>
              <p className="text-lg font-bold">{data.hours}h</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rating</p>
              <div className="flex items-center gap-1 text-lg font-bold">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                {data.rating}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bonus</p>
              <p className="text-lg font-bold text-emerald-500">₹{data.bonus}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Badge variant="secondary" className="text-[10px]">₹{weeklyTotal} total</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <EarningsChart data={weeklyEarnings} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Payout Summary</CardTitle>
              <Badge variant="outline" className="text-[10px]">Weekly</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Balance</span>
              <span className="font-bold text-lg">₹4,195</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pending Clearance</span>
              <span className="font-medium">₹845</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Available for Payout</span>
              <span className="font-medium text-emerald-500">₹3,350</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Next Payout</span>
              <span className="font-medium">Mon, Jun 29</span>
            </div>
            <Button className="w-full gap-2" size="sm">
              <Wallet className="h-4 w-4" />
              Request Early Payout
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Transaction History</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" disabled>
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="space-y-1">
            <div className="hidden sm:grid sm:grid-cols-12 gap-3 px-3 py-2 text-xs font-medium text-muted-foreground">
              <span className="col-span-1"></span>
              <span className="col-span-6">Description</span>
              <span className="col-span-2 text-right">Date</span>
              <span className="col-span-3 text-right">Amount</span>
            </div>
            <Separator className="hidden sm:block" />
            {transactions.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <CreditCard className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Payout Method</p>
              <p className="text-xs text-muted-foreground">Bank Account (XX1234) · ICICI Bank</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              Change
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
