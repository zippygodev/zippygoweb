"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UtensilsCrossed, ArrowRight, Sparkles, ShoppingBag, BarChart3, Shield, Bot, CreditCard, Truck } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered",
    description: "Smart recommendations, demand prediction, and automated insights",
  },
  {
    icon: ShoppingBag,
    title: "Multi-Vendor",
    description: "Order from multiple restaurants in a single cart",
  },
  {
    icon: CreditCard,
    title: "Seamless Payments",
    description: "Razorpay integration with support for all payment methods",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Comprehensive dashboards for every role",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "RBAC, JWT, audit logs, and enterprise-grade security",
  },
  {
    icon: Truck,
    title: "Robot Delivery Ready",
    description: "Future-proof architecture for autonomous delivery",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b bg-white/80 backdrop-blur-xl dark:bg-black/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600">
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">FoodCourtOS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100 via-white to-transparent dark:from-emerald-950/50" />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border bg-white/50 px-4 py-1.5 text-sm shadow-sm backdrop-blur dark:bg-black/50">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              <span>AI-Powered Food Court Management</span>
            </div>
            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              The Future of{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Food Court
              </span>{" "}
              Management
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Enterprise-grade operating system for shopping malls, airports, universities,
              and corporate cafeterias. Powered by AI and built for scale.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="xl" className="gap-2">
                  Get Started Free <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="xl" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to run a food court
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Complete platform for customers, restaurants, and administrators
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-2xl border bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-black/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="rounded-3xl border bg-gradient-to-br from-emerald-50 to-white p-12 shadow-xl dark:from-emerald-950/50 dark:to-black">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to transform your food court?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands of food courts already using FoodCourtOS to manage their operations.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="xl" className="gap-2">
                  Start Free Trial <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 FoodCourtOS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
