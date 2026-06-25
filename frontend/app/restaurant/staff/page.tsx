"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { getInitials } from "@/lib/utils";
import { Users, Clock, Plus } from "lucide-react";

const staff = [
  { name: "John Chef", role: "Head Chef", email: "john@example.com", status: "active", shift: "09:00-17:00" },
  { name: "Maria Cook", role: "Line Cook", email: "maria@example.com", status: "active", shift: "14:00-22:00" },
  { name: "David Server", role: "Server", email: "david@example.com", status: "offline", shift: "09:00-17:00" },
];

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff</h1>
          <p className="text-muted-foreground">Manage your team</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add Staff</Button>
      </div>

      <div className="grid gap-4">
        {staff.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="flex items-center gap-4 p-4">
              <Avatar>
                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{member.email}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {member.shift}</span>
                </div>
              </div>
              <Badge variant={member.status === "active" ? "success" : "secondary"}>
                {member.status}
              </Badge>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
