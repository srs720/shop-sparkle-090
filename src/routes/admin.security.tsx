import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/admin/security")({
  head: () => ({ meta: [{ title: "Security & Audit — Shopzy Admin" }] }),
  component: () => <AdminShell title="Security & Audit"><Page /></AdminShell>,
});

function Page() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(50);
      return data ?? [];
    },
  });

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> Audit Log</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>When</TableHead><TableHead>Actor</TableHead><TableHead>Action</TableHead><TableHead>Entity</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading ? Array.from({length:8}).map((_,i)=>(<TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-8 w-full"/></TableCell></TableRow>))
              : logs.length === 0 ? (<TableRow><TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">No activity yet</TableCell></TableRow>)
              : logs.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-xs">{l.actor_email ?? "—"}</TableCell>
                  <TableCell className="font-mono text-xs">{l.action}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{l.entity} {l.entity_id?.slice(0,8)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Security Toggles</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><Label>Enforce 2FA for admins</Label><Switch /></div>
            <div className="flex items-center justify-between"><Label>Block suspicious IPs</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label>Stock manipulation guard</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label>Lock account on 5 failed logins</Label><Switch defaultChecked /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">IP Block List</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2"><Input placeholder="123.45.67.89" /><Button>Block</Button></div>
            <div className="rounded-md border border-border/70 p-2 text-xs text-muted-foreground">No blocked IPs</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
