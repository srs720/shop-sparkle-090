import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Wallet, Calendar, Copy, Sparkles } from "lucide-react";
import { useApp } from "@/store/app";
import { toast } from "sonner";

export const Route = createFileRoute("/account/rewards")({ component: Rewards });

const TX = [
  { date: "2026-05-22", desc: "Refund — Order #SHZ-10888", amount: +45.0 },
  { date: "2026-05-19", desc: "Order payment — #SHZ-10912", amount: -89.99 },
  { date: "2026-05-15", desc: "Wallet top-up", amount: +50.0 },
  { date: "2026-05-09", desc: "Cashback — Flash sale", amount: +12.5 },
];

function Rewards() {
  const { walletBalance, loyaltyPoints, checkedInToday, dailyCheckIn } = useApp();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Rewards & Wallet</h1>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-gradient-to-br from-primary to-secondary p-5 text-primary-foreground">
          <Wallet className="h-6 w-6 opacity-80" />
          <div className="mt-2 text-xs opacity-80">Wallet balance</div>
          <div className="text-2xl font-bold">${walletBalance.toFixed(2)}</div>
          <Button size="sm" variant="secondary" className="mt-3">Top up</Button>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <Gift className="h-6 w-6 text-primary" />
          <div className="mt-2 text-xs text-muted-foreground">Loyalty points</div>
          <div className="text-2xl font-bold">{loyaltyPoints.toLocaleString()}</div>
          <div className="mt-1 text-xs text-muted-foreground">≈ ${(loyaltyPoints / 100).toFixed(2)} value</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <Calendar className="h-6 w-6 text-warning" />
          <div className="mt-2 text-xs text-muted-foreground">Daily check-in</div>
          <div className="text-sm">Earn 10 pts every day</div>
          <Button size="sm" className="mt-3" disabled={checkedInToday} onClick={dailyCheckIn}>
            <Sparkles className="mr-1 h-4 w-4" />{checkedInToday ? "Claimed today" : "Check in"}
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Referral program</h2>
        <p className="mt-1 text-sm text-muted-foreground">Invite friends and earn $10 for each successful signup.</p>
        <div className="mt-3 flex gap-2">
          <Input readOnly value="SHOPZY-JANE-2026" className="font-mono" />
          <Button onClick={() => { navigator.clipboard?.writeText("SHOPZY-JANE-2026"); toast.success("Copied!"); }}>
            <Copy className="mr-1 h-4 w-4" />Copy
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Wallet transactions</h2>
        <ul className="mt-3 divide-y divide-border">
          {TX.map((t, i) => (
            <li key={i} className="flex items-center justify-between py-3 text-sm">
              <div>
                <div>{t.desc}</div>
                <div className="text-xs text-muted-foreground">{t.date}</div>
              </div>
              <div className={`font-semibold ${t.amount > 0 ? "text-success" : "text-destructive"}`}>
                {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}