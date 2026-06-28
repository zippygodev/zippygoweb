'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/toast';
import {
  Plus,
  Tag,
  Percent,
  IndianRupee,
  Trash2,
  Edit3,
  Copy,
  CalendarDays,
  Clock,
  Users,
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minOrder: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  active: boolean;
}

const initialOffers: Offer[] = [
  { id: '1', code: 'WELCOME50', title: 'Welcome Offer', description: '50% off on your first order', discountType: 'PERCENTAGE', discountValue: 50, minOrder: 299, maxDiscount: 150, usageLimit: 100, usedCount: 45, validFrom: '2024-06-01', validTo: '2024-12-31', active: true },
  { id: '2', code: 'FLAT100', title: 'Flat ₹100 Off', description: 'Flat ₹100 discount on orders above ₹499', discountType: 'FLAT', discountValue: 100, minOrder: 499, maxDiscount: 100, usageLimit: 200, usedCount: 78, validFrom: '2024-06-15', validTo: '2024-08-15', active: true },
  { id: '3', code: 'WEEKEND25', title: 'Weekend Special', description: '25% off on weekends', discountType: 'PERCENTAGE', discountValue: 25, minOrder: 399, maxDiscount: 200, usageLimit: 50, usedCount: 12, validFrom: '2024-07-01', validTo: '2024-09-30', active: true },
  { id: '4', code: 'BULK20', title: 'Bulk Order Discount', description: '20% off on orders above ₹999', discountType: 'PERCENTAGE', discountValue: 20, minOrder: 999, maxDiscount: 500, usageLimit: 30, usedCount: 5, validFrom: '2024-06-01', validTo: '2024-07-31', active: false },
  { id: '5', code: 'FREEDEL', title: 'Free Delivery', description: 'Free delivery on orders above ₹299', discountType: 'FLAT', discountValue: 40, minOrder: 299, maxDiscount: 40, usageLimit: 500, usedCount: 312, validFrom: '2024-06-01', validTo: '2024-07-15', active: true },
];

const emptyOffer: Offer = {
  id: '', code: '', title: '', description: '', discountType: 'PERCENTAGE', discountValue: 0,
  minOrder: 0, maxDiscount: 0, usageLimit: 0, usedCount: 0, validFrom: '', validTo: '', active: true,
};

