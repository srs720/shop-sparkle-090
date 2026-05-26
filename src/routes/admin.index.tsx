import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts";
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminOrders, revenueSeries } from "@/data/admin";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — Shopzy Admin" }] }),
  component: () => <AdminShell title="Dashboard"><Dashboard /></AdminShell>,
});

const stats = [
  { label: "Total Sales", value: "$284,920", change: 12.4, up: true, icon: DollarSign },
  { label: "Active Orders", value: "1,284", change: 4.1, up: true, icon: ShoppingBag },
  { label: "Revenue (MTD)", value: "$48,310", change: -2.3, up: false, icon: TrendingUp },
  { label: "New Customers", value: "642", change: 9.7, up: true, icon: Users },
];

function Dashboard() {
  const recent = adminOrders.slice(0, 8);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const I = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
                    <p className="mt-2 text-2xl font-bold">{s.value}</p>
                  </div>
                  <div className="grid h-10 w-10 place-content-center rounded-lg bg-secondary/15 text-secondary"><I className="h-5 w-5" /></div>
                </div>
                <div className={cn("mt-3 flex items-center gap-1 text-xs", s.up ? "text-success" : "text-destructive")}>
                  {s.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {Math.abs(s.change)}% <span className="text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Revenue Overview</CardTitle>
            <Badge variant="outline">Last 12 months</Badge>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-secondary)" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Orders vs Refunds</CardTitle></CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="orders" fill="var(--color-secondary)" radius={[4,4,0,0]} />
                <Bar dataKey="refunds" fill="var(--color-destructive)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Orders</CardTitle>
          <Badge variant="outline">{adminOrders.length} total</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell>{o.customer}</TableCell>
                  <TableCell className="text-muted-foreground">{o.date}</TableCell>
                  <TableCell className="font-medium">${o.total.toFixed(2)}</TableCell>
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
  const map: Record<string, string> = {
    Pending: "bg-warning/15 text-warning border-warning/30",
    Processing: "bg-secondary/15 text-secondary border-secondary/30",
    Shipped: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    Delivered: "bg-success/15 text-success border-success/30",
    Cancelled: "bg-muted text-muted-foreground border-border",
    Refunded: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium", map[status] ?? map.Pending)}>{status}</span>;
}