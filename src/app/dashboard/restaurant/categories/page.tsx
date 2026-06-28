'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { toast } from '@/components/ui/toast';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  GripVertical,
  Trash2,
  Edit3,
  Grid3X3,
  ImagePlus,
  ArrowUpDown,
  Moon,
  Sun,
  Check,
  X,
  Save,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  active: boolean;
  sortOrder: number;
  itemCount: number;
}

const initialCategories: Category[] = [
  { id: '1', name: 'Starters', icon: '🥟', description: 'Appetizers and starters', active: true, sortOrder: 1, itemCount: 8 },
  { id: '2', name: 'Main Course', icon: '🍛', description: 'Main course dishes', active: true, sortOrder: 2, itemCount: 10 },
  { id: '3', name: 'Breads', icon: '🫓', description: 'Indian breads', active: true, sortOrder: 3, itemCount: 4 },
  { id: '4', name: 'Desserts', icon: '🍨', description: 'Sweet treats', active: true, sortOrder: 4, itemCount: 3 },
  { id: '5', name: 'Beverages', icon: '🥤', description: 'Drinks and beverages', active: true, sortOrder: 5, itemCount: 3 },
  { id: '6', name: 'Combos', icon: '🍱', description: 'Meal combos and thalis', active: false, sortOrder: 6, itemCount: 0 },
];

const iconOptions = ['🍽️', '🥟', '🍛', '🫓', '🍨', '🥤', '🍱', '🥗', '🍜', '🌮', '🥘', '🍕', '🥪', '🧁', '🍪', '☕', '🧃', '🍶'];

function CategoryRow({ category, onEdit, onDelete, onToggle, dragHandleProps }: { category: Category; onEdit: (c: Category) => void; onDelete: (id: string) => void; onToggle: (id: string) => void; dragHandleProps?: any }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'flex items-center gap-3 rounded-xl border bg-card p-4 transition-all',
        !category.active && 'opacity-60',
        isHovered && 'shadow-sm'
      )}
    >
      <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg">
        {category.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{category.name}</span>
          <Badge variant="secondary" className="text-[10px]">{category.itemCount} items</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{category.description}</p>
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={category.active} onCheckedChange={() => onToggle(category.id)} />
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit(category)}>
          <Edit3 className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => onDelete(category.id)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}

function CategoryDialog({ open, onOpenChange, category, onSave }: { open: boolean; onOpenChange: (open: boolean) => void; category: Category | null; onSave: (category: Category) => void }) {
  const [form, setForm] = useState({
    name: category?.name || '',
    icon: category?.icon || '🍽️',
    description: category?.description || '',
  });

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast({ title: 'Error', description: 'Category name is required', variant: 'destructive' });
      return;
    }
    onSave({
      id: category?.id || crypto.randomUUID(),
      name: form.name,
      icon: form.icon,
      description: form.description,
      active: category?.active ?? true,
      sortOrder: category?.sortOrder ?? 0,
      itemCount: category?.itemCount ?? 0,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
          <DialogDescription>
            {category ? 'Update the category details' : 'Create a new menu category'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Starters"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Emoji Icon</label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setForm((prev) => ({ ...prev, icon }))}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-all',
                    form.icon === icon ? 'bg-primary/10 ring-2 ring-primary' : 'bg-muted hover:bg-muted/80'
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the category"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>{category ? 'Save Changes' : 'Add Category'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = (category: Category) => {
    setCategories((prev) => {
      const existing = prev.findIndex((c) => c.id === category.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = category;
        return updated;
      }
      return [...prev, { ...category, sortOrder: prev.length + 1 }];
    });
    toast({ title: category.id ? 'Category Updated' : 'Category Added', description: `${category.name} has been ${category.id ? 'updated' : 'added'} successfully.`, variant: 'success' });
    setEditCategory(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteId));
    toast({ title: 'Category Deleted', variant: 'destructive' });
    setDeleteId(null);
  };

  const handleToggle = (id: string) => {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
    const cat = categories.find((c) => c.id === id);
    toast({ title: 'Category Updated', description: `${cat?.name} is now ${cat?.active ? 'inactive' : 'active'}`, variant: 'success' });
  };

  const handleReorder = (reordered: Category[]) => {
    setCategories(reordered.map((c, i) => ({ ...c, sortOrder: i + 1 })));
  };

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditCategory(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">Organize your menu with categories</p>
        </div>
        <Button size="sm" className="h-9" onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Menu Categories</CardTitle>
            <span className="text-xs text-muted-foreground">Drag to reorder</span>
          </div>
        </CardHeader>
        <CardContent>
          <Reorder.Group axis="y" values={categories} onReorder={handleReorder} className="space-y-2">
            <AnimatePresence initial={false}>
              {categories.map((category) => (
                <Reorder.Item key={category.id} value={category}>
                  <CategoryRow
                    category={category}
                    onEdit={handleEdit}
                    onDelete={(id) => setDeleteId(id)}
                    onToggle={handleToggle}
                  />
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {categories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Grid3X3 className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold">No categories</h3>
              <p className="mt-1 text-sm text-muted-foreground">Create your first menu category</p>
              <Button className="mt-4" onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editCategory}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? Items in this category will not be deleted but will become uncategorized.
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
