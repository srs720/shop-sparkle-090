import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, Tag, Heart, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { UserMobileLayout } from "@/components/layout/UserMobileLayout";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart — Shopzy" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, subtotal, discount, coupon, applyCoupon, removeCoupon } = useCart();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((i) => [i.product.id, true])),
  );

  const allSelected = items.length > 0 && items.every((i) => selected[i.product.id]);
  const toggleAll = (v: boolean) => setSelected(Object.fromEntries(items.map((i) => [i.product.id, v])));

  const selectedItems = items.filter((i) => selected[i.product.id]);
  const selectedSubtotal = selectedItems.reduce((n, i) => n + i.product.price * i.qty, 0);
  const shipping = selectedSubtotal > 50 || selectedSubtotal === 0 ? 0 : 4.99;
  const total = Math.max(0, selectedSubtotal - discount) + shipping;

  const handleApply = async () => {
    setApplying(true);
    const r = await applyCoupon(code);
    setApplying(false);
    if (r.ok) { toast.success(r.message); setCode(""); } else toast.error(r.message);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) return toast.error("Select at least one item");
    navigate({ to: "/checkout" });
  };

  if (items.length === 0) {
    return (
      <UserMobileLayout title="Your Cart" hideBack>
        <EmptyCart />
      </UserMobileLayout>
    );
  }

  return (
    <UserMobileLayout
      title={`Your Cart (${items.length})`}
      hideBack
      footer={
        <CartSummaryBar
          subtotal={selectedSubtotal}
          discount={discount}
          shipping={shipping}
          total={total}
          count={selectedItems.reduce((n, i) => n + i.qty, 0)}
          onCheckout={handleCheckout}
          allSelected={allSelected}
          toggleAll={toggleAll}
        />
      }
    >
      {/* Free shipping notice */}
      {selectedSubtotal > 0 && selectedSubtotal < 50 && (
        <div className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
          Add <span className="font-bold">${(50 - selectedSubtotal).toFixed(2)}</span> more for FREE shipping 🚚
        </div>
      )}

      {/* Cart items */}
      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item.product.id}
            className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm"
          >
            <Checkbox
              checked={!!selected[item.product.id]}
              onCheckedChange={(v) => setSelected((s) => ({ ...s, [item.product.id]: !!v }))}
              className="mt-1 self-start data-[state=checked]:border-rose-600 data-[state=checked]:bg-rose-600"
            />
            <Link
              to="/product/$id"
              params={{ id: item.product.id }}
              className="shrink-0"
            >
              <img
                src={item.product.image}
                alt={item.product.title}
                className="h-20 w-20 rounded-xl object-cover"
                loading="lazy"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
              <Link
                to="/product/$id"
                params={{ id: item.product.id }}
                className="line-clamp-2 text-sm font-medium text-gray-900 transition-colors hover:text-rose-600"
              >
                {item.product.title}
              </Link>
              {(item.color || item.size) && (
                <p className="mt-0.5 text-[11px] text-gray-500">
                  {[item.size, item.color].filter(Boolean).join(" · ")}
                </p>
              )}

              <div className="mt-auto flex items-end justify-between pt-2">
                <div>
                  <span className="text-base font-bold text-rose-600">
                    ${item.product.price.toFixed(2)}
                  </span>
                  {item.product.originalPrice > item.product.price && (
                    <span className="ml-1.5 text-[11px] text-gray-400 line-through">
                      ${item.product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <QtyStepper
                  qty={item.qty}
                  onChange={(q) => setQty(item.product.id, q)}
                  onRemove={() => {
                    remove(item.product.id);
                    toast.success("Removed from cart");
                  }}
                />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Coupon */}
      <div className="mt-4 rounded-2xl bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center gap-1.5">
          <Tag className="h-4 w-4 text-rose-600" />
          <h3 className="text-sm font-bold text-gray-900">Promo Code</h3>
        </div>
        {coupon ? (
          <div className="flex items-center justify-between rounded-xl border border-dashed border-rose-300 bg-rose-50 px-3 py-2">
            <div>
              <p className="text-xs font-bold text-rose-700">{coupon}</p>
              <p className="text-[11px] text-rose-600">−${discount.toFixed(2)} applied</p>
            </div>
            <button
              onClick={() => { removeCoupon(); toast.success("Coupon removed"); }}
              className="text-xs font-semibold text-rose-700 hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter promo code"
              className="h-10 rounded-xl border-gray-200 bg-gray-50 text-sm uppercase focus-visible:ring-rose-500"
            />
            <Button
              onClick={handleApply}
              disabled={applying || !code}
              className="h-10 shrink-0 rounded-xl bg-gradient-to-r from-rose-600 to-pink-500 px-4 text-sm font-semibold text-white shadow-sm hover:opacity-90"
            >
              {applying ? "..." : "Apply"}
            </Button>
          </div>
        )}
      </div>

      {/* Trust */}
      <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-white p-3 text-[11px] text-gray-500 shadow-sm">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        Secure checkout · Buyer protection · Easy returns
      </div>
    </UserMobileLayout>
  );
}

