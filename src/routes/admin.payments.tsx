import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { adminOrders } from "@/data/admin";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ title: "Payments — Shopzy Admin" }] }),
  component: () => <AdminShell title="Payments & Finance"><Page /></AdminShell>,
});

function Page() {
  const txns = adminOrders.slice(0, 20);
  const refunds = adminOrders.filter((o) => o.status === "Refunded").slice(0, 5);
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader><CardTitle className="text-base">Transaction Log</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Txn ID</TableHead><TableHead>Order</TableHead><TableHead>Method</TableHead>
              <TableHead>Amount</TableHead><TableHead>Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {txns.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">TXN-{o.id.replace("#ORD-","")}</TableCell>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell>{o.payment}</TableCell>
                  <TableCell className="font-medium">${o.total.toFixed(2)}</TableCell>
                  <TableCell className="text-success text-xs">Captured</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Refund Requests</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {refunds.map((o) => (
            <div key={o.id} className="rounded-md border border-border p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs">{o.id}</span>
                <span className="text-sm font-medium">${o.total.toFixed(2)}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{o.customer} · {o.date}</div>
              <div className="mt-2 flex gap-2">
                <Button size="sm" className="flex-1">Approve</Button>
                <Button size="sm" variant="outline" className="flex-1">Reject</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}