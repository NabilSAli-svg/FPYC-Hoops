-- Add a new "Publicity" expense line (no budget was allocated for it) and
-- move the yard signs invoice/actual from Equipment to it.

-- Move the invoice itself.
update public.invoices
set account = '5075-08', line_item = 'Publicity'
where id = 'inv-17936';

-- Zero out Equipment's actual (the $675 moves out).
update public.budget
set data = jsonb_set(
  data,
  '{expenses}',
  (
    select jsonb_agg(
      case when elem->>'account' = '5062-08'
        then jsonb_set(elem, '{actual}', to_jsonb(greatest(coalesce((elem->>'actual')::numeric, 0) - 675, 0)))
        else elem
      end
    )
    from jsonb_array_elements(data->'expenses') elem
  ),
  false
),
updated_at = now()
where id = 'budget-2627';

-- Append the new Publicity line, unless it's already there.
update public.budget
set data = jsonb_set(
  data,
  '{expenses}',
  (data->'expenses') || jsonb_build_array(jsonb_build_object(
    'id', 'e18', 'account', '5075-08', 'label', 'Publicity',
    'perPlayer', null, 'budget', null, 'actual', 675, 'priorActual', 0,
    'notes', 'Yard signs, banners, promotional materials'
  )),
  false
),
updated_at = now()
where id = 'budget-2627'
  and not exists (
    select 1 from jsonb_array_elements(data->'expenses') e where e->>'account' = '5075-08'
  );
