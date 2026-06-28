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
  Home,
  Search,
  ShoppingCart,
  ClipboardList,
  User,
  Bell,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Heart,
  Star,
  Clock,
  Package,
  Utensils,
  Bot,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  MapPinned,
  LogOut,
  Settings,
  Gift,
  Ticket,
  Bike,
  ChefHat,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Flame,
  CheckCircle,
  CircleDashed,
  AlertCircle,
  Timer,
  Phone,
  Mail,
  PenLine,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  Share2,
  QrCode,
  RefreshCw,
  ExternalLink,
  Store,
  Tag,
  Percent,
  Receipt,
  Split,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Crown,
  Wallet,
  Building2,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';

interface CartItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  menuItemId: string;
  name: string;
  image: string;
  variant: string;
  price: number;
  quantity: number;
  specialInstructions: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'specialInstructions'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateInstructions: (id: string, instructions: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CustomerLayout');
  return context;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  time: string;
  type: 'order' | 'promo' | 'update';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within CustomerLayout');
  return context;
}

const navItems = [
  { href: '/customer', label: 'Home', icon: Home },
  { href: '/customer/restaurants', label: 'Search', icon: Search },
  { href: '/customer/cart', label: 'Cart', icon: ShoppingCart },
  { href: '/customer/orders', label: 'Orders', icon: ClipboardList },
  { href: '/customer/profile', label: 'Profile', icon: User },
];

const initialNotifications: Notification[] = [
  { id: '1', title: 'Order Confirmed', message: 'Your order #ZG-2A3B-4C5D has been confirmed.', read: false, time: '5m ago', type: 'order' },
  { id: '2', title: '50% Off Weekend Special', message: 'Get 50% off on all pizzas this weekend!', read: false, time: '1h ago', type: 'promo' },
  { id: '3', title: 'Order Delivered', message: 'Your order from Pizza Palace has been delivered.', read: true, time: '2h ago', type: 'order' },
  { id: '4', title: 'New Restaurant Added', message: 'Sushi Master is now available in your area.', read: false, time: '1d ago', type: 'update' },
  { id: '5', title: 'Free Delivery', message: 'Free delivery on orders above ₹299.', read: true, time: '2d ago', type: 'promo' },
];

function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-xl safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = item.href === '/customer'
            ? pathname === '/customer'
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                'relative flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.label === 'Cart' && itemCount > 0 && (
                <span className="absolute -right-1 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Food Court, Level 2');

  const isHome = pathname === '/customer';
  const showBack = !isHome && pathname !== '/customer/restaurants';

  const getTitle = () => {
    if (pathname === '/customer') return '';
    if (pathname === '/customer/restaurants') return '';
    if (pathname === '/customer/cart') return 'Your Cart';
    if (pathname === '/customer/checkout') return 'Checkout';
    if (pathname === '/customer/orders') return 'My Orders';
    if (pathname.startsWith('/customer/orders/')) return 'Order Details';
    if (pathname === '/customer/profile') return 'My Profile';
    if (pathname === '/customer/favorites') return 'Favorites';
    if (pathname === '/customer/reviews') return 'My Reviews';
    if (pathname === '/customer/notifications') return 'Notifications';
    if (pathname.startsWith('/customer/restaurants/')) return '';
    return '';
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl safe-top">
      <div className="mx-auto max-w-lg px-4">
        <div className="flex h-14 items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {showBack && (
              <button onClick={() => router.back()} className="-ml-1 flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            {isHome ? (
              <button className="flex items-center gap-1.5 text-sm font-medium" onClick={() => {}}>
                <MapPin className="h-4 w-4 text-primary" />
                <span className="max-w-[160px] truncate">{location}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            ) : (
              <span className="text-base font-semibold">{getTitle()}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isHome && (
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
              >
                {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </button>
            )}
            <button
              onClick={() => router.push('/customer/notifications')}
              className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
              )}
            </button>
          </div>
        </div>
        {showSearch && isHome && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pb-3"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search restaurants, cuisines, dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    router.push(`/customer/restaurants?q=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                className="h-10 rounded-xl border-none bg-muted pl-10 pr-4 text-sm"
              />
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}

export default function CustomerLayout({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const addItem = useCallback((newItem: Omit<CartItem, 'id' | 'specialInstructions'>) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.menuItemId === newItem.menuItemId && i.variant === newItem.variant && i.restaurantId === newItem.restaurantId
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + newItem.quantity } : i
        );
      }
      return [...prev, { ...newItem, id: crypto.randomUUID(), specialInstructions: '' }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }, [removeItem]);

  const updateInstructions = useCallback((id: string, instructions: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, specialInstructions: instructions } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, updateInstructions, clearCart, itemCount, subtotal }}>
      <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
        <div className="mx-auto min-h-screen max-w-lg bg-background pb-20">
          <Header />
          <main>{children}</main>
          <BottomNav />
        </div>
      </NotificationContext.Provider>
    </CartContext.Provider>
  );
}
