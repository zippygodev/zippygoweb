"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Bell,
  Shield,
  CreditCard,
  Heart,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [name, setName] = React.useState(user?.name || "");
  const [email, setEmail] = React.useState(user?.email || "");

  const handleSave = () => {
    toast.success("Profile updated");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Profile</h1>

      {/* Avatar */}
      <div className="mb-8 flex flex-col items-center">
        <Avatar className="mb-4 h-24 w-24">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="text-2xl">
            {user ? getInitials(user.name) : "U"}
          </AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm">
          Change Photo
        </Button>
      </div>

      {/* Personal Info */}
      <Card className="mb-6 p-6">
        <h2 className="mb-4 text-lg font-semibold">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Phone</label>
            <Input value={user?.phone || ""} disabled />
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="mb-6 p-6">
        <h2 className="mb-4 text-lg font-semibold">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Receive order updates</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive promotional emails</p>
              </div>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      {/* Account */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Account</h2>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Heart className="mr-3 h-5 w-5" />
            Favorites
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <CreditCard className="mr-3 h-5 w-5" />
            Payment Methods
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Shield className="mr-3 h-5 w-5" />
            Security
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
          <Separator className="my-2" />
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
}
