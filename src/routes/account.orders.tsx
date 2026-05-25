import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, Truck, CheckCircle2, MapPin, Download, RotateCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/account/orders")({
  component: Orders,
});

const ORDERS = [
  { id: "SHZ-10923", date: "2026-05-22", total: 1349.0, status: "shipped", items: 2, title: "iPhone 15 Pro Max + Case" },
  { id: "SHZ-10912", date: "2026-05-18", total: 89.99, status: "delivered", items: 1, title: "Sony WH-1000XM5" },
  { id: "SHZ-10888", date: "2026-05-10", total: 245.0, status: "processing", items: 3, title: "Nike Air Force 1 + 2 more" },
];

const STEPS = ["Order placed", "Packed", "Shipped", "Out for delivery", "Delivered"];

function StatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    processing: "bg-warning/15 text-warning",
    shipped: "bg-secondary/15 text-secondary",
    delivered: "bg-success/15 text-success",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${map[s]}`}>{s}</span>;
}

function Orders() {
  const [track, setTrack] = useState<string | null>(null);
  const order = ORDERS.find((o) => o.id === track);
  const currentStep = order?.status === "delivered" ? 4 : order?.status === "shipped" ? 3 : 1;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Orders & Tracking</h1>
      <ul className="space-y-3">
        {ORDERS.map((o) => (
          <li key={o.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-semibold">{o.id}</div>
                <div className="text-xs text-muted-foreground">{o.date} · {o.items} items</div>
              </div>
              <StatusBadge s={o.status} />
            </div>
            <div className="mt-2 text-sm">{o.title}</div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="text-lg font-bold text-primary">${o.total.toFixed(2)}</div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setTrack(o.id)}><Truck className="mr-1 h-4 w-4" />Track</Button>
                <Button size="sm" variant="outline" onClick={() => toast.success("Items re-added to cart")}><RotateCw className="mr-1 h-4 w-4" />Reorder</Button>
                <Button size="sm" variant="outline" onClick={() => toast.success("Invoice downloaded (demo)")}><Download className="mr-1 h-4 w-4" />Invoice</Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={!!track} onOpenChange={(o) => !o && setTrack(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Tracking {order?.id}</DialogTitle></DialogHeader>
          <div className="flex h-40 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <MapPin className="mr-2 h-5 w-5" /> Live map placeholder
          </div>
          <ol className="space-y-3">
            {STEPS.map((s, i) => (
              <li key={s} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full ${i <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {i <= currentStep ? <CheckCircle2 className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                  </div>
                  {i < STEPS.length - 1 && <div className={`h-8 w-px ${i < currentStep ? "bg-primary" : "bg-border"}`} />}
                </div>
                <div className="pt-1">
                  <div className={`text-sm font-medium ${i <= currentStep ? "" : "text-muted-foreground"}`}>{s}</div>
                  {i <= currentStep && <div className="text-xs text-muted-foreground">2026-05-{20 + i}</div>}
                </div>
              </li>
            ))}
          </ol>
        </DialogContent>
      </Dialog>
    </div>
  );
}