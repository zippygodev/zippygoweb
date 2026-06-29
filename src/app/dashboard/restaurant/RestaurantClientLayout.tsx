'use client';

import { useState, useEffect, useCallback, createContext, useContext, useRef, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  LayoutDashboard,
  ClipboardList,
  ChefHat,
  BookOpen,
  Grid3X3,
  Package,
  Tags,
  BarChart3,
  IndianRupee,
  Users,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  Store,
  ChevronLeft,
  ChevronRight,
  Zap,
  Moon,
  Sun,
  Receipt,
  Percent,
  TrendingUp,
  Clock,
  Star,
  Utensils,
  Sparkles,
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { getLiveOrders } from '@/actions/restaurant/orders';
import toast from 'react-hot-toast';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

const navItems: NavItem[] = [
  { href: '/dashboard/restaurant', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/restaurant/orders', label: 'Orders', icon: ClipboardList, badge: 12 },
  { href: '/dashboard/restaurant/kitchen', label: 'Kitchen Queue', icon: ChefHat, badge: 5 },
  { href: '/dashboard/restaurant/menu', label: 'Menu', icon: BookOpen },
  { href: '/dashboard/restaurant/categories', label: 'Categories', icon: Grid3X3 },
  { href: '/dashboard/restaurant/products', label: 'Products', icon: Package },
  { href: '/dashboard/restaurant/offers', label: 'Offers', icon: Tags },
  { href: '/dashboard/restaurant/reports', label: 'Reports', icon: BarChart3 },
  { href: '/dashboard/restaurant/revenue', label: 'Revenue', icon: IndianRupee },
  { href: '/dashboard/restaurant/staff', label: 'Staff', icon: Users },
];

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  time: string;
  type: 'order' | 'system' | 'alert';
}

interface DashboardContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within RestaurantLayout');
  return context;
}

const initialNotifications: Notification[] = [
  { id: '1', title: 'New Order #ZG-2A3B', message: 'Order from Table 5 - ₹1,250', read: false, time: '2m ago', type: 'order' },
  { id: '2', title: 'Low Stock Alert', message: 'Paneer Butter Masala is running low', read: false, time: '15m ago', type: 'alert' },
  { id: '3', title: 'Staff Login', message: 'Chef Rahul has clocked in', read: true, time: '1h ago', type: 'system' },
  { id: '4', title: 'Order Ready #ZG-4C5D', message: 'Order for Table 2 is ready for pickup', read: false, time: '2h ago', type: 'order' },
  { id: '5', title: 'Daily Report', message: 'Today\'s revenue: ₹24,500', read: true, time: '3h ago', type: 'system' },
];

