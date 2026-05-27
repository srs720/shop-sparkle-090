import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, Package, AlertTriangle,
  Plus, ArrowRight, Activity, Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { statusStyles } from "@/lib/admin-helpers";
import { useRealtimeInvalidate } from "@/hooks/useStoreProducts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — Shopzy Admin" }] }),
  component: () => (
    <AdminShell
      title="Dashboard"
      subtitle="Real-time overview of your store performance"
      actions={
        <Button asChild size="sm" className="gap-1.5">
          <Link to="/admin/products"><Plus className="h-4 w-4" /> Add Product</Link>
        </Button>
      }
      fab={
        <Button asChild size="lg" className="h-14 w-14 rounded-full shadow-lg shadow-secondary/30">
          <Link to="/admin/products" aria-label="Add product"><Plus className="h-6 w-6" /></Link>
        </Button>
      }
    >
      <Dashboard />
    </AdminShell>
  ),
});

function Dashboard() {
  useRealtimeInvalidate("orders", "admin-dashboard");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard", "stats"],
    queryFn: async () => {
      const [orders, customers, lowStock, refunds, products, activeOrders] = await Promise.all([
        supabase.from("orders").select("total", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }).lt("stock", 10),
        supabase.from("refund_requests").select("id", { count: "exact", head: true }).eq("status", "requested"),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }).in("status", ["pending", "confirmed", "processing", "shipped"]),
      ]);
      const revenue = (orders.data ?? []).reduce((s, o) => s + Number(o.total ?? 0), 0);
      return {
        revenue, ordersCount: orders.count ?? 0,
        activeOrders: activeOrders.count ?? 0,
        productsCount: products.count ?? 0,
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

  const { data: traffic = [] } = useQuery({
    queryKey: ["admin-dashboard", "traffic"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("payment_method").limit(500);
      const counts: Record<string, number> = {};
      (data ?? []).forEach((o) => {
        const k = (o.payment_method ?? "Other").toString();
        counts[k] = (counts[k] ?? 0) + 1;
      });
      const entries = Object.entries(counts).map(([name, value]) => ({ name, value }));
      return entries.length ? entries : [
        { name: "Direct", value: 42 }, { name: "Search", value: 28 },
        { name: "Social", value: 18 }, { name: "Referral", value: 12 },
      ];
    },
  });

  const { data: topProducts = [] } = useQuery({
    queryKey: ["admin-dashboard", "top-products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("id,name,price,image_url,stock,rating").order("rating", { ascending: false, nullsFirst: false }).limit(5);
      return data ?? [];
    },
  });

  const { data: lowStockItems = [] } = useQuery({
    queryKey: ["admin-dashboard", "low-stock"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("id,name,stock").lt("stock", 10).order("stock", { ascending: true }).limit(6);
      return data ?? [];
    },
  });

  const { data: recent = [] } = useQuery({
    queryKey: ["admin-dashboard", "recent"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(6);
      return data ?? [];
    },
  });

  const cards = [
    { label: "Total Revenue", value: `$${(stats?.revenue ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`, sub: "All-time gross", icon: DollarSign, tone: "secondary" as const },
    { label: "Active Orders", value: (stats?.activeOrders ?? 0).toLocaleString(), sub: `${stats?.ordersCount ?? 0} lifetime`, icon: ShoppingBag, tone: "secondary" as const },
    { label: "Total Products", value: (stats?.productsCount ?? 0).toLocaleString(), sub: `${stats?.customers ?? 0} customers`, icon: Package, tone: "secondary" as const },
    { label: "Low Stock Alerts", value: (stats?.lowStock ?? 0).toLocaleString(), sub: `${stats?.refunds ?? 0} refunds pending`, icon: AlertTriangle, tone: "warning" as const },
  ];

  const PIE_COLORS = ["var(--color-secondary)", "var(--color-primary)", "var(--color-warning)", "var(--color-success)", "var(--color-deal)"];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* KPI Cards — 2x2 on mobile, 4 cols desktop */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {cards.map((s) => {
          const I = s.icon;
          return (
            <Card key={s.label} className="overflow-hidden">
              <CardContent className="p-3 md:p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs uppercase tracking-wide text-muted-foreground truncate">{s.label}</p>
                    <p className="mt-1.5 text-xl md:text-2xl font-bold">{statsLoading ? <Skeleton className="h-7 w-16" /> : s.value}</p>
                  </div>
                  <div className={cn(
                    "grid h-8 w-8 md:h-10 md:w-10 shrink-0 place-content-center rounded-lg",
                    s.tone === "warning" ? "bg-warning/15 text-warning" : "bg-secondary/15 text-secondary",
                  )}>
                    <I className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-success" /> {s.sub}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts row — stacked on mobile, 2 cols desktop (2/1 split) */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Sales Overview</CardTitle>
              <p className="text-xs text-muted-foreground">Revenue · Last 30 days</p>
            </div>
            <Badge variant="outline" className="gap-1"><TrendingUp className="h-3 w-3" /> Live</Badge>
          </CardHeader>
          <CardContent className="h-[220px] md:h-[280px] p-2 md:p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 5, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-secondary)" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Traffic Sources</CardTitle>
            <p className="text-xs text-muted-foreground">By payment method</p>
          </CardHeader>
          <CardContent className="h-[220px] md:h-[280px] p-2 md:p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={traffic}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {traffic.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row — Top Products / Recent Orders / Live Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Top Products</CardTitle>
            <Link to="/admin/products" className="flex items-center gap-1 text-xs text-secondary hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2 p-3 md:p-4">
            {topProducts.length === 0 ? (
              <EmptyMini label="No products yet" />
            ) : topProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent/50 transition-colors">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                  {p.image_url && <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" loading="lazy" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">${Number(p.price ?? 0).toFixed(2)} · {p.stock ?? 0} in stock</div>
                </div>
                {p.rating != null && (
                  <Badge variant="outline" className="text-[10px]">★ {Number(p.rating).toFixed(1)}</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <Link to="/admin/orders" className="flex items-center gap-1 text-xs text-secondary hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-[11px]">Order</TableHead>
                  <TableHead className="text-[11px]">Total</TableHead>
                  <TableHead className="text-[11px]">Status</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {recent.length === 0 ? (
                    <TableRow><TableCell colSpan={3}><EmptyMini label="No orders yet" /></TableCell></TableRow>
                  ) : recent.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono text-xs">{o.order_number}</TableCell>
                      <TableCell className="font-medium">${Number(o.total).toFixed(2)}</TableCell>
                      <TableCell><StatusBadge status={o.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Mobile list cards */}
            <div className="md:hidden space-y-2 p-3">
              {recent.length === 0 ? <EmptyMini label="No orders yet" /> : recent.map((o) => (
                <div key={o.id} className="rounded-lg border border-border/70 bg-background/60 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs">{o.order_number}</span>
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground truncate">{o.customer_name ?? "Guest"}</span>
                    <span className="font-semibold">${Number(o.total).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-warning" /> Live Activity
            </CardTitle>
            <Badge variant="outline" className="text-[10px] gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2 p-3 md:p-4">
            {lowStockItems.length === 0 ? (
              <EmptyMini label="All stock levels healthy" />
            ) : lowStockItems.map((p) => (
              <div key={p.id} className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 p-2.5">
                <Zap className="h-4 w-4 shrink-0 text-warning mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium">Low stock: {p.name}</div>
                  <div className="text-[11px] text-muted-foreground">Only {p.stock} units remaining</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptyMini({ label }: { label: string }) {
  return <div className="py-6 text-center text-xs text-muted-foreground">{label}</div>;
}

export function StatusBadge({ status }: { status: string }) {
  const cls = statusStyles[status?.toLowerCase?.()] ?? statusStyles.pending;
  return <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize", cls)}>{status}</span>;
}
