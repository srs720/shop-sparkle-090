import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/tickets")({
  head: () => ({ meta: [{ title: "Support — Shopzy Admin" }] }),
  component: () => <AdminShell title="Support Tickets"><Page /></AdminShell>,
});

function Page() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: async () => {
      const { data } = await supabase.from("support_tickets").select("*").order("created_at",{ascending:false}).limit(50);
      return data ?? [];
    },
  });
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead>Opened</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? Array.from({length:5}).map((_,i)=>(<TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-8 w-full"/></TableCell></TableRow>))
            : data.length === 0 ? (<TableRow><TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">No tickets yet</TableCell></TableRow>)
            : data.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.subject}</TableCell>
                <TableCell><span className="text-xs capitalize">{t.priority}</span></TableCell>
                <TableCell><span className="rounded-full border border-secondary/30 bg-secondary/15 text-secondary px-2 py-0.5 text-xs capitalize">{t.status}</span></TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
