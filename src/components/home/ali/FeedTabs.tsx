import { useState } from "react";

const tabs = ["For You", "Choice Deals", "Trend Look", "Free Delivery"];

export function FeedTabs({ onChange }: { onChange?: (t: string) => void }) {
  const [active, setActive] = useState(tabs[0]);
  return (
    <div className="sticky top-[56px] z-30 -mx-3 border-b border-border bg-page/95 backdrop-blur">
      <div className="flex gap-1 overflow-x-auto px-3 py-2 [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => {
          const isActive = t === active;
          return (
            <button
              key={t}
              onClick={() => {
                setActive(t);
                onChange?.(t);
              }}
              className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-hot text-hot-foreground"
                  : "bg-card text-foreground/80"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}