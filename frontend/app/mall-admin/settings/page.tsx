"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Building2, Bell, Shield, DollarSign, Percent } from "lucide-react";

export default function MallSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage food court settings</p>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <Building2 className="h-5 w-5 text-emerald-500" />
          <h2 className="text-lg font-semibold">Food Court Info</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Food Court Name</label>
            <Input defaultValue="City Food Court Mall" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Phone</label>
              <Input defaultValue="+1-555-0100" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <Input defaultValue="admin@cityfoodcourt.com" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Address</label>
            <Input defaultValue="123 Main Street, Downtown" />
          </div>
          <Button onClick={() => toast.success("Settings saved")}>Save Changes</Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <Percent className="h-5 w-5 text-emerald-500" />
          <h2 className="text-lg font-semibold">Commission Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Default Commission Rate (%)</label>
            <Input type="number" defaultValue="15" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Minimum Monthly Rent</label>
            <Input type="number" defaultValue="1000" />
          </div>
          <Button onClick={() => toast.success("Commission settings saved")}>Save Changes</Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <Bell className="h-5 w-5 text-emerald-500" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">New Restaurant Registration</p>
              <p className="text-xs text-muted-foreground">Get notified when a new restaurant signs up</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Payment Failed</p>
              <p className="text-xs text-muted-foreground">Alert when a payment fails</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Daily Summary Report</p>
              <p className="text-xs text-muted-foreground">Receive daily performance summary</p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>
    </div>
  );
}
