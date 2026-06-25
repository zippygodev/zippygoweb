"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { formatPrice, formatDate } from "@/lib/utils";
import { Plus, TicketPercent, Pencil, Calendar, TrendingUp } from "lucide-react";

const promotions = [
  { id: "1", name: "20% Off Large Pizzas", code: "PIZZA20", type: "percentage", value: 20, minOrder: 500, usage: 45, maxUses: 100, status: "active", endsAt: new Date("2025-01-31") },
  { id: "2", name: "Free Garlic Bread", code: "BREADFREE", type: "fixed", value: 149, minOrder: 300, usage: 23, maxUses: 50, status: "active", endsAt: new Date("2025-02-15") },
  { id: "3", name: "Combo Deal", code: "COMBO10", type: "percentage", value: 10, minOrder: 1000, usage: 12, maxUses: 200, status: "inactive", endsAt: new Date("2025-01-20") },
];

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Promotions</h1>
          <p className="text-muted-foreground">Create and manage discounts & offers</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Create Promotion</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promo, i) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="relative overflow-hidden p-5">
              <div className="absolute right-0 top-0">
                <Switch defaultChecked={promo.status === "active"} className="m-3" />
              </div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <TicketPercent className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold">{promo.name}</h3>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs font-mono">{promo.code}</Badge>
                <Badge variant={promo.status === "active" ? "success" : "secondary"} className="text-[10px]">
                  {promo.status}
                </Badge>
              </div>
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                <p>{promo.type === "percentage" ? `${promo.value}% off` : `${formatPrice(promo.value)} off`}</p>
                <p>Min order: {formatPrice(promo.minOrder)}</p>
                <p className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Ends {formatDate(promo.endsAt)}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span className="font-medium">{promo.usage}/{promo.maxUses} used</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
