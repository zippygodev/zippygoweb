'use client';

import { useState, useEffect } from 'react';
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
  Sun,
  Moon,
  Shield,
  HelpCircle,
  Info,
  PenLine,
  Plus,
  Home,
  Briefcase,
  Trash2,
} from 'lucide-react';
import { getMyAddresses, deleteAddress } from '@/actions/customer/profile';
import toast from 'react-hot-toast';

interface PaymentCard {
  id: string;
  type: 'visa' | 'mastercard' | 'rupay';
  last4: string;
  isDefault: boolean;
}

const paymentCards: PaymentCard[] = [
  { id: 'c1', type: 'visa', last4: '4242', isDefault: true },
  { id: 'c2', type: 'mastercard', last4: '8888', isDefault: false },
];

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Guest User');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [addresses, setAddresses] = useState<any[]>([]);
  const isDark = theme === 'dark';

  const fetchAddresses = async () => {
    try {
      const res = await getMyAddresses();
      if (res.success && res.data) {
        setAddresses(res.data);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || 'Guest User');
      setEmail(session.user.email || '');
      fetchAddresses();
    }
  }, [session]);

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await deleteAddress(id);
      if (res.success) {
        toast.success('Address deleted successfully!');
        fetchAddresses();
      } else {
        toast.error(res.error || 'Failed to delete address');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    }
  };

  const menuItems = [
    { icon: Heart, label: 'Favorites', href: '/customer/favorites' },
    { icon: MessageSquare, label: 'My Reviews', href: '/customer/reviews' },
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
            <Avatar className="h-16 w-16 border-2 border-primary/20 ring-2 ring-primary/10 bg-muted">
              <AvatarImage src={session?.user?.image || ''} />
              <AvatarFallback className="text-lg bg-primary text-white">{getInitials(name || 'U')}</AvatarFallback>
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
            { label: 'Orders', value: 'Active' },
            { label: 'Favorites', value: 'Saved' },
            { label: 'Support', value: 'Help' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-card/80 py-3 text-center shadow-sm backdrop-blur-sm">
              <p className="text-sm font-bold text-primary">{stat.value}</p>
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
              <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" disabled />
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
          <button className="flex items-center gap-1 text-xs font-medium text-primary" onClick={() => toast.success('Address addition connection details placeholder')}>
            <Plus className="h-3.5 w-3.5" /> Add New
          </button>
        </div>
        <div className="space-y-2">
          {addresses.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4 bg-card rounded-xl border border-dashed">No saved addresses found.</p>
          ) : (
            addresses.map((addr) => {
              const Icon = addr.label?.toLowerCase() === 'home' ? Home : addr.label?.toLowerCase() === 'work' ? Briefcase : MapPin;
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
                  <button onClick={() => handleDeleteAddress(addr.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mx-4 mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Payment Methods</h2>
          <button className="flex items-center gap-1 text-xs font-medium text-primary" onClick={() => toast.success('Payment options placeholder')}>
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
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
