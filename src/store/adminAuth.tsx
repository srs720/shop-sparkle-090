import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const ADMIN_EMAIL = "siamhosain720@gmail.com";
const ADMIN_PASSWORD = "#$i@m720*";
const KEY = "admin-auth-v1";

type AdminUser = { email: string; name: string };
type Ctx = {
  user: AdminUser | null;
  isAuthed: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AdminAuthContext = createContext<Ctx | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const login = (email: string, password: string) => {
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const u = { email, name: "Siam Hosain" };
      setUser(u);
      try { window.localStorage.setItem(KEY, JSON.stringify(u)); } catch {}
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    try { window.localStorage.removeItem(KEY); } catch {}
  };

  return (
    <AdminAuthContext.Provider value={{ user, isAuthed: !!user, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}