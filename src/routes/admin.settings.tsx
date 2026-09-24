import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Copy, Trash2, KeyRound } from "lucide-react";
import { useAppSetting } from "@/hooks/useAppSetting";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logAdminAction } from "@/lib/admin-helpers";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Shopzy Admin" }, { name: "description", content: "Store brand, tax, currency and API settings." }] }),
  component: () => <AdminShell title="Settings"><Page /></AdminShell>,
});

const brandDefault = { store_name: "Shopzy Marketplace", support_email: "support@shopzy.com", logo_url: "", description: "" };
const taxDefault = { currency: "bdt", vat_rate: 15, tax_inclusive: true };
const hookDefault = { webhook_url: "" };

function useDraft<T>(value: T) {
  const [draft, setDraft] = useState(value);
  const json = JSON.stringify(value);
  useEffect(() => setDraft(value), [json]); // eslint-disable-line react-hooks/exhaustive-deps
  return [draft, setDraft] as const;
}

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function Page() {
  const brand = useAppSetting("brand", brandDefault);
  const tax = useAppSetting("tax", taxDefault);
  const hook = useAppSetting("webhooks", hookDefault);
  const [b, setB] = useDraft(brand.data);
  const [t, setT] = useDraft(tax.data);
  const [h, setH] = useDraft(hook.data);
  const qc = useQueryClient();
  const [label, setLabel] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);

  const keys = useQuery({
    queryKey: ["admin-api-keys"],
    queryFn: async () => {
      const { data, error } = await supabase.from("api_keys").select("id,label,prefix,revoked,created_at").order("created_at", { ascending: false });
      if (error) throw error; return data;
    },
  });
  const createKey = useMutation({
    mutationFn: async () => {
      const bytes = crypto.getRandomValues(new Uint8Array(24));
      const raw = "sk_live_" + Array.from(bytes).map((x) => x.toString(16).padStart(2, "0")).join("");
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("api_keys").insert({ label: label.trim() || "API key", prefix: raw.slice(0, 12), key_hash: await sha256(raw), created_by: user?.id });
      if (error) throw error;
      await logAdminAction("api_key.create", "api_keys", raw.slice(0, 12));
      return raw;
    },
    onSuccess: (raw) => { setNewKey(raw); setLabel(""); qc.invalidateQueries({ queryKey: ["admin-api-keys"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const revokeKey = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("api_keys").update({ revoked: true }).eq("id", id); if (error) throw error;
      await logAdminAction("api_key.revoke", "api_keys", id);
    },
    onSuccess: () => { toast.success("Key revoked"); qc.invalidateQueries({ queryKey: ["admin-api-keys"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const testHook = useMutation({
    mutationFn: async () => {
      if (!/^https:\/\//.test(h.webhook_url)) throw new Error("Save an https:// webhook URL first");
      await fetch(h.webhook_url, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ event: "test", sent_at: new Date().toISOString() }) });
    },
    onSuccess: () => toast.success("Test event sent"), onError: (e: Error) => toast.error(e.message),
  });

  const saveBrand = () => {
    if (!b.store_name.trim()) return toast.error("Store name is required");
    if (b.support_email && !/^\S+@\S+\.\S+$/.test(b.support_email)) return toast.error("Invalid support email");
    brand.save.mutate(b);
  };
  const saveTax = () => {
    const rate = Number(t.vat_rate);
    if (!(rate >= 0 && rate <= 100)) return toast.error("VAT must be between 0 and 100");
    tax.save.mutate({ ...t, vat_rate: rate });
  };

  if (brand.isLoading || tax.isLoading) return <Loader2 className="mx-auto h-6 w-6 animate-spin" />;

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="tax">Tax & Currency</TabsTrigger>
        <TabsTrigger value="api">API & Webhooks</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card><CardHeader><CardTitle className="text-base">Brand Identity</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div><Label>Store name</Label><Input value={b.store_name} onChange={(e) => setB({ ...b, store_name: e.target.value })} /></div>
            <div><Label>Support email</Label><Input value={b.support_email} onChange={(e) => setB({ ...b, support_email: e.target.value })} /></div>
            <div className="md:col-span-2"><Label>Logo URL</Label><Input value={b.logo_url} onChange={(e) => setB({ ...b, logo_url: e.target.value })} placeholder="https://…/logo.png" /></div>
            <div className="md:col-span-2"><Label>Store description</Label><Textarea rows={3} value={b.description} onChange={(e) => setB({ ...b, description: e.target.value })} /></div>
            <div className="md:col-span-2"><Button disabled={brand.save.isPending} onClick={saveBrand}>{brand.save.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Save changes</Button></div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tax">
        <Card><CardHeader><CardTitle className="text-base">Tax & Currency</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div><Label>Default currency</Label>
              <Select value={t.currency} onValueChange={(v) => setT({ ...t, currency: v })}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD — US Dollar</SelectItem>
                  <SelectItem value="bdt">BDT — Bangladeshi Taka</SelectItem>
                  <SelectItem value="eur">EUR — Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>VAT rate (%)</Label><Input type="number" value={t.vat_rate} onChange={(e) => setT({ ...t, vat_rate: e.target.value as unknown as number })} /></div>
            <div className="flex items-center justify-between rounded-md border border-border p-3 md:col-span-2">
              <div><div className="font-medium text-sm">Display prices including tax</div><div className="text-xs text-muted-foreground">Customers see tax-inclusive prices</div></div>
              <Switch checked={t.tax_inclusive} onCheckedChange={(v) => setT({ ...t, tax_inclusive: v })} />
            </div>
            <div className="md:col-span-2"><Button disabled={tax.save.isPending} onClick={saveTax}>{tax.save.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Save</Button></div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="api" className="space-y-4">
        <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><KeyRound className="h-4 w-4" /> API Keys</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex gap-2">
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Key label (e.g. Mobile app)" />
              <Button disabled={createKey.isPending} onClick={() => createKey.mutate()}>Generate key</Button>
            </div>
            {newKey && (
              <div className="rounded-md border border-warning/40 bg-warning/10 p-3 text-sm">
                <div className="mb-1 font-medium">Copy this key now — it won't be shown again.</div>
                <div className="flex gap-2"><Input readOnly value={newKey} className="font-mono text-xs" />
                  <Button size="icon" variant="outline" aria-label="Copy key" onClick={() => { navigator.clipboard.writeText(newKey); toast.success("Copied"); }}><Copy className="h-4 w-4" /></Button></div>
              </div>
            )}
            {keys.isLoading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : keys.data?.length === 0 ? <p className="text-sm text-muted-foreground">No API keys yet.</p> :
              keys.data?.map((k) => (
                <div key={k.id} className="flex items-center gap-3 rounded-md border border-border p-2 text-sm">
                  <div className="flex-1"><div className="font-medium">{k.label}</div><div className="font-mono text-xs text-muted-foreground">{k.prefix}… · {new Date(k.created_at).toLocaleDateString()}</div></div>
                  {k.revoked ? <span className="text-xs text-muted-foreground">Revoked</span> :
                    <Button size="sm" variant="ghost" onClick={() => confirm("Revoke this key?") && revokeKey.mutate(k.id)}><Trash2 className="h-4 w-4 text-destructive" /> Revoke</Button>}
                </div>
              ))}
          </CardContent>
        </Card>
        <Card><CardHeader><CardTitle className="text-base">Webhook</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            <div><Label>Webhook URL</Label><Input value={h.webhook_url} onChange={(e) => setH({ webhook_url: e.target.value })} placeholder="https://yourdomain.com/webhook" /></div>
            <div className="flex gap-2">
              <Button disabled={hook.save.isPending} onClick={() => h.webhook_url && !/^https:\/\//.test(h.webhook_url) ? toast.error("URL must start with https://") : hook.save.mutate(h)}>Save</Button>
              <Button variant="outline" disabled={testHook.isPending} onClick={() => testHook.mutate()}>Send test webhook</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
