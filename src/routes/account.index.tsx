import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Package, Heart, Wallet, Gift } from "lucide-react";
import { useApp } from "@/store/app";
import { useCart } from "@/store/cart";

export const Route = createFileRoute("/account/")({
  component: Dashboard,
});

function Dashboard() {
  const { wishlists, walletBalance, loyaltyPoints } = useApp();
  const { count } = useCart();
  const { name } = useAuth();
  const wishCount = wishlists.reduce((n, l) => n + l.productIds.length, 0);

  const stats = [
    { label: "Active orders", value: 3, icon: Package, to: "/account/orders" },
    { label: "Wishlist items", value: wishCount, icon: Heart, to: "/account/wishlist" },
    { label: "Wallet", value: `$${walletBalance.toFixed(2)}`, icon: Wallet, to: "/account/rewards" },
    { label: "Loyalty points", value: loyaltyPoints, icon: Gift, to: "/account/rewards" },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome back, {name.split(" ")[0]} 👋</h1>
      <p className="text-sm text-muted-foreground">You have {count} items in your cart.</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to as never}>
            <Card className="transition hover:shadow-md">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><s.icon className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="text-lg font-bold">{s.value}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Recent activity</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex justify-between border-b border-border pb-2"><span>Order #SHZ-10923 shipped</span><span className="text-muted-foreground">2h ago</span></li>
          <li className="flex justify-between border-b border-border pb-2"><span>Earned 50 loyalty points</span><span className="text-muted-foreground">1d ago</span></li>
          <li className="flex justify-between"><span>Wallet topped up $50</span><span className="text-muted-foreground">3d ago</span></li>
        </ul>
      </div>
    </div>
  );
}