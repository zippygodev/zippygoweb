'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency, formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ErrorState } from '@/components/ui/error-state';
import { useCart } from '../../CustomerLayoutClient';
import {
  Star,
  Clock,
  MapPin,
  Phone,
  Clock3,
  Plus,
  Minus,
  ShoppingCart,
  ChevronLeft,
  Info,
  MessageSquare,
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  variants: string[];
  popular: boolean;
}

interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

const restaurants: Record<string, {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: number;
  minOrder: number;
  coverImage: string;
  logo: string;
  openingHours: string;
  location: string;
  phone: string;
  categories: string[];
  menuItems: MenuItem[];
  reviews: Review[];
}> = {
  '1': {
    id: '1',
    name: 'Pizza Palace',
    cuisine: 'Italian • Pizza',
    rating: 4.8,
    deliveryTime: 25,
    minOrder: 199,
    coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    openingHours: '10:00 AM - 11:00 PM',
    location: 'Food Court, Level 2, Stall 12',
    phone: '+91 98765 43210',
    categories: ['Pizzas', 'Pastas', 'Sides', 'Beverages'],
    menuItems: [
      { id: 'm1', name: 'Margherita Pizza', description: 'Fresh mozzarella, tomato sauce, basil on classic crust', price: 349, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=300&fit=crop', category: 'Pizzas', variants: ['Regular', 'Large', 'Extra Large'], popular: true },
      { id: 'm2', name: 'Pepperoni Pizza', description: 'Classic pepperoni with mozzarella and signature sauce', price: 449, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=300&fit=crop', category: 'Pizzas', variants: ['Regular', 'Large', 'Extra Large'], popular: true },
      { id: 'm3', name: 'BBQ Chicken Pizza', description: 'Grilled chicken, BBQ sauce, red onions, cilantro', price: 499, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop', category: 'Pizzas', variants: ['Regular', 'Large'], popular: false },
      { id: 'm4', name: 'Penne Arrabbiata', description: 'Penne in spicy tomato sauce with garlic and chili', price: 299, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=300&fit=crop', category: 'Pastas', variants: ['Regular', 'Large'], popular: false },
      { id: 'm5', name: 'Spaghetti Carbonara', description: 'Creamy egg sauce, pancetta, parmesan, black pepper', price: 379, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&h=300&fit=crop', category: 'Pastas', variants: ['Regular', 'Large'], popular: true },
      { id: 'm6', name: 'Garlic Breadsticks', description: 'Crispy breadsticks with garlic butter and herbs', price: 149, image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa125d2?w=300&h=300&fit=crop', category: 'Sides', variants: ['4 Pcs', '8 Pcs'], popular: false },
      { id: 'm7', name: 'Coke (500ml)', description: 'Chilled Coca-Cola', price: 59, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=300&fit=crop', category: 'Beverages', variants: ['Regular'], popular: false },
    ],
    reviews: [
      { id: 'r1', user: 'Rahul S.', avatar: '', rating: 5, comment: 'Best pizza in town! The crust is perfectly crispy and the toppings are generous.', date: '2 days ago' },
      { id: 'r2', user: 'Priya M.', avatar: '', rating: 4, comment: 'Great pasta, loved the carbonara. Delivery was quick too!', date: '1 week ago' },
      { id: 'r3', user: 'Amit K.', avatar: '', rating: 5, comment: 'The BBQ chicken pizza is a must try! Will order again.', date: '2 weeks ago' },
    ],
  },
  '2': {
    id: '2',
    name: 'Sushi Master',
    cuisine: 'Japanese • Sushi',
    rating: 4.7,
    deliveryTime: 30,
    minOrder: 299,
    coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop',
    openingHours: '11:00 AM - 10:30 PM',
    location: 'Food Court, Level 1, Stall 5',
    phone: '+91 98765 43211',
    categories: ['Sushi Rolls', 'Sashimi', 'Appetizers', 'Drinks'],
    menuItems: [
      { id: 'm8', name: 'California Roll', description: 'Crab, avocado, cucumber, masago', price: 449, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=300&fit=crop', category: 'Sushi Rolls', variants: ['6 Pcs', '12 Pcs'], popular: true },
      { id: 'm9', name: 'Salmon Nigiri', description: 'Fresh Atlantic salmon over seasoned rice', price: 399, image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=300&h=300&fit=crop', category: 'Sashimi', variants: ['2 Pcs', '4 Pcs'], popular: true },
      { id: 'm10', name: 'Edamame', description: 'Steamed soy beans with sea salt', price: 199, image: 'https://images.unsplash.com/photo-1564093497595-593b96d80571?w=300&h=300&fit=crop', category: 'Appetizers', variants: ['Regular'], popular: false },
    ],
    reviews: [
      { id: 'r4', user: 'Neha G.', avatar: '', rating: 5, comment: 'Authentic Japanese flavors! The salmon was incredibly fresh.', date: '3 days ago' },
      { id: 'r5', user: 'Vikram P.', avatar: '', rating: 4, comment: 'Great sushi, generous portions. Highly recommend the California roll.', date: '5 days ago' },
    ],
  },
};

function ItemCard({ item, onAdd }: { item: MenuItem; onAdd: (variant: string, quantity: number) => void }) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(item.variants[0] ?? '');
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAdd(selectedVariant, quantity);
    setShowDialog(false);
    setQuantity(1);
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowDialog(true)}
        className="flex w-full gap-3 rounded-xl border bg-card p-3 text-left shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="truncate text-sm font-semibold">{item.name}</h4>
              {item.popular && <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">Popular</Badge>}
            </div>
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{item.description}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-primary">{formatCurrency(item.price)}</span>
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
              <Plus className="h-3 w-3" /> Add
            </span>
          </div>
        </div>
      </motion.button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-sm rounded-2xl p-0">
          <div className="overflow-hidden rounded-t-2xl">
            <img src={item.image} alt={item.name} className="h-48 w-full object-cover" />
          </div>
          <div className="space-y-4 p-5">
            <DialogHeader className="space-y-1 p-0 text-left">
              <DialogTitle className="text-xl">{item.name}</DialogTitle>
              <DialogDescription className="text-sm">{item.description}</DialogDescription>
            </DialogHeader>

            <div>
              <p className="mb-2 text-sm font-medium">Size / Variant</p>
              <div className="flex gap-2">
                {item.variants.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    className={cn(
                      'rounded-lg border px-3.5 py-2 text-xs font-medium transition-all',
                      selectedVariant === v
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/20 bg-muted text-muted-foreground hover:border-muted-foreground/40'
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Quantity</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                {formatCurrency(item.price * quantity)}
              </span>
              <Button onClick={handleAdd} className="rounded-xl px-6">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function RestaurantSkeleton() {
  return (
    <div>
      <Skeleton className="h-56 w-full" />
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-20 w-20 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [loading, setLoading] = useState(true);

  const slug = params['slug'] as string;
  const restaurant = restaurants[slug];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <RestaurantSkeleton />;

  if (!restaurant) {
    return (
      <div className="p-4">
        <ErrorState
          title="Restaurant not found"
          description="The restaurant you're looking for doesn't exist."
          onRetry={() => router.push('/customer/restaurants')}
        />
      </div>
    );
  }

  const groupedItems = restaurant.categories.map((cat) => ({
    category: cat,
    items: restaurant.menuItems.filter((i) => i.category === cat),
  }));

  return (
    <div className="pb-8">
      {/* Cover Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end gap-3">
            <Avatar className="h-14 w-14 border-2 border-white/50 ring-2 ring-white/20">
              <AvatarImage src={restaurant.logo} />
              <AvatarFallback className="text-lg">{restaurant.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-white">
              <h1 className="text-xl font-bold">{restaurant.name}</h1>
              <p className="text-sm text-white/80">{restaurant.cuisine}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="flex items-center gap-4 border-b bg-card px-4 py-3">
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{restaurant.rating}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatTime(restaurant.deliveryTime)}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Min. <span className="font-medium text-primary">₹{restaurant.minOrder}</span>
        </div>
      </div>

      {/* Info Sheet */}
      <div className="mx-4 mt-4 flex items-center justify-between rounded-xl border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{restaurant.openingHours}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{restaurant.location}</span>
        </div>
        <button className="text-primary">
          <Info className="h-4 w-4" />
        </button>
      </div>

      {/* Menu Tabs */}
      <div className="mt-4 px-4">
        <Tabs defaultValue={restaurant.categories[0]}>
          <TabsList className="w-full overflow-x-auto scrollbar-hide">
            {restaurant.categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="text-xs">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
          {groupedItems.map((group) => (
            <TabsContent key={group.category} value={group.category} className="mt-3 space-y-3">
              {group.items.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No items in this category</p>
              ) : (
                group.items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onAdd={(variant, quantity) => {
                      addItem({
                        restaurantId: restaurant.id,
                        restaurantName: restaurant.name,
                        menuItemId: item.id,
                        name: item.name,
                        image: item.image,
                        variant,
                        price: item.price,
                        quantity,
                      });
                    }}
                  />
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Reviews */}
      <div className="mt-6 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold">Reviews ({restaurant.reviews.length})</h3>
          <Button variant="ghost" size="sm" className="text-xs text-primary">
            <MessageSquare className="mr-1 h-3.5 w-3.5" /> Write a Review
          </Button>
        </div>
        <div className="space-y-3">
          {restaurant.reviews.map((review) => (
            <div key={review.id} className="rounded-xl border bg-card p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{review.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{review.user}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-3 w-3',
                            i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
