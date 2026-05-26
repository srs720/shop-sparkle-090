import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Shopzy Admin" }] }),
  component: () => <AdminShell title="Settings"><Page /></AdminShell>,
});

function Page() {
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
            <div><Label>Store name</Label><Input defaultValue="Shopzy Marketplace" /></div>
            <div><Label>Support email</Label><Input defaultValue="support@shopzy.com" /></div>
            <div className="md:col-span-2"><Label>Logo</Label><Input type="file" /></div>
            <div className="md:col-span-2"><Label>Store description</Label><Textarea rows={3} defaultValue="Bangladesh's biggest online marketplace." /></div>
            <div className="md:col-span-2"><Button>Save changes</Button></div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tax">
        <Card><CardHeader><CardTitle className="text-base">Tax & Currency</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div><Label>Default currency</Label>
              <Select defaultValue="usd"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD — US Dollar</SelectItem>
                  <SelectItem value="bdt">BDT — Bangladeshi Taka</SelectItem>
                  <SelectItem value="eur">EUR — Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>VAT rate (%)</Label><Input type="number" defaultValue={15} /></div>
            <div className="flex items-center justify-between rounded-md border border-border p-3 md:col-span-2">
              <div><div className="font-medium text-sm">Display prices including tax</div><div className="text-xs text-muted-foreground">Customers see tax-inclusive prices</div></div>
              <Switch defaultChecked />
            </div>
            <div className="md:col-span-2"><Button>Save</Button></div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="api">
        <Card><CardHeader><CardTitle className="text-base">API Configuration</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div><Label>Public key</Label><Input readOnly value="pk_live_******************" /></div>
            <div><Label>Secret key</Label><Input readOnly value="sk_live_******************" /></div>
            <div><Label>Webhook URL</Label><Input placeholder="https://yourdomain.com/webhook" /></div>
            <div className="flex gap-2"><Button>Regenerate keys</Button><Button variant="outline">Send test webhook</Button></div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}