import { Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/data/products";

export function ProductSection({ title, products, viewAllHref }: { title: string; products: Product[]; viewAllHref?: string }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        {viewAllHref && (
          <Link to="/category/$slug" params={{ slug: "all" }} className="text-sm text-primary hover:underline">
            View all →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}