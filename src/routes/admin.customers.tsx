import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { adminCustomers } from "@/data/admin";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({ meta: [{ title: "Customers — Shopzy Admin" }] }),
  component: () => <AdminShell title="Customers"><CustomersPage /></AdminShell>,
});

function CustomersPage() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Customer</TableHead><TableHead>Phone</TableHead><TableHead>Joined</TableHead>
            <TableHead>Orders</TableHead><TableHead>Total Spent</TableHead><TableHead>Wallet</TableHead>
            <TableHead>Status</TableHead><TableHead></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {adminCustomers.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarFallback className="bg-secondary/30 text-xs">{c.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs">{c.phone}</TableCell>
                <TableCell className="text-muted-foreground">{c.joined}</TableCell>
                <TableCell>{c.orders}</TableCell>
                <TableCell className="font-medium">${c.spent.toFixed(2)}</TableCell>
                <TableCell>${c.wallet.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={cn("rounded-full border px-2 py-0.5 text-[11px]",
                    c.status === "Active" ? "border-success/30 bg-success/15 text-success" :
                    c.status === "Inactive" ? "border-border bg-muted text-muted-foreground" :
                    "border-destructive/30 bg-destructive/15 text-destructive")}>{c.status}</span>
                </TableCell>
                <TableCell className="text-right"><Button size="sm" variant="outline">View</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}