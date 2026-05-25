import { useEffect, useState } from "react";

export function Countdown({ hours = 12 }: { hours?: number }) {
  const [end] = useState(() => Date.now() + hours * 3600 * 1000);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, end - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-1 font-mono text-sm">
      {[pad(h), pad(m), pad(s)].map((v, i) => (
        <span key={i} className="rounded bg-foreground px-1.5 py-0.5 text-background">{v}</span>
      ))}
    </div>
  );
}