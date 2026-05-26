import { useEffect, useState } from "react";

export function FlashCountdown({ hours = 6 }: { hours?: number }) {
  const [end] = useState(() => Date.now() + hours * 3600 * 1000);
  // Initialize `now` to `end` so SSR + first client render both show 00:00:00,
  // avoiding hydration mismatches. The effect updates it on mount.
  const [now, setNow] = useState(end);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, end - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-1 text-xs font-bold">
      {[pad(h), pad(m), pad(s)].map((v, i, arr) => (
        <span key={i} className="contents">
          <span className="rounded bg-hot px-1.5 py-0.5 font-mono text-hot-foreground">
            {v}
          </span>
          {i < arr.length - 1 && <span className="text-hot">:</span>}
        </span>
      ))}
    </div>
  );
}