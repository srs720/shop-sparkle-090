
-- ============ ROLES ============
create type public.app_role as enum ('admin', 'editor', 'viewer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- profiles policies
create policy "Users view own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "Admins view all profiles" on public.profiles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Users update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

-- user_roles policies
create policy "Users view own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid());
create policy "Admins view all roles" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- handle new user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  ) on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'viewer')
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============ PRODUCTS ============
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  sku text unique not null,
  category text not null,
  brand text,
  description text,
  price numeric(10,2) not null default 0,
  compare_price numeric(10,2),
  stock integer not null default 0,
  status text not null default 'active' check (status in ('active','draft','archived','out_of_stock')),
  image_url text,
  rating numeric(2,1) default 4.5,
  sold_count integer not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;

create index products_category_idx on public.products(category);
create index products_status_idx on public.products(status);
create index products_created_at_idx on public.products(created_at desc);

create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

create policy "Anyone can view products" on public.products
  for select using (true);
create policy "Editors and admins insert products" on public.products
  for insert to authenticated with check (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor')
  );
create policy "Editors and admins update products" on public.products
  for update to authenticated using (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor')
  );
create policy "Admins delete products" on public.products
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Seed 520 products
insert into public.products (name, slug, sku, category, brand, description, price, compare_price, stock, status, image_url, rating, sold_count, is_featured)
select
  cat || ' ' || adj || ' ' || noun || ' #' || i as name,
  lower(regexp_replace(cat || '-' || adj || '-' || noun || '-' || i, '\s+', '-', 'g')) as slug,
  'SKU-' || lpad(i::text, 6, '0') as sku,
  cat as category,
  brand,
  'Premium ' || lower(adj) || ' ' || lower(noun) || ' from ' || brand || '. High-quality build, fast shipping, and a 1-year warranty.' as description,
  round((9 + (random() * 990))::numeric, 2) as price,
  case when random() > 0.5 then round((19 + (random() * 1200))::numeric, 2) end as compare_price,
  (random() * 250)::int as stock,
  (array['active','active','active','draft','out_of_stock'])[1 + (random()*4)::int] as status,
  'https://picsum.photos/seed/p' || i || '/400/400' as image_url,
  round((35 + random() * 15)::numeric / 10, 1) as rating,
  (random() * 12000)::int as sold_count,
  random() > 0.85 as is_featured
from generate_series(1, 520) i
cross join lateral (
  select
    (array['Electronics','Fashion','Home','Beauty','Gaming','Sports','Books','Toys','Auto','Grocery'])[1 + (i % 10)] as cat,
    (array['Pro','Ultra','Smart','Eco','Lite','Max','Air','Plus','Mini','X'])[1 + (i % 10)] as adj,
    (array['Headphones','Watch','Speaker','Camera','Lamp','Backpack','Sneakers','Mouse','Keyboard','Mug','Bottle','Jacket','Charger','Drone','Console'])[1 + (i % 15)] as noun,
    (array['Sony','Apple','Samsung','Nike','Adidas','Logitech','Anker','Bose','Xiaomi','Asus'])[1 + (i % 10)] as brand
) p;
