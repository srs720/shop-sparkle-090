import { Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { FlashCountdown } from "./FlashCountdown";
import { products } from "@/data/products";

export function FlashSaleRow() {
  const items = products.slice(0, 10);
  return (
    <div className="rounded-xl bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 fill-hot text-hot" />
          <h3 className="text-base font-extrabold text-foreground">Flash Sale</h3>
          <FlashCountdown hours={5} />
        </div>
        <Link to={"/flash-sale" as never} className="text-xs font-semibold text-hot hover:underline">
          See all →
        </Link>
      </div>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [&::-webkit-scrollbar]:hidden">
        {items.map((p) => {
          const off = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
          return (
            <Link
              key={p.id}
              to="/product/$id"
              params={{ id: p.id }}
              className="block w-28 shrink-0 transition active:scale-[0.97]"
            >
              <div className="relative overflow-hidden rounded-lg bg-muted">
                <img src={p.image} alt={p.title} className="aspect-square w-full object-cover" loading="lazy" />
                <span className="absolute left-0 top-0 rounded-br-lg bg-hot px-1.5 py-0.5 text-[11px] font-extrabold text-hot-foreground">
                  -{off}%
                </span>
              </div>
              <div className="mt-1 text-sm font-extrabold text-hot">${p.price}</div>
              <div className="text-[10px] text-muted-foreground line-through">
                ${p.originalPrice}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}