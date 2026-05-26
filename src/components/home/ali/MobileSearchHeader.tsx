import { Camera, Search, ScanLine } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export function MobileSearchHeader() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  return (
    <div className="sticky top-0 z-40 bg-page/95 backdrop-blur supports-[backdrop-filter]:bg-page/80">
      <div className="flex items-center gap-2 px-3 py-2">
        <button aria-label="Scan" className="rounded-full p-1 text-foreground">
          <ScanLine className="h-5 w-5" />
        </button>
        <form
          className="flex h-10 flex-1 items-center overflow-hidden rounded-full border border-hot bg-card pl-3"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/products", search: { q } as never });
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
          <button type="button" aria-label="Visual search" className="px-2">
            <Camera className="h-5 w-5 text-muted-foreground" />
          </button>
          <button
            type="submit"
            className="h-full bg-hot px-4 text-sm font-semibold text-hot-foreground"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}