function OfferCard({ offer, onEdit, onDelete, onToggle, onDuplicate }: { offer: Offer; onEdit: (o: Offer) => void; onDelete: (id: string) => void; onToggle: (id: string) => void; onDuplicate: (offer: Offer) => void }) {
  const now = new Date();
  const validFrom = new Date(offer.validFrom);
  const validTo = new Date(offer.validTo);
  const isExpired = validTo < now;
  const isUpcoming = validFrom > now;
  const usagePercent = Math.round((offer.usedCount / offer.usageLimit) * 100);

  const statusBadge = !offer.active
    ? { label: 'Disabled', variant: 'outline' as const }
    : isExpired
      ? { label: 'Expired', variant: 'destructive' as const }
      : isUpcoming
        ? { label: 'Scheduled', variant: 'warning' as const }
        : { label: 'Active', variant: 'success' as const };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'rounded-xl border bg-card p-5 transition-all hover:shadow-md',
        !offer.active && 'opacity-60'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            offer.discountType === 'PERCENTAGE' ? 'bg-purple-100 dark:bg-purple-950/50' : 'bg-emerald-100 dark:bg-emerald-950/50'
          )}>
            {offer.discountType === 'PERCENTAGE' ? (
              <Percent className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            ) : (
              <IndianRupee className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold">{offer.title}</span>
              <Badge variant={statusBadge.variant} className="text-[10px]">{statusBadge.label}</Badge>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{offer.description}</p>
            <div className="mt-1 flex items-center gap-2">
              <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono font-bold text-primary">
                {offer.code}
              </code>
              <span className="text-xs text-muted-foreground">
                {offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Min Order</p>
          <p className="font-medium">{formatCurrency(offer.minOrder)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Max Discount</p>
          <p className="font-medium">{offer.maxDiscount > 0 ? formatCurrency(offer.maxDiscount) : 'Unlimited'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Valid From</p>
          <p className="font-medium text-xs">{offer.validFrom}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Valid To</p>
          <p className="font-medium text-xs">{offer.validTo}</p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Usage: {offer.usedCount}/{offer.usageLimit}</span>
          <span>{usagePercent}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              usagePercent >= 80 ? 'bg-red-500' : usagePercent >= 50 ? 'bg-amber-500' : 'bg-primary'
            )}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Switch checked={offer.active} onCheckedChange={() => onToggle(offer.id)} />
          <span className="text-xs text-muted-foreground ml-2">{offer.active ? 'Active' : 'Inactive'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onEdit(offer)}>
            <Edit3 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onDuplicate(offer)}>
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => onDelete(offer.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function OfferDialog({ open, onOpenChange, offer, onSave }: { open: boolean; onOpenChange: (open: boolean) => void; offer: Offer; onSave: (offer: Offer) => void }) {
  const [form, setForm] = useState<Offer>(offer);

  const handleSubmit = () => {
    if (!form.title || !form.code || !form.discountValue || !form.validFrom || !form.validTo) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    onSave({ ...form, id: form.id || crypto.randomUUID() });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{offer.id ? 'Edit Offer' : 'Create Offer'}</DialogTitle>
          <DialogDescription>
            {offer.id ? 'Update the offer details' : 'Create a new discount offer or coupon'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="e.g. Weekend Special" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Coupon Code</label>
              <Input value={form.code} onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))} placeholder="e.g. WEEKEND25" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Brief description" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Discount Type</label>
              <Select value={form.discountType} onValueChange={(value: 'PERCENTAGE' | 'FLAT') => setForm((prev) => ({ ...prev, discountType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                  <SelectItem value="FLAT">Flat (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Discount Value</label>
              <Input type="number" value={form.discountValue || ''} onChange={(e) => setForm((prev) => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))} placeholder={form.discountType === 'PERCENTAGE' ? 'e.g. 25' : 'e.g. 100'} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Min Order (₹)</label>
              <Input type="number" value={form.minOrder || ''} onChange={(e) => setForm((prev) => ({ ...prev, minOrder: parseFloat(e.target.value) || 0 }))} placeholder="e.g. 299" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Discount (₹)</label>
              <Input type="number" value={form.maxDiscount || ''} onChange={(e) => setForm((prev) => ({ ...prev, maxDiscount: parseFloat(e.target.value) || 0 }))} placeholder="0 = unlimited" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Valid From</label>
              <Input type="date" value={form.validFrom} onChange={(e) => setForm((prev) => ({ ...prev, validFrom: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Valid To</label>
              <Input type="date" value={form.validTo} onChange={(e) => setForm((prev) => ({ ...prev, validTo: e.target.value }))} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Usage Limit</label>
              <Input type="number" value={form.usageLimit || ''} onChange={(e) => setForm((prev) => ({ ...prev, usageLimit: parseInt(e.target.value) || 0 }))} placeholder="e.g. 100" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.active} onCheckedChange={(checked) => setForm((prev) => ({ ...prev, active: checked }))} />
                Active
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>{offer.id ? 'Save Changes' : 'Create Offer'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [editOffer, setEditOffer] = useState<Offer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = (offer: Offer) => {
    setOffers((prev) => {
      const existing = prev.findIndex((o) => o.id === offer.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = offer;
        return updated;
      }
      return [...prev, offer];
    });
    toast({ title: offer.id ? 'Offer Updated' : 'Offer Created', description: `${offer.title} has been ${offer.id ? 'updated' : 'created'}.`, variant: 'success' });
    setEditOffer(null);
  };

  const handleToggle = (id: string) => {
    setOffers((prev) => prev.map((o) => o.id === id ? { ...o, active: !o.active } : o));
    const offer = offers.find((o) => o.id === id);
    toast({ title: 'Offer Updated', description: `${offer?.title} is now ${offer?.active ? 'disabled' : 'active'}`, variant: 'success' });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setOffers((prev) => prev.filter((o) => o.id !== deleteId));
    toast({ title: 'Offer Deleted', variant: 'destructive' });
    setDeleteId(null);
  };

  const handleDuplicate = (offer: Offer) => {
    const newOffer = { ...offer, id: crypto.randomUUID(), code: `${offer.code}COPY`, title: `${offer.title} (Copy)`, usedCount: 0 };
    setOffers((prev) => [...prev, newOffer]);
    toast({ title: 'Offer Duplicated', variant: 'success' });
  };

  const handleAdd = () => {
    setEditOffer(emptyOffer);
    setDialogOpen(true);
  };

  const activeCount = offers.filter((o) => o.active && new Date(o.validTo) >= new Date()).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Offers & Coupons</h1>
          <p className="text-sm text-muted-foreground">Create and manage promotional offers</p>
        </div>
        <Button size="sm" className="h-9" onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Create Offer
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Active Offers', value: activeCount, icon: Tag, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Total Offers', value: offers.length, icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-950/50' },
          { label: 'Total Usage', value: offers.reduce((sum, o) => sum + o.usedCount, 0), icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-950/50' },
          { label: 'Avg Discount', value: '32%', icon: Percent, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-950/50' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={cn('rounded-lg p-2.5', stat.bg)}>
                  <Icon className={cn('h-5 w-5', stat.color)} />
                </div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onEdit={(o) => { setEditOffer(o); setDialogOpen(true); }}
              onDelete={(id) => setDeleteId(id)}
              onToggle={handleToggle}
              onDuplicate={handleDuplicate}
            />
          ))}
        </AnimatePresence>
      </div>

      <OfferDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        offer={editOffer || emptyOffer}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Offer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this offer? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
