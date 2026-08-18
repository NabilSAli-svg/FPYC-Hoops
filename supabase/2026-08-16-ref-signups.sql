-- Public referee sign-up submissions from the website.
-- Separate from `officials` (staff-only) so anonymous visitors can apply
-- without being able to read or modify the officials roster.

create table if not exists public.ref_signups (
  id          text primary key,
  name        text not null,
  email       text not null,
  phone       text,
  experience  text,                      -- 'none' | 'some' | 'certified'
  availability text,                     -- free text: weeknights, Saturdays, etc.
  note        text,
  status      text default 'new',        -- 'new' | 'contacted' | 'onboarded' | 'declined'
  created_at  timestamptz default now()
);

alter table public.ref_signups enable row level security;

-- Anyone may submit an application...
create policy "ref_signups_public_insert"
  on public.ref_signups for insert
  with check (true);

-- ...but only staff can read or manage them.
create policy "ref_signups_staff_read"
  on public.ref_signups for select
  using (public.is_staff());

create policy "ref_signups_staff_update"
  on public.ref_signups for update
  using (public.is_staff());

create policy "ref_signups_staff_delete"
  on public.ref_signups for delete
  using (public.is_staff());

-- Volunteer applications from the website's "Get involved" form.
-- Previously the form only flipped a local flag, so submissions were lost.
create table if not exists public.volunteer_signups (
  id         text primary key,
  name       text not null,
  email      text not null,
  role       text,
  note       text,
  status     text default 'new',
  created_at timestamptz default now()
);

alter table public.volunteer_signups enable row level security;

create policy "volunteer_signups_public_insert"
  on public.volunteer_signups for insert with check (true);
create policy "volunteer_signups_staff_read"
  on public.volunteer_signups for select using (public.is_staff());
create policy "volunteer_signups_staff_update"
  on public.volunteer_signups for update using (public.is_staff());
create policy "volunteer_signups_staff_delete"
  on public.volunteer_signups for delete using (public.is_staff());
