import { createFileRoute } from "@tanstack/react-router";
import { HeroSlider } from "@/components/home/HeroSlider";
import { FlashSale } from "@/components/home/FlashSale";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductSection } from "@/components/home/ProductSection";
import { bestSellers, newArrivals, products } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shopzy — Shop smarter, save bigger" },
      { name: "description", content: "Discover millions of deals on electronics, fashion, home and more." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="container mx-auto space-y-6 px-3 py-4 md:px-4 md:py-6">
      <HeroSlider />
      <FlashSale />
      <CategoryGrid />
      <ProductSection title="Just For You" products={products.slice(0, 12)} viewAllHref="/category/all" />
      <ProductSection title="Best Sellers" products={bestSellers()} viewAllHref="/category/all" />
      <ProductSection title="New Arrivals" products={newArrivals()} viewAllHref="/category/all" />
    </div>
  );
}
