import { Link, useNavigate } from "@tanstack/react-router";
import { Search, MapPin, Heart, ShoppingCart, User, Menu, Mic, Camera, GitCompareArrows, Sun, Moon } from "lucide-react";
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
import { useApp } from "@/store/app";
import { categories } from "@/data/products";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function MainHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { count, setOpen } = useCart();
  const { setAuthOpen, compare, theme, toggleTheme } = useApp();
  const { user, name } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [voice, setVoice] = useState(false);
  const [visual, setVisual] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/products", search: { q } as never });
  };

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

        <form className="hidden flex-1 md:flex" onSubmit={submit}>
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
              aria-label="Search products"
            />
            <button type="button" onClick={() => setVoice(true)} aria-label="Voice search" className="border-l border-border px-3 hover:bg-muted">
              <Mic className="h-5 w-5 text-muted-foreground" />
            </button>
            <button type="button" onClick={() => setVisual(true)} aria-label="Visual search" className="border-l border-border px-3 hover:bg-muted">
              <Camera className="h-5 w-5 text-muted-foreground" />
            </button>
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
          <button onClick={toggleTheme} aria-label="Toggle theme" className="rounded p-2 hover:bg-white/10 md:hidden">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {user ? (
            <Link to="/account" className="hidden items-center gap-1.5 rounded px-2 py-1 text-sm hover:bg-white/10 sm:flex">
              <User className="h-5 w-5" />
              <span className="hidden max-w-[120px] truncate md:inline">{name}</span>
            </Link>
          ) : (
            <button onClick={() => setAuthOpen(true)} className="hidden items-center gap-1.5 rounded px-2 py-1 text-sm hover:bg-white/10 sm:flex">
              <User className="h-5 w-5" />
              <span className="hidden md:inline">Login</span>
            </button>
          )}
          <Link to="/account/wishlist" className="relative rounded p-2 hover:bg-white/10" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </Link>
          <Link to="/compare" className="relative rounded p-2 hover:bg-white/10" aria-label="Compare">
            <GitCompareArrows className="h-5 w-5" />
            {compare.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-warning px-1 text-[10px] font-bold text-foreground">{compare.length}</span>
            )}
          </Link>
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
        <form className="flex gap-1" onSubmit={submit}>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="h-10 rounded-r-none bg-background text-foreground" aria-label="Search products" />
          <Button type="button" variant="secondary" size="icon" className="h-10 w-10 rounded-none" onClick={() => setVoice(true)} aria-label="Voice search">
            <Mic className="h-4 w-4" />
          </Button>
          <Button type="button" variant="secondary" size="icon" className="h-10 w-10 rounded-none" onClick={() => setVisual(true)} aria-label="Visual search">
            <Camera className="h-4 w-4" />
          </Button>
          <Button type="submit" className="h-10 w-10 rounded-l-none" size="icon" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <Dialog open={voice} onOpenChange={setVoice}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Voice Search</DialogTitle>
            <DialogDescription>Speak now — we'll find what you need.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
              <Mic className="h-10 w-10" />
            </div>
            <p className="text-sm text-muted-foreground">Listening... "Find wireless headphones"</p>
            <Button onClick={() => { setVoice(false); navigate({ to: "/products" }); }}>Use result</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={visual} onOpenChange={setVisual}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Visual Search</DialogTitle>
            <DialogDescription>Upload an image to find similar products.</DialogDescription>
          </DialogHeader>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-8 text-center hover:bg-muted/50">
            <Camera className="h-10 w-10 text-muted-foreground" />
            <span className="text-sm font-medium">Tap to upload or take a photo</span>
            <span className="text-xs text-muted-foreground">JPG, PNG up to 10MB</span>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={() => { setVisual(false); navigate({ to: "/products" }); }} />
          </label>
        </DialogContent>
      </Dialog>
    </div>
  );
}