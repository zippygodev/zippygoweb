"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Clock, CheckCheck, ChefHat, Timer, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const STATUS_BADGE: Record<string, "default" | "warning" | "success" | "secondary" | "destructive"> = {
  PENDING: "default",
  CONFIRMED: "default",
  PREPARING: "warning",
  READY: "success",
  DELIVERED: "secondary",
  CANCELLED: "destructive",
};

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  tableNumber?: number | null;
  isTakeaway: boolean;
  note?: string | null;
  createdAt: string;
  items: Array<{ id: string; quantity: number; name: string; product?: { name: string } }>;
  user?: { name: string; phone?: string };
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = React.useState("live");
  const queryClient = useQueryClient();
  const [restaurantId, setRestaurantId] = React.useState<string | null>(null);

  React.useEffect(() => {
    api.get("/restaurants?limit=1").then(({ data }) => {
      const r = data?.data?.[0] || data?.[0];
      if (r) setRestaurantId(r.id);
    });
  }, []);

  const { data: liveOrders, isLoading: liveLoading } = useQuery({
    queryKey: ["live-orders", restaurantId],
    queryFn: async () => {
      const { data } = await api.get(`/orders/restaurant/${restaurantId}`);
      const all: Order[] = Array.isArray(data) ? data : data?.data || [];
      return all.filter((o) => ["PENDING", "CONFIRMED", "PREPARING", "READY"].includes(o.status));
    },
    enabled: !!restaurantId,
    refetchInterval: 15_000,
  });

  const { data: historyOrders, isLoading: histLoading } = useQuery({
    queryKey: ["history-orders", restaurantId],
    queryFn: async () => {
      const { data } = await api.get(`/orders/restaurant/${restaurantId}`);
      const all: Order[] = Array.isArray(data) ? data : data?.data || [];
      return all.filter((o) => ["DELIVERED", "CANCELLED"].includes(o.status));
    },
    enabled: !!restaurantId && activeTab === "history",
  });

  const updateStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      await api.patch(`/orders/${orderId}/status`, { status });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["live-orders", restaurantId] });
      queryClient.invalidateQueries({ queryKey: ["history-orders", restaurantId] });
      toast.success(`Order marked as ${vars.status.toLowerCase()}`);
    },
    onError: () => toast.error("Failed to update order status"),
  });

  function getNextStatus(status: string): string | null {
    const flow: Record<string, string> = {
      PENDING: "CONFIRMED",
      CONFIRMED: "PREPARING",
      PREPARING: "READY",
      READY: "DELIVERED",
    };
    return flow[status] || null;
  }

  function getNextLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: "Confirm",
      CONFIRMED: "Start Preparing",
      PREPARING: "Mark Ready",
      READY: "Delivered",
    };
    return labels[status] || "";
  }

  const renderOrder = (order: Order, i: number) => {
    const nextStatus = getNextStatus(order.status);
    return (
      <motion.div
        key={order.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.04 }}
      >
        <Card className="p-5">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{order.user?.name || "Customer"}</h3>
              <p className="text-sm text-muted-foreground">
                {order.orderNumber}
                {order.tableNumber ? ` • Table ${order.tableNumber}` : order.isTakeaway ? " • Takeaway" : ""}
              </p>
            </div>
            <div className="text-right">
              <Badge variant={STATUS_BADGE[order.status] || "secondary"} className="mb-1 text-xs">
                {order.status}
              </Badge>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="mb-3 space-y-1">
            {order.items.map((item) => (
              <p key={item.id} className="text-sm text-muted-foreground">
                {item.quantity}x {item.product?.name || item.name}
              </p>
            ))}
            {order.note && (
              <p className="text-xs text-amber-600">📝 {order.note}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-600">{formatPrice(order.total)}</span>
            {nextStatus && (
              <Button
                size="sm"
                onClick={() => updateStatus.mutate({ orderId: order.id, status: nextStatus })}
                disabled={updateStatus.isPending}
                className="gap-1.5"
              >
                {order.status === "PREPARING" ? (
                  <CheckCheck className="h-4 w-4" />
                ) : (
                  <ChefHat className="h-4 w-4" />
                )}
                {getNextLabel(order.status)}
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and track incoming orders</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["live-orders", restaurantId] })}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${liveLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="live" className="relative">
            Live Orders
            {liveOrders && liveOrders.length > 0 && (
              <Badge variant="default" className="ml-2 h-5 px-1.5 text-[10px]">
                {liveOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="mt-6">
          {liveLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="h-52 animate-pulse bg-muted" />
              ))}
            </div>
          ) : liveOrders?.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16">
              <Clock className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No active orders right now</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {liveOrders?.map((order, i) => renderOrder(order, i))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {histLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : historyOrders?.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16">
              <CheckCheck className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No order history yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {historyOrders?.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-xl border p-4">
                  <div>
                    <p className="font-medium">{order.user?.name || "Customer"}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.orderNumber} • {order.items.length} items •{" "}
                      {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={STATUS_BADGE[order.status] || "secondary"} className="text-xs">
                      {order.status}
                    </Badge>
                    <span className="font-medium">{formatPrice(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
