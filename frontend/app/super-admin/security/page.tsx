"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Key, Users, AlertTriangle, Clock } from "lucide-react";

const recentLogins = [
  { user: "Super Admin", email: "superadmin@foodcourtos.com", ip: "192.168.1.100", time: "5m ago", status: "success" },
  { user: "Mall Admin", email: "malladmin@cityfoodcourt.com", ip: "192.168.1.101", time: "1h ago", status: "success" },
  { user: "Unknown", email: "hacker@example.com", ip: "203.0.113.50", time: "3h ago", status: "failed" },
];

export default function SuperAdminSecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Center</h1>
        <p className="text-muted-foreground">Monitor and manage platform security</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Sessions", value: "47", icon: Users, color: "text-blue-600" },
          { label: "Failed Logins (24h)", value: "12", icon: AlertTriangle, color: "text-red-600" },
          { label: "MFA Enabled", value: "68%", icon: Shield, color: "text-emerald-600" },
          { label: "Avg Response Time", value: "45ms", icon: Clock, color: "text-purple-600" },
        ].map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-500" />
          <h2 className="text-lg font-semibold">Security Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Require MFA for all admin accounts</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Rate Limiting</p>
              <p className="text-xs text-muted-foreground">100 requests per minute per IP</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Session Timeout</p>
              <p className="text-xs text-muted-foreground">Auto-logout after 24 hours of inactivity</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">IP Whitelisting</p>
              <p className="text-xs text-muted-foreground">Restrict admin access to trusted IPs</p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Key className="h-5 w-5 text-emerald-500" />
          <h2 className="text-lg font-semibold">Recent Login Activity</h2>
        </div>
        <div className="space-y-3">
          {recentLogins.map((login, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border p-3">
              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${login.status === "success" ? "bg-emerald-500" : "bg-red-500"}`} />
                <div>
                  <p className="text-sm font-medium">{login.user}</p>
                  <p className="text-xs text-muted-foreground">{login.email} • {login.ip}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={login.status === "success" ? "success" : "destructive"} className="text-[10px]">
                  {login.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{login.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
