import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

type Mode = "login" | "signup" | "forgot";

export function AuthForm({ onDone }: { onDone?: () => void }) {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const em = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return setError("Please enter a valid email address.");
    if (mode !== "forgot" && password.length < 6) return setError("Password must be at least 6 characters.");
    if (mode === "signup" && name.trim().length < 2) return setError("Please enter your full name.");
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: em, password });
        if (error) throw error;
        toast.success("Signed in");
        onDone?.();
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: em,
          password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name.trim() } },
        });
        if (error) throw error;
        if (data.user && data.user.identities?.length === 0) {
          setError("An account with this email already exists. Please sign in.");
        } else if (data.session) {
          toast.success("Account created");
          onDone?.();
        } else {
          setNotice("Check your email to confirm your account, then sign in.");
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(em, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setNotice("If an account exists for this email, a reset link has been sent.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(/invalid login/i.test(msg) ? "Incorrect email or password." : /not confirmed/i.test(msg) ? "Please confirm your email first — check your inbox." : msg);
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError(null);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) return setError(res.error.message);
    if (!res.redirected) { toast.success("Signed in with Google"); onDone?.(); }
  };

  return (
    <div className="space-y-4">
      {mode !== "forgot" && (
        <div className="flex rounded-lg bg-muted p-1 text-sm">
          {(["login", "signup"] as const).map((m) => (
            <button key={m} type="button" onClick={() => { setMode(m); setError(null); setNotice(null); }}
              className={`flex-1 rounded-md py-2 font-semibold transition ${mode === m ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>
      )}
      <form className="space-y-3" onSubmit={submit} noValidate>
        {mode === "forgot" && <p className="text-sm text-muted-foreground">Enter your email and we'll send you a link to reset your password.</p>}
        {mode === "signup" && (
          <div><Label htmlFor="af-name">Full name</Label><Input id="af-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" autoComplete="name" /></div>
        )}
        <div><Label htmlFor="af-email">Email</Label><Input id="af-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" /></div>
        {mode !== "forgot" && (
          <div>
            <Label htmlFor="af-pass">Password</Label>
            <div className="relative">
              <Input id="af-pass" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pr-9" autoComplete={mode === "login" ? "current-password" : "new-password"} />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}
        {mode === "login" && (
          <div className="text-right text-sm"><button type="button" onClick={() => { setMode("forgot"); setError(null); }} className="text-primary hover:underline">Forgot password?</button></div>
        )}
        {error && <p role="alert" className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">{error}</p>}
        {notice && <p role="status" className="rounded-md bg-primary/10 p-2 text-sm text-primary">{notice}</p>}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send reset link"}
        </Button>
        {mode === "forgot" && (
          <button type="button" onClick={() => { setMode("login"); setNotice(null); setError(null); }} className="block w-full text-center text-sm text-muted-foreground hover:text-primary">← Back to sign in</button>
        )}
      </form>
      {mode !== "forgot" && (
        <>
          <div className="flex items-center gap-3"><div className="h-px flex-1 bg-border" /><span className="text-xs text-muted-foreground">or</span><div className="h-px flex-1 bg-border" /></div>
          <Button type="button" variant="outline" className="w-full" onClick={google}>Continue with Google</Button>
        </>
      )}
    </div>
  );
}
