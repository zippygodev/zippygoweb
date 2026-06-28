'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  CreditCard,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Crown,
  Zap,
  Star,
  Rocket,
  Building2,
  Store,
  ShoppingBag,
  Users as UsersIcon,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billing: 'monthly' | 'yearly';
  status: 'active' | 'inactive';
  features: string[];
  maxOrgs: number;
  maxMalls: number;
  maxRestaurants: number;
  maxUsers: number;
  commissionRate: number;
  support: 'basic' | 'standard' | 'priority' | 'dedicated';
}

const plans: Plan[] = [
  {
    id: 'PLN-001', name: 'Starter', description: 'For small food courts getting started',
    price: 4999, billing: 'monthly', status: 'active',
    features: ['Up to 5 restaurants', 'Basic analytics', 'Email support', 'Standard commission', 'Single mall'],
    maxOrgs: 1, maxMalls: 1, maxRestaurants: 5, maxUsers: 500, commissionRate: 20, support: 'basic',
  },
  {
    id: 'PLN-002', name: 'Professional', description: 'For growing food court businesses',
    price: 14999, billing: 'monthly', status: 'active',
    features: ['Up to 25 restaurants', 'Advanced analytics', 'Priority support', 'Reduced commission', 'Up to 3 malls', 'Custom branding', 'API access'],
    maxOrgs: 1, maxMalls: 3, maxRestaurants: 25, maxUsers: 3000, commissionRate: 18, support: 'priority',
  },
  {
    id: 'PLN-003', name: 'Enterprise', description: 'For large-scale food court operations',
    price: 49999, billing: 'monthly', status: 'active',
    features: ['Unlimited restaurants', 'Full analytics suite', 'Dedicated support', 'Lowest commission', 'Unlimited malls', 'Custom branding', 'API access', 'SLA guarantee', 'White-label option', 'Advanced reporting'],
    maxOrgs: 999, maxMalls: 999, maxRestaurants: 999, maxUsers: 50000, commissionRate: 15, support: 'dedicated',
  },
];

const planIcons: Record<string, typeof Star> = {
  Starter: Star,
  Professional: Zap,
  Enterprise: Crown,
};

const planColors: Record<string, string> = {
  Starter: 'from-blue-500 to-blue-600',
  Professional: 'from-amber-500 to-amber-600',
  Enterprise: 'from-primary to-rose-600',
};

const allFeatures = [
  'Restaurant management', 'Order management', 'Menu management', 'Basic analytics',
  'Advanced analytics', 'Full analytics suite', 'Email support', 'Priority support',
  'Dedicated support', 'Custom branding', 'White-label option', 'API access',
  'SLA guarantee', 'Advanced reporting', 'Multi-mall support', 'Bulk operations',
];

export default function PlansPage() {
  const [planDialog, setPlanDialog] = useState<'create' | 'edit' | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Subscription Plans</h1>
          <p className="text-sm text-muted-foreground">Manage platform subscription plans and pricing.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9" onClick={() => setShowComparison(!showComparison)}>
            <TrendingUp className="mr-2 h-4 w-4" />
            {showComparison ? 'Hide Comparison' : 'Compare Plans'}
          </Button>
          <Dialog open={planDialog === 'create'} onOpenChange={(o) => setPlanDialog(o ? 'create' : null)}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9">
                <Plus className="mr-2 h-4 w-4" />
                Create Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Subscription Plan</DialogTitle>
                <DialogDescription>Define a new pricing plan.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Plan Name</Label>
                    <Input placeholder="e.g., Premium" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Price (₹)</Label>
                    <Input type="number" placeholder="9999" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Brief description of the plan" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Billing</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Commission Rate (%)</Label>
                    <Input type="number" placeholder="18" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Max Malls</Label>
                    <Input type="number" placeholder="1" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Max Restaurants</Label>
                    <Input type="number" placeholder="10" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Max Users</Label>
                    <Input type="number" placeholder="1000" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Support Level</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="dedicated">Dedicated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Features</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {allFeatures.map((f) => (
                      <label key={f} className="flex items-center gap-2 text-sm">
                        <Switch />
                        {f}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPlanDialog(null)}>Cancel</Button>
                <Button>Create Plan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {showComparison ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Plan Comparison</CardTitle>
            <CardDescription>Compare features across all plans</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Feature</TableHead>
                  {plans.map((p) => (
                    <TableHead key={p.id} className="text-center">{p.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Price</TableCell>
                  {plans.map((p) => (
                    <TableCell key={p.id} className="text-center font-bold">{formatCurrency(p.price)}/mo</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Max Malls</TableCell>
                  {plans.map((p) => (
                    <TableCell key={p.id} className="text-center">{p.maxMalls === 999 ? 'Unlimited' : p.maxMalls}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Max Restaurants</TableCell>
                  {plans.map((p) => (
                    <TableCell key={p.id} className="text-center">{p.maxRestaurants === 999 ? 'Unlimited' : p.maxRestaurants}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Max Users</TableCell>
                  {plans.map((p) => (
                    <TableCell key={p.id} className="text-center">{p.maxUsers === 50000 ? 'Unlimited' : p.maxUsers.toLocaleString()}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Commission Rate</TableCell>
                  {plans.map((p) => (
                    <TableCell key={p.id} className="text-center">{p.commissionRate}%</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Support</TableCell>
                  {plans.map((p) => (
                    <TableCell key={p.id} className="text-center capitalize">{p.support}</TableCell>
                  ))}
                </TableRow>
                {allFeatures.map((feature) => (
                  <TableRow key={feature}>
                    <TableCell className="font-medium">{feature}</TableCell>
                    {plans.map((p) => (
                      <TableCell key={p.id} className="text-center">
                        {p.features.includes(feature) ? (
                          <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="mx-auto h-4 w-4 text-muted-foreground/40" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => {
            const Icon = planIcons[plan.name] || Star;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={cn(
                  'relative overflow-hidden transition-shadow hover:shadow-lg',
                  plan.name === 'Enterprise' && 'ring-2 ring-primary'
                )}>
                  {plan.name === 'Enterprise' && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary">Popular</Badge>
                    </div>
                  )}
                  <div className={cn('bg-gradient-to-r p-6 text-white', planColors[plan.name])}>
                    <Icon className="h-8 w-8 mb-2" />
                    <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm opacity-90 mt-1">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                      <span className="text-sm opacity-80">/{plan.billing}</span>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Commission Rate</span>
                        <span className="font-medium">{plan.commissionRate}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Max Malls</span>
                        <span className="font-medium">{plan.maxMalls === 999 ? 'Unlimited' : plan.maxMalls}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Max Restaurants</span>
                        <span className="font-medium">{plan.maxRestaurants === 999 ? 'Unlimited' : plan.maxRestaurants}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Support</span>
                        <span className="font-medium capitalize">{plan.support}</span>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Features</p>
                      <div className="space-y-2">
                        {plan.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-destructive border-destructive hover:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
