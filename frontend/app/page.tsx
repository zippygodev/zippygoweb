"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Sparkles, ShoppingBag, Shield, Bot, CreditCard, Truck, Star } from "lucide-react";

const features = [
  {
    icon: ShoppingBag,
    title: "Multi-Vendor Ordering",
    description: "Combine dishes from multiple restaurants in a single cart and check out once",
  },
  {
    icon: Truck,
    title: "Fast & Reliable Delivery",
    description: "Get your food delivered fresh and warm with real-time GPS tracking",
  },
  {
    icon: Bot,
    title: "AI Smart Suggestions",
    description: "Personalized recommendations based on your tastes and dietary preferences",
  },
  {
    icon: CreditCard,
    title: "Seamless Payments",
    description: "Secure one-click checkouts with UPI, cards, and wallets via Razorpay",
  },
  {
    icon: Star,
    title: "Trending & Rated Picks",
    description: "Explore the most popular dishes and highly-rated local restaurants",
  },
  {
    icon: Shield,
    title: "Safe & Premium Service",
    description: "Vetted kitchen staff, contactless delivery, and 24/7 dedicated support",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navbar */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-white/80 backdrop-blur-xl dark:bg-black/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              ZIPPY<span className="text-primary font-extrabold">GO</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button variant="default" className="shadow-md">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24">
        {/* Warm Yellow radial gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-transparent dark:from-primary/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold shadow-sm backdrop-blur dark:bg-primary/5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-foreground">Fast. Fresh. Delivered.</span>
            </div>
            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Craving Something{" "}
              <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                Delicious?
              </span>{" "}
              We Got You.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Order from the best local restaurants and food courts near you. ZIPPY GO brings hot, fresh, and gourmet meals straight to your doorstep with lightning-fast speed.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gap-2 shadow-lg">
                  Order Now <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Partner Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose Zippy Go?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We design every bite to be premium, convenient, and fast.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className="group rounded-2xl border border-border bg-card p-8 shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 dark:bg-card"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/5">
                  <feature.icon className="h-6 w-6 fill-current" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-12 shadow-xl dark:from-primary/5">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to transform how you eat?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Sign up today and get your first delivery absolutely free! Use promo code <span className="font-bold text-primary dark:text-foreground">ZIPPYFREE</span> at checkout.
            </p>
            <div className="mt-8 flex items-center justify-center">
              <Link href="/register">
                <Button size="lg" className="gap-2 shadow-lg">
                  Start Ordering Now <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 ZIPPY GO. Fast. Fresh. Delivered. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
