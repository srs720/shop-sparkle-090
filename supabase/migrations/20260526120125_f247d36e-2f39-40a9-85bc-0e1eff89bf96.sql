
-- Order status enum
create type public.order_status as enum ('pending','confirmed','processing','shipped','delivered','cancelled','refunded');
create type public.review_status as enum ('pending','approved','rejected');
create type public.ticket_status as enum ('open','pending','resolved','closed');
create type public.refund_status as enum ('requested','approved','rejected','processed');

-- ORDERS
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('ORD-' || lpad((floor(random()*1000000))::text, 6, '0')),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text,
  customer_email text,
  customer_phone text,
  shipping_address jsonb,
  subtotal numeric not null default 0,
  shipping_fee numeric not null default 0,
  tax numeric not null default 0,
  discount numeric not null default 0,
  total numeric not null default 0,
  payment_method text default 'COD',
  payment_status text default 'pending',
  status order_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.orders (user_id);
create index on public.orders (status);
create index on public.orders (created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  variant_label text,
  unit_price numeric not null default 0,
  quantity integer not null default 1,
  subtotal numeric not null default 0,
  image_url text,
  created_at timestamptz not null default now()
);
create index on public.order_items (order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Users view own orders" on public.orders for select to authenticated using (user_id = auth.uid());
create policy "Admins view all orders" on public.orders for select to authenticated using (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'));
create policy "Users create own orders" on public.orders for insert to authenticated with check (user_id = auth.uid() or user_id is null);
create policy "Admins update orders" on public.orders for update to authenticated using (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'));
create policy "Admins delete orders" on public.orders for delete to authenticated using (has_role(auth.uid(),'admin'));

create policy "Users view own order items" on public.order_items for select to authenticated using (exists(select 1 from public.orders o where o.id=order_id and (o.user_id=auth.uid() or has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'))));
create policy "Users create order items" on public.order_items for insert to authenticated with check (exists(select 1 from public.orders o where o.id=order_id and (o.user_id=auth.uid() or o.user_id is null)));
create policy "Admins manage order items" on public.order_items for all to authenticated using (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor')) with check (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'));

create trigger trg_orders_updated before update on public.orders for each row execute function public.set_updated_at();

-- PRODUCT VARIANTS
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text,
  size text,
  color text,
  price numeric,
  stock integer not null default 0,
  created_at timestamptz not null default now()
);
create index on public.product_variants (product_id);
alter table public.product_variants enable row level security;
create policy "Anyone view variants" on public.product_variants for select using (true);
create policy "Editors manage variants" on public.product_variants for all to authenticated using (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor')) with check (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'));

-- PRODUCT IMAGES
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index on public.product_images (product_id);
alter table public.product_images enable row level security;
create policy "Anyone view product images" on public.product_images for select using (true);
create policy "Editors manage product images" on public.product_images for all to authenticated using (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor')) with check (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'));

-- REVIEWS
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  user_name text,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  status review_status not null default 'pending',
  created_at timestamptz not null default now()
);
create index on public.reviews (product_id);
create index on public.reviews (status);
alter table public.reviews enable row level security;
create policy "Anyone view approved reviews" on public.reviews for select using (status='approved' or user_id=auth.uid() or has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'));
create policy "Users create own reviews" on public.reviews for insert to authenticated with check (user_id=auth.uid());
create policy "Users update own reviews" on public.reviews for update to authenticated using (user_id=auth.uid() or has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'));
create policy "Admins delete reviews" on public.reviews for delete to authenticated using (has_role(auth.uid(),'admin'));

-- COUPONS
create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type text not null default 'percent', -- 'percent' | 'fixed'
  discount_value numeric not null default 0,
  min_order numeric default 0,
  max_uses integer,
  used_count integer not null default 0,
  active boolean not null default true,
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.coupons enable row level security;
create policy "Anyone view active coupons" on public.coupons for select using (active = true);
create policy "Admins manage coupons" on public.coupons for all to authenticated using (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor')) with check (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'));

-- SHIPPING
create table public.shipping_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  regions text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.shipping_rates (
  id uuid primary key default gen_random_uuid(),
  zone_id uuid not null references public.shipping_zones(id) on delete cascade,
  label text not null,
  price numeric not null default 0,
  eta_days_min integer default 1,
  eta_days_max integer default 7,
  created_at timestamptz not null default now()
);
alter table public.shipping_zones enable row level security;
alter table public.shipping_rates enable row level security;
create policy "Anyone view zones" on public.shipping_zones for select using (active = true);
create policy "Anyone view rates" on public.shipping_rates for select using (true);
create policy "Admins manage zones" on public.shipping_zones for all to authenticated using (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor')) with check (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'));
create policy "Admins manage rates" on public.shipping_rates for all to authenticated using (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor')) with check (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'));

-- BANNERS
create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text,
  link_url text,
  badge text,
  position text not null default 'hero', -- 'hero' | 'mega' | 'mid'
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.banners enable row level security;
create policy "Anyone view active banners" on public.banners for select using (active = true);
create policy "Admins manage banners" on public.banners for all to authenticated using (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor')) with check (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'));

