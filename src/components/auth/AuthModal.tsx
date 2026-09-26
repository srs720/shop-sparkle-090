import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useApp } from "@/store/app";
import { AuthForm } from "./AuthForm";

export function AuthModal() {
  const { authOpen, setAuthOpen } = useApp();
  return (
    <Dialog open={authOpen} onOpenChange={setAuthOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Shopzy</DialogTitle>
          <DialogDescription>Sign in or create an account to track orders and earn rewards.</DialogDescription>
        </DialogHeader>
        <AuthForm onDone={() => setAuthOpen(false)} />
        <p className="text-center text-xs text-muted-foreground">By continuing you agree to our Terms & Privacy Policy.</p>
      </DialogContent>
    </Dialog>
  );
}
