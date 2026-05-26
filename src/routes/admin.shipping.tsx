import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Truck, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/shipping")({
  head: () => ({ meta: [{ title: "Shipping — Shopzy Admin" }] }),
  component: () => <AdminShell title="Shipping"><Page /></AdminShell>,
});

const zones = [
  { name: "Dhaka City", rate: 60, eta: "1-2 days", active: true },
  { name: "Outside Dhaka", rate: 120, eta: "3-5 days", active: true },
  { name: "Chittagong", rate: 110, eta: "2-4 days", active: true },
  { name: "International — SAARC", rate: 1800, eta: "7-12 days", active: false },
];
const partners = ["Pathao Courier","Steadfast","RedX","Sundarban","DHL Express"];

function Page() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Delivery Zones</CardTitle>
          <Button size="sm"><Plus className="h-4 w-4" /> Add zone</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {zones.map((z) => (
            <div key={z.name} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 rounded-md border border-border p-3">
              <div>
                <div className="font-medium">{z.name}</div>
                <div className="text-xs text-muted-foreground">ETA {z.eta}</div>
              </div>
              <Input defaultValue={z.rate} className="w-24" />
              <Switch defaultChecked={z.active} />
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Courier Partners</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {partners.map((p) => (
            <div key={p} className="flex items-center gap-3 rounded-md border border-border p-3">
              <div className="grid h-9 w-9 place-content-center rounded-md bg-secondary/15 text-secondary"><Truck className="h-4 w-4" /></div>
              <div className="flex-1">
                <div className="font-medium">{p}</div>
                <div className="text-xs text-muted-foreground">API: connected</div>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div><Label>API Key</Label><Input placeholder="sk_live_…" /></div>
            <div><Label>Webhook URL</Label><Input placeholder="https://…" /></div>
          </div>
          <Button className="w-full">Save partner settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}