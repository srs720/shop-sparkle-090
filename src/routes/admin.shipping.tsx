import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Truck, Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logAdminAction } from "@/lib/admin-helpers";

export const Route = createFileRoute("/admin/shipping")({
  head: () => ({ meta: [{ title: "Shipping — Shopzy Admin" }, { name: "description", content: "Manage delivery zones, rates and couriers." }] }),
  component: () => <AdminShell title="Shipping"><Page /></AdminShell>,
});

function Page() {
  const qc = useQueryClient();
  const [zoneName, setZoneName] = useState("");
  const [courierName, setCourierName] = useState("");
  const [rateDraft, setRateDraft] = useState<Record<string, { label: string; price: string; min: string; max: string }>>({});
  const onErr = (e: Error) => toast.error(e.message);
  const inv = (k: string) => () => qc.invalidateQueries({ queryKey: [k] });

  const zones = useQuery({
    queryKey: ["admin-zones"],
    queryFn: async () => {
      const { data, error } = await supabase.from("shipping_zones").select("*, shipping_rates(*)").order("created_at");
      if (error) throw error; return data;
    },
  });
  const couriers = useQuery({
    queryKey: ["admin-couriers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courier_partners").select("*").order("sort_order");
      if (error) throw error; return data;
    },
  });

  const addZone = useMutation({
    mutationFn: async () => {
      const name = zoneName.trim(); if (!name) throw new Error("Zone name is required");
      const { error } = await supabase.from("shipping_zones").insert({ name, regions: [name], active: true }); if (error) throw error;
      await logAdminAction("zone.create", "shipping_zones", name);
    },
    onSuccess: () => { setZoneName(""); toast.success("Zone added"); inv("admin-zones")(); }, onError: onErr,
  });
  const toggleZone = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("shipping_zones").update({ active }).eq("id", id); if (error) throw error;
    }, onSuccess: inv("admin-zones"), onError: onErr,
  });
  const deleteZone = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("shipping_rates").delete().eq("zone_id", id);
      const { error } = await supabase.from("shipping_zones").delete().eq("id", id); if (error) throw error;
      await logAdminAction("zone.delete", "shipping_zones", id);
    }, onSuccess: () => { toast.success("Zone deleted"); inv("admin-zones")(); }, onError: onErr,
  });
  const addRate = useMutation({
    mutationFn: async (zone_id: string) => {
      const d = rateDraft[zone_id]; const price = Number(d?.price);
      if (!d?.label?.trim()) throw new Error("Rate label is required");
      if (!(price >= 0) || d.price === "") throw new Error("Enter a valid price");
      const { error } = await supabase.from("shipping_rates").insert({
        zone_id, label: d.label.trim(), price, eta_days_min: d.min ? Number(d.min) : null, eta_days_max: d.max ? Number(d.max) : null,
      }); if (error) throw error;
    },
    onSuccess: (_d, zone_id) => { setRateDraft((s) => ({ ...s, [zone_id]: { label: "", price: "", min: "", max: "" } })); toast.success("Rate added"); inv("admin-zones")(); }, onError: onErr,
  });
  const updateRate = useMutation({
    mutationFn: async ({ id, price }: { id: string; price: number }) => {
      if (!(price >= 0)) throw new Error("Invalid price");
      const { error } = await supabase.from("shipping_rates").update({ price }).eq("id", id); if (error) throw error;
    }, onSuccess: () => { toast.success("Rate updated"); inv("admin-zones")(); }, onError: onErr,
  });
  const deleteRate = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("shipping_rates").delete().eq("id", id); if (error) throw error; },
    onSuccess: inv("admin-zones"), onError: onErr,
  });
  const addCourier = useMutation({
    mutationFn: async () => {
      const name = courierName.trim(); if (!name) throw new Error("Courier name is required");
      const { error } = await supabase.from("courier_partners").insert({ name, sort_order: (couriers.data?.length ?? 0) + 1 }); if (error) throw error;
      await logAdminAction("courier.create", "courier_partners", name);
    }, onSuccess: () => { setCourierName(""); toast.success("Courier added"); inv("admin-couriers")(); }, onError: onErr,
  });
  const updateCourier = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: { enabled?: boolean; tracking_url?: string } }) => {
      const { error } = await supabase.from("courier_partners").update(patch).eq("id", id); if (error) throw error;
    }, onSuccess: inv("admin-couriers"), onError: onErr,
  });
  const deleteCourier = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("courier_partners").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Courier removed"); inv("admin-couriers")(); }, onError: onErr,
  });

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="text-base">Delivery Zones & Rates</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={zoneName} onChange={(e) => setZoneName(e.target.value)} placeholder="New zone name" />
            <Button onClick={() => addZone.mutate()} disabled={addZone.isPending}><Plus className="h-4 w-4" /> Add zone</Button>
          </div>
          {zones.isLoading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            : zones.error ? <p className="text-sm text-destructive">{(zones.error as Error).message}</p>
            : zones.data!.length === 0 ? <p className="text-sm text-muted-foreground">No zones yet.</p>
            : zones.data!.map((z) => {
              const d = rateDraft[z.id] ?? { label: "", price: "", min: "", max: "" };
              const setD = (p: Partial<typeof d>) => setRateDraft((s) => ({ ...s, [z.id]: { ...d, ...p } }));
              return (
                <div key={z.id} className="space-y-2 rounded-md border border-border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 font-medium">{z.name}</div>
                    <Switch checked={z.active} onCheckedChange={(v) => toggleZone.mutate({ id: z.id, active: v })} />
                    <Button size="icon" variant="ghost" aria-label="Delete zone" onClick={() => confirm(`Delete zone ${z.name}?`) && deleteZone.mutate(z.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                  {z.shipping_rates.map((r) => (
                    <div key={r.id} className="flex items-center gap-2 text-sm">
                      <span className="flex-1">{r.label} <span className="text-xs text-muted-foreground">{r.eta_days_min ?? "?"}–{r.eta_days_max ?? "?"} days</span></span>
                      <Input type="number" defaultValue={r.price} className="h-8 w-24" onBlur={(e) => Number(e.target.value) !== Number(r.price) && updateRate.mutate({ id: r.id, price: Number(e.target.value) })} />
                      <Button size="icon" variant="ghost" aria-label="Delete rate" onClick={() => deleteRate.mutate(r.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <div className="grid grid-cols-[1fr_80px_56px_56px_auto] gap-2">
                    <Input className="h-8" placeholder="Rate label" value={d.label} onChange={(e) => setD({ label: e.target.value })} />
                    <Input className="h-8" type="number" placeholder="Price" value={d.price} onChange={(e) => setD({ price: e.target.value })} />
                    <Input className="h-8" type="number" placeholder="Min" value={d.min} onChange={(e) => setD({ min: e.target.value })} />
                    <Input className="h-8" type="number" placeholder="Max" value={d.max} onChange={(e) => setD({ max: e.target.value })} />
                    <Button size="sm" variant="outline" onClick={() => addRate.mutate(z.id)}>Add</Button>
                  </div>
                </div>
              );
            })}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Courier Partners</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={courierName} onChange={(e) => setCourierName(e.target.value)} placeholder="New courier name" />
            <Button onClick={() => addCourier.mutate()} disabled={addCourier.isPending}><Plus className="h-4 w-4" /> Add</Button>
          </div>
          {couriers.isLoading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            : couriers.error ? <p className="text-sm text-destructive">{(couriers.error as Error).message}</p>
            : couriers.data!.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-md border border-border p-3">
              <div className="grid h-9 w-9 place-content-center rounded-md bg-secondary/15 text-secondary"><Truck className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{c.name}</div>
                <Label className="sr-only">Tracking URL</Label>
                <Input className="mt-1 h-7 text-xs" defaultValue={c.tracking_url ?? ""} placeholder="Tracking URL (https://…/{id})"
                  onBlur={(e) => e.target.value !== (c.tracking_url ?? "") && updateCourier.mutate({ id: c.id, patch: { tracking_url: e.target.value } })} />
              </div>
              <Switch checked={c.enabled} onCheckedChange={(v) => updateCourier.mutate({ id: c.id, patch: { enabled: v } })} />
              <Button size="icon" variant="ghost" aria-label="Delete courier" onClick={() => confirm(`Remove ${c.name}?`) && deleteCourier.mutate(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
