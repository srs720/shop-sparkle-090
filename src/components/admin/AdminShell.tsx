import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard, Package, ShoppingCart, Users, CreditCard, Truck,
  Tag, Boxes, BarChart3, Settings, ShieldCheck, FileText, MessageSquare,
  Bell, Search, ChevronLeft, ChevronRight, LogOut, Menu, X, Star,
  AlertTriangle, Info, CheckCircle2, AlertOctagon, Shield,
} from "lucide-react";
import { AdminAuthProvider, useAdminAuth } from "@/store/adminAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/shipping", label: "Shipping", icon: Truck },
  { to: "/admin/promotions", label: "Promotions", icon: Tag },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/cms", label: "CMS & Banners", icon: FileText },
  { to: "/admin/tickets", label: "Support", icon: MessageSquare },
  { to: "/admin/security", label: "Security & Audit", icon: Shield },
  { to: "/admin/users", label: "Users & Roles", icon: ShieldCheck },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  return (
    <AdminAuthProvider>
      <div className="admin-scope min-h-screen text-foreground">
        <Inner title={title}>{children}</Inner>
      </div>
    </AdminAuthProvider>
  );
}

function Inner({ children, title }: { children: ReactNode; title: string }) {
  const { isAuthed, user, logout, loading, canEdit } = useAdminAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthed) navigate({ to: "/admin/login" });
  }, [loading, isAuthed, navigate]);

  if (loading || !isAuthed) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading admin…</div>;
  }

  if (!canEdit) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="max-w-md text-center space-y-3 rounded-2xl admin-card p-8">
          <h2 className="text-xl font-semibold">No admin access</h2>
          <p className="text-sm text-muted-foreground">
            Your account ({user?.email}) doesn't have admin or editor role yet.
          </p>
          <Button variant="outline" onClick={async () => { await logout(); navigate({ to: "/admin/login" }); }}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className={cn("hidden lg:flex flex-col border-r border-border/70 admin-glass transition-all duration-200", collapsed ? "w-16" : "w-64")}>
        <SidebarBody collapsed={collapsed} />
        <button onClick={() => setCollapsed((c) => !c)} className="m-2 flex items-center justify-center rounded-md border border-border/70 bg-background/70 py-1.5 text-muted-foreground hover:text-foreground transition-colors">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <aside className="absolute left-0 top-0 h-full w-64 flex-col border-r border-border bg-card flex" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <Brand />
              <button onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <SidebarBody collapsed={false} onNavigate={() => setMobileOpen(false)} hideBrand />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 admin-glass px-4">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-base font-semibold truncate admin-gradient-text">{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search orders, products, users…" className="h-9 w-72 pl-8 bg-background/70 border-border/70" />
              <span className="admin-kbd absolute right-2 top-1/2 -translate-y-1/2 hidden xl:inline">⌘K</span>
            </div>

            <NotificationsBell />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md border border-border/70 bg-background/70 px-2 py-1.5 hover:bg-accent transition-colors">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-gradient-to-br from-secondary to-primary text-white text-xs">
                      {(user?.name ?? "A").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start leading-tight">
                    <span className="text-xs font-medium">{user?.name}</span>
                    <span className="text-[10px] text-muted-foreground capitalize">{user?.roles[0] ?? "viewer"}</span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/account" })}>Storefront profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/admin/settings" })}>Account settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/admin/security" })}>Activity log</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => { await logout(); navigate({ to: "/admin/login" }); }}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

function NotificationsBell() {
  const qc = useQueryClient();
  const { data: notifs = [] } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_notifications").select("*").order("created_at", { ascending: false }).limit(8);
      if (error) throw error;
      return data ?? [];
    },
  });
  const unread = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    const ch = supabase
      .channel("admin-notifications-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "admin_notifications" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-notifications"] });
      })
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, [qc]);

  const markAllRead = async () => {
    await supabase.from("admin_notifications").update({ read: true }).eq("read", false);
    qc.invalidateQueries({ queryKey: ["admin-notifications"] });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-content-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {unread > 0 && <button onClick={markAllRead} className="text-xs text-secondary hover:underline">Mark all read</button>}
        </div>
        <DropdownMenuSeparator />
        {notifs.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">No notifications</div>
        ) : notifs.map((n) => {
          const I = n.level === "warning" ? AlertTriangle : n.level === "danger" ? AlertOctagon : n.level === "success" ? CheckCircle2 : Info;
          const color = n.level === "warning" ? "text-warning" : n.level === "danger" ? "text-destructive" : n.level === "success" ? "text-success" : "text-secondary";
          return (
            <DropdownMenuItem key={n.id} className={cn("flex items-start gap-2 py-2", !n.read && "bg-secondary/5")}>
              <I className={cn("mt-0.5 h-4 w-4 shrink-0", color)} />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{n.title}</span>
                {n.body && <span className="text-xs text-muted-foreground">{n.body}</span>}
                <span className="mt-0.5 text-[10px] text-muted-foreground">{new Date(n.created_at).toLocaleString()}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-8 w-8 place-content-center rounded-md bg-gradient-to-br from-secondary to-primary font-bold text-white">S</div>
      <span className="font-bold tracking-tight">Shopzy Admin</span>
    </div>
  );
}

function SidebarBody({ collapsed, onNavigate, hideBrand }: { collapsed: boolean; onNavigate?: () => void; hideBrand?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <>
      {!hideBrand && (
        <div className={cn("flex h-14 items-center border-b border-border px-4", collapsed && "justify-center px-2")}>
          {collapsed ? (
            <div className="grid h-8 w-8 place-content-center rounded-md bg-gradient-to-br from-secondary to-primary font-bold text-white">S</div>
          ) : <Brand />}
        </div>
      )}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const I = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to as string}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-secondary text-secondary-foreground font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                collapsed && "justify-center px-2",
              )}
              title={item.label}
            >
              <I className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      {!collapsed && (
        <div className="border-t border-border p-3 text-[11px] text-muted-foreground">
          v2.0 · Shopzy Admin
        </div>
      )}
    </>
  );
}
