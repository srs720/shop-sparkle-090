import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useApp } from "@/store/app";

export function NotificationOptIn() {
  const { notifAsked, setNotifAsked } = useApp();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (notifAsked) return;
    const t = setTimeout(() => setOpen(true), 8000);
    return () => clearTimeout(t);
  }, [notifAsked]);

  const dismiss = () => { setNotifAsked(true); setOpen(false); };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) dismiss(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bell className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center">Stay in the loop</DialogTitle>
          <DialogDescription className="text-center">
            Get notified about flash sales, exclusive deals and order updates.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row gap-2 sm:justify-center">
          <Button variant="outline" onClick={dismiss}>Not now</Button>
          <Button onClick={dismiss}>Allow notifications</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}