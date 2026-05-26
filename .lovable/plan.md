
# Admin Overhaul + Storefront Sync Plan

This is a large, multi-phase build. I'll execute it across coherent batches, keeping the premium dark theme intact and wiring everything to Supabase with React Query + realtime.

## Phase 1 — Database & Data Layer (foundation)

Create migrations for all tables the 12 modules need. The existing `products`, `profiles`, `user_roles` stay; I'll add:

- `orders` + `order_items` (status enum: pending/confirmed/processing/shipped/delivered/cancelled/refunded)
- `product_variants` (size, color, sku, price, stock)
- `product_images` (multi-image per product)
- `reviews` (with moderation status)
- `coupons` (code, type, value, usage limits, expiry)
- `shipping_zones` + `shipping_rates`
- `banners` (homepage slider, with active/order)
- `flash_sales` (product_id, discount, start/end)
- `loyalty_points` (per user balance + ledger)
- `audit_logs` (admin action trail)
- `support_tickets` + `ticket_messages`
- `notifications` (admin in-app)
- `settings` (key/value singleton for site config, tax, maintenance, pixels)
- `payment_gateways` (toggle table)
- `refund_requests`

All with RLS: public SELECT for products/banners/flash_sales/reviews(approved); admin/editor write via `has_role()`. Customer-facing tables (orders, tickets, loyalty) scoped to `auth.uid()`.

Enable realtime publication on `products`, `orders`, `banners`, `flash_sales`, `notifications`.

## Phase 2 — Storefront Sync

- Replace `src/data/products.ts` static array with a Supabase-backed React Query hook (`useProducts`)
- Wire homepage Flash Sale, Top Ranking, For You, Categories grids to live Supabase data
- Wire homepage banners/hero to `banners` table
- Add realtime subscription so admin edits propagate instantly
- Keep visual layout exactly as-is

## Phase 3 — Admin Shell & Shared Infrastructure

- New `useAdminQuery` patterns + `useRealtimeTable` hook
- Shared `<DataTable>` with pagination, search, bulk actions
- Audit log helper (`logAdminAction`) called from every mutation
- Toast on all errors/successes; skeletons everywhere
- Notifications bell in `AdminShell` reading `notifications` table with badge

## Phase 4 — Wipe Dummy Data

- Delete `src/data/admin.ts` entirely
- Remove every import of `adminOrders`, `adminCustomers`, `revenueSeries`, `stockLogs`, hardcoded `team`, `banners`, etc.
- Routes that referenced them now query Supabase

## Phase 5 — The 12 Modules

Each as a route under `/admin/*`, all wired to Supabase:

```text
M1  admin.index          Dashboard: live KPIs from SQL counts/sums, Recharts trend
                         from orders by day, activity feed from audit_logs
M2  admin.products       CRUD + variants tab + images tab + CSV import/export
                         (already partially built — extend with tabs)
M3  admin.orders         Lifecycle stepper, invoice modal, bulk status update
M4  admin.customers      Profile drawer with order history, loyalty points,
                         segmentation tags. New admin.reviews for moderation
M5  admin.payments       Gateway toggles, transactions, refund queue
    admin.promotions     Coupon generator
M6  admin.shipping       Zones + rates table, courier placeholders, returns tab
M7  admin.cms            Banners CRUD, flash sale setup, SEO defaults
M8  admin.security       Audit logs table, IP block list, 2FA toggle, settings
M9  admin.users          RBAC matrix wired to user_roles + permission overrides
M10 admin.reports        Recharts dashboards + CSV/PDF export buttons
M11 admin.settings       Tabbed: General / Tax / Maintenance / Scripts
M12 admin.notifications  Bell dropdown in shell + ticketing inbox
    admin.tickets        Support ticket inbox with reply thread
```

## Phase 6 — Forms & UX

- Product form rebuilt with shadcn Tabs: Basic / Pricing / Variants / Images / SEO / Inventory
- Stepper for first-time setups where useful
- All mutations: optimistic where safe, with proper invalidation + audit log entry

## Technical Notes

- Rich text editor: lightweight `<Textarea>` with markdown preview (avoid adding heavy WYSIWYG deps for MVP)
- Image upload: Supabase Storage bucket `product-images` (created in migration), drag-drop UI
- CSV: client-side parse with PapaParse for import; `Blob` download for export
- PDF export: jsPDF for invoices + reports
- Realtime: single `useRealtimeTable(table)` hook that subscribes + invalidates the matching React Query key

## Scope & Approach

This will take several batches of file edits. I'll start with **Phase 1 (migration)** since it requires user approval before anything else can proceed. After approval I'll execute Phases 2–6 in parallel batches.

Confirm and I'll send the migration immediately.