function QtyStepper({ qty, onChange, onRemove }: { qty: number; onChange: (q: number) => void; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-1">
      {qty <= 1 ? (
        <button
          onClick={onRemove}
          aria-label="Remove item"
          className="grid h-8 w-8 place-content-center rounded-lg bg-gray-100 text-gray-500 transition-colors hover:bg-rose-100 hover:text-rose-600 active:scale-90"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ) : (
        <button
          onClick={() => onChange(qty - 1)}
          aria-label="Decrease"
          className="grid h-8 w-8 place-content-center rounded-lg bg-gray-100 text-gray-700 transition-colors hover:bg-rose-50 hover:text-rose-600 active:scale-90"
        >
          <Minus className="h-4 w-4" />
        </button>
      )}
      <span className="w-7 text-center text-sm font-bold tabular-nums text-gray-900">{qty}</span>
      <button
        onClick={() => onChange(qty + 1)}
        aria-label="Increase"
        className="grid h-8 w-8 place-content-center rounded-lg bg-rose-600 text-white transition-colors hover:bg-rose-700 active:scale-90"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function CartSummaryBar({
  subtotal, discount, shipping, total, count, onCheckout, allSelected, toggleAll,
}: {
  subtotal: number; discount: number; shipping: number; total: number; count: number;
  onCheckout: () => void; allSelected: boolean; toggleAll: (v: boolean) => void;
}) {
  return (
    <div className="px-3 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(v) => toggleAll(!!v)}
            className="data-[state=checked]:border-rose-600 data-[state=checked]:bg-rose-600"
          />
          All
        </label>
        <div className="flex-1 text-right">
          <div className="text-[11px] text-gray-500">
            Subtotal ${subtotal.toFixed(2)}
            {discount > 0 && <span className="text-rose-600"> · −${discount.toFixed(2)}</span>}
            {" · "}
            {shipping === 0 ? <span className="font-semibold text-emerald-600">Free shipping</span> : `+$${shipping.toFixed(2)} ship`}
          </div>
          <div className="text-base font-extrabold leading-tight text-gray-900">
            Total <span className="text-rose-600">${total.toFixed(2)}</span>
          </div>
        </div>
        <Button
          onClick={onCheckout}
          className="h-11 shrink-0 rounded-xl bg-gradient-to-r from-rose-600 to-pink-500 px-5 text-sm font-bold text-white shadow-sm hover:opacity-95"
        >
          Checkout{count > 0 ? ` (${count})` : ""}
        </Button>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-5 grid h-24 w-24 place-content-center rounded-full bg-rose-50">
        <ShoppingBag className="h-12 w-12 text-rose-600" />
      </div>
      <h2 className="mb-1 text-lg font-bold text-gray-900">Your cart is empty</h2>
      <p className="mb-6 text-sm text-gray-500">
        Looks like you haven't added anything yet. Let's find something you'll love.
      </p>
      <Link
        to="/categories"
        className="rounded-xl bg-gradient-to-r from-rose-600 to-pink-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition active:scale-95"
      >
        Start Shopping
      </Link>
      <Link
        to="/account/wishlist"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-rose-600"
      >
        <Heart className="h-4 w-4" /> View your wishlist
      </Link>
    </div>
  );
}