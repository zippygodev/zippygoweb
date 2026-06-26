"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Heart, Star, Clock, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

// Fallback favorites for testing
const fallbackFavorites = [
  {
    id: "fav_fallback_1",
    restaurantId: "1",
    restaurant: {
      id: "1",
      name: "Pizza Paradise",
      coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
      rating: 4.5,
      deliveryTime: "25-35 min",
      cuisine: "Italian",
      priceRange: "$$",
      slug: "pizza-paradise",
    },
  },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get("/favorites");
      setFavorites(data || []);
    } catch (err) {
      console.error("Failed to load favorites from API, using fallback data", err);
      setFavorites(fallbackFavorites);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (e: React.MouseEvent, restaurantId: string) => {
    e.preventDefault(); // Prevent navigating to restaurant detail page
    try {
      await api.post("/favorites/toggle", { restaurantId });
      setFavorites((prev) => prev.filter((fav) => fav.restaurantId !== restaurantId));
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error("Failed to remove favorite");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
        <p className="mt-1 text-muted-foreground">Your saved restaurants</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : favorites.length === 0 ? (
        <div className="py-16 text-center border border-dashed rounded-2xl bg-muted/25">
          <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No favorites yet</h3>
          <p className="text-muted-foreground">Save restaurants you love</p>
          <Link href="/restaurants">
            <Button className="mt-4">Browse Restaurants</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav, i) => {
            const rest = fav.restaurant;
            if (!rest) return null;
            return (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/restaurants/${rest.slug || rest.id}`}>
                  <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative h-40 overflow-hidden bg-muted">
                      {(rest.coverImage || rest.logo || rest.image) ? (
                        <img
                          src={rest.coverImage || rest.logo || rest.image}
                          alt={rest.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-4xl">🏪</div>
                      )}
                      <button
                        onClick={(e) => handleRemoveFavorite(e, fav.restaurantId)}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur transition-transform hover:scale-110 active:scale-95 dark:bg-black/80 text-red-500"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold truncate max-w-[70%]">{rest.name}</h3>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium">
                            {typeof rest.rating === "number" ? rest.rating.toFixed(1) : rest.rating || "4.5"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{rest.cuisine || "Multi-cuisine"}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {rest.deliveryTime || "20-30"} min
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
