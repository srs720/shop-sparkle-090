import { useState } from "react";
import { MessageCircle, X, Send, Sparkles, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FloatingWidgets() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<{ from: "user" | "bot"; text: string }[]>([
    { from: "bot", text: "Hi! I'm Shopzy AI. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMsgs((m) => [...m, { from: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", text: "Thanks! A team member will follow up shortly. Meanwhile, browse our deals on the homepage." }]);
    }, 700);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <a
        href="https://wa.me/8801711000000"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-success text-white shadow-lg hover:scale-105 transition"
      >
        <Phone className="h-5 w-5" />
      </a>
      {open && (
        <div className="w-[88vw] max-w-sm overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Shopzy AI Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat"><X className="h-4 w-4" /></button>
          </div>
          <div className="flex h-72 flex-col gap-2 overflow-y-auto p-3">
            {msgs.map((m, i) => (
              <div key={i} className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.from === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{m.text}</div>
            ))}
          </div>
          <form className="flex gap-2 border-t border-border p-2" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
            <Button type="submit" size="icon" aria-label="Send"><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-105 transition"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}