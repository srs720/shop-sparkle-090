import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Tag } from "lucide-react";

export const Route = createFileRoute("/admin/promotions")({
  head: () => ({ meta: [{ title: "Promotions — Shopzy Admin" }] }),
  component: () => <AdminShell title="Promotions"><Page /></AdminShell>,
});

const coupons = [
  { code: "WELCOME10", type: "%", value: 10, expiry: "2026-12-31", used: 420, active: true },
  { code: "FREESHIP", type: "Free shipping", value: 0, expiry: "2026-09-30", used: 1280, active: true },
  { code: "MEGA50", type: "%", value: 50, expiry: "2026-07-15", used: 92, active: false },
  { code: "FLAT200", type: "Flat", value: 200, expiry: "2026-08-20", used: 234, active: true },
];

function Page() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader><CardTitle className="text-base">Active Coupons</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Code</TableHead><TableHead>Type</TableHead><TableHead>Value</TableHead>
              <TableHead>Expires</TableHead><TableHead>Used</TableHead><TableHead>Active</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {coupons.map((c) => (
                <TableRow key={c.code}>
                  <TableCell className="font-mono">{c.code}</TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell>{c.type === "%" ? `${c.value}%` : c.type === "Flat" ? `$${c.value}` : "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{c.expiry}</TableCell>
                  <TableCell>{c.used}</TableCell>
                  <TableCell><Switch defaultChecked={c.active} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Tag className="h-4 w-4" /> Create Coupon</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Code</Label><Input placeholder="SUMMER25" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select defaultValue="percent">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Percentage</SelectItem>
                  <SelectItem value="flat">Flat amount</SelectItem>
                  <SelectItem value="ship">Free shipping</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Value</Label><Input type="number" placeholder="25" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Min cart</Label><Input type="number" placeholder="50" /></div>
            <div><Label>Max uses</Label><Input type="number" placeholder="1000" /></div>
          </div>
          <div><Label>Expires</Label><Input type="date" /></div>
          <Button className="w-full">Create coupon</Button>
        </CardContent>
      </Card>
    </div>
  );
}