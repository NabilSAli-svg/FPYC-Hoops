-- Payments table: backs the family Payments tab with real per-player records.
-- Previously the Payments tab showed entirely fake/hardcoded balances and
-- history for every family. Now: families see only their own linked player's
-- payment records (or none, if no records exist yet); commissioners/coaches
-- see and manage all.

create table if not exists public.payments (
  id        text primary key,
  player_id text not null references public.players(id) on delete cascade,
  "desc"    text not null,
  date      text,
  amount    numeric not null,
  status    text default 'due',  -- paid | due | applied
  method    text,
  receipt   text,
  created_at timestamptz default now()
);

alter table public.payments enable row level security;

create policy "payments_own_read" on public.payments for select using (
  player_id = (select player_id from public.profiles where id = auth.uid())
);
create policy "payments_staff_read" on public.payments for select using (public.is_staff());
create policy "payments_commissioner_write" on public.payments for all using (public.is_commissioner());
