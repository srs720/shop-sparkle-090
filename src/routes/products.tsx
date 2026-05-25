import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { products as ALL, categories } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Grid3x3, List, SlidersHorizontal, Star } from "lucide-react";

type Search = { q?: string; category?: string };

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [{ title: "Shop all products — Shopzy" }, { name: "description", content: "Browse and filter our catalogue." }] }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
  }),
  component: ProductsPage,
});

const BRANDS = Array.from(new Set(ALL.map((p) => p.brand)));
const COLORS = ["#000000", "#ffffff", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#a855f7"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const AREAS = ["Dhaka", "Chittagong", "Sylhet", "Khulna", "Rajshahi", "Nationwide"];

function Filters({
  price, setPrice, brands, toggleBrand, rating, setRating, area, setArea,
}: any) {
  return (
    <div className="space-y-5 text-sm">
      <div>
        <h3 className="mb-2 font-semibold">Price range</h3>
        <Slider value={price} onValueChange={setPrice} min={0} max={2000} step={10} />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>${price[0]}</span><span>${price[1]}</span></div>
      </div>
      <div>
        <h3 className="mb-2 font-semibold">Brand</h3>
        <div className="max-h-44 space-y-1.5 overflow-y-auto pr-1">
          {BRANDS.map((b) => (
            <label key={b} className="flex items-center gap-2"><Checkbox checked={brands.includes(b)} onCheckedChange={() => toggleBrand(b)} /><span>{b}</span></label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-2 font-semibold">Color</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (<button key={c} className="h-7 w-7 rounded-full border-2 border-border" style={{ background: c }} aria-label={`Color ${c}`} />))}
        </div>
      </div>
      <div>
        <h3 className="mb-2 font-semibold">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (<button key={s} className="rounded border border-border px-2.5 py-1 text-xs hover:border-primary">{s}</button>))}
        </div>
      </div>
      <div>
        <h3 className="mb-2 font-semibold">Rating</h3>
        <div className="space-y-1.5">
          {[4, 3, 2, 1].map((r) => (
            <label key={r} className="flex items-center gap-2">
              <Checkbox checked={rating === r} onCheckedChange={() => setRating(rating === r ? 0 : r)} />
              <span className="flex items-center">{Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < r ? "fill-warning text-warning" : "text-muted-foreground"}`} />
              ))} <span className="ml-1 text-xs">& up</span></span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-2 font-semibold">Delivery area</h3>
        <Select value={area} onValueChange={setArea}>
          <SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
          <SelectContent>{AREAS.map((a) => (<SelectItem key={a} value={a}>{a}</SelectItem>))}</SelectContent>
        </Select>
      </div>
    </div>
  );
}

function ProductsPage() {
  const { q, category } = Route.useSearch();
  const [price, setPrice] = useState<[number, number]>([0, 2000]);
  const [brands, setBrands] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [area, setArea] = useState("Nationwide");
  const [sort, setSort] = useState("popular");
  const [view, setView] = useState<"grid" | "list">("grid");

  const toggleBrand = (b: string) => setBrands((p) => (p.includes(b) ? p.filter((x) => x !== b) : [...p, b]));

  const filtered = useMemo(() => {
    let r = ALL.filter((p) => p.price >= price[0] && p.price <= price[1]);
    if (q) r = r.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase()));
    if (category) r = r.filter((p) => p.category === category);
    if (brands.length) r = r.filter((p) => brands.includes(p.brand));
    if (rating) r = r.filter((p) => p.rating >= rating);
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    else if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    else if (sort === "newest") r = [...r].reverse();
    return r;
  }, [q, category, price, brands, rating, sort]);

  const filterProps = { price, setPrice, brands, toggleBrand, rating, setRating, area, setArea };

  return (
    <div className="container mx-auto px-3 py-4 md:px-4 md:py-6">
      <nav className="mb-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> / <span>Products</span>
      </nav>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold md:text-2xl">All products <span className="text-sm font-normal text-muted-foreground">({filtered.length})</span></h1>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden"><SlidersHorizontal className="mr-1 h-4 w-4" />Filters</Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
              <div className="mt-4"><Filters {...filterProps} /></div>
            </SheetContent>
          </Sheet>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
          <div className="hidden items-center rounded border border-border md:flex">
            <button onClick={() => setView("grid")} aria-label="Grid view" className={`p-2 ${view === "grid" ? "bg-primary text-primary-foreground" : ""}`}><Grid3x3 className="h-4 w-4" /></button>
            <button onClick={() => setView("list")} aria-label="List view" className={`p-2 ${view === "list" ? "bg-primary text-primary-foreground" : ""}`}><List className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="hidden h-fit rounded-xl border border-border bg-card p-4 lg:block"><Filters {...filterProps} /></aside>
        <div>
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">No products match your filters.</div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((p) => (<ProductCard key={p.id} product={p} />))}
            </div>
          ) : (
            <ul className="space-y-3">
              {filtered.map((p) => (
                <li key={p.id} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                  <Link to="/product/$id" params={{ id: p.id }} className="shrink-0"><img src={p.image} alt={p.title} className="h-28 w-28 rounded object-cover" loading="lazy" /></Link>
                  <div className="flex flex-1 flex-col">
                    <Link to="/product/$id" params={{ id: p.id }} className="line-clamp-2 font-medium hover:text-primary">{p.title}</Link>
                    <div className="mt-1 text-xs text-muted-foreground">{p.brand}</div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="text-lg font-bold text-primary">${p.price}</div>
                      <Link to="/product/$id" params={{ id: p.id }}><Button size="sm">View</Button></Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}