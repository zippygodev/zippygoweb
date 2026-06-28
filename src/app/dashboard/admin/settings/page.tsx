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
  Settings,
  Store,
  Clock,
  Percent,
  Bell,
  CreditCard,
  Save,
  MapPin,
  Phone,
  Mail,
  Globe,
  Sun,
  Moon,
} from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Mall Settings</h1>
          <p className="text-sm text-muted-foreground">Configure mall-wide platform settings</p>
        </div>
        <Button onClick={handleSave} className="h-9">
          {saved ? (
            <>Saved!</>
          ) : (
            <><Save className="mr-2 h-4 w-4" /> Save Changes</>
          )}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="hours">Operating Hours</TabsTrigger>
          <TabsTrigger value="fees">Tax & Fees</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payments">Payment Gateway</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mall Information</CardTitle>
              <CardDescription>Basic information about your mall</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Mall Name</Label>
                  <Input defaultValue="Grand Mall" />
                </div>
                <div className="space-y-2">
                  <Label>Mall Code</Label>
                  <Input defaultValue="GRAND01" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input defaultValue="123 Mall Road, Sector 18, Noida, UP 201301" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue="+91 1800 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" defaultValue="admin@grandmall.com" />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input defaultValue="https://grandmall.com" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Number of Floors</Label>
                  <Input type="number" defaultValue={3} />
                </div>
                <div className="space-y-2">
                  <Label>Total Restaurant Capacity</Label>
                  <Input type="number" defaultValue={30} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Branding</CardTitle>
              <CardDescription>Platform appearance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Platform Name</Label>
                  <Input defaultValue="Zippy Go" />
                </div>
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-[#E11D48]">
                      <span className="text-[10px] text-white font-medium">HEX</span>
                    </div>
                    <Input defaultValue="#E11D48" className="flex-1 font-mono" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Default Theme</span>
                </div>
                <Select defaultValue="system">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Operating Hours</CardTitle>
              <CardDescription>Set mall-wide operating hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="w-24">
                    <span className="text-sm font-medium">{day}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked={day !== 'Sunday'} />
                    <span className="text-xs text-muted-foreground">Open</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="time" defaultValue="08:00" className="h-8 w-28" />
                    <span className="text-xs text-muted-foreground">to</span>
                    <Input type="time" defaultValue={day === 'Sunday' ? '18:00' : '22:00'} className="h-8 w-28" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Commission & Tax Settings</CardTitle>
              <CardDescription>Configure platform fees and taxes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Default Commission Rate</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue={18} className="text-right" />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>GST Rate</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue={18} className="text-right" />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Service Fee</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue={5} className="text-right" />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Delivery Fee (per km)</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue={10} className="text-right" />
                    <span className="text-sm text-muted-foreground">₹</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Minimum Delivery Fee</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue={30} className="text-right" />
                    <span className="text-sm text-muted-foreground">₹</span>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Free Delivery Threshold</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue={299} className="text-right" />
                    <span className="text-sm text-muted-foreground">₹</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Max Delivery Distance</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue={10} className="text-right" />
                    <span className="text-sm text-muted-foreground">km</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Packing Charges</CardTitle>
              <CardDescription>Configure packing fee structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm">Enable Packing Charges</span>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Packing Fee Per Item</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue={5} className="text-right" />
                    <span className="text-sm text-muted-foreground">₹</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Settings</CardTitle>
              <CardDescription>Configure email and push notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">New Restaurant Registration</p>
                    <p className="text-xs text-muted-foreground">Notify when a new restaurant applies to join</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Order Cancellations</p>
                    <p className="text-xs text-muted-foreground">Notify when an order is cancelled</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Payment Disputes</p>
                    <p className="text-xs text-muted-foreground">Notify when a payment dispute is raised</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Daily Reports</p>
                    <p className="text-xs text-muted-foreground">Receive daily summary email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">System Alerts</p>
                    <p className="text-xs text-muted-foreground">Notify about system health issues</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">New User Signups</p>
                    <p className="text-xs text-muted-foreground">Notify about new user registrations</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Gateway Configuration</CardTitle>
              <CardDescription>Configure payment processing settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Payment Gateway</Label>
                <Select defaultValue="razorpay">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="phonepe">PhonePe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input type="password" defaultValue="rzp_live_xxxxxxxxxxxx" />
                </div>
                <div className="space-y-2">
                  <Label>API Secret</Label>
                  <Input type="password" defaultValue="••••••••••••••••" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Webhook Secret</Label>
                <Input type="password" defaultValue="whsec_xxxxxxxxxxxx" />
              </div>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Enabled Payment Methods</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: 'UPI (GPay, PhonePe, Paytm)', default: true },
                    { label: 'Credit/Debit Cards', default: true },
                    { label: 'Net Banking', default: true },
                    { label: 'Cash on Delivery', default: true },
                    { label: 'Wallet (Paytm, Amazon Pay)', default: false },
                    { label: 'EMI', default: false },
                  ].map((method) => (
                    <div key={method.label} className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm">{method.label}</span>
                      <Switch defaultChecked={method.default} />
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Settlement Cycle</Label>
                <Select defaultValue="daily">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Auto-settle payments</p>
                  <p className="text-xs text-muted-foreground">Automatically process settlements to restaurants</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
