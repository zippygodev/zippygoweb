'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Store,
  Bike,
  UserCircle,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const roleOptions = [
  {
    value: 'customer',
    label: 'Customer',
    description: 'Order from your favourite restaurants',
    icon: UserCircle,
    href: '/auth/login/customer',
  },
  {
    value: 'restaurant',
    label: 'Restaurant Owner',
    description: 'Manage your restaurant and menu',
    icon: Store,
    href: '/auth/login/restaurant',
  },
  {
    value: 'delivery',
    label: 'Delivery Partner',
    description: 'Deliver orders and earn money',
    icon: Bike,
    href: '/auth/login/delivery',
  },
  {
    value: 'mall',
    label: 'Mall Admin',
    description: 'Manage your mall operations',
    icon: Store, // You might want to use a different icon like Building if available
    href: '/auth/login/mall',
  },
  {
    value: 'superadmin',
    label: 'Super Admin',
    description: 'Platform management',
    icon: ShieldCheck,
    href: '/auth/login/superadmin',
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function LoginPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Sign in to your Zippy Go account
        </p>
      </motion.div>

      {/* Role Selection */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="mb-3 block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Sign in as a...
        </div>
        <div className="grid grid-cols-2 gap-3">
          {roleOptions.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                href={role.href}
                key={role.value}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all duration-200 border-border/60 hover:border-primary/50 hover:bg-primary/5'
                )}
              >
                <Icon className="h-6 w-6 text-muted-foreground mb-1" />
                <span className="text-sm font-semibold leading-tight text-foreground">
                  {role.label}
                </span>
                <span className="text-[10px] leading-tight text-muted-foreground hidden sm:block">
                  {role.description}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.div>

      <Separator className="my-6" />

      {/* Register link */}
      <motion.div variants={itemVariants} className="text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:text-primary/80"
          >
            Create one
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
