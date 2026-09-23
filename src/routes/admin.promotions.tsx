import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Tag, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logAdminAction } from "@/lib/admin-helpers";
import { useRealtimeInvalidate } from "@/hooks/useStoreProducts";

export const Route = createFileRoute("/admin/promotions")({
  head: () => ({ meta: [{ title: "Promotions — Shopzy Admin" }] }),
  component: () => <AdminShell title="Promotions"><Page /></AdminShell>,
});

const empty = { code: "", discount_type: "percent", discount_value: "", min_order: "", max_uses: "", expires_at: "" };

function Page() {
  const qc = useQueryClient();
  useRealtimeInvalidate("coupons", "admin-coupons");
  const [form, setForm] = useState(empty);
  const { data: coupons = [], isLoading, error } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-coupons"] });

  const create = useMutation({
    mutationFn: async () => {
      const code = form.code.trim().toUpperCase();
      if (!code) throw new Error("Code is required");
      const value = Number(form.discount_value || 0);
      if (form.discount_type !== "free_shipping" && value <= 0) throw new Error("Value must be greater than 0");
      if (form.discount_type === "percent" && value > 100) throw new Error("Percentage cannot exceed 100");
      const { error } = await supabase.from("coupons").insert({
        code, discount_type: form.discount_type, discount_value: value,
        min_order: form.min_order ? Number(form.min_order) : null,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        expires_at: form.expires_at ? new Date(form.expires_at + "T23:59:59").toISOString() : null,
        active: true,
      });
      if (error) throw error;
      await logAdminAction("coupon.create", "coupons", code);
    },
    onSuccess: () => { toast.success("Coupon created"); setForm(empty); refresh(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const toggle = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("coupons").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh, onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
      await logAdminAction("coupon.delete", "coupons", id);
    },
    onSuccess: () => { toast.success("Coupon deleted"); refresh(); }, onError: (e: Error) => toast.error(e.message),
  });

  const fmt = (c: (typeof coupons)[number]) =>
    c.discount_type === "percent" ? `${c.discount_value}%` : c.discount_type === "free_shipping" ? "—" : `৳${c.discount_value}`;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader><CardTitle className="text-base">Coupons ({coupons.length})</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? <div className="p-6 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
            : error ? <div className="p-6 text-sm text-destructive">{(error as Error).message}</div>
            : coupons.length === 0 ? <div className="p-6 text-sm text-muted-foreground">No coupons yet.</div>
            : (
            <Table>
              <TableHeader><TableRow>
                <TableHead>Code</TableHead><TableHead>Type</TableHead><TableHead>Value</TableHead>
                <TableHead>Expires</TableHead><TableHead>Used</TableHead><TableHead>Active</TableHead><TableHead />
              </TableRow></TableHeader>
              <TableBody>
                {coupons.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono">{c.code}</TableCell>
                    <TableCell className="capitalize">{c.discount_type.replace("_", " ")}</TableCell>
                    <TableCell>{fmt(c)}</TableCell>
                    <TableCell className="text-muted-foreground">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "Never"}</TableCell>
                    <TableCell>{c.used_count}{c.max_uses ? ` / ${c.max_uses}` : ""}</TableCell>
                    <TableCell><Switch checked={c.active} onCheckedChange={(v) => toggle.mutate({ id: c.id, active: v })} /></TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" onClick={() => confirm(`Delete ${c.code}?`) && remove.mutate(c.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Tag className="h-4 w-4" /> Create Coupon</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="SUMMER25" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select value={form.discount_type} onValueChange={(v) => setForm({ ...form, discount_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Percentage</SelectItem>
                  <SelectItem value="fixed">Flat amount</SelectItem>
                  <SelectItem value="free_shipping">Free shipping</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Value</Label><Input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} placeholder="25" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Min cart</Label><Input type="number" value={form.min_order} onChange={(e) => setForm({ ...form, min_order: e.target.value })} placeholder="50" /></div>
            <div><Label>Max uses</Label><Input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} placeholder="1000" /></div>
          </div>
          <div><Label>Expires</Label><Input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} /></div>
          <Button className="w-full" disabled={create.isPending} onClick={() => create.mutate()}>
            {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Create coupon
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
