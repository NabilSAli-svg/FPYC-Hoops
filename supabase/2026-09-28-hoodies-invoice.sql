-- 4 Leaf Graphics invoice #4045 (131 navy hoodies, $3,930) against Spirit Wear / Coaches.
insert into public.invoices (id, vendor, invoice_no, invoice_date, amount, account, line_item, notes) values
  ('inv-4045', '4 Leaf Graphics', '4045', '2026-09-28', 3930, '5093-08', 'Spirit Wear / Coaches', '131 navy Gildan Heavy Blend hoodies (20 S, 26 M, 48 L, 32 XL, 5 XXL) — FPYC logo front, @FPYCHOOPS back')
on conflict (id) do update set
  vendor = excluded.vendor, invoice_no = excluded.invoice_no, invoice_date = excluded.invoice_date,
  amount = excluded.amount, account = excluded.account, line_item = excluded.line_item, notes = excluded.notes;

update public.budget
set data = jsonb_set(
  data,
  '{expenses}',
  (
    select jsonb_agg(
      case when elem->>'account' = '5093-08'
        then jsonb_set(elem, '{actual}', to_jsonb((coalesce((elem->>'actual')::numeric, 0) + 3930)::numeric))
        else elem
      end
    )
    from jsonb_array_elements(data->'expenses') elem
  ),
  false
),
updated_at = now()
where id = 'budget-2627';
