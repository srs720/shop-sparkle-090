import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Sparkles, TrendingUp } from "lucide-react";
import { categories } from "@/data/products";
import { UserMobileLayout } from "@/components/layout/UserMobileLayout";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [{ title: "All Categories — Shopzy" }] }),
  component: CategoriesPage,
});

const trending = [
  { slug: "electronics", label: "iPhone 15" },
  { slug: "fashion", label: "Sneakers" },
  { slug: "beauty", label: "Skincare" },
  { slug: "home", label: "Home Decor" },
  { slug: "gaming", label: "PS5" },
  { slug: "audio", label: "Headphones" },
];

function CategoriesPage() {
  return (
    <UserMobileLayout title="Categories" hideBack>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search categories..."
          className="h-11 rounded-xl border-gray-200 bg-white pl-9 text-sm shadow-sm focus-visible:ring-rose-500"
        />
      </div>

      {/* Featured banner */}
      <Link
        to="/flash-sale"
        className="mb-4 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-500 p-4 text-white shadow-sm transition active:scale-[0.98]"
      >
        <div className="grid h-12 w-12 place-content-center rounded-xl bg-white/20 backdrop-blur">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">Explore Today's Deals</p>
          <p className="text-xs text-white/90">Up to 70% off across all categories</p>
        </div>
      </Link>

      {/* Trending pills */}
      <div className="mb-5">
        <div className="mb-2 flex items-center gap-1.5">
          <TrendingUp className="h-4 w-4 text-rose-600" />
          <h2 className="text-sm font-bold text-gray-900">Trending Searches</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {trending.map((t) => (
            <Link
              key={t.label}
              to="/category/$slug"
              params={{ slug: t.slug }}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-rose-50 hover:text-rose-600 active:scale-95"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Categories grid */}
      <h2 className="mb-3 text-sm font-bold text-gray-900">All Categories</h2>
      <div className="grid grid-cols-3 gap-3">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center shadow-sm transition hover:shadow-md active:scale-95"
            >
              <span
                className="grid h-14 w-14 place-content-center rounded-2xl bg-rose-50 transition-colors group-hover:bg-rose-100"
              >
                <Icon className="h-7 w-7 text-rose-600" />
              </span>
              <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-gray-800">
                {c.name}
              </span>
            </Link>
          );
        })}
      </div>
    </UserMobileLayout>
  );
}