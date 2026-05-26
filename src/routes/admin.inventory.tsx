import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, ArrowDown, ArrowUp, Package } from "lucide-react";
import { stockLogs } from "@/data/admin";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({ meta: [{ title: "Inventory — Shopzy Admin" }] }),
  component: () => <AdminShell title="Inventory"><Page /></AdminShell>,
});

function Page() {
  const low = products.slice(0, 6).map((p, i) => ({ ...p, stock: [3, 7, 0, 12, 5, 9][i] }));
  const summary = [
    { label: "Total SKUs", value: "1,284", icon: Package },
    { label: "Low Stock", value: "23", icon: AlertTriangle, color: "text-warning" },
    { label: "Out of Stock", value: "5", icon: AlertTriangle, color: "text-destructive" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {summary.map((s) => {
          const I = s.icon;
          return (
            <Card key={s.label}><CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-2xl font-bold">{s.value}</p>
              </div>
              <I className={cn("h-8 w-8", s.color ?? "text-secondary")} />
            </CardContent></Card>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> Low Stock Alerts</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>SKU</TableHead><TableHead>Stock</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {low.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="flex items-center gap-2">
                      <img src={p.image} className="h-8 w-8 rounded object-cover" alt="" />
                      <span className="truncate max-w-[180px]">{p.title}</span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">SKU-{p.id}</TableCell>
                    <TableCell><span className={cn("text-sm font-medium", p.stock === 0 ? "text-destructive" : "text-warning")}>{p.stock}</span></TableCell>
                    <TableCell><button className="text-xs text-secondary hover:underline">Restock</button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Stock In/Out Log</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Type</TableHead><TableHead>Qty</TableHead><TableHead>By</TableHead><TableHead>When</TableHead></TableRow></TableHeader>
              <TableBody>
                {stockLogs.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{l.product}</TableCell>
                    <TableCell>
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                        l.type === "IN" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive")}>
                        {l.type === "IN" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />} {l.type}
                      </span>
                    </TableCell>
                    <TableCell>{l.qty}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{l.by}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{l.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}