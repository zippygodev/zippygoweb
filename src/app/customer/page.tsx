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

const featuredRestaurants = [
  { id: '1', name: 'Pizza Palace', cuisine: 'Italian • Pizza', rating: 4.8, deliveryTime: 25, minOrder: 199, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=300&fit=crop', logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop', featured: true },
  { id: '2', name: 'Sushi Master', cuisine: 'Japanese • Sushi', rating: 4.7, deliveryTime: 30, minOrder: 299, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=300&fit=crop', logo: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop', featured: true },
  { id: '3', name: 'Burger Barn', cuisine: 'American • Fast Food', rating: 4.5, deliveryTime: 20, minOrder: 149, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=300&fit=crop', logo: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=100&h=100&fit=crop', featured: true },
];

const nearbyRestaurants = [
  { id: '4', name: 'Tandoori Nights', cuisine: 'Indian • North Indian', rating: 4.6, deliveryTime: 35, minOrder: 249, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=250&fit=crop', logo: 'https://images.unsplash.com/photo-1601050690597-df0568f7095c?w=100&h=100&fit=crop' },
  { id: '5', name: 'Green Bowl', cuisine: 'Healthy • Salads', rating: 4.4, deliveryTime: 20, minOrder: 179, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop', logo: 'https://images.unsplash.com/photo-1616279967985-ec8c5a54bbe3?w=100&h=100&fit=crop' },
  { id: '6', name: 'Noodle House', cuisine: 'Chinese • Asian', rating: 4.3, deliveryTime: 25, minOrder: 199, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=250&fit=crop', logo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&h=100&fit=crop' },
  { id: '7', name: 'Sweet Tooth', cuisine: 'Desserts • Bakery', rating: 4.9, deliveryTime: 15, minOrder: 99, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=250&fit=crop', logo: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=100&h=100&fit=crop' },
  { id: '8', name: 'Pasta Paradiso', cuisine: 'Italian • Pasta', rating: 4.5, deliveryTime: 30, minOrder: 249, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=250&fit=crop', logo: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=100&h=100&fit=crop' },
  { id: '9', name: 'Thai Fusion', cuisine: 'Thai • Asian', rating: 4.2, deliveryTime: 35, minOrder: 299, image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=250&fit=crop', logo: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=100&h=100&fit=crop' },
];

const popularItems = [
  { id: 'p1', name: 'Margherita Pizza', restaurant: 'Pizza Palace', price: 349, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=300&fit=crop', rating: 4.8 },
  { id: 'p2', name: 'California Roll', restaurant: 'Sushi Master', price: 449, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=300&fit=crop', rating: 4.7 },
  { id: 'p3', name: 'Double Cheeseburger', restaurant: 'Burger Barn', price: 249, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop', rating: 4.6 },
  { id: 'p4', name: 'Chocolate Lava Cake', restaurant: 'Sweet Tooth', price: 199, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=300&h=300&fit=crop', rating: 4.9 },
  { id: 'p5', name: 'Butter Chicken', restaurant: 'Tandoori Nights', price: 399, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop', rating: 4.8 },
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
  const touchStart = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => { api.off('select', onSelect); };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 4000);
    return () => clearInterval(interval);
  }, [api]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
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

        {/* Hero Banner Carousel */}
        <section className="px-4 pt-4">
          <Carousel setApi={setApi} opts={{ loop: true, align: 'start' }}>
            <CarouselContent>
              {featuredRestaurants.map((restaurant) => (
                <CarouselItem key={restaurant.id}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(`/customer/restaurants/${restaurant.id}`)}
                    className="relative w-full overflow-hidden rounded-2xl"
                  >
                    <div className="aspect-[2/1] w-full">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border-2 border-white/50">
                          <AvatarImage src={restaurant.logo} />
                          <AvatarFallback className="text-xs">{getInitials(restaurant.name)}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <h3 className="text-base font-bold text-white">{restaurant.name}</h3>
                          <p className="text-xs text-white/80">{restaurant.cuisine}</p>
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
            <div className="mt-2 flex justify-center gap-1.5">
              {featuredRestaurants.map((_, i) => (
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
          </Carousel>
        </section>

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

        {/* Nearby Restaurants */}
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
          <div className="mt-3 grid grid-cols-2 gap-3">
            {nearbyRestaurants.map((restaurant) => (
              <motion.button
                key={restaurant.id}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(`/customer/restaurants/${restaurant.id}`)}
                className="group overflow-hidden rounded-xl border bg-card text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-1.5 p-3">
                  <h3 className="truncate text-sm font-semibold">{restaurant.name}</h3>
                  <p className="truncate text-xs text-muted-foreground">{restaurant.cuisine}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {restaurant.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(restaurant.deliveryTime)}
                    </span>
                    <span>Min ₹{restaurant.minOrder}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Popular Items */}
        <section className="mt-6">
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
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 p-2.5">
                    <h3 className="truncate text-sm font-semibold">{item.name}</h3>
                    <p className="truncate text-xs text-muted-foreground">{item.restaurant}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-primary">{formatCurrency(item.price)}</span>
                      <button
                        onClick={() => {
                          addItem({
                            restaurantId: item.id,
                            restaurantName: item.restaurant,
                            menuItemId: item.id,
                            name: item.name,
                            image: item.image,
                            variant: 'Regular',
                            price: item.price,
                            quantity: 1,
                          });
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white"
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
      </div>
    </motion.div>
  );
}
