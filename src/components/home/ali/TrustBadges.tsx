import { ShieldCheck, Truck, Undo2 } from "lucide-react";

export function TrustBadges() {
  const items = [
    { Icon: ShieldCheck, label: "Safe Payment" },
    { Icon: Truck, label: "Fast Delivery" },
    { Icon: Undo2, label: "Free Return" },
  ];
  return (
    <div className="flex items-center justify-around border-y border-border bg-card px-2 py-1.5 text-[11px] text-muted-foreground">
      {items.map(({ Icon, label }) => (
        <div key={label} className="flex items-center gap-1">
          <Icon className="h-3.5 w-3.5 text-success" />
          <span className="font-medium text-foreground/80">{label}</span>
        </div>
      ))}
    </div>
  );
}