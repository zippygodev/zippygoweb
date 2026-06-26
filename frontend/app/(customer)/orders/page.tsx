"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { formatPrice, formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import {
  Package,
  Clock,
  MapPin,
  ChevronRight,
  RefreshCw,
  Loader2,
} from "lucide-react";

const statusSteps = ["confirmed", "preparing", "ready", "delivered"];

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/my");
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to fetch user orders", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const getMappedStatus = (dbStatus: string): string => {
    const status = dbStatus.toLowerCase();
    if (status === "pending" || status === "confirmed") return "confirmed";
    if (status === "preparing") return "preparing";
    if (status === "ready") return "ready";
    if (status === "delivered") return "delivered";
    return status;
  };

  const getStatusPercentage = (status: string): number => {
    const mapped = getMappedStatus(status);
    const index = statusSteps.indexOf(mapped);
    if (index === -1) return 0;
    return index * 33 + 33;
  };

  const activeOrders = orders.filter((o) => o.status !== "DELIVERED" && o.status !== "CANCELLED");
  const pastOrders = orders.filter((o) => o.status === "DELIVERED" || o.status === "CANCELLED");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="mt-1 text-muted-foreground">Track and manage your orders</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setLoading(true); fetchOrders(); }} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
            <TabsTrigger value="history">Order History ({pastOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeOrders.length === 0 ? (
              <div className="py-16 text-center border rounded-2xl border-dashed bg-muted/30">
                <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No active orders</h3>
                <p className="text-muted-foreground">Place your first order!</p>
                <Link href="/restaurants">
                  <Button className="mt-4">Browse Restaurants</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order) => {
                  const mappedStatus = getMappedStatus(order.status);
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-2xl font-bold text-secondary-foreground">
                              🍽️
                            </div>
                            <div>
                              <h3 className="font-semibold">{order.restaurant?.name || "Restaurant"}</h3>
                              <p className="text-sm text-muted-foreground">{order.orderNumber}</p>
                            </div>
                          </div>
                          <Badge variant={order.status === "PREPARING" ? "warning" : order.status === "READY" ? "success" : "default"}>
                            {order.status}
                          </Badge>
                        </div>
                        <Progress value={getStatusPercentage(order.status)} className="mb-4" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground truncate max-w-[70%]">
                            {order.items?.map((item: any) => `${item.quantity}x ${item.name || "Item"}`).join(", ")}
                          </span>
                          <span className="font-medium text-amber-600">{formatPrice(order.total)}</span>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {pastOrders.length === 0 ? (
              <div className="py-16 text-center border rounded-2xl border-dashed bg-muted/30">
                <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No order history</h3>
                <p className="text-muted-foreground">Your past orders will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pastOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="flex items-center gap-4 p-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-secondary text-3xl font-bold">
                        🍔
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 justify-between mb-1">
                          <h3 className="font-medium truncate">{order.restaurant?.name || "Restaurant"}</h3>
                          <Badge variant={order.status === "CANCELLED" ? "destructive" : "secondary"}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {order.items?.map((item: any) => `${item.quantity}x ${item.name}`).join(", ")}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{formatDate(new Date(order.createdAt))}</span>
                          <span>{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
