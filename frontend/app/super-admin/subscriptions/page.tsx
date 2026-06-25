"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, CreditCard, TrendingUp } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    features: ["1 Restaurant", "5 Staff Accounts", "Basic Analytics", "Email Support"],
    popular: false,
    color: "bg-gray-100 dark:bg-gray-900",
  },
  {
    name: "Professional",
    price: "$249",
    period: "/month",
    features: ["5 Restaurants", "25 Staff Accounts", "Advanced Analytics", "AI Recommendations", "Priority Support"],
    popular: true,
    color: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    name: "Enterprise",
    price: "$599",
    period: "/month",
    features: ["Unlimited Restaurants", "Unlimited Staff", "Full AI Suite", "Robot Delivery Ready", "Dedicated Support", "Custom Integrations"],
    popular: false,
    color: "bg-gray-100 dark:bg-gray-900",
  },
];

const activeSubscriptions = [
  { organization: "City Food Court Mall", plan: "Enterprise", status: "active", amount: "$599/mo", nextBilling: "Jan 15, 2025" },
  { organization: "Grand Plaza Food Court", plan: "Professional", status: "active", amount: "$249/mo", nextBilling: "Jan 20, 2025" },
  { organization: "Airport Terminal 3", plan: "Enterprise", status: "active", amount: "$599/mo", nextBilling: "Feb 1, 2025" },
  { organization: "University Campus", plan: "Starter", status: "trial", amount: "$99/mo", nextBilling: "Jan 10, 2025" },
];

export default function SuperAdminSubscriptionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground">Manage plans and billing</p>
      </div>

      {/* Plans */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`relative overflow-hidden p-6 ${plan.popular ? "ring-2 ring-emerald-500" : ""}`}>
              {plan.popular && (
                <div className="absolute right-0 top-0 bg-emerald-500 px-3 py-1 text-xs font-medium text-white">
                  Popular
                </div>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="ml-1 text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full" variant={plan.popular ? "default" : "outline"}>
                {plan.popular ? "Current Plan" : "View Plan"}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Subscriptions */}
      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Active Subscriptions</h3>
        <div className="space-y-3">
          {activeSubscriptions.map((sub) => (
            <div key={sub.organization} className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="font-medium">{sub.organization}</p>
                <p className="text-sm text-muted-foreground">
                  {sub.plan} • Next billing: {sub.nextBilling}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={sub.status === "active" ? "success" : "warning"}>{sub.status}</Badge>
                <span className="font-medium">{sub.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
