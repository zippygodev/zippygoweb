'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDelivery } from '../DeliveryClientLayout';
import {
  User,
  Bike,
  Star,
  IndianRupee,
  Calendar,
  Clock,
  Navigation,
  Shield,
  Settings,
  ChevronRight,
  Pencil,
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Car,
  BadgeCheck,
  Phone,
  MapPin,
  Mail,
  Globe,
  Bell,
  BellOff,
  Moon,
  Sun,
  LogOut,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

const stats: StatItem[] = [
  { label: 'Total Deliveries', value: '1,247', icon: Bike, color: 'bg-primary' },
  { label: 'Total Earnings', value: '₹1,82,450', icon: IndianRupee, color: 'bg-emerald-500' },
  { label: 'Rating', value: '4.8', icon: Star, color: 'bg-yellow-500' },
  { label: 'Total Distance', value: '3,842 km', icon: Navigation, color: 'bg-blue-500' },
  { label: 'Member Since', value: 'Jan 2025', icon: Calendar, color: 'bg-purple-500' },
  { label: 'On-Time Rate', value: '98%', icon: Clock, color: 'bg-cyan-500' },
];

function ProfileHeader() {
  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-background sm:h-32" />
      <CardContent className="relative px-4 pb-4 pt-0">
        <div className="flex flex-col items-center -mt-12 sm:flex-row sm:items-end sm:gap-4">
          <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-primary/20">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=delivery" />
            <AvatarFallback className="text-2xl">RK</AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="secondary"
            className="absolute left-20 top-12 h-7 w-7 rounded-full sm:left-[88px] sm:top-[52px]"
          >
            <Camera className="h-3.5 w-3.5" />
          </Button>
          <div className="mt-2 text-center sm:mt-0 sm:text-left sm:flex-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h2 className="text-xl font-bold">Rahul Kumar</h2>
              <BadgeCheck className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Delivery Partner</p>
            <div className="mt-2 flex items-center gap-3 justify-center sm:justify-start text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                Sector 18, Noida
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                4.8 (312 reviews)
              </span>
              <Badge variant="secondary" className="text-[10px]">
                <CheckCircle2 className="mr-0.5 h-3 w-3" />
                Verified
              </Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-2 sm:mt-0 gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StatsGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', stat.color)}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function PersonalInfo() {
  const [editing, setEditing] = useState(false);

  const infoRows = [
    { label: 'Full Name', value: 'Rahul Kumar', icon: User },
    { label: 'Phone', value: '+91 98765 43210', icon: Phone },
    { label: 'Email', value: 'rahul.kumar@zippygo.com', icon: Mail },
    { label: 'Location', value: 'Sector 18, Noida, Uttar Pradesh', icon: MapPin },
    { label: 'Language', value: 'Hindi, English', icon: Globe },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-sm font-medium">Personal Information</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 text-xs"
          onClick={() => setEditing(!editing)}
        >
          <Pencil className="h-3.5 w-3.5" />
          {editing ? 'Save' : 'Edit'}
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-0">
        {infoRows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="flex items-center gap-3 py-2.5">
              <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
              {editing ? (
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">{row.label}</Label>
                  <Input defaultValue={row.value} className="h-8 mt-0.5 text-sm" />
                </div>
              ) : (
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{row.value}</p>
                  <p className="text-xs text-muted-foreground">{row.label}</p>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function VehicleDetails() {
  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium">Vehicle Details</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-0">
        <div className="flex items-center gap-3 py-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Bike className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Hero Honda Splendor Plus</p>
            <p className="text-xs text-muted-foreground">2023 Model · Black</p>
          </div>
          <Badge variant="secondary" className="text-[10px]">Active</Badge>
        </div>
        <Separator />
        <div className="flex items-center gap-3 py-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <FileText className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm">Registration: UP14 AB 1234</p>
            <p className="text-xs text-muted-foreground">Valid till Dec 2026</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <Separator />
        <div className="flex items-center gap-3 py-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
            <Shield className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm">DL: DL-0420170045678</p>
            <p className="text-xs text-muted-foreground">Valid till Mar 2028</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentsSection() {
  const docs = [
    { name: 'Aadhar Card', status: 'verified', number: 'XXXX-XXXX-1234' },
    { name: 'PAN Card', status: 'verified', number: 'ABCDE1234F' },
    { name: 'Driving License', status: 'verified', number: 'DL-0420170045678' },
    { name: 'Vehicle Insurance', status: 'pending', number: 'Expires Dec 2026' },
    { name: 'Bank Account', status: 'verified', number: 'ICICI Bank · XX1234' },
  ];

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Documents</CardTitle>
          <Badge variant="outline" className="text-[10px]">
            {docs.filter((d) => d.status === 'verified').length}/{docs.length} Verified
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-0">
        {docs.map((doc) => (
          <div key={doc.name} className="flex items-center gap-3 py-2.5">
            {doc.status === 'verified' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{doc.name}</p>
              <p className="text-xs text-muted-foreground">{doc.number}</p>
            </div>
            <Badge className={cn(
              'h-5 text-[10px]',
              doc.status === 'verified' ? 'bg-emerald-500' : 'bg-amber-500'
            )}>
              {doc.status === 'verified' ? 'Verified' : 'Pending'}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AvailabilitySettings() {
  const { isOnline, toggleOnline } = useDelivery();
  const [settings, setSettings] = useState([
    { label: 'New Order Notifications', enabled: true, icon: Bell },
    { label: 'Sound Alerts', enabled: true, icon: Bell },
    { label: 'Vibrate on New Order', enabled: true, icon: Bell },
    { label: 'Auto-Accept Orders', enabled: false, icon: Settings },
    { label: 'Night Mode (6PM - 6AM)', enabled: false, icon: Moon },
    { label: 'Long Distance Orders', enabled: true, icon: Navigation },
  ]);

  const toggleSetting = (index: number) => {
    setSettings((prev) => prev.map((s, i) => i === index ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Availability & Preferences</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              isOnline ? 'bg-emerald-500/10' : 'bg-muted'
            )}>
              <Bike className={cn('h-5 w-5', isOnline ? 'text-emerald-500' : 'text-muted-foreground')} />
            </div>
            <div>
              <p className="text-sm font-medium">{isOnline ? 'Online & Available' : 'Offline'}</p>
              <p className="text-xs text-muted-foreground">
                {isOnline ? 'Receiving delivery requests' : 'Not receiving orders'}
              </p>
            </div>
          </div>
          <Switch checked={isOnline} onCheckedChange={toggleOnline} />
        </div>

        <Separator className="my-3" />

        <div className="space-y-2">
          {settings.map((setting, i) => {
            const Icon = setting.icon;
            return (
              <div key={setting.label} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{setting.label}</span>
                </div>
                <Switch
                  checked={setting.enabled}
                  onCheckedChange={() => toggleSetting(i)}
                />
              </div>
            );
          })}
        </div>

        <Separator className="my-3" />

        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3 text-sm font-normal" size="sm">
            <HelpCircle className="h-4 w-4" />
            Help & Support
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-sm font-normal text-destructive" size="sm">
            <LogOut className="h-4 w-4" />
            Sign Out
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">My Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <ProfileHeader />
      <StatsGrid />
      <PersonalInfo />
      <div className="grid gap-4 sm:grid-cols-2">
        <VehicleDetails />
        <DocumentsSection />
      </div>
      <AvailabilitySettings />
    </div>
  );
}
