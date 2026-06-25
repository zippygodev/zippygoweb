"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Globe,
  Mail,
  Bell,
  CreditCard,
  Shield,
  Palette,
  Database,
  Webhook,
} from "lucide-react";

export default function SuperAdminSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground">Configure global platform settings</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <Globe className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-semibold">General</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Platform Name</label>
                <Input defaultValue="FoodCourtOS" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Support Email</label>
                  <Input defaultValue="support@foodcourtos.com" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Support Phone</label>
                  <Input defaultValue="+1-555-0000" />
                </div>
              </div>
              <Button onClick={() => toast.success("Settings saved")}>Save Changes</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <Bell className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "New Organization Signup", desc: "Email when a new organization registers" },
                { label: "Payment Received", desc: "Alert on successful subscription payments" },
                { label: "System Alerts", desc: "Critical system health notifications" },
                { label: "Weekly Report", desc: "Weekly platform performance summary" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <Mail className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-semibold">Email Configuration</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">SMTP Host</label>
                <Input defaultValue="smtp.sendgrid.net" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">SMTP Port</label>
                  <Input defaultValue="587" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">From Address</label>
                  <Input defaultValue="noreply@foodcourtos.com" />
                </div>
              </div>
              <Button onClick={() => toast.success("Email settings saved")}>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-semibold">Payment Gateway</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Razorpay Key ID</label>
                <Input type="password" defaultValue="rzp_live_********" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Razorpay Key Secret</label>
                <Input type="password" defaultValue="********" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Default Currency</label>
                <Input defaultValue="INR" />
              </div>
              <Button onClick={() => toast.success("Payment settings saved")}>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <Webhook className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-semibold">API Configuration</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Rate Limit (per minute)</label>
                <Input type="number" defaultValue="100" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">CORS Origins</label>
                <Input defaultValue="https://app.foodcourtos.com" />
              </div>
              <Button onClick={() => toast.success("API settings saved")}>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
