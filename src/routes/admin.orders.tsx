import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Printer, Eye } from "lucide-react";
import { adminOrders, type AdminOrder } from "@/data/admin";
import { StatusBadge } from "./admin.index";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Orders — Shopzy Admin" }] }),
  component: () => <AdminShell title="Orders"><OrdersPage /></AdminShell>,
});

const STATUSES: AdminOrder["status"][] = ["Pending","Processing","Shipped","Delivered","Cancelled","Refunded"];

function OrdersPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [data, setData] = useState(adminOrders);

  const filtered = useMemo(() => data.filter((o) =>
    (status === "all" || o.status === status) &&
    (!q || o.id.toLowerCase().includes(q.toLowerCase()) || o.customer.toLowerCase().includes(q.toLowerCase())),
  ), [data, q, status]);

  const updateStatus = (id: string, s: AdminOrder["status"]) => {
    setData((prev) => prev.map((o) => o.id === id ? { ...o, status: s } : o));
    toast.success(`Order ${id} → ${s}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by order ID or customer…" className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline">Export CSV</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{o.customer}</div>
                    <div className="text-xs text-muted-foreground">{o.email}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{o.date}</TableCell>
                  <TableCell>{o.items}</TableCell>
                  <TableCell><span className="text-xs">{o.payment}</span></TableCell>
                  <TableCell className="font-medium">${o.total.toFixed(2)}</TableCell>
                  <TableCell><StatusBadge status={o.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as AdminOrder["status"])}>
                        <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                      <Button size="icon" variant="ghost" onClick={() => toast("Invoice queued for print")}>
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost"><Eye className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}