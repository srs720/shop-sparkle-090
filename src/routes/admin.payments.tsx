import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "./admin.index";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ title: "Payments — Shopzy Admin" }] }),
  component: () => <AdminShell title="Payments & Finance"><Page /></AdminShell>,
});

function Page() {
  const qc = useQueryClient();
  const { data: txns = [], isLoading: tLoading } = useQuery({
    queryKey: ["admin-payments-txns"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("id,order_number,total,payment_method,payment_status,status,created_at").order("created_at",{ascending:false}).limit(30);
      return data ?? [];
    },
  });
  const { data: gateways = [] } = useQuery({
    queryKey: ["payment-gateways"],
    queryFn: async () => {
      const { data } = await supabase.from("payment_gateways").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const toggle = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error } = await supabase.from("payment_gateways").update({ enabled }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Gateway updated"); qc.invalidateQueries({ queryKey: ["payment-gateways"] }); },
  });

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader><CardTitle className="text-base">Recent Transactions</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Method</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {tLoading ? Array.from({length:6}).map((_,i)=>(<TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-8 w-full"/></TableCell></TableRow>))
              : txns.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.order_number}</TableCell>
                  <TableCell>{o.payment_method}</TableCell>
                  <TableCell className="font-medium">${Number(o.total).toFixed(2)}</TableCell>
                  <TableCell><StatusBadge status={o.payment_status === "paid" ? "delivered" : "pending"} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Payment Gateways</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {gateways.map((g) => (
            <div key={g.id} className="flex items-center justify-between rounded-md border border-border/70 p-3">
              <div><div className="font-medium">{g.name}</div><div className="text-xs text-muted-foreground uppercase">{g.id}</div></div>
              <Switch checked={g.enabled} onCheckedChange={(v) => toggle.mutate({ id: g.id, enabled: v })} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
