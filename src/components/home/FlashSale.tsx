import { Zap } from "lucide-react";
import { flashSaleProducts } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Countdown } from "./Countdown";

export function FlashSale() {
  const items = flashSaleProducts();
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ background: "var(--gradient-flash)" }}>
        <div className="flex items-center gap-2 text-primary-foreground">
          <Zap className="h-5 w-5 fill-current" />
          <h2 className="text-lg font-extrabold uppercase">Flash Sale</h2>
          <span className="hidden text-xs opacity-90 sm:inline">Ends in</span>
        </div>
        <Countdown />
      </div>
      <div className="flex gap-3 overflow-x-auto p-4">
        {items.map((p) => (
          <div key={p.id} className="w-44 shrink-0 sm:w-52">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}