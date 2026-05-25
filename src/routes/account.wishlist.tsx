import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/store/app";
import { products as ALL } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Heart } from "lucide-react";

export const Route = createFileRoute("/account/wishlist")({ component: Wishlists });

function Wishlists() {
  const { wishlists, createWishlist, toggleWish } = useApp();
  const [name, setName] = useState("");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Wishlists</h1>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (name.trim()) { createWishlist(name.trim()); setName(""); } }}>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="New list name (e.g. Birthday gifts)" />
        <Button type="submit"><Plus className="mr-1 h-4 w-4" />Create</Button>
      </form>
      {wishlists.map((l) => {
        const items = l.productIds.map((id) => ALL.find((p) => p.id === id)).filter(Boolean);
        return (
          <div key={l.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{l.name} <span className="text-sm font-normal text-muted-foreground">({items.length})</span></h2>
            </div>
            {items.length === 0 ? (
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Heart className="h-4 w-4" />No items yet — start saving products from anywhere on the site.</p>
            ) : (
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {items.map((p) => p && (
                  <li key={p.id} className="flex gap-3 rounded-lg border border-border p-3">
                    <Link to="/product/$id" params={{ id: p.id }}><img src={p.image} alt={p.title} className="h-16 w-16 rounded object-cover" loading="lazy" /></Link>
                    <div className="flex-1">
                      <Link to="/product/$id" params={{ id: p.id }} className="line-clamp-2 text-sm hover:text-primary">{p.title}</Link>
                      <div className="text-sm font-bold text-primary">${p.price}</div>
                    </div>
                    <button onClick={() => toggleWish(l.id, p.id)} aria-label="Remove" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}