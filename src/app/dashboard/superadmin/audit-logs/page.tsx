'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ScrollText,
  Search,
  Download,
  Filter,
  Eye,
  User,
  Activity,
  Building2,
  Store,
  ShoppingBag,
  Settings,
  Shield,
  LogIn,
  LogOut,
  Trash2,
  Edit3,
  Plus,
  MoreHorizontal,
  Clock,
  Radio,
} from 'lucide-react';

interface AuditLog {
  id: string;
  user: string;
  userRole: string;
  action: string;
  resource: string;
  resourceType: string;
  details: string;
  ip: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

const auditLogs: AuditLog[] = Array.from({ length: 50 }, (_, i) => ({
  id: `LOG-${String(i + 1).padStart(4, '0')}`,
  user: ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Gupta', 'Vikram Singh', 'System'][Math.floor(Math.random() * 6)],
  userRole: ['super_admin', 'org_admin', 'mall_admin', 'system'][Math.floor(Math.random() * 4)],
  action: ['Created', 'Updated', 'Deleted', 'Approved', 'Rejected', 'Logged In', 'Logged Out', 'Exported', 'Modified'][Math.floor(Math.random() * 9)],
  resource: ['Organization', 'Mall', 'Restaurant', 'User', 'Plan', 'Commission', 'Feature Flag', 'Setting', 'Role'][Math.floor(Math.random() * 9)],
  resourceType: ['organization', 'mall', 'restaurant', 'user', 'plan', 'commission', 'feature_flag', 'setting'][Math.floor(Math.random() * 8)],
  details: `Performed ${['create', 'update', 'delete', 'approve', 'modify'][Math.floor(Math.random() * 5)]} operation on resource`,
  ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
  severity: (['info', 'info', 'info', 'warning', 'critical'] as const)[Math.floor(Math.random() * 5)],
}));

const actionIcon: Record<string, typeof Plus> = {
  Created: Plus,
  Deleted: Trash2,
  Updated: Edit3,
  Approved: Activity,
  Rejected: Activity,
  'Logged In': LogIn,
  'Logged Out': LogOut,
  Exported: Download,
  Modified: Edit3,
};

const severityBadge: Record<string, { variant: 'default' | 'warning' | 'destructive'; label: string }> = {
  info: { variant: 'default', label: 'Info' },
  warning: { variant: 'warning', label: 'Warning' },
  critical: { variant: 'destructive', label: 'Critical' },
};

const resourceIcons: Record<string, typeof Building2> = {
  organization: Building2,
  mall: Store,
  restaurant: ShoppingBag,
  user: User,
  plan: Shield,
  commission: Activity,
  feature_flag: Settings,
  setting: Settings,
};

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [liveStream, setLiveStream] = useState(false);
  const pageSize = 12;

  const filtered = auditLogs.filter((log) => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesResource = resourceFilter === 'all' || log.resourceType === resourceFilter;
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    return matchesSearch && matchesAction && matchesResource && matchesSeverity;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const actions = [...new Set(auditLogs.map(l => l.action))];
  const resourceTypes = [...new Set(auditLogs.map(l => l.resourceType))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-sm text-muted-foreground">Track all administrative actions on the platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm">
            <Radio className={cn('h-4 w-4', liveStream ? 'text-red-500 animate-pulse' : 'text-muted-foreground')} />
            <span>{liveStream ? 'Live' : 'Off'}</span>
            <Switch checked={liveStream} onCheckedChange={setLiveStream} className="scale-75" />
          </div>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="h-9 rounded-lg border-none bg-muted pl-10 pr-4 text-sm"
            />
          </div>
          <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {actions.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={resourceFilter} onValueChange={(v) => { setResourceFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Resource" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resources</SelectItem>
              {resourceTypes.map((r) => <SelectItem key={r} value={r} className="capitalize">{r.replace('_', ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={(v) => { setSeverityFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[120px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">{filtered.length} entries</div>
      </div>

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((log) => {
                  const ActionIcon = actionIcon[log.action] || Activity;
                  const ResourceIcon = resourceIcons[log.resourceType] || Activity;
                  return (
                    <TableRow key={log.id} className="cursor-pointer" onClick={() => setSelectedLog(log)}>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(log.timestamp, 'long')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                            <User className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm font-medium">{log.user}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <ActionIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <ResourceIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{log.resource}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={severityBadge[log.severity].variant} className="text-[10px]">
                          {severityBadge[log.severity].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">{log.ip}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <Dialog open={!!selectedLog} onOpenChange={(o) => { if (!o) setSelectedLog(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>Full details of the audit log entry.</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Log ID</p>
                  <p className="text-sm font-medium">{selectedLog.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Timestamp</p>
                  <p className="text-sm font-medium">{formatDate(selectedLog.timestamp, 'long')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">User</p>
                  <p className="text-sm font-medium">{selectedLog.user}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">User Role</p>
                  <p className="text-sm font-medium capitalize">{selectedLog.userRole.replace('_', ' ')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Action</p>
                  <p className="text-sm font-medium">{selectedLog.action}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Resource</p>
                  <p className="text-sm font-medium">{selectedLog.resource}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Severity</p>
                  <Badge variant={severityBadge[selectedLog.severity].variant}>{severityBadge[selectedLog.severity].label}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">IP Address</p>
                  <p className="text-sm font-mono">{selectedLog.ip}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Details</p>
                <div className="rounded-lg border p-3 text-sm bg-muted/50">
                  {selectedLog.details}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
