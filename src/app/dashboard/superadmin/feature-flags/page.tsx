'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Pagination } from '@/components/ui/pagination';
import {
  Flag,
  Plus,
  Edit3,
  Trash2,
  Search,
  TestTube,
  Users,
  Globe,
  RefreshCw,
  Lightbulb,
  ToggleLeft,
  Percent,
} from 'lucide-react';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  key: string;
  enabled: boolean;
  rolloutPercentage: number;
  environment: 'production' | 'staging' | 'development';
  createdAt: string;
  updatedAt: string;
  abTest: boolean;
  abVariants?: string[];
}

const featureFlags: FeatureFlag[] = [
  { id: 'FF-001', name: 'Dynamic Pricing', description: 'Enable dynamic pricing based on demand', key: 'dynamic-pricing', enabled: true, rolloutPercentage: 50, environment: 'production', createdAt: '2026-01-15', updatedAt: '2026-06-20', abTest: true, abVariants: ['control', 'dynamic-5%', 'dynamic-10%'] },
  { id: 'FF-002', name: 'Robot Delivery', description: 'Enable autonomous robot delivery', key: 'robot-delivery', enabled: false, rolloutPercentage: 0, environment: 'staging', createdAt: '2026-02-01', updatedAt: '2026-06-10', abTest: false },
  { id: 'FF-003', name: 'QR Scan Pay', description: 'Enable QR code based payment', key: 'qr-scan-pay', enabled: true, rolloutPercentage: 100, environment: 'production', createdAt: '2026-01-10', updatedAt: '2026-05-15', abTest: false },
  { id: 'FF-004', name: 'Multi-language Support', description: 'Enable i18n for customer app', key: 'multi-lang', enabled: true, rolloutPercentage: 25, environment: 'production', createdAt: '2026-03-01', updatedAt: '2026-06-25', abTest: true, abVariants: ['en-only', 'en-hi', 'en-hi-ta'] },
  { id: 'FF-005', name: 'AI Recommendations', description: 'AI-powered restaurant suggestions', key: 'ai-recommendations', enabled: false, rolloutPercentage: 0, environment: 'development', createdAt: '2026-04-10', updatedAt: '2026-06-01', abTest: false },
  { id: 'FF-006', name: 'Wallet Feature', description: 'Digital wallet for users', key: 'digital-wallet', enabled: true, rolloutPercentage: 80, environment: 'production', createdAt: '2026-02-15', updatedAt: '2026-06-22', abTest: true, abVariants: ['basic', 'premium'] },
  { id: 'FF-007', name: 'Group Ordering', description: 'Enable group ordering from multiple users', key: 'group-ordering', enabled: false, rolloutPercentage: 0, environment: 'staging', createdAt: '2026-05-01', updatedAt: '2026-06-05', abTest: false },
  { id: 'FF-008', name: 'Dark Mode', description: 'Enable dark mode for admin dashboard', key: 'dark-mode', enabled: true, rolloutPercentage: 100, environment: 'production', createdAt: '2026-01-05', updatedAt: '2026-04-10', abTest: false },
];

const envBadge: Record<string, { variant: 'default' | 'warning' | 'secondary'; label: string }> = {
  production: { variant: 'default', label: 'Production' },
  staging: { variant: 'warning', label: 'Staging' },
  development: { variant: 'secondary', label: 'Development' },
};

