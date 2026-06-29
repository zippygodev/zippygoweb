'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency, generateOrderNumber } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorState } from '@/components/ui/error-state';
import { useCart } from '../CustomerLayoutClient';
import {
  CreditCard,
  Banknote,
  Phone,
  Mail,
  User,
  Building2,
  Store,
  Check,
} from 'lucide-react';
import { placeOrder } from '@/actions/customer/orders';
import toast from 'react-hot-toast';

type PaymentMethod = 'razorpay' | 'cod';

interface FormData {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

const initialForm: FormData = {
  name: '',
  phone: '',
  email: '',
  notes: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState<FormData>(initialForm);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderId, setOrderId] = useState('');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const deliveryFee = 0;
  const tax = subtotal * 0.05;
  const discount = 0;
  const total = subtotal + deliveryFee + tax;

  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }));
    }
  }, [session]);

  useEffect(() => {
    if (items.length === 0 && !success) {
      router.push('/customer/cart');
    }
  }, [items.length, router, success]);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\+?[\d\s-]{10,15}$/.test(form.phone)) newErrors.phone = 'Invalid phone number';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setProcessing(true);

    try {
      const firstItem = items[0];
      if (!firstItem) throw new Error('Cart is empty');

      const res = await placeOrder({
        restaurantId: firstItem.restaurantId,
        deliveryType: 'PICKUP',
        notes: form.notes,
        paymentMethod: paymentMethod === 'razorpay' ? 'RAZORPAY' : 'COD',
        items: items.map((item) => ({
          productId: item.menuItemId,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          variantName: item.variant,
        })),
        subtotal,
        tax,
        deliveryFee,
        discount,
        total,
      });

      if (res.success && res.data) {
        setOrderNumber(res.data.orderNumber);
        setOrderId(res.data.id);
        setSuccess(true);
        clearCart();
        toast.success('Order placed successfully!');
      } else {
        toast.error(res.error || 'Failed to place order');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while placing order');
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center px-4 pt-16 text-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <Check className="h-10 w-10 text-green-600 dark:text-green-300" />
        </div>
        <h1 className="text-2xl font-bold">Order Placed!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your order has been placed successfully.
        </p>
        <div className="mt-6 w-full rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Order Number</p>
          <p className="text-lg font-bold text-primary">{orderNumber}</p>
        </div>
        <div className="mt-6 flex w-full gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => router.push(`/customer/orders/${orderId}`)}
          >
            Track Order
          </Button>
          <Button
            className="flex-1 rounded-xl"
            onClick={() => router.push('/customer')}
          >
            Back to Home
          </Button>
        </div>
      </motion.div>
    );
  }

  if (items.length === 0) return null;

  const groupedItems = items.reduce((acc: any, item: any) => {
    if (!acc[item.restaurantId]) {
      acc[item.restaurantId] = { restaurantName: item.restaurantName, items: [] };
    }
    acc[item.restaurantId]!.items.push(item);
    return acc;
  }, {} as Record<string, { restaurantName: string; items: typeof items }>);

  return (
    <div className="pb-8">
      {/* Contact Info */}
      <div className="space-y-3 px-4 pt-4">
        <h2 className="text-base font-semibold">Contact Information</h2>
        <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={cn('h-10 border-none bg-muted/50 pl-0', errors.name && 'ring-1 ring-destructive')}
              />
            </div>
            {errors.name && <p className="mt-1 pl-6 text-xs text-destructive">{errors.name}</p>}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={cn('h-10 border-none bg-muted/50 pl-0', errors.phone && 'ring-1 ring-destructive')}
              />
            </div>
            {errors.phone && <p className="mt-1 pl-6 text-xs text-destructive">{errors.phone}</p>}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={cn('h-10 border-none bg-muted/50 pl-0', errors.email && 'ring-1 ring-destructive')}
              />
            </div>
            {errors.email && <p className="mt-1 pl-6 text-xs text-destructive">{errors.email}</p>}
          </div>
          <div className="flex items-start gap-2">
            <Building2 className="mt-2 h-4 w-4 text-muted-foreground" />
            <Textarea
              placeholder="Special instructions or notes..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="min-h-[60px] border-none bg-muted/50 pl-0 text-sm resize-none"
            />
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-6 px-4">
        <h2 className="mb-3 text-base font-semibold">Order Summary</h2>
        <div className="space-y-3">
          {Object.entries(groupedItems).map(([id, group]) => (
            <div key={id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
              <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
                <Store className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{(group as any).restaurantName}</span>
              </div>
              <div className="divide-y">
                {(group as any).items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 items-center justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">x{item.quantity} • {item.variant}</p>
                      </div>
                      <span className="shrink-0 text-sm font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-6 px-4">
        <h2 className="mb-3 text-base font-semibold">Payment Method</h2>
        <div className="space-y-2">
          {[
            { value: 'razorpay', label: 'Razorpay', description: 'Credit/Debit Card, UPI, Net Banking', icon: CreditCard },
            { value: 'cod', label: 'Cash on Delivery', description: 'Pay when you receive', icon: Banknote },
          ].map((method) => {
            const Icon = method.icon;
            const isActive = paymentMethod === method.value;
            return (
              <button
                key={method.value}
                onClick={() => setPaymentMethod(method.value as PaymentMethod)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all',
                  isActive
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'bg-card hover:border-muted-foreground/30'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg',
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{method.label}</p>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                </div>
                <div
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full border-2',
                    isActive ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                  )}
                >
                  {isActive && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Summary */}
      <div className="mx-4 mt-6 overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="p-4">
          <h3 className="mb-3 text-sm font-semibold">Price Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="text-green-600 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (5%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold pt-2 border-t text-primary">
              <span>Total Amount</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-16 left-0 right-0 z-30 border-t bg-background/80 backdrop-blur-xl px-4 py-3 safe-bottom">
        <div className="mx-auto max-w-lg">
          <Button
            onClick={handlePlaceOrder}
            disabled={processing}
            className="h-12 w-full rounded-xl text-base font-semibold shadow-lg"
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Processing Payment...
              </span>
            ) : (
              `Place Order • ${formatCurrency(total)}`
            )}
          </Button>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-20" />
    </div>
  );
}
