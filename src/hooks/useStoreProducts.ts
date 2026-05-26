import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type StoreProduct = {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  sold: number;
  image: string;
  images: string[];
  stock: number;
  description: string;
};

type Row = {
  id: string; name: string; slug: string; category: string; brand: string | null;
  price: number; compare_price: number | null; stock: number;
  image_url: string | null; rating: number | null; sold_count: number;
  description: string | null; is_featured: boolean; status: string;
};

const map = (r: Row): StoreProduct => ({
  id: r.id,
  title: r.name,
  brand: r.brand ?? "",
  category: r.category,
  price: Number(r.price),
  originalPrice: Number(r.compare_price ?? r.price) || Number(r.price) * 1.3,
  rating: Number(r.rating ?? 4.5),
  reviews: Math.max(10, Math.floor(r.sold_count / 8)),
  sold: r.sold_count,
  image: r.image_url ?? `https://picsum.photos/seed/${r.id}/600/600`,
  images: [r.image_url ?? `https://picsum.photos/seed/${r.id}/600/600`],
  stock: r.stock,
  description: r.description ?? "",
});

export function useStoreProducts(opts: { limit?: number; featured?: boolean; category?: string } = {}) {
  const { limit = 30, featured, category } = opts;
  return useQuery({
    queryKey: ["store-products", { limit, featured, category }],
    queryFn: async () => {
      let q = supabase.from("products").select("*").eq("status", "active")
        .order("sold_count", { ascending: false }).limit(limit);
      if (featured) q = q.eq("is_featured", true);
      if (category) q = q.eq("category", category);
      const { data, error } = await q;
      if (error) throw error;
      return (data as Row[]).map(map);
    },
  });
}

export function useFlashSaleProducts(limit = 10) {
  return useQuery({
    queryKey: ["flash-sale-products", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("flash_sales")
        .select("discount_percent, product:products(*)")
        .eq("active", true)
        .gte("ends_at", new Date().toISOString())
        .limit(limit);
      if (error) throw error;
      return (data ?? []).map((f) => {
        const p = map(f.product as Row);
        const disc = f.discount_percent;
        return { ...p, price: +(p.price * (1 - disc / 100)).toFixed(2), originalPrice: p.price };
      });
    },
  });
}

export function useBanners(position?: string) {
  return useQuery({
    queryKey: ["banners", position],
    queryFn: async () => {
      let q = supabase.from("banners").select("*").eq("active", true).order("sort_order");
      if (position) q = q.eq("position", position);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** Subscribe to realtime changes on a table and invalidate queries by prefix. */
export function useRealtimeInvalidate(table: string, queryKeyPrefix: string) {
  const qc = useQueryClient();
  useEffect(() => {
    const ch = supabase
      .channel(`rt-${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        qc.invalidateQueries({ queryKey: [queryKeyPrefix] });
      })
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, [table, queryKeyPrefix, qc]);
}
