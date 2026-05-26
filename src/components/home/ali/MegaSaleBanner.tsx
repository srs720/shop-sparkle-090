import { Link } from "@tanstack/react-router";

const img = (s: string) => `https://picsum.photos/seed/${s}/240/240`;
const cards = [
  { title: "Fashion", from: "$4.99", seed: "eid-fashion", to: "/category/fashion" },
  { title: "Beauty", from: "$1.99", seed: "eid-beauty", to: "/category/beauty" },
  { title: "Home", from: "$2.49", seed: "eid-home", to: "/category/home" },
];

export function MegaSaleBanner() {
  return (
    <div
      className="rounded-xl p-3 text-white"
      style={{ background: "var(--gradient-voucher)" }}
    >
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider opacity-90">
            Limited Offer
          </div>
          <h3 className="text-lg font-extrabold leading-tight">🌙 Mega Eid Sale</h3>
        </div>
        <Link
          to={"/promotions/mega-eid-sale" as never}
          className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-hot transition hover:brightness-95 active:scale-95"
        >
          Shop all →
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {cards.map((c) => (
          <Link
            key={c.title}
            to={c.to as never}
            className="block overflow-hidden rounded-lg bg-card text-foreground transition hover:shadow-md active:scale-[0.98]"
          >
            <img src={img(c.seed)} alt={c.title} className="aspect-square w-full object-cover" loading="lazy" />
            <div className="px-1.5 py-1">
              <div className="truncate text-[11px] font-bold">{c.title}</div>
              <div className="text-[11px] font-bold text-hot">From {c.from}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}