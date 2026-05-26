import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Download } from "lucide-react";
import { downloadCSV } from "@/lib/admin-helpers";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — Shopzy Admin" }] }),
  component: () => <AdminShell title="Reports"><Page /></AdminShell>,
});

const COLORS = ["var(--color-secondary)","var(--color-primary)","var(--color-success)","var(--color-warning)","var(--color-destructive)","var(--color-chart-4)"];

function Page() {
  const { data: catSales = [] } = useQuery({
    queryKey: ["report-category-sales"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("category, sold_count, price");
      const map = new Map<string, number>();
      (data ?? []).forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + Number(p.price) * (p.sold_count ?? 0)));
      return Array.from(map.entries()).map(([name, value]) => ({ name, value: Math.round(value) }));
    },
  });

  const { data: monthly = [] } = useQuery({
    queryKey: ["report-monthly"],
    queryFn: async () => {
      const since = new Date(Date.now() - 365 * 86400000).toISOString();
      const { data } = await supabase.from("orders").select("total, created_at").gte("created_at", since);
      const buckets: Record<string, { orders: number; revenue: number }> = {};
      (data ?? []).forEach((o) => {
        const m = o.created_at.slice(0, 7);
        if (!buckets[m]) buckets[m] = { orders: 0, revenue: 0 };
        buckets[m].orders++;
        buckets[m].revenue += Number(o.total);
      });
      return Object.entries(buckets).sort().map(([month, v]) => ({ month: month.slice(5), ...v, revenue: +v.revenue.toFixed(0) }));
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => downloadCSV("sales-by-category.csv", catSales)}><Download className="h-4 w-4" /> Export CSV</Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Sales by Category</CardTitle></CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={catSales} dataKey="value" nameKey="name" outerRadius={110} label>
                  {catSales.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend /><Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Monthly Revenue</CardTitle></CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background:"var(--color-card)", border:"1px solid var(--color-border)" }} />
                <Bar dataKey="revenue" fill="var(--color-secondary)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
