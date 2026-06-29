'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency, formatTime } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import {
  Search,
  SlidersHorizontal,
  Star,
  Clock,
  ArrowUpDown,
  X,
  Store,
} from 'lucide-react';
import { getActiveRestaurants } from '@/actions/customer/restaurants';

const allCategories = [
  { id: 'all', name: 'All', emoji: '🔥' },
  { id: 'pizza', name: 'Pizza', emoji: '🍕' },
  { id: 'burger', name: 'Burgers', emoji: '🍔' },
  { id: 'sushi', name: 'Sushi', emoji: '🍣' },
  { id: 'pasta', name: 'Pasta', emoji: '🍝' },
  { id: 'indian', name: 'Indian', emoji: '🍛' },
  { id: 'chinese', name: 'Chinese', emoji: '🥟' },
  { id: 'dessert', name: 'Desserts', emoji: '🍰' },
  { id: 'drinks', name: 'Drinks', emoji: '🥤' },
  { id: 'salad', name: 'Salads', emoji: '🥗' },
  { id: 'thai', name: 'Thai', emoji: '🍜' },
  { id: 'mexican', name: 'Mexican', emoji: '🌮' },
];

type SortOption = 'rating' | 'deliveryTime' | 'minOrder';

function RestaurantsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchRestaurants = async () => {
    try {
      const res = await getActiveRestaurants();
      if (res.success && res.data) {
        setRestaurants(res.data);
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [searchQuery, selectedCategory, sortBy]);

  useEffect(() => {
    if (loadingMore) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore) {
          setLoadingMore(true);
          setTimeout(() => {
            setPage((p) => p + 1);
            setLoadingMore(false);
            if (page >= 3) setHasMore(false);
          }, 1000);
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [loadingMore, hasMore, page]);

  const filtered = restaurants
    .filter((r) => {
      if (selectedCategory !== 'all') {
        const cat = selectedCategory.toLowerCase();
        const cuisine = (r.cuisineType || '').toLowerCase();
        const name = (r.name || '').toLowerCase();
        if (!cuisine.includes(cat) && !name.includes(cat)) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          (r.name || '').toLowerCase().includes(q) ||
          (r.cuisineType || '').toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'deliveryTime') return (a.deliveryTime || 0) - (b.deliveryTime || 0);
      return Number(a.minOrderAmount || 0) - Number(b.minOrderAmount || 0);
    });

  const displayed = filtered.slice(0, page * 6);

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-10 w-full rounded-xl" />
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Search Bar */}
      <div className="sticky top-14 z-30 border-b bg-background/80 backdrop-blur-xl">
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search restaurants, cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-xl border-none bg-muted pl-10 pr-10 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filters & Sort */}
      <div className="border-b">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              {allCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
                    selectedCategory === cat.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/20 bg-muted text-muted-foreground hover:border-muted-foreground/40'
                  )}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                showFilters
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground/20 bg-muted text-muted-foreground'
              )}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              Sort
            </button>
            {showFilters && (
              <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border bg-popover shadow-lg">
                {([
                  { value: 'rating', label: 'Highest Rated' },
                  { value: 'deliveryTime', label: 'Fastest Delivery' },
                  { value: 'minOrder', label: 'Lowest Minimum' },
                ] as { value: SortOption; label: string }[]).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => { setSortBy(option.value); setShowFilters(false); }}
                    className={cn(
                      'flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted',
                      sortBy === option.value ? 'font-medium text-primary' : 'text-foreground'
                    )}
                  >
                    {sortBy === option.value && <CheckIcon className="h-4 w-4" />}
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 pt-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Store className="h-10 w-10" />}
            title="No restaurants found"
            description={searchQuery ? `No results for "${searchQuery}"` : 'Try a different category'}
            action={{ label: 'Clear Filters', onClick: () => { setSearchQuery(''); setSelectedCategory('all'); } }}
          />
        ) : (
          <>
            <p className="mb-3 text-sm text-muted-foreground">
              {filtered.length} restaurant{filtered.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-2 gap-3">
              {displayed.map((restaurant, index) => (
                <motion.button
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(`/customer/restaurants/${restaurant.slug}`)}
                  className="group overflow-hidden rounded-xl border bg-card text-left shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={restaurant.coverImageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=250&fit=crop'}
                      alt={restaurant.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-1.5 p-3">
                    <h3 className="truncate text-sm font-semibold">{restaurant.name}</h3>
                    <p className="truncate text-xs text-muted-foreground">{restaurant.cuisineType || 'Cuisine'}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {restaurant.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(restaurant.deliveryTime)}
                      </span>
                      <span className="text-primary">₹{Number(restaurant.minOrderAmount)}+</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            <div ref={loadMoreRef} className="py-6">
              {loadingMore && <LoadingSpinner text="Loading more..." />}
              {!hasMore && displayed.length > 0 && (
                <p className="text-center text-sm text-muted-foreground">You&apos;ve seen all restaurants</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function RestaurantsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Loading restaurants...</div>}>
      <RestaurantsPageInner />
    </Suspense>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
