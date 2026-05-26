import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

const vouchers = [
  { amount: "$3", min: "$20", code: "SAVE3", color: "from-[oklch(0.68_0.24_30)] to-[oklch(0.6_0.26_18)]" },
  { amount: "$8", min: "$50", code: "BIG8", color: "from-[oklch(0.7_0.22_40)] to-[oklch(0.62_0.25_25)]" },
  { amount: "$15", min: "$100", code: "MEGA15", color: "from-[oklch(0.65_0.24_20)] to-[oklch(0.55_0.24_350)]" },
  { amount: "$30", min: "$200", code: "VIP30", color: "from-[oklch(0.6_0.26_18)] to-[oklch(0.5_0.22_300)]" },
  { amount: "$50", min: "$300", code: "ELITE50", color: "from-[oklch(0.7_0.21_50)] to-[oklch(0.6_0.24_25)]" },
];

export function Vouchers() {
  const [claimed, setClaimed] = useState<Record<string, boolean>>({});
  const claim = (code: string) => {
    if (claimed[code]) return;
    setClaimed((p) => ({ ...p, [code]: true }));
    toast.success("Voucher Claimed successfully!", { description: `Code ${code} added to your wallet.` });
  };
  return (
    <div className="rounded-xl bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">
          🎟️ Claim Vouchers To Save More!
        </h3>
        <Link to={"/vouchers" as never} className="text-xs font-semibold text-hot hover:underline">
          View all →
        </Link>
      </div>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [&::-webkit-scrollbar]:hidden">
        {vouchers.map((v) => {
          const isClaimed = !!claimed[v.code];
          return (
          <div
            key={v.code}
            className={`relative flex h-20 w-36 shrink-0 items-center overflow-hidden rounded-lg bg-gradient-to-br ${v.color} text-white shadow-sm`}
          >
            <span className="absolute left-[88px] top-0 h-full w-px border-l border-dashed border-white/50" />
            <span className="absolute left-[82px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-page" />
            <div className="flex w-[88px] flex-col items-center justify-center px-2">
              <div className="text-2xl font-black leading-none">{v.amount}</div>
              <div className="mt-1 text-[10px] opacity-90">Min. spend {v.min}</div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-1 pl-2 pr-2">
              <div className="text-[10px] font-semibold uppercase opacity-90">
                Code
              </div>
              <div className="text-[11px] font-bold tracking-wide">{v.code}</div>
              <button
                onClick={() => claim(v.code)}
                disabled={isClaimed}
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition active:scale-95 ${
                  isClaimed
                    ? "bg-success text-success-foreground cursor-default"
                    : "bg-white text-hot hover:brightness-95"
                }`}
              >
                {isClaimed ? "Claimed!" : "Claim"}
              </button>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}