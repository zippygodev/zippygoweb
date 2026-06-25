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
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Plus,
  Minus,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";

const restaurant = {
  id: "1",
  name: "Pizza Paradise",
  image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
  coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200",
  rating: 4.5,
  deliveryTime: "25-35 min",
  cuisine: "Italian",
  priceRange: "$$",
  address: "Food Court, Level 2",
  description: "Authentic Italian pizzas made with fresh ingredients and traditional recipes.",
};

const menuItems = [
  { id: "m1", name: "Margherita Pizza", description: "Fresh mozzarella, tomato sauce, basil", price: 349, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300", category: "Pizzas", popular: true },
  { id: "m2", name: "Pepperoni Pizza", description: "Double pepperoni, mozzarella, oregano", price: 449, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300", category: "Pizzas", popular: true },
  { id: "m3", name: "Pasta Carbonara", description: "Creamy sauce, pancetta, parmesan", price: 399, image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300", category: "Pasta", popular: false },
  { id: "m4", name: "Caesar Salad", description: "Romaine, croutons, parmesan, caesar dressing", price: 249, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300", category: "Salads", popular: false },
  { id: "m5", name: "Garlic Bread", description: "Toasted ciabatta with garlic butter", price: 149, image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=300", category: "Sides", popular: true },
  { id: "m6", name: "Tiramisu", description: "Classic Italian coffee dessert", price: 299, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300", category: "Desserts", popular: false },
];

const categories = ["Pizzas", "Pasta", "Salads", "Sides", "Desserts"];

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, items, getItemCount, getTotal } = useCartStore();
  const [activeCategory, setActiveCategory] = React.useState("Pizzas");

  const filteredItems = menuItems.filter((item) => item.category === activeCategory);

  const handleAddToCart = (item: (typeof menuItems)[0]) => {
    addItem({
      id: item.id,
      productId: item.id,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      name: item.name,
      image: item.image,
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
          src={restaurant.coverImage}
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
            <div>
              <h1 className="text-3xl font-bold">{restaurant.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">{restaurant.rating}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {restaurant.deliveryTime}
                </div>
                <span>•</span>
                <span>{restaurant.cuisine}</span>
                <span>•</span>
                <span>{restaurant.priceRange}</span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {restaurant.address}
              </div>
              <p className="mt-3 text-muted-foreground">{restaurant.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Menu Categories */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group overflow-hidden transition-all hover:shadow-md">
                <div className="flex">
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {item.popular && (
                      <Badge className="absolute left-1 top-1 bg-amber-500 text-[10px] text-white">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-3">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emerald-600">
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
                <ShoppingCart className="h-5 w-5 text-emerald-500" />
                <span className="font-medium">{getItemCount()} item(s)</span>
              </div>
              <span className="text-lg font-bold text-emerald-600">
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
