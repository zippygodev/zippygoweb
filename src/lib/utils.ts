import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateOrderNumber(): string {
  const prefix = 'ZG';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function formatCurrency(amount: number | string, currency = 'INR'): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'relative'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'relative') {
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
  }

  if (format === 'short') {
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
    });
  }

  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-purple-100 text-purple-800',
    READY: 'bg-green-100 text-green-800',
    OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-emerald-100 text-emerald-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-pink-100 text-pink-800',
    AVAILABLE: 'bg-green-100 text-green-800',
    OCCUPIED: 'bg-red-100 text-red-800',
    RESERVED: 'bg-yellow-100 text-yellow-800',
    MAINTENANCE: 'bg-gray-100 text-gray-800',
  };
  return colors[status] ?? 'bg-gray-100 text-gray-800';
}

export function getDeliveryTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    PICKUP: 'package',
    TABLE: 'utensils',
    ROBOT: 'bot',
  };
  return icons[type] ?? 'package';
}

export function generateQRCode(data: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data)}`;
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const re = /^\+?[\d\s-]{10,15}$/;
  return re.test(phone);
}

export function parseAmount(amount: string | number): number {
  if (typeof amount === 'number') return amount;
  return parseFloat(amount) || 0;
}

export function calculateTax(amount: number, rate: number): number {
  return Math.round((amount * rate) / 100 * 100) / 100;
}

export function calculateDiscount(amount: number, discountType: string, discountValue: number, maxDiscount?: number): number {
  let discount = 0;
  if (discountType === 'PERCENTAGE') {
    discount = (amount * discountValue) / 100;
    if (maxDiscount && discount > maxDiscount) {
      discount = maxDiscount;
    }
  } else {
    discount = discountValue;
  }
  return Math.min(discount, amount);
}

export function paginate(page: number, limit: number) {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) result[key] = obj[key];
  });
  return result;
}

export function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj } as Record<string, unknown>;
  keys.forEach((key) => delete result[key as string]);
  return result as Omit<T, K>;
}
