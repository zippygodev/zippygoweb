'use client';

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
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
  Store,
  Users,
  Bike,
  ClipboardList,
  IndianRupee,
  Percent,
  BarChart3,
  Grid3X3,
  QrCode,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  Moon,
  Sun,
  ShoppingBag,
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

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

const navItems: NavItem[] = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/admin/restaurants', label: 'Restaurants', icon: Store, badge: 2 },
  { href: '/dashboard/admin/users', label: 'Users', icon: Users },
  { href: '/dashboard/admin/delivery-partners', label: 'Delivery Partners', icon: Bike },
  { href: '/dashboard/admin/orders', label: 'Orders', icon: ClipboardList, badge: 8 },
  { href: '/dashboard/admin/payments', label: 'Payments', icon: IndianRupee },
  { href: '/dashboard/admin/coupons', label: 'Coupons', icon: Percent },
  { href: '/dashboard/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/dashboard/admin/tables', label: 'Tables', icon: Grid3X3 },
  { href: '/dashboard/admin/qrcodes', label: 'QR Codes', icon: QrCode },
  { href: '/dashboard/admin/support', label: 'Support Tickets', icon: ClipboardList },
  { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
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

export function useAdminDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useAdminDashboard must be used within AdminLayout');
  return context;
}

const initialNotifications: Notification[] = [
  { id: '1', title: 'New Restaurant Request', message: 'Spice Junction wants to join the mall', read: false, time: '5m ago', type: 'alert' },
  { id: '2', title: 'Payment Dispute', message: 'Order #ZG-8K9L - ₹1,250 refund requested', read: false, time: '12m ago', type: 'alert' },
  { id: '3', title: 'System Update', message: 'Platform maintenance scheduled at 2 AM', read: true, time: '1h ago', type: 'system' },
  { id: '4', title: 'New User Signups', message: '24 new users joined in the last hour', read: false, time: '2h ago', type: 'system' },
  { id: '5', title: 'Daily Report', message: "Today's revenue: ₹1,24,500", read: true, time: '3h ago', type: 'system' },
];

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const { unreadCount } = useAdminDashboard();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-50 flex h-screen flex-col border-r bg-card transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      <div className={cn('flex h-16 items-center border-b px-4', collapsed ? 'justify-center' : 'justify-between')}>
        <Link href="/dashboard/admin" className={cn('flex items-center gap-2.5', collapsed && 'justify-center')}>
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
            const isActive = item.href === '/dashboard/admin'
              ? pathname === '/dashboard/admin'
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
                    layoutId="adminActiveNav"
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
            <ShoppingBag className="h-4 w-4 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">Grand Mall</p>
              <p className="truncate text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount } = useAdminDashboard();

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
              <Link href="/dashboard/admin" className="flex items-center gap-2.5" onClick={onClose}>
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
                  const isActive = item.href === '/dashboard/admin'
                    ? pathname === '/dashboard/admin'
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
                  <ShoppingBag className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">Grand Mall</p>
                  <p className="truncate text-xs text-muted-foreground">Admin Dashboard</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { notifications, unreadCount, markAllAsRead } = useAdminDashboard();
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
            placeholder="Search restaurants, users, orders..."
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
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">Admin</span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mall Admin</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Mall Settings
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

export default function AdminClientLayout({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <DashboardContext.Provider value={{ sidebarOpen: mobileSidebarOpen, setSidebarOpen: setMobileSidebarOpen, notifications, unreadCount, markAsRead, markAllAsRead }}>
      <div className="flex min-h-screen bg-background">
        {mounted && (
          <>
            <div className="hidden lg:block">
              <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            </div>
            <MobileSidebar open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
          </>
        )}
        <div className={cn('flex flex-1 flex-col transition-all duration-300', !sidebarCollapsed ? 'lg:ml-[260px]' : 'lg:ml-[72px]')}>
          <Header onMenuClick={() => setMobileSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <footer className="border-t px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>&copy; {new Date().getFullYear()} Zippy Go. All rights reserved.</span>
              <span>Grand Mall Admin Dashboard</span>
            </div>
          </footer>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
