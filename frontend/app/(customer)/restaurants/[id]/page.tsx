"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Plus,
  Heart,
  ShoppingCart,
  ChevronRight,
  Loader2,
} from "lucide-react";

// Hardcoded fallback data in case API fails or database is empty
const fallbackRestaurant = {
  id: "1",
  name: "Pizza Paradise",
  logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
  coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200",
  rating: 4.5,
  deliveryTime: "25-35 min",
  cuisine: "Italian",
  priceRange: "$$",
  address: "Food Court, Level 2",
  description: "Authentic Italian pizzas made with fresh ingredients and traditional recipes.",
  categories: [
    {
      id: "cat_1",
      name: "Pizzas",
      products: [
        { id: "m1", name: "Margherita Pizza", description: "Fresh mozzarella, tomato sauce, basil", price: 349, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300", popular: true },
        { id: "m2", name: "Pepperoni Pizza", description: "Double pepperoni, mozzarella, oregano", price: 449, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300", popular: true },
      ],
    },
    {
      id: "cat_2",
      name: "Pasta",
      products: [
        { id: "m3", name: "Pasta Carbonara", description: "Creamy sauce, pancetta, parmesan", price: 399, image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300", popular: false },
      ],
    },
  ],
};

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slugOrId = params?.id as string;
  
  const { addItem, items, getItemCount, getTotal } = useCartStore();
  
  const [restaurant, setRestaurant] = React.useState<any>(null);
  const [activeCategory, setActiveCategory] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [favorited, setFavorited] = React.useState(false);
  const [togglingFavorite, setTogglingFavorite] = React.useState(false);

  React.useEffect(() => {
    async function loadData() {
      if (!slugOrId) return;
      try {
        setLoading(true);
        // 1. Fetch restaurant details
        const { data } = await api.get(`/restaurants/${slugOrId}`);
        if (data) {
          setRestaurant(data);
          if (data.categories && data.categories.length > 0) {
            setActiveCategory(data.categories[0].name);
          }
          
          // 2. Fetch favorite status
          try {
            const favRes = await api.get(`/favorites/status/${data.id}`);
            setFavorited(favRes.data?.favorited || false);
          } catch (favErr) {
            // Ignore if auth is not ready or API fails
          }
        } else {
          setRestaurant(fallbackRestaurant);
          setActiveCategory(fallbackRestaurant.categories[0].name);
        }
      } catch (err) {
        console.error("Failed to fetch restaurant, using local mock", err);
        setRestaurant(fallbackRestaurant);
        setActiveCategory(fallbackRestaurant.categories[0].name);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slugOrId]);

  const handleToggleFavorite = async () => {
    if (!restaurant || togglingFavorite) return;
    try {
      setTogglingFavorite(true);
      const { data } = await api.post("/favorites/toggle", { restaurantId: restaurant.id });
      setFavorited(data.favorited);
      toast.success(data.message || (data.favorited ? "Added to favorites" : "Removed from favorites"));
    } catch (err: any) {
      if (err?.response?.status === 401) {
        toast.error("Please login to save favorites");
      } else {
        toast.error("Failed to toggle favorite");
      }
    } finally {
      setTogglingFavorite(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold">Restaurant not found</h2>
        <Button className="mt-4" onClick={() => router.push("/restaurants")}>Back to Restaurants</Button>
      </div>
    );
  }

  const currentCategoryData = restaurant.categories?.find((c: any) => c.name === activeCategory);
  const currentItems = currentCategoryData?.products || [];

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      productId: item.id,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      name: item.name,
      image: item.image || item.coverImage || "",
      price: item.price,
      quantity: 1,
    });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="pb-24">
      {/* Cover Image */}
      <div className="relative h-64 overflow-hidden sm:h-80 lg:h-96">
        <img
          src={restaurant.coverImage || restaurant.logo || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200"}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur dark:bg-black/90"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        {/* Restaurant Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative -mt-20 mb-8 rounded-2xl border bg-white p-6 shadow-xl dark:bg-black"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                <button
                  onClick={handleToggleFavorite}
                  disabled={togglingFavorite}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border bg-background transition-colors hover:bg-accent ${
                    favorited ? "text-red-500" : "text-muted-foreground"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${favorited ? "fill-current" : ""}`} />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">
                    {typeof restaurant.rating === "number" ? restaurant.rating.toFixed(1) : restaurant.rating || "4.5"}
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {restaurant.deliveryTime || "20-30"} min
                </div>
                <span>•</span>
                <span>{restaurant.cuisine || "Multi-cuisine"}</span>
                <span>•</span>
                <span>{restaurant.priceRange || "$$"}</span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {restaurant.address || "Main Food Court"}
              </div>
              <p className="mt-3 text-muted-foreground">{restaurant.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Menu Categories */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {restaurant.categories?.map((cat: any) => (
            <button
              key={cat.id || cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activeCategory === cat.name
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        {currentItems.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No items in this category.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currentItems.map((item: any, i: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="group overflow-hidden transition-all hover:shadow-md">
                  <div className="flex">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden bg-muted">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-3xl">🍔</div>
                      )}
                      {item.isPopular && (
                        <Badge className="absolute left-1 top-1 bg-amber-500 text-[10px] text-white">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-3 min-w-0">
                      <div>
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-amber-600 dark:text-primary">
                          {formatPrice(item.price)}
                        </span>
                        <Button
                          size="sm"
                          className="h-8 w-8 rounded-full p-0"
                          onClick={() => handleAddToCart(item)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Bar */}
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white p-4 shadow-2xl dark:bg-black"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span className="font-medium">{getItemCount()} item(s)</span>
              </div>
              <span className="text-lg font-bold text-amber-600 dark:text-primary">
                {formatPrice(getTotal())}
              </span>
            </div>
            <Link href="/cart">
              <Button size="lg" className="gap-2">
                View Cart <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
