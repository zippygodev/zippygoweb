'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/toast';
import { updateRestaurantSettings } from '@/actions/restaurant/settings';

export default function SettingsClient({ initialSettings }: { initialSettings: any }) {
  const [form, setForm] = useState(initialSettings || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleToggle = (name: string, checked: boolean) => {
    setForm({ ...form, [name]: checked });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const res = await updateRestaurantSettings(formData);
    if (res.success) {
      toast({ title: 'Settings Updated', description: 'Restaurant settings saved successfully.', variant: 'success' });
    } else {
      toast({ title: 'Error', description: res.error || 'Failed to update settings', variant: 'destructive' });
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your restaurant profile and operations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Profile</CardTitle>
            <CardDescription>General information about your restaurant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Restaurant Name</label>
              <Input name="name" value={form.name || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input name="phone" value={form.phone || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input name="email" value={form.email || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Textarea name="address" value={form.address || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea name="description" value={form.description || ''} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operations</CardTitle>
            <CardDescription>Configure timings and operational parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Accepting Orders</p>
                <p className="text-xs text-muted-foreground">Turn on/off incoming orders</p>
              </div>
              <Switch checked={form.isOpen} onCheckedChange={(c) => handleToggle('isOpen', c)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Opening Time</label>
                <Input type="time" name="openingTime" value={form.openingTime || ''} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Closing Time</label>
                <Input type="time" name="closingTime" value={form.closingTime || ''} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prep Time (mins)</label>
                <Input type="number" name="preparationTime" value={form.preparationTime || 20} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Delivery Time (mins)</label>
                <Input type="number" name="deliveryTime" value={form.deliveryTime || 30} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Order Amount (₹)</label>
                <Input type="number" name="minOrderAmount" value={form.minOrderAmount || 0} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Delivery Fee (₹)</label>
                <Input type="number" name="deliveryFee" value={form.deliveryFee || 0} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
