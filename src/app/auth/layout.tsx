'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className={cn(
            'absolute inset-0',
            mounted && theme === 'dark'
              ? 'bg-gradient-to-b from-background via-primary-950/30 to-background'
              : 'bg-gradient-to-b from-primary-50/50 via-background to-background'
          )}
        />
        <div
          className={cn(
            'absolute inset-0 bg-dots opacity-30',
            mounted && theme === 'dark' ? 'opacity-20' : 'opacity-40'
          )}
        />
        {/* Gradient orbs */}
        <div className="absolute -top-40 right-[-10%] h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 left-[-10%] h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Logo */}
      <Link
        href="/"
        className="group mb-8 flex items-center gap-2.5 transition-opacity hover:opacity-80"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-105">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <span className="font-display text-2xl font-bold tracking-tight">
          Zippy
          <span className="text-primary"> Go</span>
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border/50 bg-card/80 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-8">
          {children}
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Zippy Go. All rights reserved.
      </p>
    </div>
  );
}
