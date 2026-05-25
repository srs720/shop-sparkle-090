import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, CreditCard, Truck, Wallet, Banknote } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Shopzy" }] }),
  component: Checkout,
});

const STEPS = ["Shipping", "Payment", "Review"];

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = subtotal + shipping + tax;

  if (placed) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
        <h1 className="mt-4 text-2xl font-bold">Order placed!</h1>
        <p className="mt-2 text-muted-foreground">Thank you for shopping with Shopzy. A confirmation email is on its way.</p>
        <Link to="/"><Button className="mt-6">Continue Shopping</Button></Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link to="/"><Button className="mt-6">Start Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 py-4 md:px-4 md:py-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <ol className="mt-4 flex items-center gap-2 text-sm">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>{i + 1}</span>
            <span className={i === step ? "font-semibold" : "text-muted-foreground"}>{s}</span>
            {i < STEPS.length - 1 && <span className="mx-2 h-px w-8 bg-border" />}
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          {step === 0 && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(1); }}>
              <h2 className="text-lg font-semibold">Shipping Address</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Full Name</Label><Input required placeholder="Jane Doe" /></div>
                <div><Label>Phone</Label><Input required type="tel" placeholder="+1 555 123 4567" /></div>
                <div className="sm:col-span-2"><Label>Address</Label><Input required placeholder="123 Main St" /></div>
                <div><Label>City</Label><Input required placeholder="New York" /></div>
                <div><Label>Postal Code</Label><Input required placeholder="10001" /></div>
              </div>
              <Button type="submit" size="lg" className="w-full">Continue to Payment</Button>
            </form>
          )}

          {step === 1 && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <h2 className="text-lg font-semibold">Payment Method</h2>
              <RadioGroup defaultValue="card" className="space-y-2">
                {[
                  { v: "card", t: "Credit / Debit Card", I: CreditCard },
                  { v: "wallet", t: "Digital Wallet", I: Wallet },
                  { v: "cod", t: "Cash on Delivery", I: Banknote },
                ].map(({ v, t, I }) => (
                  <label key={v} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 hover:border-primary">
                    <RadioGroupItem value={v} id={v} />
                    <I className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{t}</span>
                  </label>
                ))}
              </RadioGroup>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(0)}>Back</Button>
                <Button type="submit" className="flex-1">Review Order</Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Review Your Order</h2>
              <ul className="divide-y divide-border">
                {items.map((i) => (
                  <li key={i.product.id} className="flex gap-3 py-3">
                    <img src={i.product.image} alt={i.product.title} className="h-16 w-16 rounded object-cover" />
                    <div className="flex-1">
                      <div className="line-clamp-2 text-sm">{i.product.title}</div>
                      <div className="text-xs text-muted-foreground">Qty: {i.qty}</div>
                    </div>
                    <div className="text-sm font-semibold">${(i.product.price * i.qty).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1" size="lg" onClick={() => { clear(); setPlaced(true); }}>Place Order</Button>
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit space-y-3 rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold">Order Summary</h3>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({items.length} items)</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1"><Truck className="h-3.5 w-3.5" />Shipping</span><span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
            <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}