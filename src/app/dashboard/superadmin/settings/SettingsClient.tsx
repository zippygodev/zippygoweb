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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Settings,
  Save,
  Building2,
  Mail,
  Shield,
  Key,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Globe,
  Bell,
  Lock,
  Users,
  FileText,
  RefreshCw,
} from 'lucide-react';

const apiKeys = [
  { id: 'KEY-001', name: 'Production API Key', key: 'zg_prod_8a7b6c5d4e3f2g1h', created: '2026-01-15', lastUsed: '2026-06-26', status: 'active' },
  { id: 'KEY-002', name: 'Staging API Key', key: 'zg_stag_1a2b3c4d5e6f7g8h', created: '2026-01-15', lastUsed: '2026-06-25', status: 'active' },
  { id: 'KEY-003', name: 'Development Key', key: 'zg_dev_9h8g7f6e5d4c3b2a', created: '2026-03-01', lastUsed: '2026-06-20', status: 'active' },
];

const emailTemplates = [
  { id: 'TMP-001', name: 'Welcome Email', subject: 'Welcome to Zippy Go!', updated: '2026-06-01', status: 'active' },
  { id: 'TMP-002', name: 'Password Reset', subject: 'Reset your Zippy Go password', updated: '2026-05-15', status: 'active' },
  { id: 'TMP-003', name: 'Order Confirmation', subject: 'Order #{{order_id}} confirmed', updated: '2026-06-10', status: 'active' },
  { id: 'TMP-004', name: 'New Restaurant Request', subject: 'New restaurant registration request', updated: '2026-04-20', status: 'active' },
  { id: 'TMP-005', name: 'Invoice', subject: 'Your Zippy Go invoice for {{period}}', updated: '2026-06-01', status: 'inactive' },
];

const defaultRoles = [
  { role: 'Super Admin', permissions: 'Full access to all platform features', users: 2 },
  { role: 'Org Admin', permissions: 'Manage organization, malls, restaurants, users', users: 8 },
  { role: 'Mall Admin', permissions: 'Manage mall, restaurants, orders', users: 24 },
  { role: 'Restaurant Admin', permissions: 'Manage restaurant menu, orders, staff', users: 156 },
  { role: 'Customer', permissions: 'Browse, order, manage profile', users: 52150 },
];

import { toggleFeatureFlag } from '@/actions/superadmin/settings';

