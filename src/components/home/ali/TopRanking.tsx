import { Crown } from "lucide-react";

const img = (s: string) => `https://picsum.photos/seed/${s}/300/300`;

const groups = [
  {
    cat: "Figures",
    items: [
      { rank: 1, seed: "fig-1", price: 12.99 },
      { rank: 2, seed: "fig-2", price: 8.5 },
      { rank: 3, seed: "fig-3", price: 15.2 },
    ],
  },
  {
    cat: "Women's Intimate",
    items: [
      { rank: 1, seed: "wi-1", price: 6.99 },
      { rank: 2, seed: "wi-2", price: 9.49 },
      { rank: 3, seed: "wi-3", price: 11.0 },
    ],
  },
  {
    cat: "Controllers",
    items: [
      { rank: 1, seed: "ctr-1", price: 23.9 },
      { rank: 2, seed: "ctr-2", price: 18.5 },
      { rank: 3, seed: "ctr-3", price: 29.99 },
    ],
  },
  {
    cat: "Kitchen",
    items: [
      { rank: 1, seed: "kit-1", price: 4.5 },
      { rank: 2, seed: "kit-2", price: 6.9 },
      { rank: 3, seed: "kit-3", price: 11.2 },
    ],
  },
];

function rankColor(r: number) {
  if (r === 1) return "bg-gradient-to-br from-[oklch(0.85_0.16_85)] to-[oklch(0.65_0.18_60)]";
  if (r === 2) return "bg-gradient-to-br from-[oklch(0.85_0.02_250)] to-[oklch(0.6_0.02_250)]";
  return "bg-gradient-to-br from-[oklch(0.7_0.13_50)] to-[oklch(0.5_0.13_40)]";
}

export function TopRanking() {
  return (
    <div className="rounded-xl bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Crown className="h-5 w-5 text-[oklch(0.75_0.17_75)]" />
          <h3 className="text-base font-extrabold text-foreground">Top Ranking</h3>
        </div>
        <button className="text-xs font-semibold text-hot">More →</button>
      </div>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 [&::-webkit-scrollbar]:hidden">
        {groups.map((g) => (
          <div key={g.cat} className="w-44 shrink-0 rounded-lg border border-border p-2">
            <div className="mb-2 truncate text-xs font-bold text-foreground">
              🔥 {g.cat}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {g.items.map((it) => (
                <div key={it.rank} className="relative">
                  <img
                    src={img(g.cat + it.seed)}
                    alt={`Top ${it.rank}`}
                    className="aspect-square w-full rounded object-cover"
                    loading="lazy"
                  />
                  <span
                    className={`absolute left-0 top-0 rounded-br-md rounded-tl-md px-1 py-0.5 text-[9px] font-extrabold text-white shadow ${rankColor(
                      it.rank,
                    )}`}
                  >
                    Top {it.rank}
                  </span>
                  <div className="mt-0.5 text-[10px] font-bold text-hot">
                    ${it.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}