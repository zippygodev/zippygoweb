'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency, getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import {
  Bike,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  Star,
  TrendingUp,
  Shield,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Wifi,
  WifiOff,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

// Removed mock data

const statusOptions = ['All', 'ONLINE', 'OFFLINE', 'BUSY'];
const verificationOptions = ['All', 'VERIFIED', 'PENDING', 'REJECTED'];

const statusBadge: Record<string, string> = {
  ONLINE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  OFFLINE: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  BUSY: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
};

const verificationBadge: Record<string, string> = {
  VERIFIED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
};

import { toggleDeliveryPartnerStatus, deleteDeliveryPartner } from '@/actions/admin/delivery';

export default function DeliveryClient({ initialPartners }: { initialPartners: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const pageSize = 6;

  // Normalize data for UI
  const normalizedPartners = initialPartners.map(p => ({
    id: p.id,
    name: p.user?.name || 'Unknown',
    email: p.user?.email || 'Unknown',
    phone: p.user?.phone || 'Unknown',
    status: p.isOnline ? 'ONLINE' : (p.isAvailable ? 'OFFLINE' : 'BUSY'),
    verificationStatus: p.isVerified ? 'VERIFIED' : 'PENDING',
    rating: p.rating || 0,
    totalDeliveries: p.totalDeliveries || 0,
    completedDeliveries: p.totalDeliveries || 0, // Mock for completed
    cancelledDeliveries: 0,
    earnings: p.totalEarnings ? Number(p.totalEarnings) : 0,
    acceptanceRate: p.totalDeliveries > 0 ? 95 : 0, // Mock acceptance rate
    joinedDate: p.createdAt,
    documents: [{ name: 'Driver License', status: p.isVerified ? 'VERIFIED' : 'PENDING' }],
  }));

  const filtered = normalizedPartners.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesVerification = verificationFilter === 'All' || p.verificationStatus === verificationFilter;
    return matchesSearch && matchesStatus && matchesVerification;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Delivery Partners</h1>
          <p className="text-sm text-muted-foreground">Manage delivery partners and their verifications</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search delivery partners..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="h-9 rounded-lg pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[140px]">
              <Wifi className="mr-2 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>{s === 'All' ? 'All Status' : s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={verificationFilter} onValueChange={(v) => { setVerificationFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[160px]">
              <Shield className="mr-2 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {verificationOptions.map((v) => (
                <SelectItem key={v} value={v}>{v === 'All' ? 'All Verification' : v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((partner, i) => (
          <motion.div
            key={partner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${partner.name}`} />
                      <AvatarFallback>{getInitials(partner.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{partner.name}</p>
                      <p className="text-xs text-muted-foreground">{partner.email}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => { setSelectedPartner(partner); setShowDetailDialog(true); }}>
                        <FileText className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {partner.verificationStatus === 'PENDING' && (
                        <DropdownMenuItem>
                          <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" /> Verify
                        </DropdownMenuItem>
                      )}
                      {partner.verificationStatus === 'VERIFIED' && (
                        <DropdownMenuItem className="text-destructive">
                          <XCircle className="mr-2 h-4 w-4" /> Suspend
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="outline" className={cn('text-[11px]', statusBadge[partner.status])}>
                    {partner.status === 'ONLINE' ? <Wifi className="mr-1 h-3 w-3" /> : <WifiOff className="mr-1 h-3 w-3" />}
                    {partner.status}
                  </Badge>
                  <Badge variant="outline" className={cn('text-[11px]', verificationBadge[partner.verificationStatus])}>
                    {partner.verificationStatus}
                  </Badge>
                  {partner.rating > 0 && (
                    <div className="flex items-center gap-0.5 text-xs text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{partner.rating}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-2">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Deliveries</p>
                    <p className="text-sm font-bold">{partner.completedDeliveries}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Earnings</p>
                    <p className="text-sm font-bold">{formatCurrency(partner.earnings)}</p>
                  </div>
                </div>

                {partner.totalDeliveries > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Acceptance Rate</span>
                      <span className="font-medium">{partner.acceptanceRate}%</span>
                    </div>
                    <Progress value={partner.acceptanceRate} className="mt-1 h-1.5" />
                  </div>
                )}

                {partner.verificationStatus === 'PENDING' && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="flex-1 h-8 text-xs">
                      <ThumbsUp className="mr-1 h-3.5 w-3.5" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                      <ThumbsDown className="mr-1 h-3.5 w-3.5" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {paginated.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bike className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">No delivery partners found</p>
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Delivery Partner Details</DialogTitle>
            <DialogDescription>Detailed information and documents.</DialogDescription>
          </DialogHeader>
          {selectedPartner && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedPartner.name}`} />
                  <AvatarFallback className="text-lg">{getInitials(selectedPartner.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{selectedPartner.name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className={cn('text-[11px]', statusBadge[selectedPartner.status])}>
                      {selectedPartner.status}
                    </Badge>
                    <Badge variant="outline" className={cn('text-[11px]', verificationBadge[selectedPartner.verificationStatus])}>
                      {selectedPartner.verificationStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedPartner.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedPartner.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-lg border p-3">
                <div className="text-center">
                  <p className="text-xl font-bold">{selectedPartner.completedDeliveries}</p>
                  <p className="text-xs text-muted-foreground">Deliveries</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{selectedPartner.rating || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{selectedPartner.acceptanceRate}%</p>
                  <p className="text-xs text-muted-foreground">Acceptance</p>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold">Documents</h4>
                <div className="space-y-2">
                  {selectedPartner.documents.map((doc: any) => (
                    <div key={doc.name} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{doc.name}</span>
                      </div>
                      <Badge variant="outline" className={cn('text-[11px]', verificationBadge[doc.status])}>
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm font-medium">Total Earnings</span>
                <span className="text-lg font-bold text-emerald-600">{formatCurrency(selectedPartner.earnings)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
