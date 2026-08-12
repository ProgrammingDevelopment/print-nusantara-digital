do $$ begin
  create type public.app_role as enum ('admin','moderator','user');
exception when duplicate_object then null; end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

drop policy if exists "Users can view own roles" on public.user_roles;
create policy "Users can view own roles" on public.user_roles
for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

revoke all on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

revoke all on function public.handle_new_user() from public, anon, authenticated;

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products" on public.products
for insert to authenticated with check (public.has_role(auth.uid(),'admin'));

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products" on public.products
for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products" on public.products
for delete to authenticated using (public.has_role(auth.uid(),'admin'));

drop policy if exists "Users can update own pending orders" on public.orders;
create policy "Users can update own pending orders" on public.orders
for update to authenticated using (auth.uid() = user_id and status in ('pending','processing'))
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own pending orders" on public.orders;
create policy "Users can delete own pending orders" on public.orders
for delete to authenticated using (auth.uid() = user_id and status = 'pending');

grant select, insert, update, delete on public.orders to authenticated;
grant all on public.orders to service_role;

drop policy if exists "Users can update own order items" on public.order_items;
create policy "Users can update own order items" on public.order_items
for update to authenticated using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid() and o.status = 'pending')
) with check (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid() and o.status = 'pending')
);

drop policy if exists "Users can delete own order items" on public.order_items;
create policy "Users can delete own order items" on public.order_items
for delete to authenticated using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid() and o.status = 'pending')
);

grant select, insert, update, delete on public.order_items to authenticated;
grant all on public.order_items to service_role;

insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role from auth.users
on conflict (user_id, role) do nothing;