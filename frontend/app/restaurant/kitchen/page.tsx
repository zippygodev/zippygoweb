"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChefHat, CheckCheck, Timer, AlertTriangle, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  variant?: string;
  product?: { name: string };
}

interface KdsOrder {
  id: string;
  orderNumber: string;
  status: string;
  tableNumber?: number | null;
  isTakeaway: boolean;
  note?: string | null;
  createdAt: string;
  items: OrderItem[];
  user?: { name: string; phone?: string };
}

const STATUS_PRIORITY: Record<string, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PREPARING: 2,
  READY: 3,
  DELIVERED: 4,
  CANCELLED: 5,
};

export default function KitchenDisplayPage() {
  const queryClient = useQueryClient();
  const [restaurantId, setRestaurantId] = React.useState<string | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [now, setNow] = React.useState(new Date());

  // Get restaurant ID
  React.useEffect(() => {
    api.get("/restaurants?limit=1").then(({ data }) => {
      const r = data?.data?.[0] || data?.[0];
      if (r) setRestaurantId(r.id);
    });
  }, []);

  // Clock ticker
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(t);
  }, []);

  // Simulate WebSocket connection (real ws needs socket.io-client installed)
  React.useEffect(() => {
    if (!restaurantId) return;
    setIsConnected(true);

    // Real-time polling every 10s as a WebSocket fallback
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["kds-orders", restaurantId] });
    }, 10_000);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [restaurantId, queryClient]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["kds-orders", restaurantId],
    queryFn: async () => {
      const { data } = await api.get(
        `/orders/restaurant/${restaurantId}?status=PENDING,CONFIRMED,PREPARING,READY`,
      );
      const list: KdsOrder[] = Array.isArray(data) ? data : data?.data || [];
      return list.sort(
        (a, b) =>
          STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status] ||
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    },
    enabled: !!restaurantId,
    refetchInterval: 15_000,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      await api.patch(`/orders/${orderId}/status`, { status });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["kds-orders", restaurantId] });
      toast.success(`Order status updated to ${vars.status}`);
    },
  });

  const pendingCount = orders?.filter((o) => o.status === "PENDING").length || 0;
  const preparingCount = orders?.filter((o) => o.status === "PREPARING").length || 0;
  const readyCount = orders?.filter((o) => o.status === "READY").length || 0;

  function getElapsed(createdAt: string) {
    try {
      return formatDistanceToNow(new Date(createdAt), { addSuffix: false });
    } catch {
      return "—";
    }
  }

  function isUrgent(createdAt: string) {
    return now.getTime() - new Date(createdAt).getTime() > 15 * 60 * 1000; // > 15 minutes
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Kitchen Display</h1>
            <div className={`flex items-center gap-1.5 text-xs ${isConnected ? "text-emerald-600" : "text-red-500"}`}>
              {isConnected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
              <span>{isConnected ? "Live" : "Offline"}</span>
            </div>
          </div>
          <p className="text-muted-foreground">Live order queue — auto-refreshes every 10s</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {pendingCount > 0 && (
            <Badge variant="default" className="gap-1 px-3 py-1 text-sm">
              <Clock className="h-4 w-4" />
              {pendingCount} Pending
            </Badge>
          )}
          {preparingCount > 0 && (
            <Badge variant="warning" className="gap-1 px-3 py-1 text-sm">
              <Timer className="h-4 w-4" />
              {preparingCount} Preparing
            </Badge>
          )}
          {readyCount > 0 && (
            <Badge variant="success" className="gap-1 px-3 py-1 text-sm">
              <CheckCheck className="h-4 w-4" />
              {readyCount} Ready
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["kds-orders", restaurantId] })}
            className="gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Orders Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-56 animate-pulse bg-muted" />
          ))}
        </div>
      ) : orders?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20">
          <ChefHat className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">Kitchen is clear!</h3>
          <p className="text-sm text-muted-foreground">No active orders at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {orders?.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={isUrgent(order.createdAt) ? "ring-2 ring-red-500 rounded-2xl" : ""}
              >
                <Card
                  className={`p-5 ${
                    order.status === "PREPARING"
                      ? "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20"
                      : order.status === "READY"
                      ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20"
                      : ""
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">{order.orderNumber}</h3>
                        {isUrgent(order.createdAt) && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.isTakeaway ? "🥡 Takeaway" : order.tableNumber ? `🪑 Table ${order.tableNumber}` : "Dine-In"}
                        {order.user?.name ? ` — ${order.user.name}` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          order.status === "PREPARING"
                            ? "warning"
                            : order.status === "READY"
                            ? "success"
                            : "default"
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                      <p className="mt-1 text-xs text-muted-foreground">{getElapsed(order.createdAt)} ago</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-4 space-y-1.5">
                    {order.items.map((item) => (
                      <div key={item.id} className="rounded-lg bg-muted/50 px-3 py-2">
                        <p className="font-medium">
                          <span className="text-emerald-600">{item.quantity}x</span>{" "}
                          {item.product?.name || item.name}
                        </p>
                        {item.variant && (
                          <p className="text-xs text-muted-foreground">{item.variant}</p>
                        )}
                      </div>
                    ))}
                    {order.note && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 dark:border-amber-800 dark:bg-amber-950/20">
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                          📝 {order.note}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {order.status === "PENDING" && (
                      <Button
                        size="sm"
                        className="flex-1 gap-1.5 bg-amber-500 hover:bg-amber-600"
                        onClick={() => updateStatus.mutate({ orderId: order.id, status: "PREPARING" })}
                        disabled={updateStatus.isPending}
                      >
                        <ChefHat className="h-4 w-4" />
                        Start Preparing
                      </Button>
                    )}
                    {order.status === "CONFIRMED" && (
                      <Button
                        size="sm"
                        className="flex-1 gap-1.5 bg-amber-500 hover:bg-amber-600"
                        onClick={() => updateStatus.mutate({ orderId: order.id, status: "PREPARING" })}
                        disabled={updateStatus.isPending}
                      >
                        <ChefHat className="h-4 w-4" />
                        Start Preparing
                      </Button>
                    )}
                    {order.status === "PREPARING" && (
                      <Button
                        size="sm"
                        className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => updateStatus.mutate({ orderId: order.id, status: "READY" })}
                        disabled={updateStatus.isPending}
                      >
                        <CheckCheck className="h-4 w-4" />
                        Mark Ready
                      </Button>
                    )}
                    {order.status === "READY" && (
                      <Button
                        size="sm"
                        className="flex-1 gap-1.5"
                        onClick={() => updateStatus.mutate({ orderId: order.id, status: "DELIVERED" })}
                        disabled={updateStatus.isPending}
                      >
                        <CheckCheck className="h-4 w-4" />
                        Delivered
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
