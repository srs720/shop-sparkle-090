import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Strict desktop/tablet layout for /admin routes.
 * Thin wrapper around AdminShell (fixed left sidebar + top header).
 * Mobile bottom nav is NEVER rendered here.
 */
export function AdminDesktopLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return <AdminShell title={title}>{children}</AdminShell>;
}