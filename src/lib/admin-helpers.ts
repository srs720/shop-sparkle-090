import { supabase } from "@/integrations/supabase/client";

export async function logAdminAction(action: string, entity?: string, entityId?: string, meta?: Record<string, unknown>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("audit_logs").insert({
    actor_id: user.id,
    actor_email: user.email,
    action,
    entity,
    entity_id: entityId,
    meta: meta ?? null,
  });
}

export function downloadCSV(filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const keys = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => escape(r[k])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export const ORDER_STATUSES = ["pending","confirmed","processing","shipped","delivered","cancelled","refunded"] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

export const statusStyles: Record<string, string> = {
  pending:    "bg-warning/15 text-warning border-warning/30",
  confirmed:  "bg-secondary/15 text-secondary border-secondary/30",
  processing: "bg-secondary/15 text-secondary border-secondary/30",
  shipped:    "bg-blue-500/15 text-blue-400 border-blue-500/30",
  delivered:  "bg-success/15 text-success border-success/30",
  cancelled:  "bg-muted text-muted-foreground border-border",
  refunded:   "bg-destructive/15 text-destructive border-destructive/30",
};
