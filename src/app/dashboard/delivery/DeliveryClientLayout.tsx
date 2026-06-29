'use client';

import { useState, useEffect, useCallback, createContext, useContext, useRef, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Bike,
  ClipboardList,
  History,
  IndianRupee,
  User,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  Zap,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Star,
  TrendingUp,
  Navigation,
  Clock,
  Package,
  type LucideIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from 'next-themes';
import { getAvailableOrders } from '@/actions/delivery/orders';
import toast from 'react-hot-toast';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

const bottomNavItems: NavItem[] = [
  { href: '/dashboard/delivery', label: 'Orders', icon: ClipboardList },
  { href: '/dashboard/delivery/history', label: 'History', icon: History },
  { href: '/dashboard/delivery/earnings', label: 'Earnings', icon: IndianRupee },
  { href: '/dashboard/delivery/profile', label: 'Profile', icon: User },
];

const sidebarNavItems: NavItem[] = [
  { href: '/dashboard/delivery', label: 'Orders', icon: ClipboardList, badge: 3 },
  { href: '/dashboard/delivery/history', label: 'History', icon: History },
  { href: '/dashboard/delivery/earnings', label: 'Earnings', icon: IndianRupee },
  { href: '/dashboard/delivery/profile', label: 'Profile', icon: User },
];

interface DeliveryContextType {
  isOnline: boolean;
  toggleOnline: () => void;
  todayEarnings: number;
  todayDeliveries: number;
}

const DeliveryContext = createContext<DeliveryContextType | null>(null);

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (!context) throw new Error('useDelivery must be used within DeliveryLayout');
  return context;
}

