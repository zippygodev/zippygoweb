"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, Star, Clock, MapPin, SlidersHorizontal, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

const fallbackRestaurants = [
  { id: "1", name: "Pizza Paradise", slug: "pizza-paradise", coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400", rating: 4.5, deliveryTime: "25-35", cuisine: "Italian", priceRange: "$$", isOpen: true },
  { id: "2", name: "Dragon Wok", slug: "dragon-wok", coverImage: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400", rating: 4.3, deliveryTime: "20-30", cuisine: "Chinese", priceRange: "$$", isOpen: true },
  { id: "3", name: "Burger Barn", slug: "burger-barn", coverImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", rating: 4.7, deliveryTime: "15-25", cuisine: "American", priceRange: "$", isOpen: true },
  { id: "4", name: "Sushi Master", slug: "sushi-master", coverImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400", rating: 4.6, deliveryTime: "30-40", cuisine: "Japanese", priceRange: "$$$", isOpen: true },
  { id: "5", name: "Taco Fiesta", slug: "taco-fiesta", coverImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400", rating: 4.4, deliveryTime: "20-30", cuisine: "Mexican", priceRange: "$", isOpen: true },
];

export default function RestaurantsPage() {
  const [search, setSearch] = React.useState("");
  const [restaurants, setRestaurants] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchRestaurants() {
      try {
        const { data } = await api.get("/restaurants?limit=20");
        const list = data?.data || data || [];
        if (list.length > 0) {
          setRestaurants(list);
        } else {
          setRestaurants(fallbackRestaurants);
        }
      } catch (err) {
        console.error("Failed to load restaurants from API, using fallback data", err);
        setRestaurants(fallbackRestaurants);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter(
    (r) =>
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Restaurants</h1>
        <p className="mt-1 text-muted-foreground">Discover amazing food near you</p>
      </div>

      <div className="mb-8 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search restaurants or cuisines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 pl-12"
          />
        </div>
        <Button variant="outline" size="icon" className="h-12 w-12 shrink-0 rounded-xl">
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((restaurant, i) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link href={`/restaurants/${restaurant.slug || restaurant.id}`}>
                <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative h-40 overflow-hidden bg-muted">
                    {(restaurant.coverImage || restaurant.logo || restaurant.image) ? (
                      <img
                        src={restaurant.coverImage || restaurant.logo || restaurant.image}
                        alt={restaurant.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-secondary text-5xl">
                        🏪
                      </div>
                    )}
                    {restaurant.isOpen === false && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <span className="rounded-full bg-white px-4 py-1 text-sm font-medium text-black">
                          Closed
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur dark:bg-black/90">
                        <Clock className="mr-1 h-3 w-3" />
                        {restaurant.deliveryTime || "20-30"} min
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-1 flex items-start justify-between">
                      <h3 className="font-semibold truncate max-w-[70%]">{restaurant.name}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium">
                          {typeof restaurant.rating === "number" ? restaurant.rating.toFixed(1) : restaurant.rating || "4.5"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{restaurant.cuisine || "Multi-cuisine"}</span>
                      <span>•</span>
                      <span>{restaurant.priceRange || "$$"}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
