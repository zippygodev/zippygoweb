'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import {
  QrCode,
  Download,
  Printer,
  Plus,
  Search,
  Copy,
  CheckCheck,
  Table,
  Smartphone,
  Clock,
} from 'lucide-react';

interface QRTable {
  id: string;
  number: number;
  section: string;
  qrGenerated: boolean;
  lastScanned?: string;
  scanCount: number;
}

const qrTables: QRTable[] = [
  { id: 'T-001', number: 1, section: 'Main Hall', qrGenerated: true, lastScanned: '2024-06-27T10:30:00', scanCount: 45 },
  { id: 'T-002', number: 2, section: 'Main Hall', qrGenerated: true, lastScanned: '2024-06-27T10:25:00', scanCount: 38 },
  { id: 'T-003', number: 3, section: 'Main Hall', qrGenerated: true, lastScanned: '2024-06-27T09:15:00', scanCount: 52 },
  { id: 'T-004', number: 4, section: 'Main Hall', qrGenerated: true, scanCount: 12 },
  { id: 'T-005', number: 5, section: 'Main Hall', qrGenerated: false, scanCount: 0 },
  { id: 'T-006', number: 6, section: 'Main Hall', qrGenerated: false, scanCount: 0 },
  { id: 'T-007', number: 7, section: 'Main Hall', qrGenerated: true, scanCount: 8 },
  { id: 'T-008', number: 8, section: 'Terrace', qrGenerated: true, lastScanned: '2024-06-27T08:45:00', scanCount: 28 },
  { id: 'T-009', number: 9, section: 'Terrace', qrGenerated: true, scanCount: 15 },
  { id: 'T-010', number: 10, section: 'Terrace', qrGenerated: false, scanCount: 0 },
  { id: 'T-011', number: 11, section: 'Terrace', qrGenerated: true, scanCount: 5 },
  { id: 'T-012', number: 12, section: 'VIP Room', qrGenerated: true, lastScanned: '2024-06-26T20:00:00', scanCount: 22 },
  { id: 'T-013', number: 13, section: 'VIP Room', qrGenerated: false, scanCount: 0 },
  { id: 'T-014', number: 14, section: 'Outdoor', qrGenerated: true, scanCount: 3 },
  { id: 'T-015', number: 15, section: 'Outdoor', qrGenerated: false, scanCount: 0 },
];

const sections = ['All', 'Main Hall', 'Terrace', 'VIP Room', 'Outdoor'];

export default function QRCodesPage() {
  const [sectionFilter, setSectionFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const pageSize = 10;

  const filtered = sectionFilter === 'All' ? qrTables : qrTables.filter(t => t.section === sectionFilter);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === paginated.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginated.map(t => t.id));
    }
  };

  const handleCopy = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalScans = qrTables.reduce((s, t) => s + t.scanCount, 0);
  const generatedCount = qrTables.filter(t => t.qrGenerated).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">QR Codes</h1>
          <p className="text-sm text-muted-foreground">Generate and manage QR codes for tables</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9" disabled={selectedIds.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Download Selected ({selectedIds.length})
          </Button>
          <Button size="sm" className="h-9">
            <Plus className="mr-2 h-4 w-4" />
            Generate All Missing
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{qrTables.length}</p>
            <p className="text-xs text-muted-foreground">Total Tables</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{generatedCount}</p>
            <p className="text-xs text-muted-foreground">QR Generated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{qrTables.length - generatedCount}</p>
            <p className="text-xs text-muted-foreground">Missing QR</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{totalScans.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Scans</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex gap-2">
          {sections.map((s) => (
            <Button
              key={s}
              variant={sectionFilter === s ? 'default' : 'outline'}
              size="sm"
              className="h-8"
              onClick={() => { setSectionFilter(s); setCurrentPage(1); }}
            >
              {s}
            </Button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Printer className="mr-2 h-4 w-4" />
            Print All
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            <div className="flex items-center gap-4 px-4 py-3 text-xs font-medium text-muted-foreground">
              <div className="flex w-8 items-center">
                <Checkbox
                  checked={selectedIds.length === paginated.length && paginated.length > 0}
                  onCheckedChange={toggleAll}
                />
              </div>
              <div className="flex-1">Table</div>
              <div className="w-24">Section</div>
              <div className="w-24 text-center">QR Status</div>
              <div className="w-24 text-center">Scans</div>
              <div className="w-32 text-center">Last Scanned</div>
              <div className="w-28 text-right">Actions</div>
            </div>
            {paginated.map((table) => (
              <div key={table.id} className="flex items-center gap-4 px-4 py-3.5 text-sm hover:bg-muted/50">
                <div className="flex w-8 items-center">
                  <Checkbox
                    checked={selectedIds.includes(table.id)}
                    onCheckedChange={() => toggleSelect(table.id)}
                  />
                </div>
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Table className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Table {table.number}</p>
                    <p className="text-xs text-muted-foreground">{table.id}</p>
                  </div>
                </div>
                <div className="w-24 text-xs text-muted-foreground">{table.section}</div>
                <div className="flex w-24 justify-center">
                  {table.qrGenerated ? (
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 text-[11px]">
                      Generated
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-100 text-gray-700 dark:bg-gray-800 text-[11px]">
                      Missing
                    </Badge>
                  )}
                </div>
                <div className="w-24 text-center text-sm font-medium">{table.scanCount}</div>
                <div className="w-32 text-center text-xs text-muted-foreground">
                  {table.lastScanned ? new Date(table.lastScanned).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '-'}
                </div>
                <div className="flex w-28 justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(table.id)} title="Copy QR URL">
                    {copiedId === table.id ? <CheckCheck className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" title="Download QR">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" title="Preview QR">
                    <QrCode className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Bulk Generation</CardTitle>
          <CardDescription>Generate QR codes for multiple tables at once</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label>Select Section</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.filter(s => s !== 'All').map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>QR Code Size</Label>
              <Select defaultValue="250">
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="150">150px</SelectItem>
                  <SelectItem value="250">250px</SelectItem>
                  <SelectItem value="400">400px</SelectItem>
                  <SelectItem value="600">600px</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <QrCode className="mr-2 h-4 w-4" />
              Generate for Section
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Scan History</CardTitle>
          <CardDescription>Recent QR code scan activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {qrTables.filter(t => t.lastScanned).slice(0, 5).map((table) => (
              <div key={table.id} className="flex items-center gap-3 rounded-lg border p-3">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Table {table.number} scanned</p>
                  <p className="text-xs text-muted-foreground">{table.section}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(table.lastScanned!).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
