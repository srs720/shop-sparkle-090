import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Shield, Download, Trash2, Smartphone, Monitor } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/account/security")({ component: Security });

const DEVICES = [
  { id: 1, name: "iPhone 15 Pro · Safari", loc: "Dhaka, BD", when: "Active now", icon: Smartphone, current: true },
  { id: 2, name: "MacBook Pro · Chrome", loc: "Dhaka, BD", when: "2 hours ago", icon: Monitor },
  { id: 3, name: "Windows · Firefox", loc: "Chittagong, BD", when: "3 days ago", icon: Monitor },
];

function Security() {
  const [twofa, setTwofa] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [marketing, setMarketing] = useState(true);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Security & Privacy</h1>

      <div className="space-y-3 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Authentication</h2>
        <ToggleRow label="Two-factor authentication (2FA)" desc="Add a verification step when logging in." checked={twofa} onChange={setTwofa} />
        <ToggleRow label="Biometric login" desc="Use Fingerprint or Face ID on supported devices." checked={biometric} onChange={setBiometric} />
        <Button variant="outline" size="sm">Change password</Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Login activity & devices</h2>
        <ul className="mt-3 divide-y divide-border">
          {DEVICES.map((d) => (
            <li key={d.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <d.icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{d.name} {d.current && <span className="ml-1 rounded bg-success/10 px-1.5 py-0.5 text-xs text-success">This device</span>}</div>
                  <div className="text-xs text-muted-foreground">{d.loc} · {d.when}</div>
                </div>
              </div>
              {!d.current && <Button size="sm" variant="ghost" onClick={() => toast.success("Session revoked")}>Sign out</Button>}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Privacy preferences</h2>
        <ToggleRow label="Marketing emails & push" desc="Receive personalised offers and recommendations." checked={marketing} onChange={setMarketing} />
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Your data</h2>
        <p className="text-sm text-muted-foreground">Download a copy of your data or permanently delete your account.</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast.success("Export queued — you'll get an email")}><Download className="mr-1 h-4 w-4" />Export my data</Button>
          <Button variant="destructive" onClick={() => toast.error("Account deletion requires confirmation")}>
            <Trash2 className="mr-1 h-4 w-4" />Delete account
          </Button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
      <div>
        <div className="flex items-center gap-2 text-sm font-medium"><Shield className="h-4 w-4 text-primary" />{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}