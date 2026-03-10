-- Supabase schema for Pa-Buy (Essu Express)
-- Run this in the Supabase SQL editor (Database -> SQL Editor) to create the required tables.

-- 1) Users table (for email/password authentication)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  role text not null check (role in ('client','runner','store','admin')),
  password text,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS) and allow public inserts/selects for this demo app.
-- In production, tighten these policies to prevent unauthorized access.
alter table users enable row level security;

create policy "Allow insert for anon" on users
  for insert
  with check (true);

create policy "Allow select for anon" on users
  for select
  using (true);

-- 2) Stores (store partners)
create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references users(id) on delete set null,
  name text not null,
  email text,
  address text,
  category text,
  rating numeric,
  delivery_time text,
  delivery_fee numeric,
  min_order numeric,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3) Orders / Deliveries
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  store_id uuid references stores(id) on delete set null,
  customer_id uuid references users(id) on delete set null,
  customer_name text,
  customer_phone text,
  dropoff_address text,
  status text not null default 'pending', -- pending, in_transit, delivered, cancelled
  total numeric,
  delivery_fee numeric,
  tax numeric,
  items jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4) Trigger to keep updated_at in sync
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on orders;
create trigger set_updated_at
before update on orders
for each row execute procedure update_updated_at_column();
