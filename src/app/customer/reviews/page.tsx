'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/ui/empty-state';
import {
  MessageSquare,
  Star,
  Trash2,
  PenLine,
  Check,
  X,
} from 'lucide-react';
import { getMyReviews } from '@/actions/customer/reviews';
import toast from 'react-hot-toast';

export default function ReviewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await getMyReviews();
      if (res.success && res.data) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const averageRating = reviews.length > 0 
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach((r) => { 
    const idx = r.rating - 1; 
    if (idx >= 0 && idx < 5) ratingDistribution[idx]++; 
  });

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border p-3">
            <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="px-4 pt-8">
        <EmptyState
          icon={<MessageSquare className="h-12 w-12 text-muted-foreground" />}
          title="No reviews yet"
          description="Share your experience with restaurants and items you've ordered."
          action={{ label: 'Browse Restaurants', onClick: () => router.push('/customer/restaurants') }}
        />
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Rating Summary */}
      <div className="mx-4 mt-4 flex items-center gap-6 rounded-xl border bg-card p-4 shadow-sm">
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">{averageRating.toFixed(1)}</p>
          <div className="mt-1 flex justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-3.5 w-3.5',
                  i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
                )}
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{reviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <span className="w-8 text-xs text-muted-foreground">{star}★</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-yellow-400"
                  style={{ width: `${((ratingDistribution[star - 1] ?? 0) / reviews.length) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right text-xs text-muted-foreground">
                {ratingDistribution[star - 1]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div className="mt-4 space-y-3 px-4">
        {reviews.map((review, i) => {
          const title = review.product ? review.product.name : review.restaurant?.name;
          const image = review.product ? review.product.imageUrl : review.restaurant?.logoUrl;
          return (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="overflow-hidden rounded-xl border bg-card shadow-sm"
            >
              <div className="p-3">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {image && (
                      <img src={image} alt={title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="truncate text-sm font-semibold">{title}</h3>
                        <p className="text-xs text-muted-foreground">{review.restaurant?.name || 'Restaurant'}</p>
                      </div>
                      <Badge variant={review.product ? 'secondary' : 'default'} className="h-5 px-1.5 text-[10px]">
                        {review.product ? 'Item' : 'Restaurant'}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            className={cn(
                              'h-3 w-3',
                              j < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(review.createdAt, 'short')}</span>
                    </div>
                  </div>
                </div>

                {editingId === review.id ? (
                  <div className="mt-3 space-y-2">
                    <Textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="min-h-[80px] resize-none text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="rounded-lg"
                        onClick={() => {
                          toast.success('Review saved locally (read-only for demo)');
                          setEditingId(null);
                        }}
                      >
                        <Check className="mr-1 h-3.5 w-3.5" /> Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="mr-1 h-3.5 w-3.5" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                )}
              </div>

              {editingId !== review.id && (
                <div className="flex border-t border-border/50">
                  <button
                    onClick={() => {
                      setEditingId(review.id);
                      setEditComment(review.comment);
                    }}
                    className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50"
                  >
                    <PenLine className="h-3.5 w-3.5" /> Edit
                  </button>
                  <div className="my-1.5 w-px bg-border" />
                  <button
                    onClick={() => {
                      toast.success('Review deletion requested (read-only for demo)');
                    }}
                    className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
