import { Link } from "@tanstack/react-router";

export function HeroBanner() {
  return (
    <Link
      to={"/promotions/super-deals" as never}
      className="relative block overflow-hidden rounded-xl transition active:scale-[0.99]"
    >
      <div
        className="relative h-36 w-full sm:h-44"
        style={{ background: "var(--gradient-mega)" }}
      >
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <div className="text-primary-foreground">
            <div className="text-[10px] font-semibold uppercase tracking-wider opacity-90">
              Limited time
            </div>
            <div className="text-2xl font-extrabold leading-tight">Super Deals</div>
            <div className="mt-1 text-sm opacity-95">Up to 80% OFF</div>
            <span className="mt-2 inline-block rounded-full bg-card px-3 py-1 text-xs font-bold text-hot transition hover:brightness-95">
              Shop now →
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="rounded-full bg-card/95 px-2 py-0.5 text-[10px] font-bold text-hot">
              NEW USER
            </span>
            <div className="mt-2 text-5xl font-black italic text-card drop-shadow-md">
              $0.99
            </div>
            <div className="text-[11px] font-semibold text-card/90">deals from</div>
          </div>
        </div>
      </div>
    </Link>
  );
}