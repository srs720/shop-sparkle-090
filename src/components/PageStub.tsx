import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data/products";

export function PageStub({
  title,
  description,
  showProducts = true,
}: {
  title: string;
  description?: string;
  showProducts?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <Link
        to={"/" as never}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>
      <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{title}</h1>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {showProducts && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 12).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}