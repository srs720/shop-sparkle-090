import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/store/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, MapPin } from "lucide-react";

export const Route = createFileRoute("/account/addresses")({ component: Addresses });

function Addresses() {
  const { addresses, addAddress, removeAddress } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Address Book</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" />Add address</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New address</DialogTitle></DialogHeader>
            <form className="space-y-3" onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              addAddress({ label: f.get("label") as string, name: f.get("name") as string, phone: f.get("phone") as string, line: f.get("line") as string, city: f.get("city") as string, area: f.get("area") as string, postal: f.get("postal") as string });
              setOpen(false);
            }}>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Label</Label><Input name="label" required placeholder="Home" /></div>
                <div><Label>Name</Label><Input name="name" required /></div>
              </div>
              <div><Label>Phone</Label><Input name="phone" required /></div>
              <div><Label>Address</Label><Input name="line" required /></div>
              <div className="grid grid-cols-3 gap-2">
                <div><Label>City</Label><Input name="city" required /></div>
                <div><Label>Area</Label><Input name="area" required /></div>
                <div><Label>Postal</Label><Input name="postal" required /></div>
              </div>
              <Button type="submit" className="w-full">Save address</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <ul className="grid gap-3 md:grid-cols-2">
        {addresses.map((a) => (
          <li key={a.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 font-semibold"><MapPin className="h-4 w-4 text-primary" />{a.label} {a.isDefault && <span className="rounded bg-success/10 px-2 py-0.5 text-xs text-success">Default</span>}</div>
                <div className="mt-1 text-sm">{a.name} · {a.phone}</div>
                <div className="text-sm text-muted-foreground">{a.line}, {a.area}, {a.city} {a.postal}</div>
              </div>
              <button onClick={() => removeAddress(a.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}