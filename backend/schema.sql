-- Public events table
create table public_events (
    id bigint primary key generated always as identity,
    title text not null,
    description text,
    event_date date not null
);

-- User events table
create table user_events (
    id bigint primary key generated always as identity,
    user_id uuid references auth.users not null,
    title text not null,
    description text,
    event_date date not null
);

-- Enable RLS for tables
alter table public_events enable row level security;
alter table user_events enable row level security;

-- Pblic policy
create policy "Anyone can read public events"
on public_events for select
to anon
using (true);

-- Admin can modify public events
create policy "Admin can modify public events"
on public_events for all
to authenticated
using (auth.uid() = 'admin-uuid');

-- User policies
create policy "Authed users can modify their events"
on user_events for all
to authenticated
using (user_id = auth.uid()); -- Propagates over new data
