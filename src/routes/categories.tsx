import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "@/data/products";

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [{ title: "All Categories — Shopzy" }] }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-extrabold">All Categories</h1>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition hover:shadow-md active:scale-95"
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ background: `color-mix(in oklab, ${c.color} 18%, transparent)` }}
              >
                <Icon className="h-7 w-7" style={{ color: c.color }} />
              </span>
              <span className="text-xs font-medium">{c.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}