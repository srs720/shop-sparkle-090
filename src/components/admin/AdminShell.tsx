import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Package, ShoppingCart, Users, CreditCard, Truck,
  Tag, Boxes, BarChart3, Settings, ShieldCheck, FileText,
  Bell, Search, ChevronLeft, ChevronRight, LogOut, Menu, X,
  AlertTriangle, Info, CheckCircle2, AlertOctagon,
} from "lucide-react";
import { AdminAuthProvider, useAdminAuth } from "@/store/adminAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { notifications } from "@/data/admin";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/shipping", label: "Shipping", icon: Truck },
  { to: "/admin/promotions", label: "Promotions", icon: Tag },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/users", label: "Users & Roles", icon: ShieldCheck },
  { to: "/admin/cms", label: "CMS", icon: FileText },
] as const;

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  return (
    <AdminAuthProvider>
      <div className="dark min-h-screen bg-background text-foreground">
        <Inner title={title}>{children}</Inner>
      </div>
    </AdminAuthProvider>
  );
}

function Inner({ children, title }: { children: ReactNode; title: string }) {
  const { isAuthed, user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setReady(true); }, []);
  useEffect(() => {
    if (ready && !isAuthed) navigate({ to: "/admin/login" });
  }, [ready, isAuthed, navigate]);

  if (!ready || !isAuthed) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading admin…</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - desktop */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-border bg-card transition-all duration-200",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarBody collapsed={collapsed} />
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="m-2 flex items-center justify-center rounded-md border border-border bg-background py-1.5 text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>

      {/* Sidebar - mobile drawer */}
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
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-base font-semibold truncate">{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search orders, products, users…" className="h-9 w-72 pl-8 bg-background" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-content-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                    {notifications.length}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((n) => {
                  const I = n.type === "warning" ? AlertTriangle : n.type === "danger" ? AlertOctagon : n.type === "success" ? CheckCircle2 : Info;
                  const color = n.type === "warning" ? "text-warning" : n.type === "danger" ? "text-destructive" : n.type === "success" ? "text-success" : "text-secondary";
                  return (
                    <DropdownMenuItem key={n.id} className="flex items-start gap-2 py-2">
                      <I className={cn("mt-0.5 h-4 w-4 shrink-0", color)} />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{n.title}</span>
                        <span className="text-xs text-muted-foreground">{n.body}</span>
                        <span className="mt-0.5 text-[10px] text-muted-foreground">{n.time}</span>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5 hover:bg-accent">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">SH</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start leading-tight">
                    <span className="text-xs font-medium">{user?.name}</span>
                    <span className="text-[10px] text-muted-foreground">Super Admin</span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Account settings</DropdownMenuItem>
                <DropdownMenuItem>Activity log</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate({ to: "/admin/login" }); }}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 bg-background">{children}</main>
      </div>
    </div>
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
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-secondary text-secondary-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
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
          v1.0 · Shopzy Admin
        </div>
      )}
    </>
  );
}