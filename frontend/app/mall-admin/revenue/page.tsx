"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, TrendingUp, Download, ArrowUpRight } from "lucide-react";

export default function MallRevenuePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revenue</h1>
          <p className="text-muted-foreground">Track food court revenue and payouts</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="month">
            <SelectTrigger className="w-32 h-9">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Gross Revenue", value: "$48,290", change: "+18.2%" },
          { label: "Commission", value: "$7,243", change: "+18.2%" },
          { label: "Net Payout", value: "$41,047", change: "+18.2%" },
          { label: "Avg Order Value", value: "$12.56", change: "+5.3%" },
        ].map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold">{stat.value}</p>
            <div className="mt-2 flex items-center gap-1 text-sm text-emerald-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>{stat.change}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Revenue by Restaurant</h3>
        <div className="space-y-4">
          {[
            { name: "Pizza Paradise", revenue: "$12,450", commission: "$1,867", share: "25.8%" },
            { name: "Dragon Wok", revenue: "$9,840", commission: "$1,476", share: "20.4%" },
            { name: "Burger Barn", revenue: "$7,230", commission: "$1,084", share: "15.0%" },
            { name: "Sushi Master", revenue: "$6,890", commission: "$1,033", share: "14.3%" },
            { name: "Others", revenue: "$11,880", commission: "$1,783", share: "24.5%" },
          ].map((r, i) => (
            <div key={r.name} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-6">{i + 1}.</span>
                <span className="font-medium">{r.name}</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span>{r.revenue}</span>
                <span className="text-muted-foreground">{r.commission}</span>
                <span className="w-12 text-right text-muted-foreground">{r.share}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
