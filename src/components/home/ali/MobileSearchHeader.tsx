import { Camera, Search, ScanLine } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export function MobileSearchHeader() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  return (
    <div className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          aria-label="Scan"
          onClick={() => toast("Scanner opening...")}
          className="rounded-full p-2 text-foreground transition active:scale-90 hover:bg-white/60"
        >
          <ScanLine className="h-5 w-5" />
        </button>
        <form
          className="flex h-10 flex-1 items-center overflow-hidden rounded-full border border-primary/40 bg-white/80 pl-3 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            const query = q.trim();
            if (!query) {
              toast.error("Please enter a search term");
              return;
            }
            navigate({ to: "/search", search: { query } as never });
          }}
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="women dress"
            className="h-full flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Search products"
          />
          <button
            type="button"
            aria-label="Visual search"
            onClick={() => toast.success("Visual Search opening...")}
            className="px-2 transition active:scale-90"
          >
            <Camera className="h-5 w-5 text-muted-foreground" />
          </button>
          <button
            type="submit"
            className="h-full bg-hot px-4 text-sm font-semibold text-hot-foreground transition hover:brightness-95 active:scale-95"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}