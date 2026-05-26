import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({ meta: [{ title: "Customers — Shopzy Admin" }] }),
  component: () => <AdminShell title="Customers"><CustomersPage /></AdminShell>,
});

function CustomersPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Customer</TableHead><TableHead>Joined</TableHead><TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {isLoading ? Array.from({length:6}).map((_,i)=>(
              <TableRow key={i}><TableCell colSpan={3}><Skeleton className="h-10 w-full"/></TableCell></TableRow>
            )) : data.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="py-10 text-center text-sm text-muted-foreground">No customers yet</TableCell></TableRow>
            ) : data.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarFallback className="bg-secondary/30 text-xs">{(c.full_name ?? c.email ?? "?").slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
                    <div>
                      <div className="font-medium">{c.full_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{c.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right"><Button size="sm" variant="outline">View</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
