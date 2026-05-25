import { Link } from "@tanstack/react-router";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg">
      <Link to="/product/$id" params={{ id: product.id }} className="relative block aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded bg-destructive px-1.5 py-0.5 text-[11px] font-bold text-destructive-foreground">
            -{discount}%
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="line-clamp-2 text-sm leading-snug text-foreground hover:text-primary"
        >
          {product.title}
        </Link>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-primary">${product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <div className="flex items-center text-warning">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-3 w-3"
                fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                strokeWidth={1.5}
              />
            ))}
          </div>
          <span>({product.reviews.toLocaleString()})</span>
          <span className="ml-auto">{product.sold.toLocaleString()} sold</span>
        </div>
        <Button
          size="sm"
          className="mt-2 w-full"
          onClick={(e) => {
            e.preventDefault();
            add(product);
          }}
        >
          <ShoppingCart className="mr-1.5 h-4 w-4" /> Add to Cart
        </Button>
      </div>
    </div>
  );
}