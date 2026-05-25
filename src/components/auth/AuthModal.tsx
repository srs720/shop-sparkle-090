import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Smartphone, Mail, Fingerprint, ScanFace } from "lucide-react";
import { useApp } from "@/store/app";
import { toast } from "sonner";

export function AuthModal() {
  const { authOpen, setAuthOpen } = useApp();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [otpSent, setOtpSent] = useState(false);

  const close = () => { setAuthOpen(false); setOtpSent(false); };
  const fakeLogin = (method: string) => { toast.success(`${method} successful (demo)`); close(); };

  return (
    <Dialog open={authOpen} onOpenChange={(o) => (o ? setAuthOpen(true) : close())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "login" ? "Welcome back" : "Create your account"}</DialogTitle>
          <DialogDescription>
            {mode === "login" ? "Login to continue shopping." : "Sign up to track orders and earn rewards."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-2 text-sm">
          <button onClick={() => setMode("login")} className={mode === "login" ? "font-semibold text-primary underline" : "text-muted-foreground"}>Login</button>
          <span className="text-muted-foreground">·</span>
          <button onClick={() => setMode("signup")} className={mode === "signup" ? "font-semibold text-primary underline" : "text-muted-foreground"}>Sign up</button>
        </div>

        <Tabs defaultValue="mobile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mobile"><Smartphone className="mr-1 h-4 w-4" />Mobile</TabsTrigger>
            <TabsTrigger value="email"><Mail className="mr-1 h-4 w-4" />Email</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="mobile" className="space-y-3">
            <div><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" placeholder="+880 1XXX-XXXXXX" /></div>
            {!otpSent ? (
              <Button className="w-full" onClick={() => { setOtpSent(true); toast.success("OTP sent (demo: 123456)"); }}>Send OTP</Button>
            ) : (
              <>
                <div>
                  <Label>One-time password</Label>
                  <div className="mt-1 flex gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Input key={i} maxLength={1} className="h-12 w-full text-center text-lg font-bold" aria-label={`OTP digit ${i + 1}`} />
                    ))}
                  </div>
                </div>
                <Button className="w-full" onClick={() => fakeLogin("OTP login")}>Verify & continue</Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="email" className="space-y-3">
            <div><Label>Email</Label><Input type="email" placeholder="you@example.com" /></div>
            <div><Label>Password</Label><Input type="password" placeholder="••••••••" /></div>
            {mode === "login" && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2"><Checkbox id="remember" /> <span>Remember me</span></label>
                <button className="text-primary hover:underline">Forgot password?</button>
              </div>
            )}
            <Button className="w-full" onClick={() => fakeLogin("Email login")}>{mode === "login" ? "Login" : "Create account"}</Button>
          </TabsContent>

          <TabsContent value="social" className="space-y-3">
            <Button variant="outline" className="w-full" onClick={() => fakeLogin("Google")}>Continue with Google</Button>
            <Button variant="outline" className="w-full" onClick={() => fakeLogin("Facebook")}>Continue with Facebook</Button>
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-3 pt-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or biometric</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => fakeLogin("Fingerprint")}><Fingerprint className="mr-2 h-4 w-4" />Fingerprint</Button>
          <Button variant="outline" onClick={() => fakeLogin("Face ID")}><ScanFace className="mr-2 h-4 w-4" />Face ID</Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">By continuing you agree to our Terms & Privacy Policy.</p>
      </DialogContent>
    </Dialog>
  );
}