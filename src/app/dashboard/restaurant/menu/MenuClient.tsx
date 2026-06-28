'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/toast';
import {
  Plus,
  Search,
  Filter,
  Utensils,
  ImagePlus,
  X,
  GripVertical,
  Trash2,
  Edit3,
  Copy,
  Eye,
  EyeOff,
  Leaf,
  Wheat,
  Milk,
  ChefHat,
  ArrowUpDown,
  Grid3X3,
  List,
  Tag,
  DollarSign,
  Check,
  Sparkles,
  Clock,
} from 'lucide-react';

interface Variant {
  id: string;
  name: string;
  price: number;
}

interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  variants: Variant[];
  addOns: AddOn[];
  dietary: {
    veg: boolean;
    vegan: boolean;
    glutenFree: boolean;
  };
  available: boolean;
  popular: boolean;
  sortOrder: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
  sortOrder: number;
}

// Removed mock data

const dietaryIcons: Record<string, { icon: any; label: string }> = {
  veg: { icon: Leaf, label: 'Vegetarian' },
  vegan: { icon: Leaf, label: 'Vegan' },
  glutenFree: { icon: Wheat, label: 'Gluten Free' },
};

const emptyMenuItem: MenuItem = {
  id: '',
  name: '',
  description: '',
  price: 0,
  category: 'Main Course',
  image: '',
  variants: [],
  addOns: [],
  dietary: { veg: false, vegan: false, glutenFree: false },
  available: true,
  popular: false,
  sortOrder: 0,
};

