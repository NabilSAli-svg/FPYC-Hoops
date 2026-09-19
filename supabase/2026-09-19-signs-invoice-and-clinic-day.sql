-- Concept Marketing invoice #17936 (100 yard signs, $675) against Equipment.
insert into public.invoices (id, vendor, invoice_no, invoice_date, amount, account, line_item, notes) values
  ('inv-17936', 'Concept Marketing, Inc.', '17936', '2026-09-17', 675, '5062-08', 'Equipment', '100 FPYC 2026/2027 Basketball Sign Up yard signs, printed 2 sides + metal H-stakes')
on conflict (id) do update set
  vendor = excluded.vendor, invoice_no = excluded.invoice_no, invoice_date = excluded.invoice_date,
  amount = excluded.amount, account = excluded.account, line_item = excluded.line_item, notes = excluded.notes;

update public.budget
set data = jsonb_set(
  data,
  '{expenses}',
  (
    select jsonb_agg(
      case when elem->>'account' = '5062-08'
        then jsonb_set(elem, '{actual}', to_jsonb((coalesce((elem->>'actual')::numeric, 0) + 675)::numeric))
        else elem
      end
    )
    from jsonb_array_elements(data->'expenses') elem
  ),
  false
),
updated_at = now()
where id = 'budget-2627';

-- Skills Clinic: move the Sep 29 onward sessions from Monday to Tuesday.
-- (Sep 14 and the Sep 21 Daniels Run week are unchanged.)
update public.practices set date = 'Tue, Sep 29' where id in ('fc_beg_3', 'fc_int_3', 'fc_adv_3');
update public.practices set date = 'Tue, Oct 6'  where id in ('fc_beg_4', 'fc_int_4', 'fc_adv_4');
update public.practices set date = 'Tue, Oct 20' where id in ('fc_beg_5', 'fc_int_5', 'fc_adv_5');
update public.practices set date = 'Tue, Oct 27' where id in ('fc_beg_6', 'fc_int_6', 'fc_adv_6');
update public.practices set notes = 'Moved to Tuesdays' where id in ('fc_beg_3', 'fc_int_3', 'fc_adv_3');
