"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Globe,
  DollarSign,
  Users,
  ShoppingBag,
  Activity,
  Server,
  Store,
  CheckCircle2,
} from "lucide-react";

const systemHealth = [
  { name: "API Server", status: "healthy", uptime: "99.99%", latency: "45ms" },
  { name: "Database", status: "healthy", uptime: "99.95%", latency: "12ms" },
  { name: "Redis Cache", status: "healthy", uptime: "99.99%", latency: "2ms" },
  { name: "AI Service", status: "healthy", uptime: "99.9%", latency: "85ms" },
];

export default function SuperAdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["super-admin-stats"],
    queryFn: async () => {
      const { data } = await api.get("/analytics/super-admin");
      return data;
    },
    refetchInterval: 60_000,
  });

  const { data: orgs } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data } = await api.get("/organizations");
      return data?.data || data || [];
    },
    staleTime: 120_000,
  });

  const statCards = [
    {
      label: "Total Organizations",
      value: isLoading ? "—" : String(stats?.totalOrganizations || 0),
      icon: Globe,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Total Revenue",
      value: isLoading ? "—" : formatPrice(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: "text-amber-600 dark:text-primary",
      bg: "bg-primary/20 dark:bg-primary/10",
    },
    {
      label: "Active Users",
      value: isLoading ? "—" : stats?.totalUsers?.toLocaleString() || "0",
      icon: Users,
      color: "text-violet-600",
      bg: "bg-violet-100 dark:bg-violet-900/30",
    },
    {
      label: "Total Orders",
      value: isLoading ? "—" : stats?.totalOrders?.toLocaleString() || "0",
      icon: ShoppingBag,
      color: "text-amber-600",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      label: "Active Restaurants",
      value: isLoading ? "—" : String(stats?.totalRestaurants || 0),
      icon: Store,
      color: "text-rose-600",
      bg: "bg-rose-100 dark:bg-rose-900/30",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Super Admin</h1>
        <p className="text-muted-foreground">Platform-wide overview and system health</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-6">
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              {isLoading ? (
                <>
                  <Skeleton className="mb-1 h-8 w-20" />
                  <Skeleton className="h-4 w-32" />
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* System Health */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">System Health</h2>
            <Badge variant="success" className="ml-auto text-[10px]">
              All Systems Operational
            </Badge>
          </div>
          <div className="space-y-3">
            {systemHealth.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between rounded-xl border p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      service.status === "healthy" ? "bg-success animate-pulse" : "bg-warning"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium">{service.name}</p>
                    <p className="text-xs text-muted-foreground">Uptime: {service.uptime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={service.status === "healthy" ? "success" : "warning"}
                    className="text-[10px]"
                  >
                    {service.status}
                  </Badge>
                  <p className="mt-0.5 text-xs text-muted-foreground">{service.latency}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Organizations */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Organizations</h2>
          </div>
          <div className="space-y-3">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="flex-1">
                      <Skeleton className="mb-1 h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))
              : orgs?.slice(0, 5).map((org: any, i: number) => (
                  <div key={org.id} className="flex items-center justify-between rounded-xl border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-lg font-bold text-primary-dark">
                        {org.name?.[0] || "O"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{org.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {org.type?.toLowerCase().replace("_", " ") || "Organization"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {org.isActive && <CheckCircle2 className="h-4 w-4 text-success" />}
                      <Badge variant={org.isActive ? "success" : "secondary"} className="text-[10px]">
                        {org.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                )) || (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No organizations yet. Create the first one!
                </p>
              )}
          </div>
        </Card>
      </div>
    </div>
  );
}