-- FLASH SALES
create table public.flash_sales (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  discount_percent integer not null default 10,
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null default (now() + interval '24 hours'),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.flash_sales enable row level security;
create policy "Anyone view active flash sales" on public.flash_sales for select using (active = true);
create policy "Admins manage flash sales" on public.flash_sales for all to authenticated using (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor')) with check (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'));

-- LOYALTY
create table public.loyalty_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  points integer not null,
  reason text,
  created_at timestamptz not null default now()
);
create index on public.loyalty_ledger (user_id);
alter table public.loyalty_ledger enable row level security;
create policy "Users view own loyalty" on public.loyalty_ledger for select to authenticated using (user_id = auth.uid() or has_role(auth.uid(),'admin'));
create policy "Admins write loyalty" on public.loyalty_ledger for all to authenticated using (has_role(auth.uid(),'admin')) with check (has_role(auth.uid(),'admin'));

-- AUDIT LOGS
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  action text not null,
  entity text,
  entity_id text,
  meta jsonb,
  created_at timestamptz not null default now()
);
create index on public.audit_logs (created_at desc);
alter table public.audit_logs enable row level security;
create policy "Admins view audit" on public.audit_logs for select to authenticated using (has_role(auth.uid(),'admin'));
create policy "Authenticated insert audit" on public.audit_logs for insert to authenticated with check (actor_id = auth.uid());

-- SUPPORT TICKETS
create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  subject text not null,
  category text default 'general',
  priority text default 'normal',
  status ticket_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  author_name text,
  body text not null,
  is_staff boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.support_tickets enable row level security;
alter table public.ticket_messages enable row level security;
create policy "Users view own tickets" on public.support_tickets for select to authenticated using (user_id = auth.uid() or has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'));
create policy "Users create tickets" on public.support_tickets for insert to authenticated with check (user_id = auth.uid());
create policy "Admins update tickets" on public.support_tickets for update to authenticated using (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'));
create policy "View ticket messages" on public.ticket_messages for select to authenticated using (exists(select 1 from public.support_tickets t where t.id=ticket_id and (t.user_id=auth.uid() or has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'))));
create policy "Add ticket messages" on public.ticket_messages for insert to authenticated with check (author_id = auth.uid());
create trigger trg_tickets_updated before update on public.support_tickets for each row execute function public.set_updated_at();

-- ADMIN NOTIFICATIONS
create table public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  level text not null default 'info', -- info|warning|danger|success
  read boolean not null default false,
  link text,
  created_at timestamptz not null default now()
);
create index on public.admin_notifications (created_at desc);
alter table public.admin_notifications enable row level security;
create policy "Admins view notifications" on public.admin_notifications for select to authenticated using (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'));
create policy "Admins manage notifications" on public.admin_notifications for all to authenticated using (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor')) with check (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'));

-- APP SETTINGS
create table public.app_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.app_settings enable row level security;
create policy "Anyone view settings" on public.app_settings for select using (true);
create policy "Admins update settings" on public.app_settings for all to authenticated using (has_role(auth.uid(),'admin')) with check (has_role(auth.uid(),'admin'));

-- PAYMENT GATEWAYS
create table public.payment_gateways (
  id text primary key,
  name text not null,
  enabled boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0
);
alter table public.payment_gateways enable row level security;
create policy "Anyone view enabled gateways" on public.payment_gateways for select using (enabled = true or has_role(auth.uid(),'admin'));
create policy "Admins manage gateways" on public.payment_gateways for all to authenticated using (has_role(auth.uid(),'admin')) with check (has_role(auth.uid(),'admin'));

-- REFUND REQUESTS
create table public.refund_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  reason text,
  amount numeric not null default 0,
  status refund_status not null default 'requested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.refund_requests enable row level security;
create policy "Users view own refunds" on public.refund_requests for select to authenticated using (user_id = auth.uid() or has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'));
create policy "Users create refunds" on public.refund_requests for insert to authenticated with check (user_id = auth.uid());
create policy "Admins manage refunds" on public.refund_requests for update to authenticated using (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor'));
create trigger trg_refunds_updated before update on public.refund_requests for each row execute function public.set_updated_at();

-- STORAGE bucket for product images
insert into storage.buckets (id, name, public) values ('product-images','product-images', true) on conflict (id) do nothing;
create policy "Public read product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "Editors upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor')));
create policy "Editors update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images' and (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor')));
create policy "Editors delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and (has_role(auth.uid(),'admin') or has_role(auth.uid(),'editor')));

-- REALTIME
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.banners;
alter publication supabase_realtime add table public.flash_sales;
alter publication supabase_realtime add table public.admin_notifications;

-- Seed minimal settings + gateways
insert into public.app_settings (key, value) values
  ('site', '{"name":"Shopzy","currency":"USD","logo_url":null}'::jsonb),
  ('tax', '{"rate":0,"inclusive":false}'::jsonb),
  ('maintenance', '{"enabled":false,"message":"We will be right back"}'::jsonb),
  ('scripts', '{"ga":null,"pixel":null}'::jsonb)
on conflict (key) do nothing;

insert into public.payment_gateways (id, name, enabled, sort_order) values
  ('cod','Cash on Delivery', true, 1),
  ('card','Card (Stripe)', true, 2),
  ('bkash','bKash', true, 3),
  ('nagad','Nagad', false, 4),
  ('paypal','PayPal', false, 5)
on conflict (id) do nothing;
