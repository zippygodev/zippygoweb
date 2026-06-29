'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
  Plus,
  Minus,
  ShoppingCart,
  ChevronLeft,
  Info,
  MessageSquare,
  Clock3,
} from 'lucide-react';
import { getRestaurantBySlug } from '@/actions/customer/restaurants';
import toast from 'react-hot-toast';

function ItemCard({
  item,
  restaurantId,
  restaurantName,
  onAdd,
}: {
  item: any;
  restaurantId: string;
  restaurantName: string;
  onAdd: (variant: any, quantity: number) => void;
}) {
  const [showDialog, setShowDialog] = useState(false);
  const variants = item.variants || [];
  const [selectedVariant, setSelectedVariant] = useState<any>(variants[0] || null);
  const [quantity, setQuantity] = useState(1);

  const price = selectedVariant ? Number(selectedVariant.price) : Number(item.price);

  const handleAdd = () => {
    onAdd(selectedVariant, quantity);
    setShowDialog(false);
    setQuantity(1);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowDialog(true)}
        className="flex w-full gap-3 rounded-xl border bg-card p-3 text-left shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
          {item.imageUrl && (
            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="truncate text-sm font-semibold">{item.name}</h4>
              {item.isVegetarian && (
                <span className="h-3 w-3 rounded-full border border-green-600 bg-white p-0.5 flex items-center justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                </span>
              )}
            </div>
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{item.description}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-primary">{formatCurrency(Number(item.price))}</span>
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
              <Plus className="h-3 w-3" /> Add
            </span>
          </div>
        </div>
      </motion.button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-sm rounded-2xl p-0">
          <div className="overflow-hidden rounded-t-2xl bg-muted">
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.name} className="h-48 w-full object-cover" />
            )}
          </div>
          <div className="space-y-4 p-5">
            <DialogHeader className="space-y-1 p-0 text-left">
              <DialogTitle className="text-xl">{item.name}</DialogTitle>
              <DialogDescription className="text-sm">{item.description}</DialogDescription>
            </DialogHeader>

            {variants.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium">Size / Variant</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={cn(
                        'rounded-lg border px-3.5 py-2 text-xs font-medium transition-all',
                        selectedVariant?.id === v.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground/20 bg-muted text-muted-foreground hover:border-muted-foreground/40'
                      )}
                    >
                      {v.name} (+₹{Number(v.price) - Number(item.price)})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 text-sm font-medium">Quantity</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border hover:bg-muted"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border hover:bg-muted"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                {formatCurrency(price * quantity)}
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
  const [restaurant, setRestaurant] = useState<any>(null);

  const slug = params['slug'] as string;

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await getRestaurantBySlug(slug);
        if (res.success && res.data) {
          setRestaurant(res.data);
        }
      } catch (err) {
        console.error('Error fetching restaurant:', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchRestaurant();
  }, [slug]);

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

  const activeCategories = restaurant.categories || [];

  return (
    <div className="pb-8">
      {/* Cover Image */}
      <div className="relative h-56 overflow-hidden bg-muted">
        {restaurant.coverImageUrl && (
          <img
            src={restaurant.coverImageUrl}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
        )}
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
              <AvatarImage src={restaurant.logoUrl || ''} />
              <AvatarFallback className="text-lg bg-primary text-white">{restaurant.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-white">
              <h1 className="text-xl font-bold">{restaurant.name}</h1>
              <p className="text-sm text-white/80">{restaurant.cuisineType || 'Cuisine'}</p>
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
          Min. <span className="font-medium text-primary">₹{Number(restaurant.minOrderAmount)}</span>
        </div>
      </div>

      {/* Info Sheet */}
      <div className="mx-4 mt-4 flex items-center justify-between rounded-xl border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{restaurant.openingTime} - {restaurant.closingTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground truncate max-w-[150px]">{restaurant.address}</span>
        </div>
        <button className="text-primary" onClick={() => toast.success(restaurant.description || '')}>
          <Info className="h-4 w-4" />
        </button>
      </div>

      {/* Menu Tabs */}
      <div className="mt-4 px-4">
        {activeCategories.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No menu categories available.</p>
        ) : (
          <Tabs defaultValue={activeCategories[0]?.name}>
            <TabsList className="w-full overflow-x-auto scrollbar-hide">
              {activeCategories.map((cat: any) => (
                <TabsTrigger key={cat.id} value={cat.name} className="text-xs">
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {activeCategories.map((cat: any) => (
              <TabsContent key={cat.id} value={cat.name} className="mt-3 space-y-3">
                {(!cat.products || cat.products.length === 0) ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No items in this category</p>
                ) : (
                  cat.products.map((item: any) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      restaurantId={restaurant.id}
                      restaurantName={restaurant.name}
                      onAdd={(variant, quantity) => {
                        addItem({
                          restaurantId: restaurant.id,
                          restaurantName: restaurant.name,
                          menuItemId: item.id,
                          name: item.name,
                          image: item.imageUrl || '',
                          variant: variant ? variant.name : 'Regular',
                          price: variant ? Number(variant.price) : Number(item.price),
                          quantity,
                        });
                      }}
                    />
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {/* Reviews */}
      <div className="mt-6 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold">Reviews ({restaurant.reviews?.length || 0})</h3>
          <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => toast.success('Reviews functionality connected.')}>
            <MessageSquare className="mr-1 h-3.5 w-3.5" /> Write a Review
          </Button>
        </div>
        <div className="space-y-3">
          {(!restaurant.reviews || restaurant.reviews.length === 0) ? (
            <p className="text-xs text-muted-foreground text-center py-4">No reviews yet. Be the first to order and review!</p>
          ) : (
            restaurant.reviews.map((review: any) => (
              <div key={review.id} className="rounded-xl border bg-card p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-muted text-muted-foreground">{getInitials(review.user?.name || 'U')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{review.user?.name || 'User'}</p>
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
                      <span className="text-xs text-muted-foreground">Just now</span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
