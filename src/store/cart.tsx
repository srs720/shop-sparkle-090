import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";

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
  coupon: string | null;
  applyCoupon: (code: string) => Promise<{ ok: boolean; message: string }>;
  removeCoupon: () => void;
  discount: number;
  freeShipping: boolean;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "shop-cart-v1";
const COUPON_KEY = "shop-coupon-v1";
const DISCOUNT_KEY = "shop-coupon-disc-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [couponRule, setCouponRule] = useState<{ type: string; value: number } | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setItems(JSON.parse(raw));
      const c = typeof window !== "undefined" ? localStorage.getItem(COUPON_KEY) : null;
      if (c) setCoupon(c);
      const d = typeof window !== "undefined" ? localStorage.getItem(DISCOUNT_KEY) : null;
      if (d) {
        try { setCouponRule(JSON.parse(d)); } catch { /* ignore */ }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (coupon) localStorage.setItem(COUPON_KEY, coupon);
    else localStorage.removeItem(COUPON_KEY);
  }, [coupon]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (couponRule) localStorage.setItem(DISCOUNT_KEY, JSON.stringify(couponRule));
    else localStorage.removeItem(DISCOUNT_KEY);
  }, [couponRule]);

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
  const freeShipping = couponRule?.type === "free_shipping";
  const discount = !couponRule || freeShipping
    ? 0
    : couponRule.type === "percent"
      ? +(subtotal * (Math.min(100, couponRule.value) / 100)).toFixed(2)
      : +Math.min(subtotal, Math.max(0, couponRule.value)).toFixed(2);

  const applyCoupon = async (code: string) => {
    const c = code.trim();
    if (!c) return { ok: false, message: "Enter a coupon code" };
    const { data, error } = await supabase.rpc("validate_coupon", {
      _code: c,
      _order_subtotal: subtotal,
    });
    if (error) return { ok: false, message: "Could not validate coupon" };
    const r = data as { ok: boolean; message: string; code?: string; discount_type?: string; discount_value?: number };
    if (!r?.ok) return { ok: false, message: r?.message ?? "Invalid coupon code" };
    setCoupon(r.code ?? c.toUpperCase());
    setCouponRule({ type: r.discount_type ?? "percent", value: Number(r.discount_value ?? 0) });
    return { ok: true, message: r.message ?? "Coupon applied" };
  };
  const removeCoupon = () => { setCoupon(null); setCouponRule(null); };

  return (
    <Ctx.Provider value={{ items, open, setOpen, add, remove, setQty, clear, count, subtotal, coupon, applyCoupon, removeCoupon, discount, freeShipping }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used within CartProvider");
  return v;
}