function MenuItemCard({ item, onEdit, onToggle, onDelete, onDuplicate }: { item: MenuItem; onEdit: (item: MenuItem) => void; onToggle: (id: string) => void; onDelete: (id: string) => void; onDuplicate: (item: MenuItem) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md',
        !item.available && 'opacity-60'
      )}
    >
      <div className="flex gap-4 p-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
          {item.popular && (
            <div className="absolute left-1 top-1 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-bold text-white">
              POPULAR
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold">{item.name}</span>
                {item.dietary.veg && <Leaf className="h-3.5 w-3.5 text-green-600" />}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
            </div>
            <span className="shrink-0 text-sm font-bold">{formatCurrency(item.price)}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">{item.category}</Badge>
            {item.variants.length > 0 && (
              <Badge variant="outline" className="text-[10px]">{item.variants.length} variants</Badge>
            )}
            {item.addOns.length > 0 && (
              <Badge variant="outline" className="text-[10px]">+{item.addOns.length} add-ons</Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onEdit(item)}>
            <Edit3 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onDuplicate(item)}>
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => onDelete(item.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">{item.available ? 'Active' : 'Hidden'}</span>
          <Switch checked={item.available} onCheckedChange={() => onToggle(item.id)} />
        </div>
      </div>
    </motion.div>
  );
}

function MenuItemDialog({ open, onOpenChange, item, onSave, categories }: { open: boolean; onOpenChange: (open: boolean) => void; item: MenuItem; onSave: (item: MenuItem) => void; categories: Category[] }) {
  const [form, setForm] = useState<MenuItem>(item);

  const handleAddVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { id: crypto.randomUUID(), name: '', price: 0 }],
    }));
  };

  const handleRemoveVariant = (id: string) => {
    setForm((prev) => ({ ...prev, variants: prev.variants.filter((v) => v.id !== id) }));
  };

  const handleAddAddOn = () => {
    setForm((prev) => ({
      ...prev,
      addOns: [...prev.addOns, { id: crypto.randomUUID(), name: '', price: 0 }],
    }));
  };

  const handleRemoveAddOn = (id: string) => {
    setForm((prev) => ({ ...prev, addOns: prev.addOns.filter((a) => a.id !== id) }));
  };

  const handleSubmit = () => {
    onSave({ ...form, id: form.id || crypto.randomUUID() });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item.id ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
          <DialogDescription>
            {item.id ? 'Update the item details below' : 'Fill in the details to add a new menu item'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border bg-muted">
              {form.image ? (
                <img src={form.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <Button variant="outline" size="sm" className="h-8">
                <ImagePlus className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              <p className="mt-1 text-xs text-muted-foreground">Recommended: 400x400px, max 2MB</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Item Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Butter Chicken"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (₹)</label>
              <Input
                type="number"
                value={form.price || ''}
                onChange={(e) => setForm((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="e.g. 450"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the item..."
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter((c) => c.name !== 'All Items').map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.icon} {cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Variants (optional)</label>
              <Button variant="outline" size="sm" className="h-7" onClick={handleAddVariant}>
                <Plus className="mr-1 h-3 w-3" />
                Add Variant
              </Button>
            </div>
            {form.variants.map((variant, i) => (
              <div key={variant.id} className="flex items-center gap-2">
                <Input
                  placeholder="Size name"
                  value={variant.name}
                  onChange={(e) => {
                    const newVariants = [...form.variants];
                    newVariants[i] = { ...variant, name: e.target.value };
                    setForm((prev) => ({ ...prev, variants: newVariants }));
                  }}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={variant.price || ''}
                  onChange={(e) => {
                    const newVariants = [...form.variants];
                    newVariants[i] = { ...variant, price: parseFloat(e.target.value) || 0 };
                    setForm((prev) => ({ ...prev, variants: newVariants }));
                  }}
                  className="w-24"
                />
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => handleRemoveVariant(variant.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Add-ons (optional)</label>
              <Button variant="outline" size="sm" className="h-7" onClick={handleAddAddOn}>
                <Plus className="mr-1 h-3 w-3" />
                Add Add-on
              </Button>
            </div>
            {form.addOns.map((addon, i) => (
              <div key={addon.id} className="flex items-center gap-2">
                <Input
                  placeholder="Add-on name"
                  value={addon.name}
                  onChange={(e) => {
                    const newAddOns = [...form.addOns];
                    newAddOns[i] = { ...addon, name: e.target.value };
                    setForm((prev) => ({ ...prev, addOns: newAddOns }));
                  }}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={addon.price || ''}
                  onChange={(e) => {
                    const newAddOns = [...form.addOns];
                    newAddOns[i] = { ...addon, price: parseFloat(e.target.value) || 0 };
                    setForm((prev) => ({ ...prev, addOns: newAddOns }));
                  }}
                  className="w-24"
                />
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => handleRemoveAddOn(addon.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Dietary Info</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={form.dietary.veg}
                  onCheckedChange={(checked) => setForm((prev) => ({ ...prev, dietary: { ...prev.dietary, veg: checked } }))}
                />
                <Leaf className="h-4 w-4 text-green-600" />
                Vegetarian
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={form.dietary.vegan}
                  onCheckedChange={(checked) => setForm((prev) => ({ ...prev, dietary: { ...prev.dietary, vegan: checked } }))}
                />
                <Leaf className="h-4 w-4 text-emerald-600" />
                Vegan
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={form.dietary.glutenFree}
                  onCheckedChange={(checked) => setForm((prev) => ({ ...prev, dietary: { ...prev.dietary, glutenFree: checked } }))}
                />
                <Wheat className="h-4 w-4 text-amber-600" />
                Gluten Free
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.available} onCheckedChange={(checked) => setForm((prev) => ({ ...prev, available: checked }))} />
              Available
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.popular} onCheckedChange={(checked) => setForm((prev) => ({ ...prev, popular: checked }))} />
              Mark as Popular
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>{item.id ? 'Save Changes' : 'Add Item'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function MenuClient({ initialCategories, initialProducts }: { initialCategories: any[], initialProducts: any[] }) {
  const [items, setItems] = useState<any[]>(initialProducts);
  const [categoriesList, setCategoriesList] = useState<any[]>([{ id: 'all', name: 'All Items', icon: '🍽️', itemCount: items.length }, ...initialCategories]);
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [catDialogOpen, setCatDialogOpen] = useState(false);

  const filteredItems = items.filter((item) => {
    const categoryName = item.category?.name || item.category;
    const matchesCategory = selectedCategory === 'All Items' || categoryName === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSave = async (item: MenuItem) => {
    // Basic optimistic update or handle server action
    // In real app, call server action `createProduct`
    setItems((prev) => {
      const existing = prev.findIndex((i) => i.id === item.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = item;
        return updated;
      }
      return [...prev, { ...item, id: crypto.randomUUID(), sortOrder: prev.length + 1, category: { name: item.category } }];
    });
    toast({ title: item.id ? 'Item Updated' : 'Item Added', description: `${item.name} has been ${item.id ? 'updated' : 'added'} successfully.`, variant: 'success' });
    setEditItem(null);
  };

  const handleToggle = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    
    // Call server action toggleProductAvailability(id, !item.isAvailable)
    // Here we'll do optimistic UI update
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, available: !i.available, isAvailable: !i.isAvailable } : i));
    toast({ title: 'Availability Updated', description: `${item.name} is now ${item.available || item.isAvailable ? 'hidden' : 'visible'}`, variant: 'success' });
  };

  const handleDelete = async (id: string) => {
    // Call server action deleteProduct(id)
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast({ title: 'Item Deleted', variant: 'destructive' });
  };

  const handleDuplicate = (item: MenuItem) => {
    const newItem = { ...item, id: crypto.randomUUID(), name: `${item.name} (Copy)`, sortOrder: items.length + 1 };
    setItems((prev) => [...prev, newItem]);
    toast({ title: 'Item Duplicated', description: `${newItem.name} has been created.`, variant: 'success' });
  };

  const handleEdit = (item: any) => {
    setEditItem({
      ...item,
      category: item.category?.name || item.category,
      available: item.isAvailable !== undefined ? item.isAvailable : item.available,
      dietary: { veg: item.isVegetarian, vegan: item.isVegan, glutenFree: item.isGlutenFree },
      variants: [], addOns: []
    });
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditItem(emptyMenuItem);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-sm text-muted-foreground">Manage your restaurant menu items</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border p-0.5">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setViewMode('list')}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button variant="outline" size="sm" className="h-9" onClick={() => setCatDialogOpen(true)}>
            <Grid3X3 className="mr-2 h-4 w-4" />
            Categories
          </Button>
          <Button size="sm" className="h-9" onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex shrink-0 gap-1 overflow-x-auto sm:flex-col sm:w-48">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap sm:whitespace-normal',
                selectedCategory === cat.name
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <span>{cat.icon || '🍽️'}</span>
              <span className="flex-1 text-left">{cat.name}</span>
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px]">{cat._count?.products ?? cat.itemCount ?? 0}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-10"
            />
          </div>

          <AnimatePresence mode="popLayout">
            <div className={cn(
              'gap-4',
              viewMode === 'grid' ? 'grid sm:grid-cols-2 xl:grid-cols-3' : 'space-y-3'
            )}>
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={{
                    ...item,
                    category: item.category?.name || item.category,
                    available: item.isAvailable !== undefined ? item.isAvailable : item.available,
                    dietary: { veg: item.isVegetarian, vegan: item.isVegan, glutenFree: item.isGlutenFree },
                    variants: item.variants || [],
                    addOns: item.addOns || []
                  }}
                  onEdit={handleEdit}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                />
              ))}
            </div>
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Utensils className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold">No items found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'Add your first menu item'}
              </p>
              {!searchQuery && (
                <Button className="mt-4" onClick={handleAddNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Menu Item
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <MenuItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editItem || emptyMenuItem}
        onSave={handleSave}
        categories={categoriesList}
      />
    </div>
  );
}
