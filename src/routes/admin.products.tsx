import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/store/adminAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Trash2, Pencil, Download, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "Products — Shopzy Admin" }] }),
  component: () => <AdminShell title="Products"><ProductsPage /></AdminShell>,
});

const PAGE_SIZE = 15;
const CATEGORIES = ["Electronics","Fashion","Home","Beauty","Gaming","Sports","Books","Toys","Auto","Grocery"];

type Product = {
  id: string; name: string; slug: string; sku: string; category: string;
  brand: string | null; price: number; compare_price: number | null;
  stock: number; status: string; image_url: string | null;
  rating: number | null; sold_count: number; is_featured: boolean;
  description: string | null;
};

function ProductsPage() {
  const qc = useQueryClient();
  const { canEdit, isAdmin } = useAdminAuth();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const queryKey = ["admin-products", { q, cat, status, page }] as const;

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      let req = supabase
        .from("products")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);
      if (cat !== "all") req = req.eq("category", cat);
      if (status !== "all") req = req.eq("status", status);
      if (q.trim()) req = req.or(`name.ilike.%${q}%,sku.ilike.%${q}%`);
      const { data, error, count } = await req;
      if (error) throw error;
      return { rows: (data ?? []) as Product[], total: count ?? 0 };
    },
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const allOnPageSelected = rows.length > 0 && rows.every((p) => sel.has(p.id));

  const toggleAll = () => {
    const next = new Set(sel);
    if (allOnPageSelected) rows.forEach((p) => next.delete(p.id));
    else rows.forEach((p) => next.add(p.id));
    setSel(next);
  };

  const saveMutation = useMutation({
    mutationFn: async (payload: Partial<Product> & { id?: string }) => {
      if (payload.id) {
        const { id, ...rest } = payload;
        const { error } = await supabase.from("products").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Product updated" : "Product created");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      setOpen(false); setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("products").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: (_d, ids) => {
      toast.success(`Deleted ${ids.length} product${ids.length > 1 ? "s" : ""}`);
      setSel(new Set());
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const stockStatus = (n: number) =>
    n === 0 ? { label: "Out of stock", cls: "bg-destructive/15 text-destructive border-destructive/30" } :
    n < 15 ? { label: "Low stock", cls: "bg-warning/15 text-warning border-warning/30" } :
    { label: "In stock", cls: "bg-success/15 text-success border-success/30" };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search product name or SKU…" className="pl-9 bg-background/70" />
        </div>
        <Select value={cat} onValueChange={(v) => { setCat(v); setPage(1); }}>
          <SelectTrigger className="w-[180px] bg-background/70"><SelectValue placeholder="All categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-[150px] bg-background/70"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="out_of_stock">Out of stock</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button disabled={!canEdit}><Plus className="h-4 w-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit product" : "Add new product"}</DialogTitle></DialogHeader>
            <ProductForm
              initial={editing}
              busy={saveMutation.isPending}
              onCancel={() => { setOpen(false); setEditing(null); }}
              onSubmit={(p) => saveMutation.mutate(editing ? { ...p, id: editing.id } : p)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {sel.size > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-secondary/30 bg-secondary/5 px-3 py-2 text-sm">
          <span>{sel.size} selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="destructive" disabled={!isAdmin || deleteMutation.isPending} onClick={() => deleteMutation.mutate(Array.from(sel))}>
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSel(new Set())}>Clear</Button>
          </div>
        </div>
      )}

      <Card className="admin-card overflow-hidden">
        <CardContent className="p-0">
          {isError ? (
            <div className="flex items-center gap-2 p-6 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" /> Failed to load products: {(error as Error)?.message}
            </div>
          ) : (
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
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7}><Skeleton className="h-10 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : rows.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-10 text-sm text-muted-foreground">No products found.</TableCell></TableRow>
                ) : rows.map((p) => {
                  const s = stockStatus(p.stock);
                  return (
                    <TableRow key={p.id} className="admin-row">
                      <TableCell><Checkbox checked={sel.has(p.id)} onCheckedChange={(c) => {
                        const next = new Set(sel); if (c) next.add(p.id); else next.delete(p.id); setSel(next);
                      }} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img src={p.image_url ?? ""} alt={p.name} loading="lazy" className="h-10 w-10 rounded-md object-cover border border-border bg-muted" />
                          <div className="min-w-0">
                            <div className="truncate font-medium">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.brand}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                      <TableCell className="capitalize text-muted-foreground">{p.category}</TableCell>
                      <TableCell className="font-medium">${Number(p.price).toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm tabular-nums">{p.stock}</span>
                          <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", s.cls)}>{s.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" disabled={!canEdit} onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" disabled={!isAdmin} onClick={() => deleteMutation.mutate([p.id])}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Pagination page={page} totalPages={totalPages} total={total} fetching={isFetching} onPage={setPage} />
    </div>
  );
}

function ProductForm({ initial, busy, onSubmit, onCancel }: {
  initial: Product | null;
  busy: boolean;
  onSubmit: (p: Partial<Product>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    sku: initial?.sku ?? `SKU-${Math.floor(Math.random() * 900000 + 100000)}`,
    price: initial?.price ?? 0,
    category: initial?.category ?? CATEGORIES[0],
    brand: initial?.brand ?? "",
    stock: initial?.stock ?? 0,
    description: initial?.description ?? "",
    status: initial?.status ?? "active",
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <>
      <div className="grid gap-3">
        <div><Label>Name</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} required /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>SKU</Label><Input value={form.sku} onChange={(e) => set("sku", e.target.value)} required /></div>
          <div><Label>Price (USD)</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => set("price", parseFloat(e.target.value) || 0)} required /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => set("category", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => set("stock", parseInt(e.target.value) || 0)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Brand</Label><Input value={form.brand} onChange={(e) => set("brand", e.target.value)} /></div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="out_of_stock">Out of stock</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button disabled={busy} onClick={() => {
          const slug = (initial?.slug) ?? form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now();
          onSubmit({ ...form, slug });
        }}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save product
        </Button>
      </DialogFooter>
    </>
  );
}

function Pagination({ page, totalPages, total, fetching, onPage }: { page: number; totalPages: number; total: number; fetching: boolean; onPage: (n: number) => void }) {
  const win = 5;
  let from = Math.max(1, page - Math.floor(win / 2));
  const to = Math.min(totalPages, from + win - 1);
  from = Math.max(1, to - win + 1);
  const pages = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
      <span className="text-muted-foreground flex items-center gap-2">
        {fetching && <Loader2 className="h-3 w-3 animate-spin" />}
        Page {page} of {totalPages} · {total.toLocaleString()} products
      </span>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => onPage(1)}>First</Button>
        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => onPage(page - 1)}>Prev</Button>
        {pages.map((n) => (
          <Button key={n} size="sm" variant={n === page ? "default" : "outline"} onClick={() => onPage(n)}>{n}</Button>
        ))}
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>Next</Button>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPage(totalPages)}>Last</Button>
      </div>
    </div>
  );
}