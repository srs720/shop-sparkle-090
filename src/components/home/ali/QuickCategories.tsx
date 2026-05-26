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

type Item = { icon: LucideIcon; label: string; color: string };

const items: Item[] = [
  { icon: ShoppingBag, label: "Mart", color: "oklch(0.65 0.24 30)" },
  { icon: Shirt, label: "Fashion", color: "oklch(0.6 0.22 350)" },
  { icon: Truck, label: "Free Delivery", color: "oklch(0.6 0.18 150)" },
  { icon: Tag, label: "Low Price", color: "oklch(0.7 0.21 50)" },
  { icon: Sparkles, label: "Beauty", color: "oklch(0.7 0.19 330)" },
  { icon: Smartphone, label: "Electronics", color: "oklch(0.55 0.21 260)" },
  { icon: Home, label: "Home", color: "oklch(0.6 0.17 170)" },
  { icon: Gift, label: "Coupons", color: "oklch(0.65 0.24 20)" },
  { icon: Gamepad2, label: "Gaming", color: "oklch(0.55 0.21 290)" },
  { icon: Wrench, label: "Tools", color: "oklch(0.5 0.1 250)" },
];

export function QuickCategories() {
  return (
    <div className="rounded-xl bg-card p-3">
      <div className="grid grid-cols-5 gap-y-3">
        {items.map(({ icon: Icon, label, color }) => (
          <button key={label} className="flex flex-col items-center gap-1">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm"
              style={{ background: color }}
            >
              <Icon className="h-6 w-6" />
            </span>
            <span className="text-[10.5px] font-medium leading-tight text-foreground">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}