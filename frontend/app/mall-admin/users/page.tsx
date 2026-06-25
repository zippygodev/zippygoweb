"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { getInitials } from "@/lib/utils";
import { Search, Users, Shield, MoreHorizontal } from "lucide-react";

const users = [
  { name: "John Doe", email: "john@example.com", role: "Customer", status: "active", orders: 24 },
  { name: "Jane Smith", email: "jane@example.com", role: "Customer", status: "active", orders: 18 },
  { name: "Bob Wilson", email: "bob@example.com", role: "Customer", status: "blocked", orders: 3 },
  { name: "Alice Brown", email: "alice@example.com", role: "Restaurant Owner", status: "active", orders: 0 },
];

export default function MallUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage all platform users</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{users.length} total</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search users by name or email..." className="h-10 pl-9" />
      </div>

      <Card>
        <div className="divide-y">
          {users.map((user, i) => (
            <motion.div
              key={user.email}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              <Avatar>
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{user.name}</p>
                  <Badge variant="secondary" className="text-[10px]">{user.role}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{user.email} • {user.orders} orders</p>
              </div>
              <Badge variant={user.status === "active" ? "success" : "destructive"}>
                {user.status}
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
