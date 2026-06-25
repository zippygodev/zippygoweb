"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Store, Star, TrendingUp, DollarSign, AlertTriangle } from "lucide-react";

export default function RestaurantDetailPage() {
  const router = useRouter();
  const params = useParams();

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Restaurants
      </button>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
            <Store className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Pizza Paradise</h1>
            <p className="text-muted-foreground">Italian • Food Court, Level 2</p>
            <div className="mt-1 flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.5</span>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Suspend</Button>
          <Button>Edit</Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Revenue", value: "$12,450", change: "+18.2%", icon: DollarSign },
              { label: "Total Orders", value: "342", change: "+12.5%", icon: TrendingUp },
              { label: "Avg Rating", value: "4.5", change: "+0.2", icon: Star },
              { label: "Reports", value: "2", change: "-1", icon: AlertTriangle, negative: true },
            ].map((stat) => (
              <Card key={stat.label} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                  <Badge variant={stat.negative ? "destructive" : "success"} className="text-[10px]">{stat.change}</Badge>
                </div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>

          <Card className="mt-6 p-6">
            <h3 className="mb-4 font-semibold">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: "New menu item added", detail: "Truffle Pasta - $18.99", time: "2h ago" },
                { action: "Staff schedule updated", detail: "3 shifts modified", time: "5h ago" },
                { action: "Promotion created", detail: "20% off on large pizzas", time: "1d ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.detail} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="flex h-48 items-center justify-center text-muted-foreground">
            Order history for this restaurant
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card className="flex h-48 items-center justify-center text-muted-foreground">
            Customer reviews will appear here
          </Card>
        </TabsContent>

        <TabsContent value="staff">
          <Card className="flex h-48 items-center justify-center text-muted-foreground">
            Staff management will appear here
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
