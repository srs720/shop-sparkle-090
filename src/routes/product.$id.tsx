import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getProduct, products, type Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Minus, Plus, Truck, Shield, RotateCcw, ChevronRight, ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/store/cart";
import { useNavigate } from "@tanstack/react-router";
import { ProductCard } from "@/components/product/ProductCard";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = getProduct(params.id);
    return {
      meta: [
        { title: `${p?.title ?? "Product"} — Shopzy` },
        { name: "description", content: p?.description ?? "Product details" },
        ...(p ? [
          { property: "og:title", content: p.title },
          { property: "og:description", content: p.description },
          { property: "og:image", content: p.image },
          { property: "twitter:image", content: p.image },
        ] : []),
      ],
    };
  },
  loader: ({ params }): Product => {
    const p = getProduct(params.id);
    if (!p) throw notFound();
    return p;
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="container mx-auto p-12 text-center">
      <h1 className="text-2xl font-bold">Product not found</h1>
      <Link to="/" className="mt-4 inline-block text-primary hover:underline">← Back to home</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container mx-auto p-12 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function ProductPage() {
  const p = Route.useLoaderData() as Product;
  const { add } = useCart();
  const navigate = useNavigate();
  const [imgIdx, setImgIdx] = useState(0);
  const [color, setColor] = useState<string | undefined>(p.colors?.[0]);
  const [size, setSize] = useState<string | undefined>(p.sizes?.[0]);
  const [qty, setQty] = useState(1);

  const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 6);

  return (
    <div className="container mx-auto px-3 py-4 md:px-4 md:py-6">
      <nav className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/category/$slug" params={{ slug: p.category }} className="hover:text-primary">{p.category}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="line-clamp-1 text-foreground">{p.title}</span>
      </nav>

      <div className="grid gap-6 rounded-xl border border-border bg-card p-4 md:p-6 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="overflow-hidden rounded-lg border border-border bg-muted">
            <img src={p.images[imgIdx]} alt={p.title} className="aspect-square w-full object-cover" />
          </div>
          <div className="mt-3 flex gap-2">
            {p.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`h-16 w-16 overflow-hidden rounded border-2 ${i === imgIdx ? "border-primary" : "border-border"}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-xs text-muted-foreground">Brand: <Link to="/" className="text-primary hover:underline">{p.brand}</Link></div>
            <h1 className="mt-1 text-xl font-semibold leading-tight md:text-2xl">{p.title}</h1>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <div className="flex text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" fill={i < Math.round(p.rating) ? "currentColor" : "none"} strokeWidth={1.5} />
                  ))}
                </div>
                <span className="font-medium">{p.rating}</span>
              </div>
              <span className="text-muted-foreground">{p.reviews.toLocaleString()} ratings</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">{p.sold.toLocaleString()} sold</span>
            </div>
          </div>

          <div className="rounded-lg bg-muted/40 p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-primary">${p.price}</span>
              <span className="text-base text-muted-foreground line-through">${p.originalPrice}</span>
              <span className="rounded bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">-{discount}%</span>
            </div>
            <div className={`mt-1 text-xs font-medium ${p.stock > 10 ? "text-success" : "text-destructive"}`}>
              {p.stock > 10 ? "In Stock" : p.stock > 0 ? `Only ${p.stock} left!` : "Out of Stock"}
            </div>
          </div>

          {p.colors && (
            <div>
              <div className="mb-2 text-sm">Color: <span className="font-medium">{color}</span></div>
              <div className="flex flex-wrap gap-2">
                {p.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    aria-label={c}
                    className={`h-9 w-9 rounded-full border-2 ${color === c ? "border-primary" : "border-border"}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          )}

          {p.sizes && (
            <div>
              <div className="mb-2 text-sm">Size: <span className="font-medium">{size}</span></div>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-12 rounded border-2 px-3 py-1.5 text-sm transition-colors ${
                      size === s ? "border-primary bg-accent text-accent-foreground" : "border-border hover:border-primary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="mb-2 text-sm">Quantity</div>
            <div className="inline-flex items-center rounded-md border border-border">
              <button className="px-3 py-2 hover:bg-muted" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-medium">{qty}</span>
              <button className="px-3 py-2 hover:bg-muted" onClick={() => setQty((q) => q + 1)}>
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" variant="outline" className="flex-1" onClick={() => add(p, { qty, color, size })}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button
              size="lg"
              className="flex-1"
              onClick={() => {
                add(p, { qty, color, size });
                navigate({ to: "/checkout" });
              }}
            >
              <Zap className="mr-2 h-4 w-4" /> Buy Now
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-border pt-4 text-xs">
            {[
              { icon: Truck, t: "Free Delivery" },
              { icon: RotateCcw, t: "14-day Returns" },
              { icon: Shield, t: "Warranty" },
            ].map(({ icon: I, t }) => (
              <div key={t} className="flex items-center gap-2 text-muted-foreground">
                <I className="h-4 w-4 text-primary" /> {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-4 md:p-6">
        <Tabs defaultValue="desc">
          <TabsList>
            <TabsTrigger value="desc">Description</TabsTrigger>
            <TabsTrigger value="spec">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({p.reviews.toLocaleString()})</TabsTrigger>
          </TabsList>
          <TabsContent value="desc" className="prose mt-4 max-w-none text-sm leading-relaxed text-foreground">
            <p>{p.description}</p>
            <p className="mt-3 text-muted-foreground">
              Enjoy unbeatable quality and value when you shop with Shopzy. Every order is backed by our buyer protection guarantee.
            </p>
          </TabsContent>
          <TabsContent value="spec" className="mt-4">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {Object.entries(p.specs).map(([k, v]) => (
                  <tr key={k}>
                    <td className="w-1/3 py-2 font-medium text-muted-foreground">{k}</td>
                    <td className="py-2">{v}</td>
                  </tr>
                ))}
                <tr><td className="w-1/3 py-2 font-medium text-muted-foreground">Brand</td><td className="py-2">{p.brand}</td></tr>
              </tbody>
            </table>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4 space-y-4">
            {[
              { name: "Sarah K.", r: 5, t: "Absolutely love it! Quality exceeded my expectations." },
              { name: "Michael R.", r: 4, t: "Great product for the price. Shipping was quick." },
              { name: "Lina P.", r: 5, t: "Exactly as described. Will buy again!" },
            ].map((r, i) => (
              <div key={i} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{r.name}</span>
                  <div className="flex text-warning">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5" fill={j < r.r ? "currentColor" : "none"} strokeWidth={1.5} />
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{r.t}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {related.length > 0 && (
        <div className="mt-6 rounded-xl border border-border bg-card p-4 md:p-6">
          <h2 className="mb-4 text-lg font-bold">You may also like</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {related.map((rp) => <ProductCard key={rp.id} product={rp} />)}
          </div>
        </div>
      )}
    </div>
  );
}