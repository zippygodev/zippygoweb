"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/utils";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Clock,
  Star,
  TrendingUp,
  Pizza,
  Coffee,
  IceCream,
  Sandwich,
  Beef,
  Salad,
  Sparkles,
  Bot,
} from "lucide-react";
import { useRouter } from "next/navigation";

const categories = [
  { name: "Pizza", icon: Pizza, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30" },
  { name: "Coffee", icon: Coffee, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30" },
  { name: "Desserts", icon: IceCream, color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30" },
  { name: "Burgers", icon: Sandwich, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30" },
  { name: "BBQ", icon: Beef, color: "bg-red-100 text-red-600 dark:bg-red-900/30" },
  { name: "Healthy", icon: Salad, color: "bg-green-100 text-green-600 dark:bg-green-900/30" },
];

function RestaurantSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </Card>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data: restaurantsData, isLoading } = useQuery({
    queryKey: ["restaurants", "home"],
    queryFn: async () => {
      const { data } = await api.get("/restaurants?limit=6&isOpen=true");
      return data;
    },
    staleTime: 60_000,
  });

  const { data: recommendationsData } = useQuery({
    queryKey: ["ai-trending"],
    queryFn: async () => {
      const { data } = await api.get("/ai/trending");
      return data;
    },
    staleTime: 300_000,
  });

  const restaurants = restaurantsData?.data || restaurantsData || [];
  const trending = recommendationsData?.trending || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting()},{" "}
          <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
            {user?.name?.split(" ")[0] || "Guest"}
          </span>
          ! 👋
        </h1>
        <p className="mt-1 text-muted-foreground">What are you craving today?</p>
      </motion.div>

      {/* Search */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-8"
        onSubmit={handleSearch}
      >
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search for restaurants, cuisines, or dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-14 w-full rounded-2xl border bg-white pl-12 pr-32 text-base shadow-sm outline-none transition-all focus:border-info focus:ring-2 focus:ring-info/30 dark:bg-black/50"
        />
        <Link href="/ai-chat">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-3 top-1/2 -translate-y-1/2 gap-1.5 text-amber-600 hover:text-amber-700"
          >
            <Bot className="h-4 w-4" />
            AI Search
          </Button>
        </Link>
      </motion.form>

      {/* Categories */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Browse by Category</h2>
          <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700">
            View All
          </Button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => router.push(`/restaurants?cuisine=${cat.name}`)}
              className="flex shrink-0 flex-col items-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${cat.color}`}>
                <cat.icon className="h-7 w-7" />
              </div>
              <span className="text-xs font-medium">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* AI Trending Items */}
      {trending.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-4 w-4 fill-current" />
            </div>
            <h2 className="text-xl font-semibold">AI Trending Now</h2>
            <Badge className="bg-primary/20 text-foreground dark:bg-primary/10">Popular</Badge>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {trending.slice(0, 6).map((item: any, i: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="shrink-0 w-48"
              >
                <Link href={`/restaurants/${item.restaurant?.slug || ""}`}>
                  <Card className="overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <div className="h-32 overflow-hidden bg-muted">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-3xl">🍽️</div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-semibold">{item.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.restaurant?.name}</p>
                      <p className="mt-1 text-sm font-bold text-amber-600">{formatPrice(item.price)}</p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Restaurants */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">
              {isLoading ? "Loading Restaurants..." : "Restaurants Near You"}
            </h2>
          </div>
          <Link href="/restaurants">
            <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700">
              View All
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <RestaurantSkeleton key={i} />)
            : restaurants.length > 0
            ? restaurants.map((restaurant: any, i: number) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/restaurants/${restaurant.slug}`}>
                    <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                      <div className="relative h-48 overflow-hidden bg-muted">
                        {restaurant.coverImage ? (
                          <img
                            src={restaurant.coverImage}
                            alt={restaurant.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-secondary text-5xl">
                            🏪
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2">
                          <Badge
                            variant="secondary"
                            className="bg-white/90 text-xs backdrop-blur dark:bg-black/90"
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            {restaurant.deliveryTime} min
                          </Badge>
                        </div>
                        {!restaurant.isOpen && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Badge variant="destructive" className="text-xs">Closed</Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="mb-1 flex items-start justify-between">
                          <h3 className="font-semibold">{restaurant.name}</h3>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-medium">{restaurant.rating?.toFixed(1) || "New"}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{restaurant.cuisine || "Multi-cuisine"}</span>
                          {restaurant.priceRange && (
                            <>
                              <span>•</span>
                              <span>{restaurant.priceRange}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))
            : (
              // Fallback static restaurants if API has no data
              [
                { id: "1", name: "Pizza Paradise", slug: "pizza-paradise", rating: 4.5, deliveryTime: "25-35", cuisine: "Italian", priceRange: "$$", coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400", isOpen: true },
                { id: "2", name: "Dragon Wok", slug: "dragon-wok", rating: 4.3, deliveryTime: "20-30", cuisine: "Chinese", priceRange: "$$", coverImage: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400", isOpen: true },
                { id: "3", name: "Burger Barn", slug: "burger-barn", rating: 4.7, deliveryTime: "15-25", cuisine: "American", priceRange: "$", coverImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", isOpen: true },
              ].map((restaurant, i) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/restaurants/${restaurant.slug}`}>
                    <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={restaurant.coverImage}
                          alt={restaurant.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="secondary" className="bg-white/90 text-xs backdrop-blur dark:bg-black/90">
                            <Clock className="mr-1 h-3 w-3" />
                            {restaurant.deliveryTime} min
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="mb-1 flex items-start justify-between">
                          <h3 className="font-semibold">{restaurant.name}</h3>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-medium">{restaurant.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{restaurant.cuisine}</span>
                          <span>•</span>
                          <span>{restaurant.priceRange}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))
            )}
        </div>
      </section>

      {/* AI Chat FAB */}
      <Link
        href="/ai-chat"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-amber-500 px-4 py-3 text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
      >
        <Bot className="h-5 w-5" />
        <span className="text-sm font-medium">AI Assistant</span>
      </Link>
    </div>
  );
}
