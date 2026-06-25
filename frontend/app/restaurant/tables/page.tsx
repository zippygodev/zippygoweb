"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import {
  Table2,
  Plus,
  QrCode,
  Users,
  CheckCircle2,
  Circle,
  Trash2,
  Download,
  RefreshCw,
} from "lucide-react";

interface Table {
  id: string;
  number: number;
  capacity: number;
  isOccupied: boolean;
  qrCode: string | null;
}

interface QRModal {
  open: boolean;
  table: Table | null;
  qrData: any;
}

export default function TablesPage() {
  const queryClient = useQueryClient();
  const [restaurantId, setRestaurantId] = React.useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [qrModal, setQrModal] = React.useState<QRModal>({ open: false, table: null, qrData: null });
  const [newTable, setNewTable] = React.useState({ number: 1, capacity: 4 });

  // Get restaurant ID from the first available restaurant (owner's)
  React.useEffect(() => {
    api.get("/restaurants?limit=1").then(({ data }) => {
      const r = data?.data?.[0] || data?.[0];
      if (r) setRestaurantId(r.id);
    });
  }, []);

  const { data: tables, isLoading, refetch } = useQuery({
    queryKey: ["tables", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      const { data } = await api.get(`/restaurants/${restaurantId}/tables`);
      return data as Table[];
    },
    enabled: !!restaurantId,
  });

  const addTable = useMutation({
    mutationFn: async (data: { number: number; capacity: number }) => {
      const res = await api.post(`/restaurants/${restaurantId}/tables`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables", restaurantId] });
      setAddDialogOpen(false);
      toast.success("Table added successfully");
    },
    onError: () => toast.error("Failed to add table"),
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ tableId, isOccupied }: { tableId: string; isOccupied: boolean }) => {
      const res = await api.patch(`/restaurants/${restaurantId}/tables/${tableId}/status`, { isOccupied });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables", restaurantId] });
    },
  });

  const deleteTable = useMutation({
    mutationFn: async (tableId: string) => {
      await api.delete(`/restaurants/${restaurantId}/tables/${tableId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables", restaurantId] });
      toast.success("Table deleted");
    },
  });

  const showQR = async (table: Table) => {
    try {
      const { data } = await api.get(`/restaurants/${restaurantId}/tables/${table.number}/qr`);
      setQrModal({ open: true, table, qrData: data });
    } catch {
      toast.error("Failed to generate QR code");
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `table-${qrModal.table?.number}-qr.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const occupiedCount = tables?.filter((t) => t.isOccupied).length || 0;
  const totalCount = tables?.length || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Table Management</h1>
          <p className="text-muted-foreground">
            Manage dine-in tables and QR codes for contactless ordering
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add Table
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <Table2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCount}</p>
              <p className="text-sm text-muted-foreground">Total Tables</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
              <Users className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{occupiedCount}</p>
              <p className="text-sm text-muted-foreground">Occupied</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCount - occupiedCount}</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tables Grid */}
      {!restaurantId ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          Loading restaurant data...
        </div>
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-48 animate-pulse bg-muted" />
          ))}
        </div>
      ) : tables?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20">
          <Table2 className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No tables yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Add tables to manage your dine-in service with QR codes
          </p>
          <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Table
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tables?.map((table, i) => (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card
                className={`relative overflow-hidden p-5 transition-all ${
                  table.isOccupied
                    ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10"
                    : "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10"
                }`}
              >
                {/* Status indicator */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {table.isOccupied ? (
                      <Circle className="h-3 w-3 fill-red-500 text-red-500" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    )}
                    <Badge
                      variant={table.isOccupied ? "destructive" : "success"}
                      className="text-[10px]"
                    >
                      {table.isOccupied ? "Occupied" : "Available"}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-red-600"
                    onClick={() => deleteTable.mutate(table.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Table Number */}
                <div className="mb-3 text-center">
                  <p className="text-4xl font-black text-foreground">
                    {String(table.number).padStart(2, "0")}
                  </p>
                  <p className="text-xs text-muted-foreground">Table</p>
                </div>

                {/* Capacity */}
                <div className="mb-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{table.capacity} seats</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() => showQR(table)}
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    QR Code
                  </Button>
                  <Button
                    variant={table.isOccupied ? "outline" : "default"}
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() => toggleStatus.mutate({ tableId: table.id, isOccupied: !table.isOccupied })}
                  >
                    {table.isOccupied ? "Free" : "Occupy"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Table Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Table</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tableNumber">Table Number</Label>
              <Input
                id="tableNumber"
                type="number"
                min={1}
                value={newTable.number}
                onChange={(e) => setNewTable((prev) => ({ ...prev, number: parseInt(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Seating Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                max={20}
                value={newTable.capacity}
                onChange={(e) => setNewTable((prev) => ({ ...prev, capacity: parseInt(e.target.value) }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => addTable.mutate(newTable)}
              disabled={addTable.isPending}
            >
              {addTable.isPending ? "Adding..." : "Add Table"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      <Dialog open={qrModal.open} onOpenChange={(o) => setQrModal((prev) => ({ ...prev, open: o }))}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              Table {qrModal.table?.number} — QR Code
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-center text-sm text-muted-foreground">
              Customers scan this to order directly from Table {qrModal.table?.number}
            </p>
            {qrModal.qrData && (
              <div className="rounded-2xl bg-white p-4 shadow-lg">
                <QRCode
                  id="qr-code-svg"
                  value={qrModal.qrData.qrUrl || qrModal.qrData.qrData || ""}
                  size={200}
                  fgColor="#064e3b"
                />
              </div>
            )}
            <div className="text-center">
              <p className="text-xs font-mono text-muted-foreground">
                {qrModal.qrData?.qrData}
              </p>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {qrModal.qrData?.qrUrl}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQrModal({ open: false, table: null, qrData: null })}>
              Close
            </Button>
            <Button onClick={downloadQR} className="gap-2">
              <Download className="h-4 w-4" />
              Download QR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
