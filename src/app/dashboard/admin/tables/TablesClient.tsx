'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Grid3X3,
  Plus,
  Edit3,
  Trash2,
  QrCode,
  Users,
  Utensils,
  Square,
  Search,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface TableData {
  id: string;
  number: number;
  section: string;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';
  currentOrder?: string;
  assignedTo?: string;
}

interface Section {
  name: string;
  color: string;
}

const sections: Section[] = [
  { name: 'Main Hall', color: 'bg-blue-100 border-blue-300 dark:bg-blue-950/30 dark:border-blue-800' },
  { name: 'Terrace', color: 'bg-emerald-100 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-800' },
  { name: 'VIP Room', color: 'bg-purple-100 border-purple-300 dark:bg-purple-950/30 dark:border-purple-800' },
  { name: 'Outdoor', color: 'bg-amber-100 border-amber-300 dark:bg-amber-950/30 dark:border-amber-800' },
];

const tablesData: TableData[] = [
  { id: 'T-001', number: 1, section: 'Main Hall', capacity: 4, status: 'AVAILABLE' },
  { id: 'T-002', number: 2, section: 'Main Hall', capacity: 4, status: 'OCCUPIED', currentOrder: 'ZG-7A8B', assignedTo: 'Rahul S.' },
  { id: 'T-003', number: 3, section: 'Main Hall', capacity: 6, status: 'OCCUPIED', currentOrder: 'ZG-3G4H', assignedTo: 'Sneha P.' },
  { id: 'T-004', number: 4, section: 'Main Hall', capacity: 2, status: 'AVAILABLE' },
  { id: 'T-005', number: 5, section: 'Main Hall', capacity: 4, status: 'RESERVED' },
  { id: 'T-006', number: 6, section: 'Main Hall', capacity: 4, status: 'AVAILABLE' },
  { id: 'T-007', number: 7, section: 'Main Hall', capacity: 2, status: 'MAINTENANCE' },
  { id: 'T-008', number: 8, section: 'Terrace', capacity: 6, status: 'OCCUPIED', currentOrder: 'ZG-8M9N', assignedTo: 'Raj P.' },
  { id: 'T-009', number: 9, section: 'Terrace', capacity: 4, status: 'AVAILABLE' },
  { id: 'T-010', number: 10, section: 'Terrace', capacity: 4, status: 'RESERVED' },
  { id: 'T-011', number: 11, section: 'Terrace', capacity: 2, status: 'AVAILABLE' },
  { id: 'T-012', number: 12, section: 'VIP Room', capacity: 8, status: 'AVAILABLE' },
  { id: 'T-013', number: 13, section: 'VIP Room', capacity: 6, status: 'OCCUPIED', assignedTo: 'Kenji T.' },
  { id: 'T-014', number: 14, section: 'Outdoor', capacity: 4, status: 'AVAILABLE' },
  { id: 'T-015', number: 15, section: 'Outdoor', capacity: 4, status: 'AVAILABLE' },
];

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  AVAILABLE: { label: 'Available', color: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-700', dot: 'bg-emerald-500' },
  OCCUPIED: { label: 'Occupied', color: 'border-red-400 bg-red-50 dark:bg-red-950/20 dark:border-red-700', dot: 'bg-red-500' },
  RESERVED: { label: 'Reserved', color: 'border-amber-400 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-700', dot: 'bg-amber-500' },
  MAINTENANCE: { label: 'Maintenance', color: 'border-gray-400 bg-gray-50 dark:bg-gray-900 dark:border-gray-600', dot: 'bg-gray-400' },
};

import { createTable, deleteTable } from '@/actions/admin/tables';

export default function TablesClient({ initialTables }: { initialTables: any[] }) {
  const [activeSection, setActiveSection] = useState('All');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Normalize location as section for UI
  const normalizedTables = initialTables.map(t => ({
    ...t,
    section: t.location,
    capacity: t.seats,
  }));

  const filtered = activeSection === 'All' ? normalizedTables : normalizedTables.filter(t => t.section === activeSection);

  const statusCounts = {
    total: normalizedTables.length,
    available: normalizedTables.filter(t => t.status === 'AVAILABLE').length,
    occupied: normalizedTables.filter(t => t.status === 'OCCUPIED').length,
    reserved: normalizedTables.filter(t => t.status === 'RESERVED').length,
    maintenance: normalizedTables.filter(t => t.status === 'MAINTENANCE').length,
  };

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this table?')) {
      await deleteTable(id);
    }
  }

  async function handleAdd(formData: FormData) {
    setIsLoading(true);
    const result = await createTable(formData);
    setIsLoading(false);
    if (result.success) {
      setShowAddDialog(false);
    } else {
      alert(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Table Management</h1>
          <p className="text-sm text-muted-foreground">Manage floor plan and table assignments</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" />
              Add Table
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
              <DialogDescription>Add a new table to the floor plan.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Table Number</Label>
                  <Input type="number" placeholder="e.g. 16" />
                </div>
                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input type="number" placeholder="e.g. 4" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Section</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                  <SelectContent>
                    {sections.map((s) => (
                      <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button>Add Table</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', ...sections.map(s => s.name)].map((section) => (
          <Button
            key={section}
            variant={activeSection === section ? 'default' : 'outline'}
            size="sm"
            className="h-8"
            onClick={() => setActiveSection(section)}
          >
            {section}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {Object.entries({ total: 'Total', available: 'Available', occupied: 'Occupied', reserved: 'Reserved' }).map(([key, label]) => (
          <Card key={key}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{statusCounts[key as keyof typeof statusCounts]}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {sections.filter(s => activeSection === 'All' || activeSection === s.name).map((section) => {
        const sectionTables = filtered.filter(t => t.section === section.name);
        if (sectionTables.length === 0) return null;
        return (
          <div key={section.name}>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">{section.name}</h3>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {sectionTables.map((table, i) => {
                const config = statusConfig[table.status] ?? { label: 'Unknown', color: 'border-gray-200', dot: 'bg-gray-400' };
                return (
                  <motion.div
                    key={table.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <div
                      className={cn(
                        'relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md',
                        config.color
                      )}
                      onClick={() => { setSelectedTable(table); setShowEditDialog(true); }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn('h-2.5 w-2.5 rounded-full', config.dot)} />
                          <span className="text-lg font-bold">T{table.number}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedTable(table); setShowEditDialog(true); }}>
                              <Edit3 className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <QrCode className="mr-2 h-4 w-4" /> QR Code
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                              <Trash2 className="mr-2 h-4 w-4" /> Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>Capacity: {table.capacity}</span>
                      </div>

                      <div className="mt-1 text-xs">
                        <Badge variant="outline" className={cn('text-[10px]', config.dot.replace('bg-', 'bg-') + '/10 text-' + config.dot.split('-')[1] + '-700')}>
                          {config.label}
                        </Badge>
                      </div>

                      {table.assignedTo && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {table.assignedTo}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Table</DialogTitle>
            <DialogDescription>Update table details and status.</DialogDescription>
          </DialogHeader>
          {selectedTable && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Table Number</Label>
                  <Input defaultValue={selectedTable.number} />
                </div>
                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input type="number" defaultValue={selectedTable.capacity} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Section</Label>
                <Select defaultValue={selectedTable.section}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {sections.map((s) => (
                      <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue={selectedTable.status}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="OCCUPIED">Occupied</SelectItem>
                    <SelectItem value="RESERVED">Reserved</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
