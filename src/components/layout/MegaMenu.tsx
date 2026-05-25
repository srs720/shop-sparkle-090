import { Link } from "@tanstack/react-router";
import { categories } from "@/data/products";

export function MegaMenu() {
  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto flex items-center gap-1 overflow-x-auto px-2 md:px-4">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-3 text-sm text-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-medium" }}
            >
              <Icon className="h-4 w-4" style={{ color: c.color }} />
              {c.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}