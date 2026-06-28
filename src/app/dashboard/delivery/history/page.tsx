'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Star,
  IndianRupee,
  Bike,
  Clock,
  MapPin,
  User,
  Utensils,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Download,
} from 'lucide-react';

interface DeliveryHistoryItem {
  id: string;
  orderNumber: string;
  restaurant: string;
  customerName: string;
  customerAddress: string;
  date: string;
  time: string;
  amount: number;
  rating: number;
  distance: string;
  duration: string;
  items: string[];
  status: 'completed' | 'cancelled';
}

const historyData: DeliveryHistoryItem[] = [
  {
    id: '1',
    orderNumber: 'ZG-A1B2',
    restaurant: 'Punjab Dhaba',
    customerName: 'Amit Sharma',
    customerAddress: 'H-45, Sector 12, Noida',
    date: '2026-06-27',
    time: '12:30 PM',
    amount: 85,
    rating: 5,
    distance: '2.3 km',
    duration: '18 min',
    items: ['Butter Chicken', 'Garlic Naan (2)', 'Dal Makhani'],
    status: 'completed',
  },
  {
    id: '2',
    orderNumber: 'ZG-C3D4',
    restaurant: 'Sushi World',
    customerName: 'Priya Singh',
    customerAddress: 'Apt 301, Blue Tower, Sector 15',
    date: '2026-06-27',
    time: '11:15 AM',
    amount: 65,
    rating: 4,
    distance: '3.1 km',
    duration: '22 min',
    items: ['California Roll', 'Miso Soup', 'Edamame'],
    status: 'completed',
  },
  {
    id: '3',
    orderNumber: 'ZG-E5F6',
    restaurant: 'Pizza Planet',
    customerName: 'Rohit Verma',
    customerAddress: 'House 12, Green Park, Sector 22',
    date: '2026-06-27',
    time: '10:00 AM',
    amount: 75,
    rating: 5,
    distance: '1.8 km',
    duration: '15 min',
    items: ['Margherita Pizza', 'Garlic Bread', 'Coke'],
    status: 'completed',
  },
  {
    id: '4',
    orderNumber: 'ZG-G7H8',
    restaurant: 'Biryani Blues',
    customerName: 'Sneha Patel',
    customerAddress: 'C-78, Sector 11, Noida',
    date: '2026-06-26',
    time: '7:45 PM',
    amount: 90,
    rating: 3,
    distance: '4.2 km',
    duration: '28 min',
    items: ['Hyderabadi Biryani', 'Raita', 'Salad'],
    status: 'completed',
  },
  {
    id: '5',
    orderNumber: 'ZG-I9J0',
    restaurant: 'Taco Bell',
    customerName: 'Vikas Gupta',
    customerAddress: 'D-12, Sector 44, Noida',
    date: '2026-06-26',
    time: '6:30 PM',
    amount: 55,
    rating: 4,
    distance: '2.8 km',
    duration: '20 min',
    items: ['Crunchy Taco (3)', 'Nachos', 'Quesadilla'],
    status: 'completed',
  },
  {
    id: '6',
    orderNumber: 'ZG-K1L2',
    restaurant: 'Dominoes',
    customerName: 'Neha Kapoor',
    customerAddress: 'F-34, Sector 18, Noida',
    date: '2026-06-25',
    time: '8:00 PM',
    amount: 70,
    rating: 5,
    distance: '1.5 km',
    duration: '12 min',
    items: ['Pepperoni Pizza', 'Cheese Burst', 'Pepsi'],
    status: 'completed',
  },
  {
    id: '7',
    orderNumber: 'ZG-M3N4',
    restaurant: 'Subway',
    customerName: 'Arun Mehta',
    customerAddress: 'E-56, Sector 27, Noida',
    date: '2026-06-25',
    time: '1:15 PM',
    amount: 60,
    rating: 4,
    distance: '3.5 km',
    duration: '25 min',
    items: ['Footlong Sub', 'Cookies (2)', 'Smoothie'],
    status: 'completed',
  },
  {
    id: '8',
    orderNumber: 'ZG-O5P6',
    restaurant: 'McDonalds',
    customerName: 'Ravi Joshi',
    customerAddress: 'A-78, Sector 33, Noida',
    date: '2026-06-24',
    time: '9:30 PM',
    amount: 50,
    rating: 2,
    distance: '2.0 km',
    duration: '16 min',
    items: ['McVeggie Meal', 'Fries', 'Coke'],
    status: 'cancelled',
  },
];

function HistoryCard({ item }: { item: DeliveryHistoryItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border bg-card"
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
              item.status === 'completed' ? 'bg-emerald-500/10' : 'bg-red-500/10'
            )}>
              {item.status === 'completed' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <Bike className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold">{item.restaurant}</p>
                <Badge variant="outline" className="text-[10px]">#{item.orderNumber}</Badge>
                <Badge className={cn(
                  'h-5 text-[10px]',
                  item.status === 'completed' ? 'bg-emerald-500' : 'bg-red-500'
                )}>
                  {item.status === 'completed' ? 'Completed' : 'Cancelled'}
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {item.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {item.distance}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="text-base font-bold text-emerald-500">₹{item.amount}</p>
            <div className="mt-0.5 flex items-center gap-0.5 justify-end">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-3 w-3',
                    i < item.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted'
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-1 text-xs text-muted-foreground hover:bg-muted transition-colors"
        >
          {expanded ? (
            <><ChevronUp className="h-3.5 w-3.5" /> Less Details</>
          ) : (
            <><ChevronDown className="h-3.5 w-3.5" /> More Details</>
          )}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Separator className="my-3" />
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{item.customerName}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{item.customerAddress}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Utensils className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{item.items.join(', ')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                  <span>Delivery took {item.duration}</span>
                </div>
                {item.rating <= 2 && (
                  <div className="mt-2 rounded-lg bg-amber-500/10 p-2.5 text-xs text-amber-600">
                    Low rating received. Tap to review feedback.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const filteredData = historyData
    .filter((item) => {
      if (filter === 'completed') return item.status === 'completed';
      if (filter === 'cancelled') return item.status === 'cancelled';
      return true;
    })
    .filter((item) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.restaurant.toLowerCase().includes(q) ||
        item.orderNumber.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time).getTime();
      const dateB = new Date(b.date + ' ' + b.time).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const totalEarnings = filteredData
    .filter((i) => i.status === 'completed')
    .reduce((sum, i) => sum + i.amount, 0);

  const avgRating = filteredData
    .filter((i) => i.status === 'completed')
    .reduce((sum, i, _, arr) => sum + i.rating / arr.length, 0);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Delivery History</h1>
        <p className="text-sm text-muted-foreground">View your past deliveries</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold">{filteredData.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Earned</p>
            <p className="text-lg font-bold text-emerald-500">₹{totalEarnings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Rating</p>
            <p className="text-lg font-bold">{avgRating.toFixed(1)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by restaurant, order, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border">
            {(['all', 'completed', 'cancelled'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-2 text-xs font-medium transition-colors',
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                {f === 'all' ? 'All' : f === 'completed' ? 'Completed' : 'Cancelled'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
          </button>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Bike className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">No history found</p>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            {searchQuery
              ? 'No deliveries match your search. Try a different term.'
              : 'Your completed deliveries will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredData.map((item) => (
              <HistoryCard key={item.id} item={item} />
            ))}
          </AnimatePresence>

          <div className="flex justify-center pt-2">
            <Button variant="outline" className="gap-2" disabled>
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
