import { Home, LayoutGrid, MessageCircle, ShoppingCart, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/store/cart";

const items = [
  { Icon: Home, label: "Home", to: "/", active: true },
  { Icon: LayoutGrid, label: "Categories", to: "/products" },
  { Icon: MessageCircle, label: "Messages", to: "/account" },
  { Icon: ShoppingCart, label: "Cart", to: "/checkout", badge: true },
  { Icon: User, label: "Account", to: "/account" },
] as const;

export function BottomNav() {
  const { count } = useCart();
  return (
    <nav className="sticky bottom-0 z-40 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5">
        {items.map(({ Icon, label, to, active, badge }) => (
          <li key={label}>
            <Link
              to={to}
              className={`relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold ${
                active ? "text-hot" : "text-muted-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-hot" : ""}`} />
              {badge && count > 0 && (
                <span className="absolute right-[calc(50%-22px)] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-hot px-1 text-[9px] font-bold text-hot-foreground">
                  {count}
                </span>
              )}
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}