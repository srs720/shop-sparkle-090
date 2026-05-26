import { Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useStoreProducts, useRealtimeInvalidate } from "@/hooks/useStoreProducts";
import { Skeleton } from "@/components/ui/skeleton";

const formatSold = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k+ Sold` : `${n} Sold`;

export function ForYouGrid() {
  const { data: feed = [], isLoading } = useStoreProducts({ limit: 30 });
  useRealtimeInvalidate("products", "store-products");

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg bg-card">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-1 p-2"><Skeleton className="h-3 w-full" /><Skeleton className="h-4 w-1/2" /></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {feed.map((p, idx) => {
        const off = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
        const freeDelivery = idx % 3 !== 0;
        const isChoice = idx % 4 === 0;
        return (
          <Link
            key={p.id}
            to="/product/$id"
            params={{ id: p.id }}
            className="overflow-hidden rounded-lg bg-card shadow-sm transition active:scale-[0.98]"
          >
            <div className="relative aspect-square bg-muted">
              <img src={p.image} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
              {isChoice && (
                <span className="absolute left-1.5 top-1.5 rounded bg-choice px-1.5 py-0.5 text-[10px] font-extrabold text-choice-foreground">
                  Choice
                </span>
              )}
              {off > 0 && (
                <span className="absolute right-1.5 top-1.5 rounded bg-hot px-1.5 py-0.5 text-[10px] font-extrabold text-hot-foreground">
                  -{off}%
                </span>
              )}
              {freeDelivery && (
                <span className="absolute bottom-1.5 left-1.5 rounded bg-card/95 px-1.5 py-0.5 text-[9px] font-bold text-success">
                  Free Delivery
                </span>
              )}
            </div>
            <div className="space-y-1 p-2">
              <div className="line-clamp-2 text-[12px] leading-tight text-foreground">{p.title}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-extrabold text-hot">${p.price}</span>
                {p.originalPrice > p.price && (
                  <span className="text-[10px] text-muted-foreground line-through">${p.originalPrice}</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Star className="h-3 w-3 fill-[oklch(0.78_0.17_75)] text-[oklch(0.78_0.17_75)]" />
                <span className="font-semibold text-foreground/80">{p.rating.toFixed(1)}</span>
                <span>·</span>
                <span>{formatSold(p.sold)}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
