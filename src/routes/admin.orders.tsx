import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeInvalidate } from "@/hooks/useStoreProducts";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Printer, Download } from "lucide-react";
import { StatusBadge } from "./admin.index";
import { ORDER_STATUSES, downloadCSV, logAdminAction, type OrderStatus } from "@/lib/admin-helpers";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Orders — Shopzy Admin" }] }),
  component: () => <AdminShell title="Orders"><OrdersPage /></AdminShell>,
});

function OrdersPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  useRealtimeInvalidate("orders", "admin-orders");

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-orders", { q, status }],
    queryFn: async () => {
      let req = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(100);
      if (status !== "all") req = req.eq("status", status as OrderStatus);
      if (q.trim()) req = req.or(`order_number.ilike.%${q}%,customer_name.ilike.%${q}%,customer_email.ilike.%${q}%`);
      const { data, error } = await req;
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, s }: { id: string; s: OrderStatus }) => {
      const { error } = await supabase.from("orders").update({ status: s }).eq("id", id);
      if (error) throw error;
      await logAdminAction("order.status_changed", "orders", id, { status: s });
    },
    onSuccess: () => { toast.success("Order updated"); qc.invalidateQueries({ queryKey: ["admin-orders"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order # or customer…" className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ORDER_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => downloadCSV("orders.csv", data)}><Download className="h-4 w-4" /> Export CSV</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Order #</TableHead><TableHead>Customer</TableHead><TableHead>Date</TableHead>
              <TableHead>Payment</TableHead><TableHead>Total</TableHead>
              <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {isLoading ? Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
              )) : data.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">No orders yet</TableCell></TableRow>
              ) : data.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.order_number}</TableCell>
                  <TableCell>
                    <div className="font-medium">{o.customer_name ?? "Guest"}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</TableCell>
                  <TableCell><span className="text-xs">{o.payment_method}</span></TableCell>
                  <TableCell className="font-medium">${Number(o.total).toFixed(2)}</TableCell>
                  <TableCell><StatusBadge status={o.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Select value={o.status} onValueChange={(v) => updateStatus.mutate({ id: o.id, s: v as OrderStatus })}>
                        <SelectTrigger className="h-8 w-[130px] text-xs capitalize"><SelectValue /></SelectTrigger>
                        <SelectContent>{ORDER_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                      </Select>
                      <Button size="icon" variant="ghost" onClick={() => toast("Invoice queued for print")}><Printer className="h-4 w-4" /></Button>
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
