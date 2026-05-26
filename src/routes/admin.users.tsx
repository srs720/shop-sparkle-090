import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users & Roles — Shopzy Admin" }] }),
  component: () => <AdminShell title="Users & Roles"><Page /></AdminShell>,
});

const perms = [
  { mod: "Products", admin: true, editor: true, viewer: false },
  { mod: "Orders", admin: true, editor: true, viewer: true },
  { mod: "Customers", admin: true, editor: false, viewer: true },
  { mod: "Payments", admin: true, editor: false, viewer: false },
  { mod: "Settings", admin: true, editor: false, viewer: false },
  { mod: "CMS", admin: true, editor: true, viewer: false },
];

function Page() {
  const { data: team = [], isLoading } = useQuery({
    queryKey: ["admin-team-members"],
    queryFn: async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role, created_at")
        .order("created_at", { ascending: false });
      if (!roles?.length) return [];
      const ids = Array.from(new Set(roles.map((r) => r.user_id)));
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email, updated_at")
        .in("id", ids);
      const map = new Map((profiles ?? []).map((p) => [p.id, p]));
      const seen = new Set<string>();
      return roles
        .filter((r) => (seen.has(r.user_id) ? false : (seen.add(r.user_id), true)))
        .map((r) => {
          const p = map.get(r.user_id);
          return {
            id: r.user_id,
            name: p?.full_name ?? p?.email?.split("@")[0] ?? "Unknown",
            email: p?.email ?? "—",
            role: r.role,
            last: p?.updated_at ? new Date(p.updated_at).toLocaleDateString() : "—",
          };
        });
    },
  });

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Team Members</CardTitle>
          <Button size="sm"><Plus className="h-4 w-4" /> Invite</Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Member</TableHead><TableHead>Role</TableHead><TableHead>Last active</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                ))
              ) : team.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-6">No team members yet</TableCell></TableRow>
              ) : team.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8"><AvatarFallback className="bg-secondary/30 text-xs">{t.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback></Avatar>
                      <div><div className="text-sm font-medium">{t.name}</div><div className="text-xs text-muted-foreground">{t.email}</div></div>
                    </div>
                  </TableCell>
                  <TableCell><span className="rounded-full border border-secondary/30 bg-secondary/15 text-secondary px-2 py-0.5 text-xs">{t.role}</span></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.last}</TableCell>
                  <TableCell className="text-right"><Button size="sm" variant="outline">Edit</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Role Permissions (RBAC)</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Module</TableHead><TableHead className="text-center">Admin</TableHead><TableHead className="text-center">Editor</TableHead><TableHead className="text-center">Viewer</TableHead></TableRow></TableHeader>
            <TableBody>
              {perms.map((p) => (
                <TableRow key={p.mod}>
                  <TableCell className="font-medium">{p.mod}</TableCell>
                  <TableCell className="text-center"><Checkbox defaultChecked={p.admin} /></TableCell>
                  <TableCell className="text-center"><Checkbox defaultChecked={p.editor} /></TableCell>
                  <TableCell className="text-center"><Checkbox defaultChecked={p.viewer} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}