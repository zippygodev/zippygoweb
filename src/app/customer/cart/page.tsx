'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { useCart } from '../CustomerLayoutClient';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Ticket,
  Bike,
  Utensils,
  Store,
  ChefHat,
  Percent,
  MapPinned,
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, updateInstructions, removeItem, subtotal, clearCart, getDeliveryType, setDeliveryType: setContextDeliveryType } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'table'>(getDeliveryType() === 'TABLE' ? 'table' : 'pickup');
  const [tableNumber, setTableNumber] = useState('');
  const [couponError, setCouponError] = useState('');

  const deliveryFee = deliveryType === 'pickup' ? 0 : 29;
  const tax = subtotal * 0.05;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryFee + tax - discount;

  const groupedItems = items.reduce((acc: any, item: any) => {
      if (!acc[item.restaurantId]) {
        acc[item.restaurantId] = { restaurantName: item.restaurantName, items: [] };
      }
      acc[item.restaurantId]!.items.push(item);
      return acc;
    },
    {} as Record<string, { restaurantName: string; items: typeof items }>
  );

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    if (couponCode.trim().toUpperCase() === 'ZIPPY50') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
      setCouponApplied(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="px-4 pt-8">
        <EmptyState
          icon={<ShoppingCart className="h-12 w-12" />}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Browse restaurants to find something delicious!"
          action={{ label: 'Browse Restaurants', onClick: () => router.push('/customer/restaurants') }}
        />
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="space-y-4 px-4 pt-4">
        {/* Delivery Type Selection */}
        <div className="flex gap-2 rounded-xl border bg-card p-1 shadow-sm">
          {[
            { value: 'pickup', label: 'Pickup', icon: Bike },
            { value: 'table', label: 'Table', icon: Utensils },
          ].map((option) => {
            const Icon = option.icon;
            const isActive = deliveryType === option.value;
            return (
              <button
                key={option.value}
                onClick={() => {
                  setDeliveryType(option.value as 'pickup' | 'table');
                  setContextDeliveryType(option.value === 'table' ? 'TABLE' : 'PICKUP');
                }}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {option.label}
              </button>
            );
          })}
        </div>

        {deliveryType === 'table' && (
          <div className="flex items-center gap-2 rounded-xl border bg-card p-3 shadow-sm">
            <MapPinned className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter table number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="h-8 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
            />
          </div>
        )}
      </div>

      {/* Cart Items Grouped by Restaurant */}
      <div className="mt-4 space-y-4 px-4">
        {Object.entries(groupedItems).map(([restaurantId, group]) => (
          <motion.div
            key={restaurantId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-xl border bg-card shadow-sm"
          >
            <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-3">
              <Store className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">{(group as any).restaurantName}</span>
            </div>
            <div className="divide-y">
              {(group as any).items.map((item: any) => (
                <div key={item.id} className="p-4">
                  <div className="flex gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <h4 className="truncate text-sm font-semibold">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.variant}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-primary">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border"
                          >
                            {item.quantity === 1 ? (
                              <Trash2 className="h-3 w-3 text-destructive" />
                            ) : (
                              <Minus className="h-3 w-3" />
                            )}
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Textarea
                      placeholder="Special instructions (e.g., no onions, extra sauce)"
                      value={item.specialInstructions}
                      onChange={(e) => updateInstructions(item.id, e.target.value)}
                      className="min-h-[60px] resize-none text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Coupon Code */}
      <div className="mx-4 mt-4 overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Have a coupon?</span>
          </div>
          {couponApplied ? (
            <div className="mt-2 flex items-center justify-between rounded-lg bg-green-50 px-3 py-2 dark:bg-green-950">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  ZIPPY50 - 10% off applied!
                </span>
              </div>
              <button
                onClick={() => { setCouponApplied(false); setCouponCode(''); }}
                className="text-xs text-destructive"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Enter code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="h-9 text-sm"
              />
              <Button onClick={handleApplyCoupon} size="sm" variant="outline" className="shrink-0">
                Apply
              </Button>
            </div>
          )}
          {couponError && <p className="mt-1 text-xs text-destructive">{couponError}</p>}
        </div>
      </div>

      {/* Order Summary */}
      <div className="mx-4 mt-4 overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="p-4">
          <h3 className="mb-3 text-sm font-semibold">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {deliveryType === 'pickup' ? 'Pickup' : 'Delivery Fee'}
              </span>
              <span>{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (5%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount (10%)</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {deliveryType === 'pickup'
                ? 'Pick up your order at the restaurant counter.'
                : `Food will be delivered to Table ${tableNumber || '#'}.`}
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-16 left-0 right-0 z-30 border-t bg-background/80 backdrop-blur-xl px-4 py-3 safe-bottom">
        <div className="mx-auto max-w-lg">
          <Button
            onClick={() => router.push('/customer/checkout')}
            className="h-12 w-full rounded-xl text-base font-semibold shadow-lg"
          >
            Proceed to Checkout • {formatCurrency(total)}
          </Button>
        </div>
      </div>

      {/* Spacer for fixed button */}
      <div className="h-20" />
    </div>
  );
}
