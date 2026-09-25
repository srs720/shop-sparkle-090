import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, Tag, Truck, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal, coupon, applyCoupon, removeCoupon, discount, freeShipping } = useCart();
  const [code, setCode] = useState("");
  const [area, setArea] = useState("dhaka");
  const delivery = freeShipping ? 0 : area === "express" ? 9.99 : area === "outside" ? 5.99 : subtotal > 50 ? 0 : 2.99;
  const total = Math.max(0, subtotal - discount) + (items.length ? delivery : 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Your Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-muted-foreground">
              <ShoppingBag className="h-12 w-12 opacity-40" />
              <p>Your cart is empty</p>
              <Button variant="outline" onClick={() => setOpen(false)}>Continue shopping</Button>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((i) => (
                <li key={i.product.id} className="flex gap-3 p-4">
                  <img src={i.product.image} alt={i.product.title} className="h-20 w-20 shrink-0 rounded object-cover" />
                  <div className="flex flex-1 flex-col gap-1">
                    <Link
                      to="/product/$id"
                      params={{ id: i.product.id }}
                      onClick={() => setOpen(false)}
                      className="line-clamp-2 text-sm hover:text-primary"
                    >
                      {i.product.title}
                    </Link>
                    <div className="text-sm font-bold text-primary">${(i.product.price * i.qty).toFixed(2)}</div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded border border-border">
                        <button className="px-2 py-1 hover:bg-muted" onClick={() => setQty(i.product.id, i.qty - 1)} aria-label="Decrease">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{i.qty}</span>
                        <button className="px-2 py-1 hover:bg-muted" onClick={() => setQty(i.product.id, i.qty + 1)} aria-label="Increase">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button onClick={() => remove(i.product.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="flex-col border-t border-border bg-muted/20 p-5">
            <div className="w-full space-y-3">
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-medium"><Tag className="h-3.5 w-3.5" />Coupon code <span className="ml-auto text-muted-foreground">try SAVE10, MEGA20</span></label>
                {coupon ? (
                  <div className="flex items-center justify-between rounded border border-success/30 bg-success/10 px-3 py-2 text-sm">
                    <span className="font-medium text-success">{coupon} applied</span>
                    <button onClick={removeCoupon} aria-label="Remove coupon"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter code" className="h-9" />
                    <Button size="sm" onClick={async () => { const r = await applyCoupon(code); r.ok ? toast.success(r.message) : toast.error(r.message); setCode(""); }}>Apply</Button>
                  </div>
                )}
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-medium"><Truck className="h-3.5 w-3.5" />Delivery</label>
                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dhaka">Inside Dhaka — {subtotal > 50 ? "FREE" : "$2.99"}</SelectItem>
                    <SelectItem value="outside">Outside Dhaka — $5.99</SelectItem>
                    <SelectItem value="express">Express (Same day) — $9.99</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 border-t border-border pt-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`}</span></div>
                <div className="flex justify-between border-t border-border pt-1 text-base font-bold"><span>Total</span><span className="text-primary">${total.toFixed(2)}</span></div>
              </div>
              <Link to="/checkout" onClick={() => setOpen(false)}>
                <Button className="w-full" size="lg">Proceed to Checkout</Button>
              </Link>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}