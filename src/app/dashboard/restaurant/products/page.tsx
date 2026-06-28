'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { toast } from '@/components/ui/toast';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit3,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Package,
  Leaf,
  Tag,
  ArrowUpDown,
} from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
  popular: boolean;
  veg: boolean;
  stock: number;
  createdAt: string;
}

const products: Product[] = [
  { id: '1', name: 'Butter Chicken', category: 'Main Course', price: 450, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=100&h=100&fit=crop', available: true, popular: true, veg: false, stock: 20, createdAt: '2024-01-15' },
  { id: '2', name: 'Paneer Tikka', category: 'Starters', price: 380, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=100&h=100&fit=crop', available: true, popular: true, veg: true, stock: 15, createdAt: '2024-01-20' },
  { id: '3', name: 'Dal Makhani', category: 'Main Course', price: 350, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=100&h=100&fit=crop', available: true, popular: false, veg: true, stock: 25, createdAt: '2024-02-01' },
  { id: '4', name: 'Garlic Naan', category: 'Breads', price: 60, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=100&h=100&fit=crop', available: true, popular: false, veg: true, stock: 50, createdAt: '2024-02-05' },
  { id: '5', name: 'Gulab Jamun', category: 'Desserts', price: 120, image: 'https://images.unsplash.com/photo-1666190050266-2bd72987a97a?w=100&h=100&fit=crop', available: true, popular: false, veg: true, stock: 30, createdAt: '2024-02-10' },
  { id: '6', name: 'Mango Lassi', category: 'Beverages', price: 120, image: 'https://images.unsplash.com/photo-1570197785651-0bb9f1a79d2f?w=100&h=100&fit=crop', available: true, popular: false, veg: true, stock: 40, createdAt: '2024-02-15' },
  { id: '7', name: 'Chicken Biryani', category: 'Main Course', price: 380, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=100&h=100&fit=crop', available: true, popular: true, veg: false, stock: 18, createdAt: '2024-02-20' },
  { id: '8', name: 'Chicken Tikka', category: 'Starters', price: 350, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=100&h=100&fit=crop', available: false, popular: false, veg: false, stock: 0, createdAt: '2024-03-01' },
];

const categories = ['All', 'Starters', 'Main Course', 'Breads', 'Desserts', 'Beverages'];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const columns: ColumnDef<Product>[] = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'Product',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 rounded-lg">
            <AvatarImage src={row.original.image} />
            <AvatarFallback className="rounded-lg">{row.original.name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-medium">{row.original.name}</span>
              {row.original.veg && <Leaf className="h-3 w-3 text-green-600" />}
              {row.original.popular && (
                <Badge variant="default" className="text-[8px] px-1 py-0">POPULAR</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">ID: {row.original.id}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-[10px]">{row.original.category}</Badge>
      ),
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: ({ row }) => (
        <span className="font-medium">{formatCurrency(row.original.price)}</span>
      ),
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: ({ row }) => (
        <span className={cn(row.original.stock < 10 ? 'text-destructive font-medium' : 'text-muted-foreground')}>
          {row.original.stock} units
        </span>
      ),
    },
    {
      accessorKey: 'available',
      header: 'Status',
      cell: ({ row }) => (
        <Switch
          checked={row.original.available}
          onCheckedChange={() => {
            toast({ title: `${row.original.available ? 'Hidden' : 'Activated'}`, description: `${row.original.name} is now ${row.original.available ? 'hidden' : 'available'}`, variant: 'success' });
          }}
        />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], []);

  const selectedCount = selectedIds.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Manage all menu products and inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/restaurant/menu">
            <Button variant="outline" size="sm" className="h-9">
              Menu Editor
            </Button>
          </Link>
          <Button size="sm" className="h-9">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 w-[160px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selectedCount} selected</span>
            <Button variant="destructive" size="sm" className="h-9">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={filtered}
            searchKey="name"
            searchPlaceholder="Search products..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
