"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Store, Clock, Bell, Shield, CreditCard } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your restaurant settings</p>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <Store className="h-5 w-5 text-emerald-500" />
          <h2 className="text-lg font-semibold">Restaurant Info</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Restaurant Name</label>
            <Input defaultValue="Pizza Paradise" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Phone</label>
              <Input defaultValue="+1 555-1234" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <Input defaultValue="hello@pizzaparadise.com" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Cuisine Type</label>
            <Input defaultValue="Italian, Pizza" />
          </div>
          <Button>Save Changes</Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <Clock className="h-5 w-5 text-emerald-500" />
          <h2 className="text-lg font-semibold">Operating Hours</h2>
        </div>
        <div className="space-y-3">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
            <div key={day} className="flex items-center justify-between">
              <span className="text-sm font-medium w-24">{day}</span>
              <Switch defaultChecked={day !== "Sunday"} />
              <div className="flex items-center gap-2">
                <Input defaultValue="10:00" className="h-9 w-20" type="time" />
                <span className="text-muted-foreground">to</span>
                <Input defaultValue="22:00" className="h-9 w-20" type="time" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
