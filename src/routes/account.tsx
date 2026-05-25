import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, RotateCcw, Gift, Heart, MapPin, Shield, LogOut, User } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account — Shopzy" }] }),
  component: AccountLayout,
});

const nav = [
  { to: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/account/orders", label: "Orders & Tracking", icon: Package },
  { to: "/account/returns", label: "Returns & Refunds", icon: RotateCcw },
  { to: "/account/rewards", label: "Rewards & Wallet", icon: Gift },
  { to: "/account/wishlist", label: "Wishlists", icon: Heart },
  { to: "/account/addresses", label: "Address Book", icon: MapPin },
  { to: "/account/security", label: "Security & Privacy", icon: Shield },
] as const;

function AccountLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="container mx-auto px-3 py-4 md:px-4 md:py-6">
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><User className="h-6 w-6" /></div>
            <div>
              <div className="font-semibold">Jane Doe</div>
              <div className="text-xs text-muted-foreground">jane@example.com</div>
            </div>
          </div>
          <nav className="space-y-1 text-sm">
            {nav.map((n) => {
              const active = n.exact ? path === n.to : path.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to} className={`flex items-center gap-2 rounded-md px-3 py-2 transition ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                  <n.icon className="h-4 w-4" /> {n.label}
                </Link>
              );
            })}
            <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </nav>
        </aside>
        <div><Outlet /></div>
      </div>
    </div>
  );
}