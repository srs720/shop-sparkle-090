import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Shopzy" }] }),
  component: Login,
});

function Login() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [show, setShow] = useState(false);

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        <div className="flex">
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-semibold ${
                tab === t ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
              }`}
            >
              {t === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <form className="space-y-4 p-6" onSubmit={(e) => e.preventDefault()}>
          {tab === "register" && (
            <div>
              <Label>Full Name</Label>
              <Input required placeholder="Jane Doe" />
            </div>
          )}
          <div>
            <Label>Email or Phone</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input required type="text" placeholder="you@example.com" className="pl-9" />
            </div>
          </div>
          <div>
            <Label>Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input required type={show ? "text" : "password"} placeholder="••••••••" className="pl-9 pr-9" />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {tab === "login" && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <Checkbox /> Remember me
              </label>
              <a href="#" className="text-primary hover:underline">Forgot password?</a>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full">
            {tab === "login" ? "Sign In" : "Create Account"}
          </Button>

          <div className="relative my-2 text-center text-xs text-muted-foreground">
            <span className="bg-card px-2 relative z-10">or continue with</span>
            <span className="absolute left-0 right-0 top-1/2 -z-0 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="outline">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.79 0 3.4.62 4.67 1.84l3.48-3.48C18.04 1.55 15.24.5 12 .5 7.31.5 3.26 3.18 1.28 7.07l4.04 3.14C6.27 7.35 8.91 5.04 12 5.04z"/><path fill="#4285F4" d="M23.5 12.27c0-.78-.07-1.53-.2-2.27H12v4.51h6.47c-.28 1.4-1.11 2.59-2.36 3.39l3.81 2.96c2.23-2.06 3.58-5.1 3.58-8.59z"/><path fill="#FBBC05" d="M5.32 14.21A7.06 7.06 0 0 1 4.96 12c0-.77.13-1.52.36-2.21L1.28 6.65A11.46 11.46 0 0 0 .5 12c0 1.86.45 3.62 1.28 5.17l3.54-2.96z"/><path fill="#34A853" d="M12 23.5c3.24 0 5.96-1.07 7.94-2.91l-3.81-2.96c-1.06.71-2.42 1.14-4.13 1.14-3.09 0-5.73-2.31-6.68-5.41l-4.04 3.14C3.26 20.82 7.31 23.5 12 23.5z"/></svg>
              Google
            </Button>
            <Button type="button" variant="outline">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.88v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
              Facebook
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By continuing you agree to our <a href="#" className="text-primary">Terms</a> & <a href="#" className="text-primary">Privacy Policy</a>.
          </p>
          <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-primary">← Back to home</Link>
        </form>
      </div>
    </div>
  );
}