import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data/products";
import { ArrowLeft } from "lucide-react";

const searchSchema = z.object({
  query: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [{ title: "Search — Shopzy" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { query } = Route.useSearch();
  const q = query.toLowerCase();
  const results = q
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    : [];
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <Link to={"/" as never} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <h1 className="text-2xl font-extrabold">
        {query ? `Results for "${query}"` : "Search"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {query
          ? `${results.length} product${results.length === 1 ? "" : "s"} found`
          : "Use the search bar to find products."}
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {results.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}