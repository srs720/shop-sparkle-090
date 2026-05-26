import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users & Roles — Shopzy Admin" }] }),
  component: () => <AdminShell title="Users & Roles"><Page /></AdminShell>,
});

const team = [
  { name: "Siam Hosain", email: "siamhosain720@gmail.com", role: "Super Admin", last: "now" },
  { name: "Ayesha Rahman", email: "ayesha@shopzy.com", role: "Admin", last: "2h ago" },
  { name: "Tanvir Hasan", email: "tanvir@shopzy.com", role: "Editor", last: "yesterday" },
  { name: "Mehedi Karim", email: "mehedi@shopzy.com", role: "Viewer", last: "3 days ago" },
  { name: "Nusrat Jahan", email: "nusrat@shopzy.com", role: "Editor", last: "1 week ago" },
];

const perms = [
  { mod: "Products", admin: true, editor: true, viewer: false },
  { mod: "Orders", admin: true, editor: true, viewer: true },
  { mod: "Customers", admin: true, editor: false, viewer: true },
  { mod: "Payments", admin: true, editor: false, viewer: false },
  { mod: "Settings", admin: true, editor: false, viewer: false },
  { mod: "CMS", admin: true, editor: true, viewer: false },
];

function Page() {
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
              {team.map((t) => (
                <TableRow key={t.email}>
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