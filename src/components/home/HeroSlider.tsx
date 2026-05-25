import { useEffect, useState } from "react";
import { heroBanners } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HeroSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % heroBanners.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-[260px] overflow-hidden rounded-xl md:h-[380px]">
      {heroBanners.map((b, idx) => (
        <div
          key={b.id}
          className="absolute inset-0 flex items-center justify-between gap-6 px-6 transition-opacity duration-700 md:px-12"
          style={{ background: b.bg, opacity: i === idx ? 1 : 0, pointerEvents: i === idx ? "auto" : "none" }}
        >
          <div className="z-10 max-w-md text-white">
            <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">{b.title}</h2>
            <p className="mt-2 text-sm opacity-90 md:text-lg">{b.subtitle}</p>
            <Link to={b.href as "/category/$slug"} params={{ slug: b.href.split("/").pop()! }}>
              <Button size="lg" variant="secondary" className="mt-4">{b.cta}</Button>
            </Link>
          </div>
          <img src={b.image} alt={b.title} className="hidden h-full w-1/2 object-cover opacity-30 md:block md:opacity-60" />
        </div>
      ))}
      <button
        onClick={() => setI((p) => (p - 1 + heroBanners.length) % heroBanners.length)}
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
        aria-label="Previous"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => setI((p) => (p + 1) % heroBanners.length)}
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
        aria-label="Next"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
        {heroBanners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-2 bg-white/50"}`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}