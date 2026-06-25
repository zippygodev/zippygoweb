"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, TrendingUp, DollarSign, ShoppingBag, Users } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Analytics and performance data</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="items">Top Items</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Today", value: "$1,234", change: "+12.5%", trend: "up" },
              { label: "This Week", value: "$8,456", change: "+8.3%", trend: "up" },
              { label: "This Month", value: "$34,290", change: "+15.7%", trend: "up" },
            ].map((stat) => (
              <Card key={stat.label} className="p-6">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                <Badge variant="success" className="mt-2">{stat.change}</Badge>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="flex h-48 items-center justify-center text-muted-foreground">
            Order analytics chart will appear here
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card className="flex h-48 items-center justify-center text-muted-foreground">
            Top selling items chart will appear here
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