function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {bottomNavItems.map((item) => {
          const isActive = item.href === '/dashboard/delivery'
            ? pathname === '/dashboard/delivery'
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="bottomNav"
                  className="absolute -top-1 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function Sidebar() {
  const pathname = usePathname();
  const { isOnline, toggleOnline, todayEarnings, todayDeliveries } = useDelivery();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[240px] flex-col border-r bg-card lg:flex">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard/delivery" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            Zippy<span className="text-primary">Go</span>
          </span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="mb-4 rounded-lg border bg-muted/50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn('h-2 w-2 rounded-full', isOnline ? 'bg-emerald-500' : 'bg-muted-foreground')} />
              <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <Switch checked={isOnline} onCheckedChange={toggleOnline} />
          </div>
          <Separator className="my-2" />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[11px] text-muted-foreground">Today</p>
              <p className="text-sm font-semibold text-emerald-500">₹{todayEarnings}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Deliveries</p>
              <p className="text-sm font-semibold">{todayDeliveries}</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {sidebarNavItems.map((item) => {
            const isActive = item.href === '/dashboard/delivery'
              ? pathname === '/dashboard/delivery'
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary')} />
                <span className="truncate">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="deliverySidebarNav"
                    className="absolute inset-0 -z-10 rounded-lg bg-primary/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=delivery" />
            <AvatarFallback>DP</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">Rahul Kumar</p>
            <p className="truncate text-xs text-muted-foreground">Delivery Partner</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { isOnline, toggleOnline, todayEarnings } = useDelivery();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur-xl lg:hidden">
      <Link href="/dashboard/delivery" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="font-display text-base font-bold tracking-tight">
          Zippy<span className="text-primary">Go</span>
        </span>
      </Link>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1.5 rounded-full border px-2.5 py-1">
          <div className={cn('h-1.5 w-1.5 rounded-full', isOnline ? 'bg-emerald-500' : 'bg-muted-foreground')} />
          <span className="text-xs font-medium">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        <Switch checked={isOnline} onCheckedChange={toggleOnline} className="scale-75" />
      </div>

      <div className="hidden items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 sm:flex">
        <IndianRupee className="h-3.5 w-3.5 text-emerald-500" />
        <span className="text-sm font-semibold text-emerald-500">{todayEarnings}</span>
      </div>

      {mounted && (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      )}

      <button
        onClick={onMenuClick}
        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
      >
        <Menu className="h-5 w-5" />
      </button>
    </header>
  );
}

function DesktopHeader() {
  const { isOnline, toggleOnline, todayEarnings, todayDeliveries } = useDelivery();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 hidden h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3">
        <div className={cn(
          'flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
          isOnline ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'
        )}>
          <div className={cn('h-2 w-2 rounded-full', isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground')} />
          {isOnline ? 'Online' : 'Offline'}
          <Switch checked={isOnline} onCheckedChange={toggleOnline} className="scale-75 ml-1" />
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 rounded-lg border px-4 py-1.5">
          <div className="text-right">
            <p className="text-[11px] text-muted-foreground">Today&apos;s Earnings</p>
            <p className="text-sm font-bold text-emerald-500">₹{todayEarnings}</p>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="text-right">
            <p className="text-[11px] text-muted-foreground">Deliveries</p>
            <p className="text-sm font-bold">{todayDeliveries}</p>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="text-right">
            <p className="text-[11px] text-muted-foreground">Rating</p>
            <div className="flex items-center gap-1 text-sm font-bold">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              4.8
            </div>
          </div>
        </div>

        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted">
              <Avatar className="h-7 w-7">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=delivery" />
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Rahul Kumar</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Delivery Partner</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isOnline, toggleOnline } = useDelivery();

  const handleNav = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-50 flex h-screen w-[280px] flex-col border-l bg-card shadow-2xl"
          >
            <div className="flex h-14 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="font-display text-base font-bold tracking-tight">
                  Zippy<span className="text-primary">Go</span>
                </span>
              </div>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b p-4">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <div className="flex items-center gap-2">
                  <div className={cn('h-2 w-2 rounded-full', isOnline ? 'bg-emerald-500' : 'bg-muted-foreground')} />
                  <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
                </div>
                <Switch checked={isOnline} onCheckedChange={toggleOnline} />
              </div>
            </div>

            <ScrollArea className="flex-1 px-3 py-4">
              <nav className="flex flex-col gap-1">
                {sidebarNavItems.map((item) => {
                  const isActive = item.href === '/dashboard/delivery'
                    ? pathname === '/dashboard/delivery'
                    : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNav(item.href)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </ScrollArea>

            <div className="border-t p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=delivery" />
                  <AvatarFallback>RK</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">Rahul Kumar</p>
                  <p className="truncate text-xs text-muted-foreground">Delivery Partner</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

import { toggleOnlineStatus } from '@/actions/delivery/status';

export default function DeliveryClientLayout({ children, initialDeliveryPartner }: { children: ReactNode, initialDeliveryPartner?: any }) {
  const [isOnline, setIsOnline] = useState(initialDeliveryPartner?.isOnline ?? false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeAlertOrder, setActiveAlertOrder] = useState<any>(null);
  const seenOrderIdsRef = useRef<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const todayEarnings = initialDeliveryPartner?.totalEarnings || 0;
  const todayDeliveries = initialDeliveryPartner?.totalDeliveries || 0;

  const toggleOnline = useCallback(async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    const res = await toggleOnlineStatus(newStatus);
    if (!res.success) {
      setIsOnline(!newStatus);
    }
  }, [isOnline]);

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playBurst = (startTime: number, freq: number, dur: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + dur);
      };
      const now = audioCtx.currentTime;
      playBurst(now, 880, 0.15);
      playBurst(now + 0.08, 987, 0.15);
      playBurst(now + 0.3, 880, 0.15);
      playBurst(now + 0.38, 987, 0.15);
      playBurst(now + 0.6, 880, 0.15);
      playBurst(now + 0.68, 987, 0.15);
    } catch (e) {
      console.warn('AudioContext error:', e);
    }
  };

  const triggerVibration = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  useEffect(() => {
    if (!activeAlertOrder) return;
    playBeep();
    triggerVibration();
    const interval = setInterval(() => {
      playBeep();
      triggerVibration();
    }, 3000);
    return () => clearInterval(interval);
  }, [activeAlertOrder]);

  useEffect(() => {
    if (!isOnline) {
      setActiveAlertOrder(null);
      return;
    }
    let isMounted = true;
    const loadInitialOrders = async () => {
      const res = await getAvailableOrders();
      if (res.success && res.data && isMounted) {
        res.data.forEach((o: any) => {
          seenOrderIdsRef.current.add(o.id);
        });
      }
    };
    loadInitialOrders();

    const interval = setInterval(async () => {
      const res = await getAvailableOrders();
      if (res.success && res.data && isMounted) {
        const readyNew = res.data.find(
          (o: any) => o.status === 'READY' && !o.deliveryPartnerId && !seenOrderIdsRef.current.has(o.id)
        );
        if (readyNew) {
          setActiveAlertOrder(readyNew);
          seenOrderIdsRef.current.add(readyNew.id);
        }
      }
    }, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isOnline]);

  return (
    <DeliveryContext.Provider value={{ isOnline, toggleOnline, todayEarnings, todayDeliveries }}>
      <div className="flex min-h-screen bg-background pb-16 lg:pb-0">
        {mounted && <Sidebar />}
        <MobileSidebar open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
        <div className="flex flex-1 flex-col lg:ml-[240px]">
          <MobileHeader onMenuClick={() => setMobileSidebarOpen(true)} />
          <DesktopHeader />
          <main className="flex-1 p-3 sm:p-4 lg:p-6">
            {children}
          </main>
          <BottomNav />
        </div>
      </div>

      {/* Absolute Overlay Banner for Incoming Orders */}
      <AnimatePresence>
        {activeAlertOrder && (
          <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
            <motion.div
              initial={{ scale: 0.9, y: -40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: -40, opacity: 0 }}
              className="flex w-full max-w-md items-center gap-4 rounded-2xl border border-primary/30 bg-card/85 p-4 shadow-2xl backdrop-blur-xl ring-4 ring-primary/10"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary animate-pulse">
                <Bike className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wide animate-pulse">
                  New Order Available!
                </h3>
                <p className="text-sm font-medium text-foreground truncate mt-0.5">
                  Order #{activeAlertOrder.id.slice(-6).toUpperCase()}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  From: {activeAlertOrder.restaurant?.name || 'Restaurant'}
                </p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <Button
                  size="sm"
                  className="rounded-xl px-3 font-semibold text-xs bg-primary hover:bg-primary/95 text-white"
                  onClick={() => {
                    setActiveAlertOrder(null);
                    router.push('/dashboard/delivery');
                  }}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl px-3 text-xs"
                  onClick={() => setActiveAlertOrder(null)}
                >
                  Dismiss
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DeliveryContext.Provider>
  );
}
