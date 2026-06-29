'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  User,
  MapPin,
  CreditCard,
  Heart,
  MessageSquare,
  Bell,
  LogOut,
  ChevronRight,
  Settings,
  Sun,
  Moon,
  Shield,
  HelpCircle,
  Info,
  PenLine,
  Plus,
  Home,
  Briefcase,
  Star,
  Trash2,
} from 'lucide-react';

interface Address {
  id: string;
  label: string;
  address: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
}

interface PaymentCard {
  id: string;
  type: 'visa' | 'mastercard' | 'rupay';
  last4: string;
  isDefault: boolean;
}

const addresses: Address[] = [
  { id: 'a1', label: 'Home', address: '123, MG Road, Indiranagar, Bangalore - 560038', type: 'home', isDefault: true },
  { id: 'a2', label: 'Work', address: '456, Brigade Road, Koramangala, Bangalore - 560034', type: 'work', isDefault: false },
];

const paymentCards: PaymentCard[] = [
  { id: 'c1', type: 'visa', last4: '4242', isDefault: true },
  { id: 'c2', type: 'mastercard', last4: '8888', isDefault: false },
];

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session?.user?.name || 'Guest User');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [phone, setPhone] = useState('+91 98765 43210');
  const isDark = theme === 'dark';

  const menuItems = [
    { icon: Heart, label: 'Favorites', href: '/customer/favorites', badge: '12' },
    { icon: MessageSquare, label: 'My Reviews', href: '/customer/reviews', badge: '8' },
    { icon: Bell, label: 'Notifications', href: '/customer/notifications' },
    { icon: Shield, label: 'Privacy & Security', href: '#' },
    { icon: HelpCircle, label: 'Help & Support', href: '/customer/support' },
    { icon: Info, label: 'About Zippy Go', href: '#' },
  ];

  return (
    <div className="pb-6">
      {/* Profile Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background px-4 pt-6 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20 ring-2 ring-primary/10">
              <AvatarImage src={session?.user?.image || ''} />
              <AvatarFallback className="text-lg">{getInitials(name || 'U')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">{name}</h1>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            <PenLine className="h-4 w-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: 'Orders', value: '24' },
            { label: 'Favorites', value: '12' },
            { label: 'Reviews', value: '8' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-card/80 py-3 text-center shadow-sm backdrop-blur-sm">
              <p className="text-lg font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mx-4 mt-4 overflow-hidden rounded-xl border bg-card p-4 shadow-sm"
        >
          <h3 className="mb-4 text-sm font-semibold">Edit Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1 rounded-xl" onClick={() => setIsEditing(false)}>Save Changes</Button>
              <Button size="sm" variant="outline" className="flex-1 rounded-xl" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Saved Addresses */}
      <div className="mx-4 mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Saved Addresses</h2>
          <button className="flex items-center gap-1 text-xs font-medium text-primary">
            <Plus className="h-3.5 w-3.5" /> Add New
          </button>
        </div>
        <div className="space-y-2">
          {addresses.map((addr) => {
            const Icon = addr.type === 'home' ? Home : addr.type === 'work' ? Briefcase : MapPin;
            return (
              <div key={addr.id} className="flex items-start gap-3 rounded-xl border bg-card p-3 shadow-sm">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{addr.label}</span>
                    {addr.isDefault && <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">Default</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{addr.address}</p>
                </div>
                <button className="shrink-0 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mx-4 mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Payment Methods</h2>
          <button className="flex items-center gap-1 text-xs font-medium text-primary">
            <Plus className="h-3.5 w-3.5" /> Add New
          </button>
        </div>
        <div className="space-y-2">
          {paymentCards.map((card) => (
            <div key={card.id} className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium capitalize">{card.type}</span>
                  <span className="text-xs text-muted-foreground">**** {card.last4}</span>
                  {card.isDefault && <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">Default</Badge>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Links */}
      <div className="mx-4 mt-6">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Settings</h2>
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="divide-y">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                {isDark ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
                <span className="text-sm">Dark Mode</span>
              </div>
              <Switch checked={isDark} onCheckedChange={(v) => setTheme(v ? 'dark' : 'light')} />
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => item.href.startsWith('/') ? router.push(item.href) : undefined}
                  className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {'badge' in item && item.badge && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{item.badge}</Badge>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="mx-4 mt-6">
        <Button
          variant="outline"
          className="w-full rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10"
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">Zippy Go v1.0.0</p>
    </div>
  );
}
