'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency, formatTime, getInitials } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from '@/components/ui/carousel';
import { useCart } from './CustomerLayoutClient';
import {
  Star,
  Clock,
  Bike,
  TrendingUp,
  Flame,
  Sparkles,
  ChevronRight,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { getActiveRestaurants, getFeaturedProducts } from '@/actions/customer/restaurants';
import toast from 'react-hot-toast';

const categories = [
  { id: 'pizza', name: 'Pizza', emoji: '🍕', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop' },
  { id: 'burger', name: 'Burgers', emoji: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
  { id: 'sushi', name: 'Sushi', emoji: '🍣', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&h=200&fit=crop' },
  { id: 'pasta', name: 'Pasta', emoji: '🍝', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop' },
  { id: 'salad', name: 'Salads', emoji: '🥗', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop' },
  { id: 'dessert', name: 'Desserts', emoji: '🍰', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop' },
  { id: 'drinks', name: 'Drinks', emoji: '🥤', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop' },
  { id: 'indian', name: 'Indian', emoji: '🍛', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function CategorySkeleton() {
  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <Skeleton className="h-16 w-16 rounded-full" />
      <Skeleton className="h-3 w-14" />
    </div>
  );
}

function RestaurantCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <div className="space-y-2 px-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <Skeleton className="h-44 w-full rounded-2xl" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-44" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <RestaurantCardSkeleton key={i} />)}
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-36" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-44 shrink-0 space-y-2">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CustomerHomePage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [popularItems, setPopularItems] = useState<any[]>([]);
  const touchStart = useRef(0);

  const fetchData = async () => {
    try {
      const [resRestaurants, resProducts] = await Promise.all([
        getActiveRestaurants(),
        getFeaturedProducts()
      ]);

      if (resRestaurants.success && resRestaurants.data) {
        setRestaurants(resRestaurants.data);
      }
      if (resProducts.success && resProducts.data) {
        setPopularItems(resProducts.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => { api.off('select', onSelect); };
  }, [api]);

  useEffect(() => {
    if (!api || restaurants.length === 0) return;
    const interval = setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 4000);
    return () => clearInterval(interval);
  }, [api, restaurants]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) return <HomeSkeleton />;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="pb-6">
      <div
        onTouchStart={(e) => { touchStart.current = e.touches[0]?.clientY ?? 0; }}
        onTouchEnd={(e) => {
          const diff = touchStart.current - (e.changedTouches[0]?.clientY ?? 0);
          if (diff < -100) handleRefresh();
        }}
      >
        {refreshing && (
          <div className="flex items-center justify-center py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Refreshing...
            </div>
          </div>
        )}

        {/* Hero Banner Carousel (Featured Restaurants) */}
        {restaurants.length > 0 && (
          <section className="px-4 pt-4">
            <Carousel setApi={setApi} opts={{ loop: true, align: 'start' }}>
              <CarouselContent>
                {restaurants.map((restaurant) => (
                  <CarouselItem key={restaurant.id}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push(`/customer/restaurants/${restaurant.slug}`)}
                      className="relative w-full overflow-hidden rounded-2xl"
                    >
                      <div className="aspect-[2/1] w-full">
                        <img
                          src={restaurant.coverImageUrl || restaurant.bannerUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop'}
                          alt={restaurant.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 border-2 border-white/50">
                            <AvatarImage src={restaurant.logoUrl || ''} />
                            <AvatarFallback className="text-xs bg-primary text-white">{getInitials(restaurant.name)}</AvatarFallback>
                          </Avatar>
                          <div className="text-left">
                            <h3 className="text-base font-bold text-white">{restaurant.name}</h3>
                            <p className="text-xs text-white/80">{restaurant.cuisineType || 'Cuisine'}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <Badge variant="secondary" className="gap-1 bg-white/20 text-white backdrop-blur-sm">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {restaurant.rating}
                          </Badge>
                          <Badge variant="secondary" className="gap-1 bg-white/20 text-white backdrop-blur-sm">
                            <Clock className="h-3 w-3" />
                            {formatTime(restaurant.deliveryTime)}
                          </Badge>
                        </div>
                      </div>
                    </motion.button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {restaurants.length > 1 && (
                <div className="mt-2 flex justify-center gap-1.5">
                  {restaurants.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => api?.scrollTo(i)}
                      className={cn(
                        'h-1.5 rounded-full transition-all duration-300',
                        i === current ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30'
                      )}
                    />
                  ))}
                </div>
              )}
            </Carousel>
          </section>
        )}

        {/* Categories */}
        <section className="mt-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-lg font-semibold">Categories</h2>
            <button className="text-sm font-medium text-primary">See All</button>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto px-4 scrollbar-hide">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                variants={itemVariants}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.push(`/customer/restaurants?category=${cat.id}`)}
                className="flex shrink-0 flex-col items-center gap-2"
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
                  <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="text-2xl">{cat.emoji}</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Nearby/All Restaurants */}
        <section className="mt-6 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bike className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Nearby Restaurants</h2>
            </div>
            <button
              onClick={() => router.push('/customer/restaurants')}
              className="flex items-center gap-0.5 text-sm font-medium text-primary"
            >
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          {restaurants.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-4 text-center">No active restaurants found.</p>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-3">
              {restaurants.map((restaurant) => (
                <motion.button
                  key={restaurant.id}
                  variants={itemVariants}
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
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {restaurant.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(restaurant.deliveryTime)}
                      </span>
                      <span>Min ₹{Number(restaurant.minOrderAmount)}</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </section>

        {/* Popular/Featured Items */}
        {popularItems.length > 0 && (
          <section className="mt-6 mb-4">
            <div className="flex items-center gap-2 px-4">
              <Flame className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-semibold">Popular Items</h2>
            </div>
            <div className="mt-3 flex gap-3 overflow-x-auto px-4 scrollbar-hide">
              {popularItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="w-40 shrink-0"
                >
                  <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=300&fit=crop'}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-1 p-2.5">
                      <h3 className="truncate text-sm font-semibold">{item.name}</h3>
                      <p className="truncate text-xs text-muted-foreground">{item.restaurant?.name || 'Restaurant'}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-primary">{formatCurrency(Number(item.price))}</span>
                        <button
                          onClick={() => {
                            addItem({
                              restaurantId: item.restaurantId,
                              restaurantName: item.restaurant?.name || 'Restaurant',
                              menuItemId: item.id,
                              name: item.name,
                              image: item.imageUrl || '',
                              variant: item.variants?.[0]?.name || 'Regular',
                              price: Number(item.price),
                              quantity: 1,
                            });
                            toast.success(`${item.name} added to cart!`);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}
