import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp, getCompareProducts } from "@/store/app";
import { products as ALL } from "@/data/products";
import { Button } from "@/components/ui/button";
import { X, Star } from "lucide-react";

export const Route = createFileRoute("/compare")({
  head: () => ({ meta: [{ title: "Compare products — Shopzy" }] }),
  component: ComparePage,
});

function ComparePage() {
  const { compare, toggleCompare, clearCompare } = useApp();
  const items = getCompareProducts(compare, ALL);

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Compare products</h1>
        <p className="mt-2 text-sm text-muted-foreground">Add up to 4 products from the catalogue to compare them side-by-side.</p>
        <Link to="/products"><Button className="mt-4">Browse products</Button></Link>
      </div>
    );
  }

  const keys = Array.from(new Set(items.flatMap((p) => Object.keys(p.specs))));

  return (
    <div className="container mx-auto px-3 py-4 md:px-4 md:py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Compare ({items.length}/4)</h1>
        <Button variant="outline" size="sm" onClick={clearCompare}>Clear all</Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="p-3 text-left text-xs uppercase text-muted-foreground">Feature</th>
              {items.map((p) => (
                <th key={p.id} className="p-3 text-left align-top">
                  <div className="flex flex-col gap-2">
                    <button onClick={() => toggleCompare(p.id)} className="ml-auto text-muted-foreground hover:text-destructive" aria-label="Remove"><X className="h-4 w-4" /></button>
                    <img src={p.image} alt={p.title} className="h-24 w-24 rounded object-cover" />
                    <Link to="/product/$id" params={{ id: p.id }} className="line-clamp-2 font-medium hover:text-primary">{p.title}</Link>
                    <div className="text-base font-bold text-primary">${p.price}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-3 font-medium text-muted-foreground">Brand</td>
              {items.map((p) => (<td key={p.id} className="p-3">{p.brand}</td>))}
            </tr>
            <tr className="border-b border-border">
              <td className="p-3 font-medium text-muted-foreground">Rating</td>
              {items.map((p) => (<td key={p.id} className="p-3"><span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warning text-warning" />{p.rating} ({p.reviews})</span></td>))}
            </tr>
            <tr className="border-b border-border">
              <td className="p-3 font-medium text-muted-foreground">Stock</td>
              {items.map((p) => (<td key={p.id} className="p-3">{p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}</td>))}
            </tr>
            {keys.map((k) => (
              <tr key={k} className="border-b border-border last:border-0">
                <td className="p-3 font-medium text-muted-foreground">{k}</td>
                {items.map((p) => (<td key={p.id} className="p-3">{p.specs[k] || "—"}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}