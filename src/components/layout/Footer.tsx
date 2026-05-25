import { Facebook, Instagram, Twitter, Youtube, CreditCard, Smartphone, Truck, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const cols = [
  { title: "Customer Care", links: ["Help Center", "How to Buy", "Returns & Refunds", "Contact Us", "Warranty Policy"] },
  { title: "Make Money With Us", links: ["Sell on Shopzy", "Become an Affiliate", "Advertise Your Products", "Sell on Marketplace"] },
  { title: "Shopzy", links: ["About Us", "Careers", "Press", "Investor Relations", "Shopzy Blog"] },
];

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-card text-card-foreground">
      <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-2 lg:grid-cols-5">
        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide">{col.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-primary">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="lg:col-span-2">
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide">Stay In The Loop</h4>
          <p className="mb-3 text-sm text-muted-foreground">Subscribe and get exclusive deals straight to your inbox.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input type="email" placeholder="your@email.com" />
            <Button type="submit">Subscribe</Button>
          </form>
          <div className="mt-6 flex gap-3 text-muted-foreground">
            <a href="#" aria-label="Facebook" className="hover:text-primary"><Facebook className="h-5 w-5" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-primary"><Instagram className="h-5 w-5" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-primary"><Twitter className="h-5 w-5" /></a>
            <a href="#" aria-label="YouTube" className="hover:text-primary"><Youtube className="h-5 w-5" /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto grid gap-4 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, t: "Free Shipping", d: "On orders over $50" },
            { icon: Shield, t: "Secure Payment", d: "100% safe transactions" },
            { icon: CreditCard, t: "Easy Returns", d: "14-day return policy" },
            { icon: Smartphone, t: "24/7 Support", d: "Dedicated support" },
          ].map(({ icon: I, t, d }) => (
            <div key={t} className="flex items-center gap-3">
              <I className="h-7 w-7 text-primary" />
              <div>
                <div className="text-sm font-semibold">{t}</div>
                <div className="text-xs text-muted-foreground">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border bg-muted/30">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-muted-foreground sm:flex-row">
          <div>© 2026 Shopzy. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span>We accept:</span>
            {["VISA", "MC", "AMEX", "PayPal", "Apple Pay"].map((p) => (
              <span key={p} className="rounded border border-border bg-background px-2 py-1 font-semibold">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}