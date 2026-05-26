import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AdminAuthProvider, useAdminAuth } from "@/store/adminAuth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Sign in — Shopzy" }] }),
  component: () => (
    <AdminAuthProvider>
      <LoginPage />
    </AdminAuthProvider>
  ),
});

function LoginPage() {
  const { login, signup, isAuthed, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthed) navigate({ to: "/admin" });
  }, [authLoading, isAuthed, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const res = await signup(email, password, fullName);
        if (!res.ok) { toast.error(res.error ?? "Could not sign up"); return; }
        toast.success("Account created. Signing you in…");
        const li = await login(email, password);
        if (!li.ok) { toast.error(li.error ?? "Sign-in failed"); return; }
        navigate({ to: "/admin" });
      } else {
        const res = await login(email, password);
        if (!res.ok) { toast.error(res.error ?? "Invalid credentials"); return; }
        toast.success("Welcome back");
        navigate({ to: "/admin" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-background text-foreground">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-secondary via-secondary/80 to-primary p-10 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: "radial-gradient(60rem 30rem at 20% 0%, rgba(255,255,255,.25), transparent 60%)" }} />
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-content-center rounded-lg bg-white/15 backdrop-blur font-bold">S</div>
          <span className="text-lg font-bold">Shopzy Admin</span>
        </div>
        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight">Run your storefront with confidence.</h2>
          <p className="mt-3 max-w-md text-white/80">Inventory, orders, customers, payments — every lever you need in one polished dashboard.</p>
        </div>
        <div className="relative grid grid-cols-3 gap-3 text-sm">
          {["12 modules","Realtime alerts","Role-based access"].map((s) => (
            <div key={s} className="rounded-md bg-white/10 px-3 py-2 backdrop-blur">{s}</div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card p-6 shadow-2xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-secondary" />
            <h1 className="text-lg font-semibold">Admin Access</h1>
          </div>
          <p className="text-xs text-muted-foreground">First person to sign up automatically becomes the admin.</p>

          <Tabs value={mode} onValueChange={(v) => setMode(v as "login" | "signup")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="signup" className="space-y-1.5 mt-4">
              <Label>Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required={mode === "signup"} placeholder="Jane Doe" className="pl-9" />
              </div>
            </TabsContent>
          </Tabs>

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
              <Input value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} type={show ? "text" : "password"} placeholder="••••••••" className="pl-9 pr-9" />
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
            {loading ? (mode === "signup" ? "Creating account…" : "Signing in…") : (mode === "signup" ? "Create account" : "Sign In")}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground">
            Protected by 2FA & audit logging.
          </p>
        </form>
      </div>
    </div>
  );
}