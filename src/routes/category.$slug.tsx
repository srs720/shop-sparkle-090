import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { brands, categories, getByCategory, products as allProducts } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Star, ChevronRight, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const cat = categories.find((c) => c.slug === params.slug);
    const name = cat?.name ?? "All Products";
    return {
      meta: [
        { title: `${name} — Shopzy` },
        { name: "description", content: `Shop ${name} at unbeatable prices on Shopzy.` },
      ],
    };
  },
  component: CategoryPage,
});

const PAGE_SIZE = 12;

function Filters({
  selectedBrands, setSelectedBrands, price, setPrice, minRating, setMinRating,
}: {
  selectedBrands: string[];
  setSelectedBrands: (b: string[]) => void;
  price: number[];
  setPrice: (p: number[]) => void;
  minRating: number;
  setMinRating: (n: number) => void;
}) {
  const colors = ["#000000", "#ffffff", "#e8474c", "#3a5a90", "#4caf50", "#d4af7a"];
  const sizes = ["S", "M", "L", "XL"];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase">Price Range</h3>
        <Slider min={0} max={1500} step={10} value={price} onValueChange={setPrice} />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>${price[0]}</span>
          <span>${price[1]}</span>
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase">Brand</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {brands.map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={selectedBrands.includes(b)}
                onCheckedChange={(v) =>
                  setSelectedBrands(v ? [...selectedBrands, b] : selectedBrands.filter((x) => x !== b))
                }
              />
              {b}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase">Rating</h3>
        <div className="space-y-1.5">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(minRating === r ? 0 : r)}
              className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm hover:bg-muted ${
                minRating === r ? "bg-muted font-medium" : ""
              }`}
            >
              <div className="flex text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5" fill={i < r ? "currentColor" : "none"} strokeWidth={1.5} />
                ))}
              </div>
              <span className="text-muted-foreground">& up</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase">Color</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button key={c} aria-label={c} className="h-7 w-7 rounded-full border-2 border-border" style={{ background: c }} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button key={s} className="rounded border border-border px-3 py-1 text-xs hover:border-primary">
              {s}
            </button>
          ))}
        </div>
      </div>
      <Label className="text-xs text-muted-foreground">Filters update results instantly</Label>
    </div>
  );
}

function CategoryPage() {
  const { slug } = Route.useParams();
  const cat = categories.find((c) => c.slug === slug);
  const base = getByCategory(slug);

  const [price, setPrice] = useState([0, 1500]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let r = base.filter(
      (p) =>
        p.price >= price[0] &&
        p.price <= price[1] &&
        (selectedBrands.length === 0 || selectedBrands.includes(p.brand)) &&
        p.rating >= minRating,
    );
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    if (sort === "newest") r = [...r].reverse();
    return r;
  }, [base, price, selectedBrands, minRating, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const view = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container mx-auto px-3 py-4 md:px-4 md:py-6">
      <nav className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/category/$slug" params={{ slug: "all" }} className="hover:text-primary">Categories</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{cat?.name ?? "All Products"}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden rounded-xl border border-border bg-card p-5 lg:block">
          <Filters
            selectedBrands={selectedBrands} setSelectedBrands={setSelectedBrands}
            price={price} setPrice={setPrice}
            minRating={minRating} setMinRating={setMinRating}
          />
        </aside>

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
            <h1 className="text-xl font-bold">
              {cat?.name ?? "All Products"} <span className="text-sm font-normal text-muted-foreground">({filtered.length})</span>
            </h1>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="mr-1 h-4 w-4" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                  <div className="mt-4">
                    <Filters
                      selectedBrands={selectedBrands} setSelectedBrands={setSelectedBrands}
                      price={price} setPrice={setPrice}
                      minRating={minRating} setMinRating={setMinRating}
                    />
                  </div>
                </SheetContent>
              </Sheet>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-9 w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {view.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {view.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {pageCount > 1 && (
            <div className="mt-6 flex items-center justify-center gap-1">
              {Array.from({ length: pageCount }).map((_, i) => (
                <Button
                  key={i}
                  variant={page === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </section>
      </div>
      <span className="hidden">{allProducts.length}</span>
    </div>
  );
}