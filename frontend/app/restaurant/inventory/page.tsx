"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Package, Search, AlertTriangle } from "lucide-react";

const inventory = [
  { name: "Pizza Dough", quantity: 25, unit: "portions", minStock: 10, status: "good" },
  { name: "Mozzarella Cheese", quantity: 5, unit: "kg", minStock: 8, status: "low" },
  { name: "Tomato Sauce", quantity: 3, unit: "liters", minStock: 2, status: "good" },
  { name: "Pepperoni", quantity: 2, unit: "kg", minStock: 3, status: "low" },
  { name: "Basil", quantity: 0.5, unit: "kg", minStock: 1, status: "critical" },
];

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Track your stock levels</p>
        </div>
        <Button>Update Stock</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search inventory..." className="h-10 pl-9" />
      </div>

      <div className="grid gap-3">
        {inventory.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  item.status === "critical" ? "bg-red-100 dark:bg-red-900/30" :
                  item.status === "low" ? "bg-amber-100 dark:bg-amber-900/30" :
                  "bg-emerald-100 dark:bg-emerald-900/30"
                }`}>
                  {item.status === "critical" ? (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  ) : (
                    <Package className="h-5 w-5 text-emerald-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} {item.unit} • Min: {item.minStock} {item.unit}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  item.status === "critical" ? "destructive" :
                  item.status === "low" ? "warning" : "success"
                }
              >
                {item.status}
              </Badge>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
