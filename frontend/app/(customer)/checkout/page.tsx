"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  CreditCard,
  MapPin,
  Shield,
  ChevronRight,
  Wallet,
  CheckCircle2,
  Loader2,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const paymentMethods = [
  { id: "razorpay", name: "Razorpay", icon: CreditCard, description: "Credit/Debit Card, UPI, Net Banking" },
  { id: "cod", name: "Cash on Delivery", icon: Wallet, description: "Pay when you receive" },
];

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, restaurantId, restaurantName, getTotal, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = React.useState("razorpay");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [address, setAddress] = React.useState("Food Court, Level 2");
  const [instructions, setInstructions] = React.useState("");
  const [orderPlaced, setOrderPlaced] = React.useState(false);
  const [orderId, setOrderId] = React.useState<string | null>(null);

  const subtotal = getTotal();
  const deliveryFee = 49;
  const packagingFee = 19;
  const total = subtotal + deliveryFee + packagingFee;

  const handleCOD = async (backendOrderId: string) => {
    // Mark payment as simulated COD
    await api.post("/payments", {
      orderId: backendOrderId,
      amount: total,
      method: "cash",
      provider: "cod",
    });

    clearCart();
    setOrderPlaced(true);
    setOrderId(backendOrderId);
    toast.success("Order placed! Pay when you receive.");
  };

  const handleRazorpay = async (backendOrderId: string) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load Razorpay. Switching to simulated payment.");
      // Fallback: simulate payment
      await api.post("/payments/verify", {
        razorpayOrderId: `rzp_sim_order_${Date.now()}`,
        razorpayPaymentId: `sim_pay_${Date.now()}`,
        razorpaySignature: "",
        orderId: backendOrderId,
      });
      clearCart();
      setOrderPlaced(true);
      setOrderId(backendOrderId);
      return;
    }

    const { data: rzpData } = await api.post("/payments/create-order", {
      orderId: backendOrderId,
      amount: total,
    });

    if (rzpData.simulated) {
      // Dev mode – skip Razorpay UI
      await api.post("/payments/verify", {
        razorpayOrderId: rzpData.razorpayOrderId,
        razorpayPaymentId: `sim_pay_${Date.now()}`,
        razorpaySignature: "",
        orderId: backendOrderId,
      });
      clearCart();
      setOrderPlaced(true);
      setOrderId(backendOrderId);
      toast.success("Payment simulated (dev mode)");
      return;
    }

    const options = {
      key: rzpData.key,
      amount: rzpData.amount,
      currency: rzpData.currency,
      name: "FoodCourtOS",
      description: `Order #${backendOrderId.slice(-8).toUpperCase()}`,
      order_id: rzpData.razorpayOrderId,
      handler: async (response: any) => {
        try {
          await api.post("/payments/verify", {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            orderId: backendOrderId,
          });
          clearCart();
          setOrderPlaced(true);
          setOrderId(backendOrderId);
          toast.success("Payment successful! 🎉");
        } catch {
          toast.error("Payment verification failed. Contact support.");
        }
      },
      prefill: { name: "", email: "", contact: "" },
      theme: { color: "#10b981" },
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
          toast("Payment cancelled");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setIsProcessing(true);
    try {
      // Create the order on backend
      const { data: order } = await api.post("/orders", {
        restaurantId: restaurantId || items[0]?.restaurantId,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          variant: item.variant,
          addons: item.addons,
        })),
        note: instructions,
        isTakeaway: false,
      });

      if (paymentMethod === "cod") {
        await handleCOD(order.id);
      } else {
        await handleRazorpay(order.id);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
        >
          <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="mb-2 text-3xl font-bold">Order Placed! 🎉</h1>
          <p className="mb-1 text-muted-foreground">
            Your order from <strong>{restaurantName}</strong> has been confirmed.
          </p>
          {orderId && (
            <p className="mb-6 text-xs text-muted-foreground">
              Order ID: #{orderId.slice(-8).toUpperCase()}
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => router.push("/orders")} className="min-w-32">
              Track Order
            </Button>
            <Button variant="outline" onClick={() => router.push("/home")}>
              Continue Shopping
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0 && typeof window !== "undefined") {
    router.push("/cart");
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="mt-1 text-muted-foreground">
          {restaurantName ? `Ordering from ${restaurantName}` : "Review your order and payment"}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Delivery Details */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-semibold">Delivery Details</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                <Input
                  id="instructions"
                  placeholder="Any special requests or notes..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-semibold">Payment Method</h2>
            </div>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="gap-3">
              {paymentMethods.map((method) => (
                <div key={method.id}>
                  <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                  <Label
                    htmlFor={method.id}
                    className="flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50 peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-emerald-500 hover:bg-accent dark:peer-data-[state=checked]:bg-emerald-900/20"
                  >
                    <method.icon className="h-6 w-6 text-emerald-600" />
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </Card>

          {/* Order Items */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Order Items</h2>
              <Badge variant="secondary">{items.length} items</Badge>
            </div>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <div className="h-12 w-12 overflow-hidden rounded-lg">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                        {item.variant ? ` • ${item.variant}` : ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div>
          <Card className="sticky top-24 p-6">
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Item Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Packaging Fee</span>
                <span>{formatPrice(packagingFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-emerald-600">{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              className="mt-6 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              size="lg"
              onClick={handlePlaceOrder}
              disabled={isProcessing || items.length === 0}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {paymentMethod === "cod" ? "Place Order" : "Pay"} {formatPrice(total)}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>
                {paymentMethod === "razorpay" ? "Secured by Razorpay" : "Pay on delivery"}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
