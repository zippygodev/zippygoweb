"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/utils";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Star,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const ORDER_STATUS_MAP: Record<string, "warning" | "default" | "success" | "secondary" | "destructive"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  PREPARING: "default",
  READY: "success",
  DELIVERED: "secondary",
  CANCELLED: "destructive",
};

function StatCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  loading,
}: {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: any;
  loading: boolean;
}) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-xl bg-primary/20 p-2.5">
          <Icon className="h-5 w-5 text-primary-dark" />
        </div>
        {!loading && (
          <Badge
            variant={trend === "up" ? "success" : trend === "down" ? "warning" : "secondary"}
            className="gap-1"
          >
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : trend === "down" ? (
              <ArrowDownRight className="h-3 w-3" />
            ) : null}
            {change}
          </Badge>
        )}
      </div>
      {loading ? (
        <>
          <Skeleton className="mb-1 h-8 w-24" />
          <Skeleton className="h-4 w-32" />
        </>
      ) : (
        <>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </>
      )}
    </Card>
  );
}

export default function RestaurantDashboard() {
  const { user } = useAuth();

  // Get the user's restaurant ID
  const { data: restaurantData, isLoading: restaurantLoading } = useQuery({
    queryKey: ["my-restaurant", user?.id],
    queryFn: async () => {
      const { data } = await api.get("/restaurants?limit=1");
      // Finds the restaurant owned by the current user
      const all = data?.data || data || [];
      return all[0] || null;
    },
    enabled: !!user?.id,
  });

  const restaurantId = restaurantData?.id;

  const {
    data: stats,
    isLoading: statsLoading,
    refetch,
  } = useQuery({
    queryKey: ["restaurant-stats", restaurantId],
    queryFn: async () => {
      const { data } = await api.get(`/analytics/restaurant/${restaurantId}`);
      return data;
    },
    enabled: !!restaurantId,
    refetchInterval: 30_000, // Refresh every 30s
  });

  const { data: revenueData } = useQuery({
    queryKey: ["restaurant-revenue", restaurantId],
    queryFn: async () => {
      const { data } = await api.get(`/analytics/restaurant/${restaurantId}/revenue?days=14`);
      return data;
    },
    enabled: !!restaurantId,
  });

  const { data: aiInsights } = useQuery({
    queryKey: ["ai-forecast", restaurantId],
    queryFn: async () => {
      const { data } = await api.get(`/ai/forecast/${restaurantId}`);
      return data;
    },
    enabled: !!restaurantId,
    staleTime: 600_000, // 10 min
  });

  const isLoading = restaurantLoading || statsLoading;

  const statCards = stats
    ? [
        {
          label: "Today's Revenue",
          value: formatPrice(stats.todayRevenue),
          change: `${stats.revenueChange >= 0 ? "+" : ""}${stats.revenueChange}%`,
          trend: (stats.revenueChange >= 0 ? "up" : "down") as "up" | "down" | "neutral",
          icon: DollarSign,
        },
        {
          label: "Today's Orders",
          value: String(stats.todayOrders),
          change: `${stats.orderChange >= 0 ? "+" : ""}${stats.orderChange}%`,
          trend: (stats.orderChange >= 0 ? "up" : "down") as "up" | "down" | "neutral",
          icon: ShoppingBag,
        },
        {
          label: "Total Customers",
          value: String(stats.totalCustomers),
          change: "All-time",
          trend: "neutral" as const,
          icon: Users,
        },
        {
          label: "Avg. Rating",
          value: `${stats.avgRating} ⭐`,
          change: `${stats.totalReviews} reviews`,
          trend: (stats.avgRating >= 4
            ? "up"
            : stats.avgRating >= 3
            ? "neutral"
            : "down") as "up" | "down" | "neutral",
          icon: Star,
        },
      ]
    : Array.from({ length: 4 }).map(() => ({
        label: "Loading...",
        value: "—",
        change: "—",
        trend: "neutral" as const,
        icon: DollarSign,
      }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {restaurantData ? (
              <>
                <span className="font-medium text-foreground">{restaurantData.name}</span>
                {" — "}Live overview
              </>
            ) : (
              "Welcome back! Here's your restaurant overview."
            )}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label + i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <StatCard {...stat} loading={isLoading} />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Revenue (Last 14 Days)</h2>
              <p className="text-sm text-muted-foreground">Daily revenue trend</p>
            </div>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          {revenueData && revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD93D" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FFD93D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => v.slice(5)}
                  className="text-xs"
                  tick={{ fontSize: 11 }}
                />
                <YAxis className="text-xs" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(v: any) => [`₹${v.toFixed(0)}`, "Revenue"]} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FFD93D"
                  strokeWidth={2}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-xl bg-muted/50 text-sm text-muted-foreground">
              {isLoading ? "Loading chart..." : "No revenue data yet"}
            </div>
          )}
        </Card>

        {/* AI Insights */}
        {aiInsights && (
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="h-4 w-4 fill-current" />
              </div>
              <h2 className="text-lg font-semibold">AI Insights</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl bg-primary/10 p-3">
                <p className="font-semibold text-primary-dark">Peak Day</p>
                <p className="text-foreground">{aiInsights.peakDay}</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="font-medium text-blue-800 dark:text-blue-300">Peak Hour</p>
                <p className="text-blue-700 dark:text-blue-400">{aiInsights.peakHour}</p>
              </div>
              <div className="space-y-1.5">
                {aiInsights.suggestions?.map((s: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="mt-0.5 shrink-0 text-primary-dark">✓</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Recent Orders + Popular Products */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href="/restaurant/orders">
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="h-4 w-4" />
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border p-4">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))
              : stats?.recentOrders?.length > 0
              ? stats.recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{order.user?.name || "Customer"}</p>
                      <p className="text-sm text-muted-foreground">
                        #{order.orderNumber} • {order.items?.length || 0} items
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={ORDER_STATUS_MAP[order.status] || "secondary"}>
                        {order.status}
                      </Badge>
                      <span className="font-medium">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                ))
              : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No orders yet. Share your restaurant link to get started!
                </p>
              )}
          </div>
        </Card>

        {/* Popular Products */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top Items</h2>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-3">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="mb-1 h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))
              : stats?.popularProducts?.length > 0
              ? stats.popularProducts.map((item: any, i: number) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-lg font-bold text-primary-dark">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{item.product?.name || "Product"}</p>
                      <p className="text-xs text-muted-foreground">{item._sum.quantity} sold</p>
                    </div>
                    {item.product?.price && (
                      <span className="text-sm font-medium text-amber-600 dark:text-primary">
                        {formatPrice(item.product.price)}
                      </span>
                    )}
                  </div>
                ))
              : (
                <p className="py-6 text-center text-sm text-muted-foreground">No sales data yet</p>
              )}
          </div>
        </Card>
      </div>

      {/* Pending orders alert */}
      {stats?.pendingOrders > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20"
        >
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-300">
                {stats.pendingOrders} pending order{stats.pendingOrders > 1 ? "s" : ""}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400">Awaiting your attention</p>
            </div>
          </div>
          <Link href="/restaurant/orders">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
              View Orders
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
