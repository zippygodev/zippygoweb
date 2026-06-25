"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil, Search, SlidersHorizontal } from "lucide-react";

const menuItems = [
  { id: 1, name: "Margherita Pizza", category: "Pizzas", price: 349, status: "active", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100", popular: true },
  { id: 2, name: "Pepperoni Pizza", category: "Pizzas", price: 449, status: "active", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=100", popular: true },
  { id: 3, name: "Pasta Carbonara", category: "Pasta", price: 399, status: "active", image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=100", popular: false },
  { id: 4, name: "Garlic Bread", category: "Sides", price: 149, status: "inactive", image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=100", popular: false },
];

export default function MenuPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Menu</h1>
          <p className="text-muted-foreground">Manage your restaurant menu items</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search menu..."
            className="h-10 w-full rounded-xl border bg-white pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-black/50"
          />
        </div>
        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-xl">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {menuItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card className="flex items-center gap-4 p-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{item.name}</h3>
                  {item.popular && (
                    <Badge variant="success" className="text-[10px]">Popular</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <span className="font-semibold text-emerald-600">{formatPrice(item.price)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Switch defaultChecked={item.status === "active"} />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
