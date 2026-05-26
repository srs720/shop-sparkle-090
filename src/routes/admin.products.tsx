import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { products as catalog, categories } from "@/data/products";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Trash2, Pencil, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "Products — Shopzy Admin" }] }),
  component: () => <AdminShell title="Products"><ProductsPage /></AdminShell>,
});

// Inflate catalog to 500+ for pagination demo
const ALL = Array.from({ length: 26 }).flatMap((_, k) =>
  catalog.map((p, i) => ({ ...p, id: `${p.id}-${k}-${i}`, sku: `SKU-${(1000 + k * 100 + i).toString()}`, stock: Math.floor(Math.random() * 220) })),
);

const PAGE_SIZE = 12;

function ProductsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return ALL.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (q && !p.title.toLowerCase().includes(q.toLowerCase()) && !p.sku.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, cat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const cur = Math.min(page, totalPages);
  const slice = filtered.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE);
  const allOnPageSelected = slice.length > 0 && slice.every((p) => sel.has(p.id));

  const toggleAll = () => {
    const next = new Set(sel);
    if (allOnPageSelected) slice.forEach((p) => next.delete(p.id));
    else slice.forEach((p) => next.add(p.id));
    setSel(next);
  };

  const stockStatus = (n: number) =>
    n === 0 ? { label: "Out of stock", cls: "bg-destructive/15 text-destructive border-destructive/30" } :
    n < 15 ? { label: "Low stock", cls: "bg-warning/15 text-warning border-warning/30" } :
    { label: "In stock", cls: "bg-success/15 text-success border-success/30" };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search product name or SKU…" className="pl-9" />
        </div>
        <Select value={cat} onValueChange={(v) => { setCat(v); setPage(1); }}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="All categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add new product</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div><Label>Name</Label><Input placeholder="Wireless Headphones" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>SKU</Label><Input placeholder="SKU-1234" /></div>
                <div><Label>Price</Label><Input type="number" placeholder="99.00" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Category</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>{categories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Stock</Label><Input type="number" placeholder="100" /></div>
              </div>
              <div><Label>Description</Label><Textarea rows={3} placeholder="Short description…" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Save product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {sel.size > 0 && (
        <div className="flex items-center justify-between rounded-md border border-border bg-secondary/10 px-3 py-2 text-sm">
          <span>{sel.size} selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">Bulk edit</Button>
            <Button size="sm" variant="destructive"><Trash2 className="h-4 w-4" /> Delete</Button>
            <Button size="sm" variant="ghost" onClick={() => setSel(new Set())}>Clear</Button>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={allOnPageSelected} onCheckedChange={toggleAll} /></TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slice.map((p) => {
                const s = stockStatus(p.stock);
                return (
                  <TableRow key={p.id}>
                    <TableCell><Checkbox checked={sel.has(p.id)} onCheckedChange={(c) => {
                      const next = new Set(sel); c ? next.add(p.id) : next.delete(p.id); setSel(next);
                    }} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.title} className="h-10 w-10 rounded-md object-cover border border-border" />
                        <div className="min-w-0">
                          <div className="truncate font-medium">{p.title}</div>
                          <div className="text-xs text-muted-foreground">{p.brand}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                    <TableCell className="capitalize text-muted-foreground">{p.category}</TableCell>
                    <TableCell className="font-medium">${p.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm tabular-nums">{p.stock}</span>
                        <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", s.cls)}>{s.label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pagination page={cur} totalPages={totalPages} total={filtered.length} onPage={setPage} />
    </div>
  );
}

function Pagination({ page, totalPages, total, onPage }: { page: number; totalPages: number; total: number; onPage: (n: number) => void }) {
  const window = 5;
  let from = Math.max(1, page - Math.floor(window / 2));
  const to = Math.min(totalPages, from + window - 1);
  from = Math.max(1, to - window + 1);
  const pages = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
      <span className="text-muted-foreground">Showing page {page} of {totalPages} — {total} results</span>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => onPage(1)}>First</Button>
        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => onPage(page - 1)}>Prev</Button>
        {pages.map((n) => (
          <Button key={n} size="sm" variant={n === page ? "default" : "outline"} onClick={() => onPage(n)}>{n}</Button>
        ))}
        <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => onPage(page + 1)}>Next</Button>
        <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => onPage(totalPages)}>Last</Button>
      </div>
    </div>
  );
}