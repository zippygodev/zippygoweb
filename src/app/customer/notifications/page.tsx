'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useNotifications } from '../CustomerLayoutClient';
import {
  Bell,
  BellRing,
  ShoppingBag,
  Gift,
  Megaphone,
  CheckCheck,
  ChevronRight,
  Clock,
  Package,
  Percent,
} from 'lucide-react';

const notificationIcons: Record<string, typeof Bell> = {
  order: ShoppingBag,
  promo: Gift,
  update: Megaphone,
};

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border p-4">
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="px-4 pt-8">
        <EmptyState
          icon={<Bell className="h-12 w-12" />}
          title="No notifications"
          description="You're all caught up! Check back later for updates."
        />
      </div>
    );
  }

  const sorted = [...notifications].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return 0;
  });

  return (
    <div className="pb-6">
      {/* Header Actions */}
      {unreadCount > 0 && (
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <p className="text-xs text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-xs font-medium text-primary"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all as read
          </button>
        </div>
      )}

      {/* Notification List */}
      <div className="mt-2 space-y-1 px-4">
        {sorted.map((notification, i) => {
          const Icon = notificationIcons[notification.type] || Bell;
          return (
            <motion.button
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => markAsRead(notification.id)}
              className={cn(
                'flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all',
                notification.read
                  ? 'bg-card'
                  : 'bg-primary/[0.03] shadow-sm ring-1 ring-primary/10'
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                  notification.read ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p
                      className={cn(
                        'truncate text-sm',
                        notification.read ? 'text-foreground' : 'font-semibold text-foreground'
                      )}
                    >
                      {notification.title}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                  {notification.message}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-muted-foreground/60" />
                  <span className="text-xs text-muted-foreground/60">{notification.time}</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