function Sidebar({ collapsed, onToggle, restaurantName }: { collapsed: boolean; onToggle: () => void; restaurantName: string }) {
  const pathname = usePathname();
  const { unreadCount } = useDashboard();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-50 flex h-screen flex-col border-r bg-card transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      <div className={cn('flex h-16 items-center border-b px-4', collapsed ? 'justify-center' : 'justify-between')}>
        <Link href="/dashboard/restaurant" className={cn('flex items-center gap-2.5', collapsed && 'justify-center')}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-display text-lg font-bold tracking-tight">
              Zippy<span className="text-primary">Go</span>
            </span>
          )}
        </Link>
        <button
          onClick={onToggle}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors',
            collapsed && 'hidden'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = item.href === '/dashboard/restaurant'
              ? pathname === '/dashboard/restaurant'
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
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  collapsed && 'justify-center px-2'
                )}
              >
                <div className="relative">
                  <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary')} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </div>
                {!collapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 -z-10 rounded-lg bg-primary/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className={cn('border-t p-3', collapsed && 'flex flex-col items-center gap-1')}>
        <div className={cn('flex items-center gap-3', collapsed && 'flex-col')}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Store className="h-4 w-4 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{restaurantName}</p>
              <p className="truncate text-xs text-muted-foreground">Food Court, Level 2</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function MobileSidebar({ open, onClose, restaurantName }: { open: boolean; onClose: () => void; restaurantName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount } = useDashboard();

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
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col border-r bg-card shadow-2xl"
          >
            <div className="flex h-16 items-center justify-between border-b px-4">
              <Link href="/dashboard/restaurant" className="flex items-center gap-2.5" onClick={onClose}>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="font-display text-lg font-bold tracking-tight">
                  Zippy<span className="text-primary">Go</span>
                </span>
              </Link>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ScrollArea className="flex-1 px-3 py-4">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = item.href === '/dashboard/restaurant'
                    ? pathname === '/dashboard/restaurant'
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
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Store className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{restaurantName}</p>
                  <p className="truncate text-xs text-muted-foreground">Food Court, Level 2</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Header({ onMenuClick, restaurantName, userName }: { onMenuClick: () => void; restaurantName: string; userName: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { notifications, unreadCount, markAllAsRead } = useDashboard();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <button onClick={onMenuClick} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden md:flex md:flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders, products, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 rounded-lg border-none bg-muted pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        )}

        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-primary" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">
                  Mark all read
                </button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-2 py-6 text-center text-sm text-muted-foreground">No notifications</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      'px-3 py-2.5 text-sm transition-colors hover:bg-muted',
                      !n.read && 'bg-primary/5'
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div className={cn('mt-0.5 h-2 w-2 shrink-0 rounded-full', !n.read ? 'bg-primary' : 'bg-transparent')} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.message}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted">
              <Avatar className="h-7 w-7">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=restaurant" />
                <AvatarFallback>PD</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">{userName}</span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Restaurant Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Store className="mr-2 h-4 w-4" />
              Restaurant Profile
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

export default function RestaurantClientLayout({ children, restaurantName, userName }: { children: ReactNode; restaurantName: string; userName: string }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [mounted, setMounted] = useState(false);
  const [activeAlertOrder, setActiveAlertOrder] = useState<any>(null);
  const seenOrderIdsRef = useRef<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

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
    let isMounted = true;
    const loadInitialOrders = async () => {
      const res = await getLiveOrders();
      if (res.success && res.data && isMounted) {
        res.data.forEach((o: any) => {
          seenOrderIdsRef.current.add(o.id);
        });
      }
    };
    loadInitialOrders();

    const interval = setInterval(async () => {
      const res = await getLiveOrders();
      if (res.success && res.data && isMounted) {
        const pendingNew = res.data.find(
          (o: any) => o.status === 'PENDING' && !seenOrderIdsRef.current.has(o.id)
        );
        if (pendingNew) {
          setActiveAlertOrder(pendingNew);
          seenOrderIdsRef.current.add(pendingNew.id);
          setNotifications(prev => [
            {
              id: pendingNew.id,
              title: `New Order #${pendingNew.id.slice(-6).toUpperCase()}`,
              message: `Incoming order from table - ₹${pendingNew.total}`,
              read: false,
              time: 'Just now',
              type: 'order'
            },
            ...prev
          ]);
        }
      }
    }, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <DashboardContext.Provider value={{ sidebarOpen: mobileSidebarOpen, setSidebarOpen: setMobileSidebarOpen, notifications, unreadCount, markAsRead, markAllAsRead }}>
      <div className="flex min-h-screen bg-background">
        {mounted && (
          <>
            <div className="hidden lg:block">
              <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} restaurantName={restaurantName} />
            </div>
            <MobileSidebar open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} restaurantName={restaurantName} />
          </>
        )}
        <div className={cn('flex flex-1 flex-col transition-all duration-300', !sidebarCollapsed ? 'lg:ml-[260px]' : 'lg:ml-[72px]')}>
          <Header onMenuClick={() => setMobileSidebarOpen(true)} restaurantName={restaurantName} userName={userName} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <footer className="border-t px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>&copy; {new Date().getFullYear()} Zippy Go. All rights reserved.</span>
              <span>{restaurantName} Dashboard</span>
            </div>
          </footer>
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
              className="flex w-full max-w-md items-center gap-4 rounded-2xl border border-destructive/30 bg-card/85 p-4 shadow-2xl backdrop-blur-xl ring-4 ring-destructive/10"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/15 text-destructive animate-pulse">
                <Bell className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-destructive uppercase tracking-wide animate-pulse">
                  New Order Received!
                </h3>
                <p className="text-sm font-medium text-foreground truncate mt-0.5">
                  Order #{activeAlertOrder.id.slice(-6).toUpperCase()}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Amount: ₹{activeAlertOrder.total || '0'}
                </p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <Button
                  size="sm"
                  variant="destructive"
                  className="rounded-xl px-3 font-semibold text-xs"
                  onClick={() => {
                    setActiveAlertOrder(null);
                    router.push('/dashboard/restaurant/orders');
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
    </DashboardContext.Provider>
  );
}
