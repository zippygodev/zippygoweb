"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, Plus, Store, Star, TrendingUp } from "lucide-react";

const restaurants = [
  { id: "1", name: "Pizza Paradise", owner: "John Smith", cuisine: "Italian", status: "active", revenue: "$12,450", orders: 342, rating: 4.5 },
  { id: "2", name: "Dragon Wok", owner: "Lisa Chen", cuisine: "Chinese", status: "active", revenue: "$9,840", orders: 289, rating: 4.3 },
  { id: "3", name: "Burger Barn", owner: "Mike Johnson", cuisine: "American", status: "active", revenue: "$7,230", orders: 256, rating: 4.7 },
  { id: "4", name: "Green Bowl", owner: "Sarah Wilson", cuisine: "Healthy", status: "inactive", revenue: "$3,210", orders: 98, rating: 4.2 },
];

export default function MallRestaurantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Restaurants</h1>
          <p className="text-muted-foreground">Manage all restaurants in the food court</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add Restaurant</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search restaurants..." className="h-10 pl-9" />
      </div>

      <div className="grid gap-4">
        {restaurants.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/mall-admin/restaurants/${r.id}`}>
              <Card className="flex items-center gap-4 p-4 transition-all hover:shadow-md">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                  <Store className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{r.name}</h3>
                    <Badge variant={r.status === "active" ? "success" : "secondary"} className="text-[10px]">
                      {r.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.cuisine} • Owner: {r.owner}</p>
                  <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {r.orders} orders</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {r.rating}</span>
                    <span className="font-medium text-emerald-600">{r.revenue}</span>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
