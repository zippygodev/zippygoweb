'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency, formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart,
  Star,
  Clock,
  Trash2,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../CustomerLayoutClient';
import { getMyFavorites, toggleFavorite } from '@/actions/customer/favorites';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('restaurants');
  const [favorites, setFavorites] = useState<{ restaurants: any[]; products: any[] }>({
    restaurants: [],
    products: [],
  });

  const fetchFavorites = async () => {
    try {
      const res = await getMyFavorites();
      if (res.success && res.data) {
        setFavorites(res.data);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async ({ restaurantId, productId }: { restaurantId?: string; productId?: string }) => {
    try {
      const res = await toggleFavorite({ restaurantId, productId });
      if (res.success) {
        toast.success('Removed from favorites');
        fetchFavorites();
      } else {
        toast.error(res.error || 'Failed to remove favorite');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    }
  };

  const hasFavorites = favorites.restaurants.length > 0 || favorites.products.length > 0;

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!hasFavorites) {
    return (
      <div className="px-4 pt-8">
        <EmptyState
          icon={<Heart className="h-12 w-12 text-muted-foreground" />}
          title="No favorites yet"
          description="Save your favorite restaurants and items for quick access."
          action={{ label: 'Browse Restaurants', onClick: () => router.push('/customer/restaurants') }}
        />
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="px-4 pt-4">
        <Tabs defaultValue="restaurants" onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="restaurants" className="flex-1 text-xs">
              Restaurants ({favorites.restaurants.length})
            </TabsTrigger>
            <TabsTrigger value="items" className="flex-1 text-xs">
              Items ({favorites.products.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="restaurants" className="mt-4 space-y-3">
            {favorites.restaurants.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">No favorite restaurants yet.</p>
            ) : (
              favorites.restaurants.map((restaurant, i) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left shadow-sm transition-shadow hover:shadow-md cursor-pointer"
                  onClick={() => router.push(`/customer/restaurants/${restaurant.slug}`)}
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {restaurant.logoUrl && (
                      <img src={restaurant.logoUrl} alt={restaurant.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <h3 className="truncate text-sm font-semibold">{restaurant.name}</h3>
                    <p className="truncate text-xs text-muted-foreground">{restaurant.cuisineType || 'Cuisine'}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {restaurant.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(restaurant.deliveryTime)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove({ restaurantId: restaurant.id });
                    }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="items" className="mt-4 space-y-3">
            {favorites.products.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">No favorite items yet.</p>
            ) : (
              favorites.products.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <h3 className="truncate text-sm font-semibold">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.restaurant?.name || 'Restaurant'}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm font-bold text-primary">{formatCurrency(Number(item.price))}</span>
                      <Button
                        size="sm"
                        className="h-7 rounded-lg px-2.5 text-xs"
                        onClick={() => {
                          addItem({
                            restaurantId: item.restaurantId,
                            restaurantName: item.restaurant?.name || 'Restaurant',
                            menuItemId: item.id,
                            name: item.name,
                            image: item.imageUrl || '',
                            variant: 'Regular',
                            price: Number(item.price),
                            quantity: 1,
                          });
                          toast.success(`${item.name} added to cart!`);
                        }}
                      >
                        <ShoppingBag className="mr-1 h-3 w-3" />
                        Add
                      </Button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove({ productId: item.id })}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
