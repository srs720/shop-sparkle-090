import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, Package, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { statusStyles } from "@/lib/admin-helpers";
import { useRealtimeInvalidate } from "@/hooks/useStoreProducts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — Shopzy Admin" }] }),
  component: () => <AdminShell title="Dashboard"><Dashboard /></AdminShell>,
});

function Dashboard() {
  useRealtimeInvalidate("orders", "admin-dashboard");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard", "stats"],
    queryFn: async () => {
      const [orders, customers, lowStock, refunds] = await Promise.all([
        supabase.from("orders").select("total", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }).lt("stock", 10),
        supabase.from("refund_requests").select("id", { count: "exact", head: true }).eq("status", "requested"),
      ]);
      const revenue = (orders.data ?? []).reduce((s, o) => s + Number(o.total ?? 0), 0);
      return {
        revenue, ordersCount: orders.count ?? 0,
        customers: customers.count ?? 0,
        lowStock: lowStock.count ?? 0, refunds: refunds.count ?? 0,
      };
    },
  });

  const { data: trend = [] } = useQuery({
    queryKey: ["admin-dashboard", "trend"],
    queryFn: async () => {
      const since = new Date(Date.now() - 30 * 86400000).toISOString();
      const { data } = await supabase.from("orders").select("total, created_at").gte("created_at", since);
      const buckets: Record<string, number> = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
        buckets[d] = 0;
      }
      (data ?? []).forEach((o) => {
        const d = o.created_at.slice(0, 10);
        if (d in buckets) buckets[d] += Number(o.total);
      });
      return Object.entries(buckets).map(([day, revenue]) => ({ day: day.slice(5), revenue: +revenue.toFixed(2) }));
    },
  });

  const { data: recent = [] } = useQuery({
    queryKey: ["admin-dashboard", "recent"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(8);
      return data ?? [];
    },
  });

  const cards = [
    { label: "Total Revenue", value: `$${(stats?.revenue ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`, icon: DollarSign },
    { label: "Total Orders", value: (stats?.ordersCount ?? 0).toLocaleString(), icon: ShoppingBag },
    { label: "Customers", value: (stats?.customers ?? 0).toLocaleString(), icon: Users },
    { label: "Low Stock", value: (stats?.lowStock ?? 0).toLocaleString(), icon: AlertTriangle, hot: true },
    { label: "Pending Refunds", value: (stats?.refunds ?? 0).toLocaleString(), icon: Package, hot: true },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((s) => {
          const I = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
                    <p className="mt-2 text-2xl font-bold">{statsLoading ? <Skeleton className="h-7 w-20" /> : s.value}</p>
                  </div>
                  <div className={cn("grid h-10 w-10 place-content-center rounded-lg", s.hot ? "bg-warning/15 text-warning" : "bg-secondary/15 text-secondary")}>
                    <I className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-success">
                  <ArrowUpRight className="h-3.5 w-3.5" /> Live
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Revenue — Last 30 Days</CardTitle>
          <Badge variant="outline"><TrendingUp className="h-3 w-3 mr-1" /> Live</Badge>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-secondary)" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Recent Orders</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Order #</TableHead><TableHead>Customer</TableHead><TableHead>Date</TableHead>
              <TableHead>Total</TableHead><TableHead>Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {recent.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.order_number}</TableCell>
                  <TableCell>{o.customer_name ?? "Guest"}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">${Number(o.total).toFixed(2)}</TableCell>
                  <TableCell><StatusBadge status={o.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const cls = statusStyles[status?.toLowerCase?.()] ?? statusStyles.pending;
  return <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize", cls)}>{status}</span>;
}
