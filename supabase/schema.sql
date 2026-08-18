-- Enable UUID
create extension if not exists "pgcrypto";

-- Profiles (linked to auth.users)
create table if not exists profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  name        text not null,
  phone       text,
  role        text not null default 'customer' check (role in ('customer','rider','merchant','admin')),
  avatar_url  text,
  verified    boolean default false,
  created_at  timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users read own profile"  on profiles for select  using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);

-- Wallet
create table if not exists wallets (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references profiles(id) on delete cascade unique,
  balance    numeric(12,2) default 0,
  updated_at timestamptz default now()
);
alter table wallets enable row level security;
create policy "Owner reads wallet" on wallets for all using (auth.uid() = user_id);

-- Wallet transactions
create table if not exists wallet_transactions (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references profiles(id),
  amount      numeric(12,2) not null,
  type        text check (type in ('credit','debit')),
  description text,
  reference   text,
  created_at  timestamptz default now()
);
alter table wallet_transactions enable row level security;
create policy "Owner reads txns" on wallet_transactions for all using (auth.uid() = user_id);

-- Saved addresses
create table if not exists saved_addresses (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references profiles(id),
  label      text,
  address    text,
  lat        float,
  lng        float,
  created_at timestamptz default now()
);
alter table saved_addresses enable row level security;
create policy "Owner manages addresses" on saved_addresses for all using (auth.uid() = user_id);

-- Orders
create table if not exists orders (
  id                 uuid default gen_random_uuid() primary key,
  tracking_id        text unique not null,
  customer_id        uuid references profiles(id),
  rider_id           uuid references profiles(id),
  service_type       text check (service_type in ('standard','bulk','heavy','interstate')),
  package_size       text check (package_size in ('small','medium','large')),
  package_category   text,  -- food, books, document, cloths, medicine, others
  item_handling      text,  -- packaged, fragile
  protection_tier    text,  -- none, silver, gold, platinum
  pickup_address     text not null,
  pickup_name        text,
  pickup_phone       text,
  pickup_lat         float,
  pickup_lng         float,
  dropoff_address    text not null,
  dropoff_name       text,
  dropoff_phone      text,
  dropoff_lat        float,
  dropoff_lng        float,
  landmark           text,
  note               text,
  price              numeric(12,2),
  payment_method     text,
  status             text default 'pending' check (status in ('pending','accepted','pickup','transit','delivered','cancelled')),
  delivery_guarantee boolean default false,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);
alter table orders enable row level security;
create policy "Customer reads own orders"  on orders for select  using (auth.uid() = customer_id);
create policy "Customer creates orders"    on orders for insert  with check (auth.uid() = customer_id);
create policy "Customer cancels orders"    on orders for update  using (auth.uid() = customer_id);
create policy "Rider reads assigned"       on orders for select  using (auth.uid() = rider_id);
create policy "Rider updates status"       on orders for update  using (auth.uid() = rider_id);

-- Notifications
create table if not exists notifications (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references profiles(id),
  title      text,
  message    text,
  type       text default 'info',
  read       boolean default false,
  created_at timestamptz default now()
);
alter table notifications enable row level security;
create policy "User reads own notifs" on notifications for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'role','customer')
  );
  insert into public.wallets (user_id, balance) values (new.id, 0);
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();
