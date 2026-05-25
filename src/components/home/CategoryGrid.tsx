import { Link } from "@tanstack/react-router";
import { categories } from "@/data/products";

export function CategoryGrid() {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h2 className="mb-4 text-lg font-bold">Shop by Category</h2>
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-12">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full transition-transform hover:scale-110"
                style={{ background: `color-mix(in oklab, ${c.color} 18%, transparent)` }}
              >
                <Icon className="h-7 w-7" style={{ color: c.color }} />
              </span>
              <span className="line-clamp-2 text-xs text-foreground">{c.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}