import { Link } from "@tanstack/react-router";
import { Search, MapPin, Heart, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/store/cart";
import { categories } from "@/data/products";
import { useState } from "react";

export function MainHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { count, setOpen } = useCart();
  const [q, setQ] = useState("");

  return (
    <div className="bg-header-main text-header-main-foreground">
      <div className="container mx-auto flex h-16 items-center gap-3 px-4">
        <button className="md:hidden" onClick={onMenuClick} aria-label="Menu">
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/" className="flex shrink-0 items-center gap-1 text-2xl font-extrabold tracking-tight">
          <span className="rounded bg-primary px-1.5 py-0.5 text-primary-foreground">Shop</span>
          <span>zy</span>
        </Link>

        <form className="hidden flex-1 md:flex" onSubmit={(e) => e.preventDefault()}>
          <div className="flex w-full overflow-hidden rounded-md bg-background text-foreground shadow-sm">
            <Select defaultValue="all">
              <SelectTrigger className="h-10 w-36 shrink-0 rounded-none border-0 border-r border-border bg-muted/50 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, brands and categories..."
              className="h-10 rounded-none border-0 focus-visible:ring-0"
            />
            <Button type="submit" className="h-10 rounded-none px-6">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:gap-3">
          <button className="hidden items-center gap-1.5 rounded px-2 py-1 text-xs hover:bg-white/10 lg:flex">
            <MapPin className="h-4 w-4" />
            <div className="text-left leading-tight">
              <div className="opacity-70">Deliver to</div>
              <div className="font-semibold">New York 10001</div>
            </div>
          </button>
          <Link to="/login" className="hidden items-center gap-1.5 rounded px-2 py-1 text-sm hover:bg-white/10 sm:flex">
            <User className="h-5 w-5" />
            <span className="hidden md:inline">Login</span>
          </Link>
          <button className="relative rounded p-2 hover:bg-white/10" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </button>
          <button
            onClick={() => setOpen(true)}
            className="relative rounded p-2 hover:bg-white/10"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-3 md:hidden">
        <form className="flex" onSubmit={(e) => e.preventDefault()}>
          <Input placeholder="Search..." className="h-10 rounded-r-none bg-background text-foreground" />
          <Button type="submit" className="h-10 rounded-l-none">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}