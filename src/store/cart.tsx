import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";

export type CartItem = {
  product: Product;
  qty: number;
  color?: string;
  size?: string;
};

type CartCtx = {
  items: CartItem[];
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (p: Product, opts?: { qty?: number; color?: string; size?: string }) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "shop-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add: CartCtx["add"] = (p, opts = {}) => {
    const qty = opts.qty ?? 1;
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === p.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { product: p, qty, color: opts.color, size: opts.size }];
    });
    setOpen(true);
  };
  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.product.id !== id));
  const setQty = (id: string, qty: number) =>
    setItems((prev) => prev.map((i) => (i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const clear = () => setItems([]);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((n, i) => n + i.qty * i.product.price, 0);

  return (
    <Ctx.Provider value={{ items, open, setOpen, add, remove, setQty, clear, count, subtotal }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used within CartProvider");
  return v;
}