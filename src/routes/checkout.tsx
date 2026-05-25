import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { useApp } from "@/store/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle2, CreditCard, Truck, Wallet, Banknote, Calculator, MapPin, Plus, Gift, Leaf, Heart, Building2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Shopzy" }] }),
  component: Checkout,
});

const STEPS = ["Address", "Delivery", "Add-ons", "Payment", "Review"];

function Checkout() {
  const { items, subtotal, clear, coupon, discount } = useCart();
  const { addresses, walletBalance } = useApp();
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [addressId, setAddressId] = useState(addresses[0]?.id ?? "");
  const [delivery, setDelivery] = useState("express");
  const [slot, setSlot] = useState("morning");
  const [pickupPoint, setPickupPoint] = useState("");
  const [gift, setGift] = useState(false);
  const [eco, setEco] = useState(true);
  const [donate, setDonate] = useState(false);
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState("bkash");
  const [saveCard, setSaveCard] = useState(true);
  const [useWallet, setUseWallet] = useState(false);
  const [emiOpen, setEmiOpen] = useState(false);
  const [emiMonths, setEmiMonths] = useState(6);

  const deliveryCost = delivery === "express" ? 9.99 : delivery === "nationwide" ? 5.99 : delivery === "pickup" ? 0 : 2.99;
  const giftFee = gift ? 2.0 : 0;
  const ecoFee = eco ? 0.5 : 0;
  const donation = donate ? 1.0 : 0;
  const tax = +((subtotal - discount) * 0.05).toFixed(2);
  const walletApplied = useWallet ? Math.min(walletBalance, subtotal - discount + deliveryCost + giftFee + ecoFee + donation + tax) : 0;
  const total = Math.max(0, subtotal - discount + deliveryCost + giftFee + ecoFee + donation + tax - walletApplied);

  if (placed) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
        <h1 className="mt-4 text-2xl font-bold">Order placed!</h1>
        <p className="mt-2 text-muted-foreground">Order #SHZ-{Math.floor(Math.random() * 90000) + 10000} confirmed. A receipt is on its way to your inbox.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/account/orders"><Button>Track order</Button></Link>
          <Link to="/"><Button variant="outline">Continue shopping</Button></Link>
        </div>
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

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="container mx-auto px-3 py-4 md:px-4 md:py-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <ol className="mt-4 flex flex-wrap items-center gap-1 text-sm">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-1">
            <button onClick={() => i < step && setStep(i)} className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</button>
            <span className={`hidden sm:inline ${i === step ? "font-semibold" : "text-muted-foreground"}`}>{s}</span>
            {i < STEPS.length - 1 && <span className="mx-1 h-px w-6 bg-border" />}
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">

          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Choose delivery address</h2>
              <RadioGroup value={addressId} onValueChange={setAddressId} className="space-y-2">
                {addresses.map((a) => (
                  <label key={a.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${addressId === a.id ? "border-primary bg-primary/5" : "border-border hover:border-primary"}`}>
                    <RadioGroupItem value={a.id} id={a.id} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-primary" />{a.label}</div>
                      <div className="text-sm">{a.name} · {a.phone}</div>
                      <div className="text-xs text-muted-foreground">{a.line}, {a.area}, {a.city} {a.postal}</div>
                    </div>
                  </label>
                ))}
              </RadioGroup>
              <Link to="/account/addresses"><Button variant="outline" size="sm"><Plus className="mr-1 h-4 w-4" />Manage address book</Button></Link>
              <Button size="lg" className="w-full" onClick={next}>Continue</Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Delivery options</h2>
              <RadioGroup value={delivery} onValueChange={setDelivery} className="space-y-2">
                {[
                  { v: "express", t: "Express delivery", d: "Within 24 hours", p: "$9.99" },
                  { v: "standard", t: "Standard (Inside Dhaka)", d: "2-3 days", p: "$2.99" },
                  { v: "nationwide", t: "Nationwide", d: "3-5 days", p: "$5.99" },
                  { v: "pickup", t: "Pickup point", d: "Collect from nearest store", p: "FREE" },
                ].map((o) => (
                  <label key={o.v} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${delivery === o.v ? "border-primary bg-primary/5" : "border-border"}`}>
                    <RadioGroupItem value={o.v} id={o.v} />
                    <div className="flex-1"><div className="text-sm font-medium">{o.t}</div><div className="text-xs text-muted-foreground">{o.d}</div></div>
                    <div className="text-sm font-semibold">{o.p}</div>
                  </label>
                ))}
              </RadioGroup>
              {delivery === "pickup" && (
                <div>
                  <Label>Pickup location</Label>
                  <Select value={pickupPoint} onValueChange={setPickupPoint}>
                    <SelectTrigger><SelectValue placeholder="Select store" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gulshan">Gulshan-2 Hub</SelectItem>
                      <SelectItem value="dhanmondi">Dhanmondi-27 Hub</SelectItem>
                      <SelectItem value="uttara">Uttara Sector-7 Hub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {delivery !== "pickup" && (
                <div>
                  <Label>Delivery slot</Label>
                  <RadioGroup value={slot} onValueChange={setSlot} className="mt-2 grid grid-cols-2 gap-2">
                    {[
                      { v: "morning", t: "Morning (9am-12pm)" },
                      { v: "afternoon", t: "Afternoon (12pm-4pm)" },
                      { v: "evening", t: "Evening (4pm-8pm)" },
                      { v: "any", t: "Anytime" },
                    ].map((s) => (
                      <label key={s.v} className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2 text-sm ${slot === s.v ? "border-primary bg-primary/5" : "border-border"}`}>
                        <RadioGroupItem value={s.v} id={`slot-${s.v}`} />{s.t}
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              )}
              <div className="flex gap-2"><Button variant="outline" onClick={back}>Back</Button><Button className="flex-1" onClick={next}>Continue</Button></div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Add-ons & extras</h2>
              <ToggleCard icon={Gift} title="Gift wrap" desc="Premium wrapping with a card (+$2.00)" checked={gift} onChange={setGift} />
              <ToggleCard icon={Leaf} title="Eco-friendly packaging" desc="Use 100% recycled materials (+$0.50)" checked={eco} onChange={setEco} />
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 hover:border-primary">
                <Checkbox checked={donate} onCheckedChange={(v) => setDonate(!!v)} id="donate" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium"><Heart className="h-4 w-4 text-destructive" />Round up & donate $1.00</div>
                  <div className="text-xs text-muted-foreground">Support flood relief in coastal regions.</div>
                </div>
              </label>
              <div>
                <Label>Personal note for recipient</Label>
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Happy birthday, Amy! 🎂" />
              </div>
              <div className="flex gap-2"><Button variant="outline" onClick={back}>Back</Button><Button className="flex-1" onClick={next}>Continue</Button></div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Payment method</h2>
              <RadioGroup value={payment} onValueChange={setPayment} className="space-y-2">
                <PayOption v="bkash" t="bKash" d="Mobile Financial Service" badge="Most popular" current={payment} />
                <PayOption v="nagad" t="Nagad" d="Mobile Financial Service" current={payment} />
                <PayOption v="upay" t="Upay" d="Mobile Financial Service" current={payment} />
                <PayOption v="card" t="Credit / Debit Card" d="Visa, Mastercard, Amex" icon={CreditCard} current={payment} />
                <PayOption v="bank" t="Bank Transfer" d="Direct deposit" icon={Building2} current={payment} />
                <PayOption v="emi" t="EMI / Installments" d="3, 6, 12, 24 months" current={payment} />
                <PayOption v="cod" t="Cash on Delivery" d="Pay when you receive" icon={Banknote} current={payment} />
              </RadioGroup>

              {payment === "card" && (
                <div className="space-y-2 rounded-lg border border-border p-3">
                  <div><Label>Card number</Label><Input placeholder="•••• •••• •••• ••••" /></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div><Label>Exp.</Label><Input placeholder="MM/YY" /></div>
                    <div><Label>CVV</Label><Input placeholder="123" /></div>
                    <div><Label>ZIP</Label><Input placeholder="1212" /></div>
                  </div>
                  <label className="flex items-center gap-2 text-sm"><Checkbox checked={saveCard} onCheckedChange={(v) => setSaveCard(!!v)} />Save card for next time</label>
                </div>
              )}

              {payment === "emi" && (
                <Dialog open={emiOpen} onOpenChange={setEmiOpen}>
                  <DialogTrigger asChild><Button variant="outline"><Calculator className="mr-1 h-4 w-4" />EMI Calculator</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>EMI Calculator</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm"><span>Loan amount</span><span className="font-semibold">${(subtotal - discount).toFixed(2)}</span></div>
                      <div>
                        <Label>Tenure (months)</Label>
                        <RadioGroup value={String(emiMonths)} onValueChange={(v) => setEmiMonths(Number(v))} className="mt-2 grid grid-cols-4 gap-2">
                          {[3, 6, 12, 24].map((m) => (
                            <label key={m} className={`cursor-pointer rounded border p-2 text-center text-sm ${emiMonths === m ? "border-primary bg-primary/5" : "border-border"}`}>
                              <RadioGroupItem value={String(m)} className="sr-only" />{m}m
                            </label>
                          ))}
                        </RadioGroup>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <div className="text-xs text-muted-foreground">Estimated monthly payment</div>
                        <div className="text-2xl font-bold text-primary">${(((subtotal - discount) * 1.1) / emiMonths).toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">@ 10% interest p.a.</div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              <div className="rounded-lg border border-border p-3">
                <label className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium"><Wallet className="h-4 w-4 text-primary" />Use Shopzy Wallet</div>
                    <div className="text-xs text-muted-foreground">Balance: ${walletBalance.toFixed(2)}</div>
                  </div>
                  <Switch checked={useWallet} onCheckedChange={setUseWallet} />
                </label>
              </div>

              <div className="flex gap-2"><Button variant="outline" onClick={back}>Back</Button><Button className="flex-1" onClick={next}>Review</Button></div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Review your order</h2>
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
              {note && <div className="rounded bg-muted p-3 text-sm"><strong>Note:</strong> {note}</div>}
              <div className="flex gap-2"><Button variant="outline" onClick={back}>Back</Button><Button className="flex-1" size="lg" onClick={() => { clear(); setPlaced(true); }}>Place Order — ${total.toFixed(2)}</Button></div>
            </div>
          )}
        </div>

        <aside className="h-fit space-y-3 rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold">Order Summary</h3>
          <div className="space-y-1.5 text-sm">
            <Row l={`Subtotal (${items.length} items)`} v={`$${subtotal.toFixed(2)}`} />
            {coupon && <Row l={`Coupon (${coupon})`} v={`-$${discount.toFixed(2)}`} success />}
            <Row l="Delivery" v={deliveryCost === 0 ? "FREE" : `$${deliveryCost.toFixed(2)}`} icon={Truck} />
            {gift && <Row l="Gift wrap" v={`$${giftFee.toFixed(2)}`} />}
            {eco && <Row l="Eco packaging" v={`$${ecoFee.toFixed(2)}`} />}
            {donate && <Row l="Donation" v={`$${donation.toFixed(2)}`} />}
            <Row l="Tax (5%)" v={`$${tax.toFixed(2)}`} />
            {useWallet && walletApplied > 0 && <Row l="Wallet" v={`-$${walletApplied.toFixed(2)}`} success />}
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
            <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ToggleCard({ icon: I, title, desc, checked, onChange }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 hover:border-primary">
      <I className="mt-0.5 h-5 w-5 text-primary" />
      <div className="flex-1">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function PayOption({ v, t, d, badge, icon: I, current }: { v: string; t: string; d: string; badge?: string; icon?: React.ComponentType<{ className?: string }>; current: string }) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${current === v ? "border-primary bg-primary/5" : "border-border hover:border-primary"}`}>
      <RadioGroupItem value={v} id={`pay-${v}`} />
      {I ? <I className="h-5 w-5 text-primary" /> : <div className="flex h-7 w-10 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">{t[0]}</div>}
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm font-medium">{t} {badge && <span className="rounded bg-warning/15 px-1.5 py-0.5 text-xs text-warning">{badge}</span>}</div>
        <div className="text-xs text-muted-foreground">{d}</div>
      </div>
    </label>
  );
}

function Row({ l, v, icon: I, success }: { l: string; v: string; icon?: React.ComponentType<{ className?: string }>; success?: boolean }) {
  return (
    <div className={`flex justify-between ${success ? "text-success" : ""}`}>
      <span className="text-muted-foreground flex items-center gap-1">{I && <I className="h-3.5 w-3.5" />}{l}</span>
      <span>{v}</span>
    </div>
  );
}