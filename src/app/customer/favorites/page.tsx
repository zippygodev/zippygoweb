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
  Store,
  Star,
  Clock,
  Trash2,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '../CustomerLayoutClient';

interface FavoriteRestaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: number;
  image: string;
}

interface FavoriteItem {
  id: string;
  name: string;
  restaurant: string;
  restaurantId: string;
  price: number;
  image: string;
}

const favoriteRestaurants: FavoriteRestaurant[] = [
  { id: '1', name: 'Pizza Palace', cuisine: 'Italian • Pizza', rating: 4.8, deliveryTime: 25, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=250&fit=crop' },
  { id: '2', name: 'Sushi Master', cuisine: 'Japanese • Sushi', rating: 4.7, deliveryTime: 30, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=250&fit=crop' },
  { id: '4', name: 'Tandoori Nights', cuisine: 'Indian • North Indian', rating: 4.6, deliveryTime: 35, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=250&fit=crop' },
  { id: '7', name: 'Sweet Tooth', cuisine: 'Desserts • Bakery', rating: 4.9, deliveryTime: 15, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=250&fit=crop' },
];

const favoriteItems: FavoriteItem[] = [
  { id: 'p1', name: 'Margherita Pizza', restaurant: 'Pizza Palace', restaurantId: '1', price: 349, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=300&fit=crop' },
  { id: 'p2', name: 'California Roll', restaurant: 'Sushi Master', restaurantId: '2', price: 449, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=300&fit=crop' },
  { id: 'p5', name: 'Butter Chicken', restaurant: 'Tandoori Nights', restaurantId: '4', price: 399, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop' },
];

export default function FavoritesPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('restaurants');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const hasFavorites = favoriteRestaurants.length > 0 || favoriteItems.length > 0;

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
          icon={<Heart className="h-12 w-12" />}
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
              Restaurants ({favoriteRestaurants.length})
            </TabsTrigger>
            <TabsTrigger value="items" className="flex-1 text-xs">
              Items ({favoriteItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="restaurants" className="mt-4 space-y-3">
            {favoriteRestaurants.map((restaurant, i) => (
              <motion.button
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/customer/restaurants/${restaurant.id}`)}
                className="flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <h3 className="truncate text-sm font-semibold">{restaurant.name}</h3>
                  <p className="truncate text-xs text-muted-foreground">{restaurant.cuisine}</p>
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
                    // Remove from favorites
                  }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.button>
            ))}
          </TabsContent>

          <TabsContent value="items" className="mt-4 space-y-3">
            {favoriteItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <h3 className="truncate text-sm font-semibold">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.restaurant}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">{formatCurrency(item.price)}</span>
                    <Button
                      size="sm"
                      className="h-7 rounded-lg px-2.5 text-xs"
                      onClick={() => {
                        addItem({
                          restaurantId: item.restaurantId,
                          restaurantName: item.restaurant,
                          menuItemId: item.id,
                          name: item.name,
                          image: item.image,
                          variant: 'Regular',
                          price: item.price,
                          quantity: 1,
                        });
                      }}
                    >
                      <ShoppingBag className="mr-1 h-3 w-3" />
                      Add
                    </Button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    // Remove from favorites
                  }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
