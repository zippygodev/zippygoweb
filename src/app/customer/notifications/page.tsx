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
  ShoppingBag,
  Megaphone,
  CheckCheck,
  Percent,
  CreditCard,
  Bike,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

const notificationIcons: Record<string, typeof Bell> = {
  ORDER_UPDATE: ShoppingBag,
  PROMOTION: Percent,
  PAYMENT: CreditCard,
  SYSTEM: Megaphone,
  DELIVERY: Bike,
};

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications } = useNotifications();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshNotifications().then(() => setLoading(false));
  }, [refreshNotifications]);

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
          icon={<Bell className="h-12 w-12 text-muted-foreground" />}
          title="No notifications"
          description="You're all caught up! Check back later for updates."
        />
      </div>
    );
  }

  const sorted = [...notifications].sort((a, b) => {
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
      <div className="mt-2 space-y-2 px-4">
        {sorted.map((notification, i) => {
          const Icon = notificationIcons[notification.type] || Bell;
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={cn(
                'flex items-start gap-3 rounded-xl border p-4 shadow-sm transition-colors text-left w-full bg-card',
                !notification.isRead && 'border-primary/20 bg-primary/5 ring-1 ring-primary/5'
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                  notification.isRead ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={cn('text-sm font-semibold truncate', !notification.isRead && 'text-primary')}>
                    {notification.title}
                  </h3>
                  <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                    {formatDate(notification.createdAt, 'relative')}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {notification.message}
                </p>
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="mt-2 text-[10px] font-semibold text-primary hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
