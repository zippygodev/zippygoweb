"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Server, Database, Globe, Cpu, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const services = [
  { name: "API Server", status: "healthy", uptime: "99.99%", latency: "45ms", pods: 4, region: "us-east-1" },
  { name: "PostgreSQL", status: "healthy", uptime: "99.95%", latency: "12ms", size: "256 GB", connections: 23 },
  { name: "Redis Cache", status: "healthy", uptime: "99.99%", latency: "2ms", memory: "4.2 GB / 8 GB", hits: "98.5%" },
  { name: "AI Service", status: "degraded", uptime: "98.50%", latency: "230ms", requests: "1,200/min", errors: "0.5%" },
  { name: "CDN", status: "healthy", uptime: "100%", latency: "35ms", bandwidth: "2.4 Gbps", cache: "94%" },
  { name: "Socket.IO", status: "healthy", uptime: "99.98%", latency: "8ms", connections: 347, channels: 12 },
];

const alerts = [
  { severity: "warning", message: "AI Service latency above threshold (230ms)", time: "5m ago", service: "ai-service" },
  { severity: "info", message: "Database connection pool at 76% capacity", time: "15m ago", service: "database" },
  { severity: "resolved", message: "Redis memory usage spike resolved", time: "1h ago", service: "redis" },
];

export default function SuperAdminMonitoringPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Monitoring</h1>
          <p className="text-muted-foreground">System health and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> 4 Healthy</Badge>
          <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> 1 Degraded</Badge>
        </div>
      </div>

      <Tabs defaultValue="services">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.name} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${
                      service.status === "healthy" ? "bg-emerald-500" :
                      service.status === "degraded" ? "bg-amber-500" : "bg-red-500"
                    }`} />
                    <h3 className="font-medium">{service.name}</h3>
                  </div>
                  <Badge variant={
                    service.status === "healthy" ? "success" :
                    service.status === "degraded" ? "warning" : "destructive"
                  } className="text-[10px]">{service.status}</Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className="font-medium">{service.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Latency</span>
                    <span className="font-medium">{service.latency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Details</span>
                    <span className="font-medium text-xs">{(service as any).pods || (service as any).connections || (service as any).requests || ""}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <Card className="p-6">
            <div className="space-y-3">
              {alerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border p-3">
                  <div className={`mt-1 h-2.5 w-2.5 rounded-full ${
                    alert.severity === "warning" ? "bg-amber-500" :
                    alert.severity === "info" ? "bg-blue-500" : "bg-emerald-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.service} • {alert.time}</p>
                  </div>
                  <Badge variant={
                    alert.severity === "warning" ? "warning" :
                    alert.severity === "info" ? "secondary" : "success"
                  } className="text-[10px] shrink-0">{alert.severity}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="flex h-48 items-center justify-center text-muted-foreground">
            Live log viewer will appear here
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
