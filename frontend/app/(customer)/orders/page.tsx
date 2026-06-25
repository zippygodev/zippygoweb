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
import {
  Package,
  Clock,
  MapPin,
  ChevronRight,
  Star,
  RefreshCw,
} from "lucide-react";

const orderHistory = [
  {
    id: "ORD-001",
    restaurant: "Pizza Paradise",
    items: ["Margherita Pizza x2", "Garlic Bread x1"],
    total: 1047,
    status: "delivered",
    date: new Date("2024-12-20"),
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100",
  },
  {
    id: "ORD-002",
    restaurant: "Dragon Wok",
    items: ["Kung Pao Chicken x1", "Fried Rice x1"],
    total: 698,
    status: "preparing",
    date: new Date(),
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=100",
  },
];

const statusSteps = ["confirmed", "preparing", "ready", "delivered"];

export default function OrdersPage() {
  const activeOrders = orderHistory.filter((o) => o.status !== "delivered");
  const pastOrders = orderHistory.filter((o) => o.status === "delivered");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="mt-1 text-muted-foreground">Track and manage your orders</p>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeOrders.length === 0 ? (
            <div className="py-16 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No active orders</h3>
              <p className="text-muted-foreground">Place your first order!</p>
              <Link href="/restaurants">
                <Button className="mt-4">Browse Restaurants</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-xl">
                          <img src={order.image} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{order.restaurant}</h3>
                          <p className="text-sm text-muted-foreground">{order.id}</p>
                        </div>
                      </div>
                      <Badge variant={order.status === "preparing" ? "warning" : "default"}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <Progress value={statusSteps.indexOf(order.status) * 33 + 33} className="mb-4" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {order.items.join(", ")}
                      </span>
                      <span className="font-medium">{formatPrice(order.total)}</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          {pastOrders.length === 0 ? (
            <div className="py-16 text-center">
              <RefreshCw className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
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
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                      <img src={order.image} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{order.restaurant}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {order.items.join(", ")}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{formatDate(order.date)}</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
