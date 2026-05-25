import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";

export type Theme = "light" | "dark";
export type Lang = "en" | "bn";

export type Address = {
  id: string;
  label: string;
  name: string;
  phone: string;
  line: string;
  city: string;
  area: string;
  postal: string;
  isDefault?: boolean;
};

export type Wishlist = {
  id: string;
  name: string;
  productIds: string[];
};

type AppCtx = {
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (en: string, bn?: string) => string;

  // wishlists (multi-list)
  wishlists: Wishlist[];
  createWishlist: (name: string) => string;
  toggleWish: (listId: string, productId: string) => void;
  isWished: (productId: string) => boolean;

  // compare
  compare: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;

  // wallet & loyalty
  walletBalance: number;
  loyaltyPoints: number;
  checkedInToday: boolean;
  dailyCheckIn: () => void;

  // addresses
  addresses: Address[];
  addAddress: (a: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;

  // auth modal
  authOpen: boolean;
  setAuthOpen: (o: boolean) => void;

  // notif opt-in
  notifAsked: boolean;
  setNotifAsked: (v: boolean) => void;
};

const Ctx = createContext<AppCtx | null>(null);
const KEY = "shop-app-v1";

const DEFAULT_ADDRESSES: Address[] = [
  { id: "a1", label: "Home", name: "Jane Doe", phone: "+8801711000000", line: "House 12, Road 5", city: "Dhaka", area: "Banani", postal: "1213", isDefault: true },
  { id: "a2", label: "Office", name: "Jane Doe", phone: "+8801711000000", line: "Level 7, Tower B", city: "Dhaka", area: "Gulshan", postal: "1212" },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [lang, setLang] = useState<Lang>("en");
  const [wishlists, setWishlists] = useState<Wishlist[]>([{ id: "w1", name: "My Favorites", productIds: [] }]);
  const [compare, setCompare] = useState<string[]>([]);
  const [walletBalance] = useState(125.5);
  const [loyaltyPoints, setLoyaltyPoints] = useState(1240);
  const [checkedInToday, setCheckedIn] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>(DEFAULT_ADDRESSES);
  const [authOpen, setAuthOpen] = useState(false);
  const [notifAsked, setNotifAsked] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) {
        const s = JSON.parse(raw);
        if (s.theme) setTheme(s.theme);
        if (s.lang) setLang(s.lang);
        if (s.wishlists) setWishlists(s.wishlists);
        if (s.compare) setCompare(s.compare);
        if (s.addresses) setAddresses(s.addresses);
        if (typeof s.notifAsked === "boolean") setNotifAsked(s.notifAsked);
        if (typeof s.checkedInToday === "boolean") setCheckedIn(s.checkedInToday);
        if (typeof s.loyaltyPoints === "number") setLoyaltyPoints(s.loyaltyPoints);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(KEY, JSON.stringify({ theme, lang, wishlists, compare, addresses, notifAsked, checkedInToday, loyaltyPoints }));
        document.documentElement.classList.toggle("dark", theme === "dark");
        document.documentElement.lang = lang;
      }
    } catch {}
  }, [theme, lang, wishlists, compare, addresses, notifAsked, checkedInToday, loyaltyPoints]);

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));

  const t = (en: string, bn?: string) => (lang === "bn" && bn ? bn : en);

  const createWishlist = (name: string) => {
    const id = `w${Date.now()}`;
    setWishlists((p) => [...p, { id, name, productIds: [] }]);
    return id;
  };
  const toggleWish = (listId: string, productId: string) => {
    setWishlists((p) =>
      p.map((l) =>
        l.id === listId
          ? { ...l, productIds: l.productIds.includes(productId) ? l.productIds.filter((x) => x !== productId) : [...l.productIds, productId] }
          : l,
      ),
    );
  };
  const isWished = (id: string) => wishlists.some((l) => l.productIds.includes(id));

  const toggleCompare = (id: string) =>
    setCompare((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 4 ? p : [...p, id]));
  const clearCompare = () => setCompare([]);

  const dailyCheckIn = () => {
    if (checkedInToday) return;
    setCheckedIn(true);
    setLoyaltyPoints((p) => p + 10);
  };

  const addAddress = (a: Omit<Address, "id">) =>
    setAddresses((p) => [...p, { ...a, id: `a${Date.now()}` }]);
  const removeAddress = (id: string) => setAddresses((p) => p.filter((a) => a.id !== id));

  return (
    <Ctx.Provider
      value={{
        theme, toggleTheme, lang, setLang, t,
        wishlists, createWishlist, toggleWish, isWished,
        compare, toggleCompare, clearCompare,
        walletBalance, loyaltyPoints, checkedInToday, dailyCheckIn,
        addresses, addAddress, removeAddress,
        authOpen, setAuthOpen,
        notifAsked, setNotifAsked,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
}

// helper for compare
export function getCompareProducts(ids: string[], all: Product[]): Product[] {
  return ids.map((id) => all.find((p) => p.id === id)).filter(Boolean) as Product[];
}