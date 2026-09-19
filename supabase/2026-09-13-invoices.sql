-- Invoices — same access as Budget (Admin / Ops Director only via can_manage_ops()).

create table if not exists public.invoices (
  id           text primary key,
  vendor       text not null,
  invoice_no   text,
  invoice_date text,
  amount       numeric not null default 0,
  account      text,
  line_item    text,
  notes        text,
  created_at   timestamptz default now()
);

alter table public.invoices enable row level security;

drop policy if exists "invoices_ops_all" on public.invoices;
create policy "invoices_ops_all" on public.invoices for all using (public.can_manage_ops());

-- The 4 Leaf Graphics house jerseys invoice.
insert into public.invoices (id, vendor, invoice_no, invoice_date, amount, account, line_item, notes) values
  ('inv-4041', '4 Leaf Graphics', '4041', '2026-09-15', 14617, '5099-08', 'Uniforms', '622 house jerseys — blank + screen print')
on conflict (id) do update set
  vendor = excluded.vendor, invoice_no = excluded.invoice_no, invoice_date = excluded.invoice_date,
  amount = excluded.amount, account = excluded.account, line_item = excluded.line_item, notes = excluded.notes;

-- Reflect the invoice in the Uniforms expense line's Actual spend.
update public.budget
set data = jsonb_set(
  data,
  '{expenses}',
  (
    select jsonb_agg(
      case when elem->>'account' = '5099-08'
        then jsonb_set(elem, '{actual}', to_jsonb((coalesce((elem->>'actual')::numeric, 0) + 14617)::numeric))
        else elem
      end
    )
    from jsonb_array_elements(data->'expenses') elem
  ),
  false
),
updated_at = now()
where id = 'budget-2627';
