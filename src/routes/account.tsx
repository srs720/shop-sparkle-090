import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, RotateCcw, Gift, Heart, MapPin, Shield, LogOut, User, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/auth/AuthForm";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account — Shopzy" }] }),
  component: AccountLayout,
});

type Nav = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: Nav[] = [
  { to: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/account/orders", label: "Orders & Tracking", icon: Package },
  { to: "/account/returns", label: "Returns & Refunds", icon: RotateCcw },
  { to: "/account/rewards", label: "Rewards & Wallet", icon: Gift },
  { to: "/account/wishlist", label: "Wishlists", icon: Heart },
  { to: "/account/addresses", label: "Address Book", icon: MapPin },
  { to: "/account/security", label: "Security & Privacy", icon: Shield },
];

function AccountLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, loading, name } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const logout = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/login", replace: true });
  };

  if (loading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!user) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-6 shadow-lg">
          <h1 className="text-center text-lg font-bold">Sign in to view your account</h1>
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 py-4 md:px-4 md:py-6">
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><User className="h-6 w-6" /></div>
            <div className="min-w-0">
              <div className="truncate font-semibold">{name}</div>
              <div className="truncate text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
          <nav className="space-y-1 text-sm">
            {nav.map((n) => {
              const active = n.exact ? path === n.to : path.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to as never} className={`flex items-center gap-2 rounded-md px-3 py-2 transition ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                  <n.icon className="h-4 w-4" /> {n.label}
                </Link>
              );
            })}
            <button onClick={logout} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </nav>
        </aside>
        <div><Outlet /></div>
      </div>
    </div>
  );
}