export default function FeatureFlagsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [envFilter, setEnvFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [createDialog, setCreateDialog] = useState(false);
  const [abDialog, setAbDialog] = useState<FeatureFlag | null>(null);
  const pageSize = 8;

  const filtered = featureFlags.filter((ff) => {
    const matchesSearch = ff.name.toLowerCase().includes(searchQuery.toLowerCase()) || ff.key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEnv = envFilter === 'all' || ff.environment === envFilter;
    return matchesSearch && matchesEnv;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Feature Flags</h1>
          <p className="text-sm text-muted-foreground">Manage feature toggles, rollouts, and A/B tests.</p>
        </div>
        <Dialog open={createDialog} onOpenChange={setCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" />
              Create Flag
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Feature Flag</DialogTitle>
              <DialogDescription>Add a new feature flag to control platform functionality.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Flag Name</Label>
                <Input placeholder="e.g., Dynamic Pricing" />
              </div>
              <div className="grid gap-2">
                <Label>Flag Key</Label>
                <Input placeholder="e.g., dynamic-pricing" />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe what this flag controls" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Environment</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Rollout %</Label>
                  <Input type="number" min={0} max={100} placeholder="100" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch />
                <Label>Enable A/B Testing</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Label>Enable immediately</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialog(false)}>Cancel</Button>
              <Button>Create Flag</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search flags..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="h-9 rounded-lg border-none bg-muted pl-10 pr-4 text-sm"
            />
          </div>
          <Select value={envFilter} onValueChange={(v) => { setEnvFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Environments</SelectItem>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="development">Development</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          {featureFlags.filter(f => f.enabled).length} active / {featureFlags.length} total
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flag</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead className="text-center">Rollout</TableHead>
                <TableHead>A/B Test</TableHead>
                <TableHead className="text-center">Enabled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((ff) => (
                <TableRow key={ff.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', ff.enabled ? 'bg-emerald-100 dark:bg-emerald-950/50' : 'bg-muted')}>
                        <Flag className={cn('h-4 w-4', ff.enabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground')} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{ff.name}</p>
                        <p className="text-xs text-muted-foreground max-w-[200px] truncate">{ff.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono">{ff.key}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={envBadge[ff.environment].variant}>{envBadge[ff.environment].label}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex-1 max-w-[80px]">
                        <div className="h-1.5 rounded-full bg-muted">
                          <div className={cn('h-full rounded-full', ff.rolloutPercentage === 100 ? 'bg-emerald-500' : 'bg-primary')} style={{ width: `${ff.rolloutPercentage}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-medium">{ff.rolloutPercentage}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {ff.abTest ? (
                      <Badge variant="outline" className="border-purple-500 text-purple-500">
                        <TestTube className="mr-1 h-3 w-3" />
                        A/B Test
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={ff.enabled}
                      onCheckedChange={() => {}}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {ff.abTest && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setAbDialog(ff)}>
                          <TestTube className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <Dialog open={!!abDialog} onOpenChange={(o) => { if (!o) setAbDialog(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-purple-500" />
              A/B Test Configuration
            </DialogTitle>
            <DialogDescription>Configure A/B test variants for {abDialog?.name}.</DialogDescription>
          </DialogHeader>
          {abDialog && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">{abDialog.name}</p>
                <p className="text-xs text-muted-foreground">Key: {abDialog.key}</p>
                <p className="text-xs text-muted-foreground">Current Rollout: {abDialog.rolloutPercentage}%</p>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label>Variants</Label>
                {abDialog.abVariants?.map((variant, i) => (
                  <div key={variant} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-600 text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium capitalize">{variant.replace(/-/g, ' ')}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 max-w-[100px]">
                          <div className="h-1.5 rounded-full bg-muted">
                            <div className="h-full rounded-full bg-purple-500" style={{ width: `${Math.floor(100 / (abDialog.abVariants?.length || 1))}%` }} />
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{Math.floor(100 / (abDialog.abVariants?.length || 1))}% traffic</span>
                      </div>
                    </div>
                    <Input type="number" className="h-8 w-20 text-center" placeholder="%" defaultValue={Math.floor(100 / (abDialog.abVariants?.length || 1))} />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Variant
                </Button>
              </div>
              <div className="flex items-center gap-2 rounded-lg border p-3 bg-muted/50">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <p className="text-xs text-muted-foreground">A/B test results can be viewed in the analytics section after sufficient data collection.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAbDialog(null)}>Cancel</Button>
            <Button onClick={() => setAbDialog(null)}>Save Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
