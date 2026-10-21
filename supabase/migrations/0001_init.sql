-- ============ ENUMS (safe to re-run) ============
do $$ begin create type user_role as enum ('rider','driver');
exception when duplicate_object then null; end $$;

do $$ begin create type verification_status as enum ('pending','approved','rejected');
exception when duplicate_object then null; end $$;

do $$ begin create type ride_status as enum
  ('matching','assigned','arrived','in_progress','completed','cancelled','no_driver');
exception when duplicate_object then null; end $$;

do $$ begin create type trip_type as enum ('one_way','quick_return');
exception when duplicate_object then null; end $$;

-- ============ TABLES ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  full_name text not null,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.driver_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  plate_number text,
  body_number text,
  verification verification_status not null default 'pending',
  rejection_reason text,
  is_online boolean not null default false,
  last_lat double precision,
  last_lng double precision,
  last_seen_at timestamptz
);

create table if not exists public.driver_documents (
  id bigint generated always as identity primary key,
  driver_id uuid not null references public.driver_profiles(id) on delete cascade,
  doc_type text not null,
  file_path text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.routes (
  id bigint generated always as identity primary key,
  name text not null,
  fare numeric(8,2),
  is_active boolean not null default true
);

create table if not exists public.rides (
  id bigint generated always as identity primary key,
  rider_id uuid not null references public.profiles(id),
  driver_id uuid references public.driver_profiles(id),
  route_id bigint references public.routes(id),
  trip_type trip_type not null default 'one_way',
  status ride_status not null default 'matching',
  total_fare numeric(8,2),
  cash_collected boolean not null default false,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.ride_legs (
  id bigint generated always as identity primary key,
  ride_id bigint not null references public.rides(id) on delete cascade,
  leg_no smallint not null check (leg_no in (1,2)),
  pickup_name text not null,
  pickup_lat double precision not null,
  pickup_lng double precision not null,
  dest_name text not null,
  dest_lat double precision not null,
  dest_lng double precision not null,
  unique (ride_id, leg_no)
);

create table if not exists public.ratings (
  ride_id bigint primary key references public.rides(id) on delete cascade,
  rider_id uuid not null references public.profiles(id),
  driver_id uuid not null references public.driver_profiles(id),
  stars smallint not null check (stars between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- ============ RLS ON ============
alter table public.profiles         enable row level security;
alter table public.driver_profiles  enable row level security;
alter table public.driver_documents enable row level security;
alter table public.routes           enable row level security;
alter table public.rides            enable row level security;
alter table public.ride_legs        enable row level security;
alter table public.ratings          enable row level security;

-- ============ POLICIES (drop + create so re-runs work) ============
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for select using (id = auth.uid());

drop policy if exists "own profile insert" on public.profiles;
create policy "own profile insert" on public.profiles
  for insert with check (id = auth.uid());

drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles
  for update using (id = auth.uid());

drop policy if exists "ride counterpart" on public.profiles;
create policy "ride counterpart" on public.profiles
  for select using (exists (
    select 1 from public.rides r
    where (r.rider_id = auth.uid() and r.driver_id = profiles.id)
       or (r.driver_id = auth.uid() and r.rider_id = profiles.id)));

drop policy if exists "own driver profile" on public.driver_profiles;
create policy "own driver profile" on public.driver_profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "riders see assigned driver" on public.driver_profiles;
create policy "riders see assigned driver" on public.driver_profiles
  for select using (exists (
    select 1 from public.rides r
    where r.rider_id = auth.uid() and r.driver_id = driver_profiles.id));

-- Drivers must not be able to approve themselves
revoke update on public.driver_profiles from authenticated;
grant update (plate_number, body_number, is_online,
              last_lat, last_lng, last_seen_at)
  on public.driver_profiles to authenticated;

drop policy if exists "own documents" on public.driver_documents;
create policy "own documents" on public.driver_documents
  for all using (driver_id = auth.uid()) with check (driver_id = auth.uid());

drop policy if exists "routes readable" on public.routes;
create policy "routes readable" on public.routes
  for select to authenticated using (is_active);

drop policy if exists "rider own rides" on public.rides;
create policy "rider own rides" on public.rides
  for select using (rider_id = auth.uid());

drop policy if exists "rider creates ride" on public.rides;
create policy "rider creates ride" on public.rides
  for insert with check (rider_id = auth.uid());

drop policy if exists "rider updates own ride" on public.rides;
create policy "rider updates own ride" on public.rides
  for update using (rider_id = auth.uid());

drop policy if exists "driver sees assigned or open rides" on public.rides;
create policy "driver sees assigned or open rides" on public.rides
  for select using (
    driver_id = auth.uid()
    or (status = 'matching' and exists (
      select 1 from public.driver_profiles d
      where d.id = auth.uid() and d.verification = 'approved' and d.is_online)));

drop policy if exists "driver updates assigned ride" on public.rides;
create policy "driver updates assigned ride" on public.rides
  for update using (driver_id = auth.uid());

drop policy if exists "legs follow ride" on public.ride_legs;
create policy "legs follow ride" on public.ride_legs
  for select using (exists (select 1 from public.rides r where r.id = ride_id));

drop policy if exists "rider adds legs" on public.ride_legs;
create policy "rider adds legs" on public.ride_legs
  for insert with check (exists (
    select 1 from public.rides r where r.id = ride_id and r.rider_id = auth.uid()));

drop policy if exists "rider rates own ride" on public.ratings;
create policy "rider rates own ride" on public.ratings
  for insert with check (rider_id = auth.uid());

drop policy if exists "see own ratings" on public.ratings;
create policy "see own ratings" on public.ratings
  for select using (rider_id = auth.uid() or driver_id = auth.uid());

-- ============ REALTIME (ignore if already added) ============
do $$ begin
  alter publication supabase_realtime add table public.rides;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.driver_profiles;
exception when duplicate_object then null; end $$;

-- ============ STORAGE: private bucket + policy ============
insert into storage.buckets (id, name, public)
values ('driver-documents', 'driver-documents', false)
on conflict (id) do nothing;

drop policy if exists "driver uploads own docs" on storage.objects;
create policy "driver uploads own docs" on storage.objects
  for all to authenticated
  using (bucket_id = 'driver-documents'
         and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'driver-documents'
         and (storage.foldername(name))[1] = auth.uid()::text);
