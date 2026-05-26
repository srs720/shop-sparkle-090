import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Check, X } from "lucide-react";

export const Route = createFileRoute("/admin/reviews")({
  head: () => ({ meta: [{ title: "Reviews — Shopzy Admin" }] }),
  component: () => <AdminShell title="Review Moderation"><Page /></AdminShell>,
});

function Page() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("*").order("created_at",{ascending:false}).limit(50);
      return data ?? [];
    },
  });
  const moderate = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" }) => {
      const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin-reviews"] }); },
  });

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Review</TableHead><TableHead>Rating</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? Array.from({length:5}).map((_,i)=>(<TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-12 w-full"/></TableCell></TableRow>))
            : data.length === 0 ? (<TableRow><TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">No reviews yet</TableCell></TableRow>)
            : data.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="font-medium">{r.title ?? r.user_name ?? "Anonymous"}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{r.body}</div>
                </TableCell>
                <TableCell><div className="flex">{Array.from({length:r.rating}).map((_,i)=><Star key={i} className="h-3 w-3 fill-warning text-warning" />)}</div></TableCell>
                <TableCell><span className="capitalize text-xs">{r.status}</span></TableCell>
                <TableCell className="text-right space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => moderate.mutate({ id: r.id, status: "approved" })}><Check className="h-4 w-4 text-success"/></Button>
                  <Button size="icon" variant="ghost" onClick={() => moderate.mutate({ id: r.id, status: "rejected" })}><X className="h-4 w-4 text-destructive"/></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
