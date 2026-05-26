import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeInvalidate } from "@/hooks/useStoreProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Package } from "lucide-react";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({ meta: [{ title: "Inventory — Shopzy Admin" }] }),
  component: () => <AdminShell title="Inventory"><Page /></AdminShell>,
});

function Page() {
  useRealtimeInvalidate("products", "admin-inventory");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-inventory"],
    queryFn: async () => {
      const [all, low, out] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }).gt("stock", 0).lt("stock", 10),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("stock", 0),
      ]);
      const { data: rows } = await supabase.from("products").select("id,name,sku,stock,category,image_url").lt("stock", 15).order("stock").limit(20);
      return { total: all.count ?? 0, low: low.count ?? 0, out: out.count ?? 0, rows: rows ?? [] };
    },
  });

  const summary = [
    { label: "Total SKUs", value: data?.total ?? 0, icon: Package },
    { label: "Low Stock", value: data?.low ?? 0, icon: AlertTriangle, color: "text-warning" },
    { label: "Out of Stock", value: data?.out ?? 0, icon: AlertTriangle, color: "text-destructive" },
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
                <p className="mt-2 text-2xl font-bold">{isLoading ? <Skeleton className="h-7 w-12" /> : s.value.toLocaleString()}</p>
              </div>
              <I className={`h-7 w-7 ${s.color ?? "text-secondary"}`} />
            </CardContent></Card>
          );
        })}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Low Stock Alerts</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>SKU</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Stock</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading ? Array.from({length:5}).map((_,i)=>(<TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-8 w-full"/></TableCell></TableRow>))
              : (data?.rows ?? []).map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="flex items-center gap-2"><img src={p.image_url ?? ""} className="h-8 w-8 rounded object-cover bg-muted" alt="" /> <span className="font-medium">{p.name}</span></TableCell>
                  <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                  <TableCell className="text-muted-foreground capitalize">{p.category}</TableCell>
                  <TableCell className="text-right"><span className={p.stock === 0 ? "font-bold text-destructive" : "font-bold text-warning"}>{p.stock}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
