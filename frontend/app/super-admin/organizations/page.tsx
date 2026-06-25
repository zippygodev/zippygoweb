"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, Plus, Building2, Users, TrendingUp } from "lucide-react";

const organizations = [
  { id: "1", name: "City Food Court Mall", slug: "city-food-court", restaurants: 8, users: 124, plan: "enterprise", status: "active", revenue: "$48,290" },
  { id: "2", name: "Grand Plaza Food Court", slug: "grand-plaza", restaurants: 5, users: 89, plan: "professional", status: "active", revenue: "$32,100" },
  { id: "3", name: "Airport Terminal 3", slug: "airport-t3", restaurants: 12, users: 45, plan: "enterprise", status: "active", revenue: "$67,430" },
  { id: "4", name: "University Campus", slug: "uni-campus", restaurants: 3, users: 12, plan: "starter", status: "trial", revenue: "$8,200" },
];

export default function SuperAdminOrganizationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">Manage all tenant organizations</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add Organization</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search organizations..." className="h-10 pl-9" />
      </div>

      <div className="grid gap-4">
        {organizations.map((org, i) => (
          <motion.div
            key={org.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="flex items-center gap-4 p-4 transition-all hover:shadow-md">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{org.name}</h3>
                  <Badge variant={org.status === "active" ? "success" : "warning"} className="text-[10px]">{org.status}</Badge>
                  <Badge variant="secondary" className="text-[10px]">{org.plan}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{org.slug}</p>
                <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {org.restaurants} restaurants</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {org.users} users</span>
                  <span className="font-medium text-emerald-600">{org.revenue}</span>
                </div>
              </div>
              <Link href={`/super-admin/organizations/${org.id}`}>
                <Button variant="ghost" size="sm">Manage</Button>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
