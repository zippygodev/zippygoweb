"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, BarChart3, TrendingUp } from "lucide-react";

const reports = [
  { name: "Monthly Performance Report", type: "PDF", date: "Dec 2024", size: "2.4 MB" },
  { name: "Revenue Summary", type: "CSV", date: "Q4 2024", size: "1.1 MB" },
  { name: "Restaurant Rankings", type: "PDF", date: "Dec 2024", size: "856 KB" },
  { name: "Customer Insights", type: "PDF", date: "Dec 2024", size: "3.2 MB" },
  { name: "Peak Hours Analysis", type: "CSV", date: "Dec 2024", size: "524 KB" },
];

export default function MallReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and download reports</p>
        </div>
        <Button className="gap-2"><BarChart3 className="h-4 w-4" /> Generate Report</Button>
      </div>

      <Tabs defaultValue="generated">
        <TabsList>
          <TabsTrigger value="generated">Generated Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="generated" className="mt-6">
          <Card>
            <div className="divide-y">
              {reports.map((report) => (
                <div key={report.name} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">{report.date} • {report.size}</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" /> Download
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card className="flex h-48 items-center justify-center text-muted-foreground">
            No scheduled reports yet
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card className="flex h-48 items-center justify-center text-muted-foreground">
            Report templates will appear here
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