export default function SettingsClient({ featureFlags }: { featureFlags: any[] }) {
  const [showKey, setShowKey] = useState<string | null>(null);

  async function handleToggleFlag(id: string, enabled: boolean) {
    await toggleFeatureFlag(id, enabled);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Global Settings</h1>
          <p className="text-sm text-muted-foreground">Platform-wide configuration and preferences.</p>
        </div>
        <Button size="sm" className="h-9">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="flex-wrap">
          <TabsTrigger value="general">Platform</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="flags">Feature Flags</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Platform Information
              </CardTitle>
              <CardDescription>Basic platform settings and branding.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Platform Name</Label>
                  <Input defaultValue="Zippy Go" />
                </div>
                <div className="grid gap-2">
                  <Label>Support Email</Label>
                  <Input type="email" defaultValue="support@zippygo.com" />
                </div>
                <div className="grid gap-2">
                  <Label>Support Phone</Label>
                  <Input defaultValue="+91-1800-123-4567" />
                </div>
                <div className="grid gap-2">
                  <Label>Website URL</Label>
                  <Input defaultValue="https://zippygo.com" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Platform Description</Label>
                <Textarea defaultValue="One Food Court. One Cart. One Checkout. Zippy Go connects food courts with customers for seamless multi-restaurant ordering." rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Platform Defaults
              </CardTitle>
              <CardDescription>Default settings for new organizations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Default Plan for New Orgs</p>
                    <p className="text-xs text-muted-foreground">Assigned on registration</p>
                  </div>
                  <Select defaultValue="starter">
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Default Commission Rate</p>
                    <p className="text-xs text-muted-foreground">Applied to new restaurants</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue={18} className="h-9 w-20 text-center" />
                    <span className="text-sm">%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Auto-Approve Restaurants</p>
                    <p className="text-xs text-muted-foreground">Skip moderation for verified orgs</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Maintenance Mode</p>
                    <p className="text-xs text-muted-foreground">Disable platform access for users</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Default Roles & Permissions
              </CardTitle>
              <CardDescription>Predefined roles with granular permissions.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="text-center">Users</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defaultRoles.map((r) => (
                    <TableRow key={r.role}>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">{r.role}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.permissions}</TableCell>
                      <TableCell className="text-center font-medium">{r.users.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Templates
                </CardTitle>
                <CardDescription>Manage email notification templates.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="h-8">
                <Plus className="mr-2 h-4 w-4" />
                Add Template
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailTemplates.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono">{t.subject}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{t.updated}</TableCell>
                      <TableCell>
                        <Badge variant={t.status === 'active' ? 'success' : 'warning'}>{t.status === 'active' ? 'Active' : 'Inactive'}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8">
                          <FileText className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure platform security policies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Require 2FA for all admin accounts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Session Timeout (minutes)</p>
                  <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
                </div>
                <Input type="number" defaultValue={60} className="h-9 w-24 text-center" />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Max Login Attempts</p>
                  <p className="text-xs text-muted-foreground">Lock account after failed attempts</p>
                </div>
                <Input type="number" defaultValue={5} className="h-9 w-20 text-center" />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Password Policy</p>
                  <p className="text-xs text-muted-foreground">Minimum password requirements</p>
                </div>
                <Select defaultValue="strong">
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (8+ chars)</SelectItem>
                    <SelectItem value="medium">Medium (10+ chars, mixed)</SelectItem>
                    <SelectItem value="strong">Strong (12+ chars, special)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">IP Whitelist Enforcement</p>
                  <p className="text-xs text-muted-foreground">Restrict admin access to whitelisted IPs</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Audit Log Retention (days)</p>
                  <p className="text-xs text-muted-foreground">How long to keep audit logs</p>
                </div>
                <Select defaultValue="90">
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  API Keys
                </CardTitle>
                <CardDescription>Manage platform API access keys.</CardDescription>
              </div>
              <Button size="sm" className="h-8">
                <Plus className="mr-2 h-4 w-4" />
                Generate Key
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((ak) => (
                    <TableRow key={ak.id}>
                      <TableCell className="font-medium">{ak.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono">
                            {showKey === ak.id ? ak.key : `${ak.key.substring(0, 12)}...${ak.key.substring(ak.key.length - 4)}`}
                          </code>
                          <button onClick={() => setShowKey(showKey === ak.id ? null : ak.id)} className="text-muted-foreground hover:text-foreground">
                            {showKey === ak.id ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                          <button onClick={() => navigator.clipboard.writeText(ak.key)} className="text-muted-foreground hover:text-foreground">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{ak.created}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{ak.lastUsed}</TableCell>
                      <TableCell>
                        <Badge variant={ak.status === 'active' ? 'success' : 'warning'} className="text-[10px]">{ak.status === 'active' ? 'Active' : 'Revoked'}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="Regenerate">
                            <RefreshCw className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" title="Revoke">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="flags" className="space-y-6">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Feature Flags
                </CardTitle>
                <CardDescription>Manage experimental features and beta access.</CardDescription>
              </div>
              <Button size="sm" className="h-8">
                <Plus className="mr-2 h-4 w-4" />
                Add Flag
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {featureFlags.map((ff) => (
                    <TableRow key={ff.id}>
                      <TableCell className="font-mono text-sm">{ff.key}</TableCell>
                      <TableCell className="font-medium">{ff.name}</TableCell>
                      <TableCell>
                        <Switch checked={ff.enabled} onCheckedChange={(checked) => handleToggleFlag(ff.id, checked)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {featureFlags.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No feature flags found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
