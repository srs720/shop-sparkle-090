import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminAuthProvider, useAdminAuth } from "@/store/adminAuth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Sign in — Shopzy" }] }),
  component: () => (
    <AdminAuthProvider>
      <div className="dark min-h-screen bg-background text-foreground">
        <LoginPage />
      </div>
    </AdminAuthProvider>
  ),
});

function LoginPage() {
  const { login, isAuthed } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthed) navigate({ to: "/admin" });
  }, [isAuthed, navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const ok = login(email, password);
      setLoading(false);
      if (ok) {
        toast.success("Welcome back, Admin");
        navigate({ to: "/admin" });
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    }, 350);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-secondary via-secondary/80 to-primary p-10 text-white">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-content-center rounded-lg bg-white/15 backdrop-blur font-bold">S</div>
          <span className="text-lg font-bold">Shopzy Admin</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight">Run your storefront with confidence.</h2>
          <p className="mt-3 max-w-md text-white/80">Inventory, orders, customers, payments — every lever you need in one polished dashboard.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {["12 modules","Realtime alerts","Role-based access"].map((s) => (
            <div key={s} className="rounded-md bg-white/10 px-3 py-2 backdrop-blur">{s}</div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-secondary" />
            <h1 className="text-lg font-semibold">Admin Sign In</h1>
          </div>
          <p className="text-xs text-muted-foreground">Restricted area. Authorized personnel only.</p>

          <div className="space-y-1.5">
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="admin@example.com" className="pl-9" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={password} onChange={(e) => setPassword(e.target.value)} required type={show ? "text" : "password"} placeholder="••••••••" className="pl-9 pr-9" />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2"><Checkbox defaultChecked /> Remember me</label>
            <a href="#" className="text-secondary hover:underline">Forgot password?</a>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground">
            Protected by 2FA & audit logging.
          </p>
        </form>
      </div>
    </div>
  );
}