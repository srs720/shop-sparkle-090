import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AdminRole = "admin" | "editor" | "viewer";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  roles: AdminRole[];
};

type Ctx = {
  user: AdminUser | null;
  session: Session | null;
  loading: boolean;
  isAuthed: boolean;
  isAdmin: boolean;
  canEdit: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshRoles: () => Promise<void>;
};

const AdminAuthContext = createContext<Ctx | null>(null);

async function fetchRoles(userId: string): Promise<AdminRole[]> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error || !data) return [];
  return data.map((r) => r.role as AdminRole);
}

function buildUser(u: User, roles: AdminRole[]): AdminUser {
  const name =
    (u.user_metadata?.full_name as string | undefined) ||
    (u.email ? u.email.split("@")[0] : "Admin");
  return { id: u.id, email: u.email ?? "", name, roles };
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up listener FIRST, then check existing session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s?.user) {
        setUser(null);
        setLoading(false);
        return;
      }
      // Defer the role fetch to avoid blocking the auth callback
      setTimeout(async () => {
        const roles = await fetchRoles(s.user.id);
        setUser(buildUser(s.user, roles));
        setLoading(false);
      }, 0);
    });

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        const roles = await fetchRoles(s.user.id);
        setUser(buildUser(s.user, roles));
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login: Ctx["login"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  };

  const signup: Ctx["signup"] = async (email, password, fullName) => {
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
        data: { full_name: fullName },
      },
    });
    if (error) return { ok: false, error: error.message };
    // Try to claim first-admin (no-op if an admin already exists)
    try {
      await supabase.rpc("claim_first_admin");
    } catch { /* ignore */ }
    return { ok: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const refreshRoles = async () => {
    if (!session?.user) return;
    const roles = await fetchRoles(session.user.id);
    setUser((prev) => (prev ? { ...prev, roles } : buildUser(session.user, roles)));
  };

  const isAdmin = !!user?.roles.includes("admin");
  const canEdit = isAdmin || !!user?.roles.includes("editor");

  return (
    <AdminAuthContext.Provider
      value={{
        user, session, loading,
        isAuthed: !!session,
        isAdmin, canEdit,
        login, signup, logout, refreshRoles,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}