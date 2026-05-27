import { Home, LayoutGrid, MessageCircle, ShoppingCart, User } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useCart } from "@/store/cart";

type NavItem = {
  Icon: typeof Home;
  label: string;
  to: string;
  badge?: boolean;
};

const items: NavItem[] = [
  { Icon: Home, label: "Home", to: "/" },
  { Icon: LayoutGrid, label: "Categories", to: "/categories" },
  { Icon: MessageCircle, label: "Messages", to: "/messages" },
  { Icon: ShoppingCart, label: "Cart", to: "/cart", badge: true },
  { Icon: User, label: "Account", to: "/account" },
];

export function BottomNav() {
  const { count } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="sticky bottom-0 z-40 border-t border-white/40 bg-white/70 backdrop-blur-xl backdrop-saturate-150 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_oklch(0.55_0.13_195/0.25)]">
      <ul className="grid grid-cols-5">
        {items.map(({ Icon, label, to, badge }) => {
          const active =
            to === "/"
              ? pathname === "/"
              : pathname === to || pathname.startsWith(`${to}/`);
          return (
            <li key={label}>
              <Link
                to={to as never}
                className={`relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition-all active:scale-95 ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 transition-colors ${active ? "text-primary" : ""}`} />
                {badge && count > 0 && (
                  <span className="absolute right-[calc(50%-22px)] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground shadow-md">
                    {count}
                  </span>
                )}
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}