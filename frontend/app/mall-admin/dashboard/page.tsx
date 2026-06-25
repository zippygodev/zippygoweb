"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Users,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
  Star,
  Activity,
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

export default function MallAdminDashboard() {
  const { data: organization, isLoading: orgLoading } = useQuery({
    queryKey: ["my-organization"],
    queryFn: async () => {
      const { data } = await api.get("/organizations/my");
      return data;
    },
  });

  const {
    data: stats,
    isLoading: statsLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["mall-stats", organization?.id],
    queryFn: async () => {
      const { data } = await api.get(`/analytics/mall/${organization.id}`);
      return data;
    },
    enabled: !!organization?.id,
    refetchInterval: 30_000,
  });

  const isLoading = orgLoading || statsLoading;

  const statCards = [
    {
      label: "Total Restaurants",
      value: isLoading ? "—" : `${stats?.activeRestaurants || 0} / ${stats?.totalRestaurants || 0}`,
      desc: "Active / Registered",
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Active Customers",
      value: isLoading ? "—" : stats?.activeUsers?.toLocaleString() || "0",
      desc: "Platform customers",
      icon: Users,
      color: "text-violet-600",
      bg: "bg-violet-100 dark:bg-violet-900/30",
    },
    {
      label: "Total Revenue",
      value: isLoading ? "—" : formatPrice(stats?.totalRevenue || 0),
      desc: `Today: ${formatPrice(stats?.todayRevenue || 0)}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      label: "Total Orders",
      value: isLoading ? "—" : stats?.totalOrders?.toLocaleString() || "0",
      desc: `Today: ${stats?.todayOrders || 0} orders`,
      icon: ShoppingBag,
      color: "text-amber-600",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mall Control Center</h1>
          <p className="text-muted-foreground">
            {organization ? (
              <>
                Overview of <span className="font-semibold text-foreground">{organization.name}</span> operations
              </>
            ) : (
              "Overview of your food court operations"
            )}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="gap-2 rounded-xl"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-xl ${stat.bg} p-2.5`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              {isLoading ? (
                <>
                  <Skeleton className="mb-2 h-8 w-20" />
                  <Skeleton className="h-4 w-32" />
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.desc}</p>
                </>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Restaurants Card */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Top Performing Restaurants</h2>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="mt-1 h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : stats?.topRestaurants && stats.topRestaurants.length > 0 ? (
            <div className="space-y-4">
              {stats.topRestaurants.map((r: any, i: number) => (
                <div key={r.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600 dark:bg-emerald-900/30">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium">{r.name}</p>
                      <p className="text-sm text-muted-foreground">{r.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">{formatPrice(r.revenue)}</p>
                    <div className="flex items-center justify-end gap-1 text-sm text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" /> {r.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-muted-foreground">
              <Building2 className="h-8 w-8 opacity-40" />
              <p>No restaurant data available</p>
            </div>
          )}
        </Card>

        {/* Revenue Overview Chart */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Revenue Overview (Last 14 Days)</h2>
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Skeleton className="h-full w-full rounded-xl" />
            </div>
          ) : stats?.revenueOverview && stats.revenueOverview.length > 0 ? (
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.revenueOverview}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorMallRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10 }}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.8)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: any) => [formatPrice(value), "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorMallRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-muted-foreground">
              <Activity className="h-8 w-8 opacity-40 animate-pulse" />
              <p>No orders registered in the last 14 days</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
