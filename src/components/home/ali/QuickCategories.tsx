import {
  ShoppingBag,
  Shirt,
  Truck,
  Tag,
  Sparkles,
  Smartphone,
  Home,
  Gift,
  Gamepad2,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

type Item = { icon: LucideIcon; label: string; color: string; to: string };

const items: Item[] = [
  { icon: ShoppingBag, label: "Mart", color: "oklch(0.65 0.24 30)", to: "/category/home" },
  { icon: Shirt, label: "Fashion", color: "oklch(0.6 0.22 350)", to: "/category/fashion" },
  { icon: Truck, label: "Free Delivery", color: "oklch(0.6 0.18 150)", to: "/promotions/free-delivery" },
  { icon: Tag, label: "Low Price", color: "oklch(0.7 0.21 50)", to: "/promotions/low-price" },
  { icon: Sparkles, label: "Beauty", color: "oklch(0.7 0.19 330)", to: "/category/beauty" },
  { icon: Smartphone, label: "Electronics", color: "oklch(0.55 0.21 260)", to: "/category/electronics" },
  { icon: Home, label: "Home", color: "oklch(0.6 0.17 170)", to: "/category/home" },
  { icon: Gift, label: "Coupons", color: "oklch(0.65 0.24 20)", to: "/vouchers" },
  { icon: Gamepad2, label: "Gaming", color: "oklch(0.55 0.21 290)", to: "/category/gaming" },
  { icon: Wrench, label: "Tools", color: "oklch(0.5 0.1 250)", to: "/category/automotive" },
];

export function QuickCategories() {
  return (
    <div className="rounded-xl bg-card p-3">
      <div className="grid grid-cols-5 gap-y-3">
        {items.map(({ icon: Icon, label, color, to }) => (
          <Link
            key={label}
            to={to as never}
            className="flex flex-col items-center gap-1 transition active:scale-95"
          >
            <span
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm transition hover:scale-105"
              style={{ background: color }}
            >
              <Icon className="h-6 w-6" />
            </span>
            <span className="text-[10.5px] font-medium leading-tight text-foreground">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}