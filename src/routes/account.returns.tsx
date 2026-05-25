import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Camera, Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/account/returns")({ component: Returns });

function Returns() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Returns & Refunds</h1>
      {submitted ? (
        <div className="rounded-xl border border-success/30 bg-success/10 p-6 text-center">
          <h2 className="text-lg font-semibold text-success">Return request submitted</h2>
          <p className="mt-1 text-sm text-muted-foreground">We'll email you the pickup details within 24 hours.</p>
          <Button className="mt-4" onClick={() => setSubmitted(false)}>New request</Button>
        </div>
      ) : (
        <form className="space-y-4 rounded-xl border border-border bg-card p-5" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); toast.success("Return submitted"); }}>
          <div><Label>Order number</Label><Input required placeholder="SHZ-10923" /></div>
          <div>
            <Label>Reason for return</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select a reason" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="damaged">Item arrived damaged</SelectItem>
                <SelectItem value="wrong">Wrong item delivered</SelectItem>
                <SelectItem value="quality">Quality not as expected</SelectItem>
                <SelectItem value="size">Size doesn't fit</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Description</Label><Textarea placeholder="Tell us what happened..." rows={3} /></div>
          <div>
            <Label>Upload photos / video</Label>
            <label className="mt-1 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-center hover:bg-muted/50">
              <Camera className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm">Tap to add evidence (max 5 files)</span>
              <input type="file" multiple accept="image/*,video/*" className="hidden" />
            </label>
          </div>
          <div>
            <Label>Refund method</Label>
            <RadioGroup defaultValue="wallet" className="mt-2 space-y-2">
              {[
                { v: "wallet", t: "Shopzy Wallet (instant)" },
                { v: "mfs", t: "Mobile Financial Service (bKash / Nagad)" },
                { v: "bank", t: "Bank transfer (3-5 days)" },
                { v: "original", t: "Original payment method" },
              ].map(({ v, t }) => (
                <label key={v} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 hover:border-primary">
                  <RadioGroupItem value={v} id={v} /> <span className="text-sm">{t}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full"><Upload className="mr-2 h-4 w-4" />Submit request</Button>
        </form>
      )}
    </div>
  );
}