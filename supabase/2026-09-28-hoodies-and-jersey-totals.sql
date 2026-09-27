-- 2025-2026 house jersey quantities (from the sizing spreadsheet) added on
-- top of whatever's already recorded owned for each size.
update public.budget
set data = jsonb_set(
  data,
  '{jerseys}',
  jsonb_build_object(
    'Youth S',   jsonb_build_object('owned', coalesce((data#>>'{jerseys,Youth S,owned}')::int, 0) + 131, 'checkedOut', coalesce((data#>>'{jerseys,Youth S,checkedOut}')::int, 0)),
    'Youth M',   jsonb_build_object('owned', coalesce((data#>>'{jerseys,Youth M,owned}')::int, 0) + 148, 'checkedOut', coalesce((data#>>'{jerseys,Youth M,checkedOut}')::int, 0)),
    'Youth L',   jsonb_build_object('owned', coalesce((data#>>'{jerseys,Youth L,owned}')::int, 0) + 117, 'checkedOut', coalesce((data#>>'{jerseys,Youth L,checkedOut}')::int, 0)),
    'Youth XL',  jsonb_build_object('owned', coalesce((data#>>'{jerseys,Youth XL,owned}')::int, 0) + 60,  'checkedOut', coalesce((data#>>'{jerseys,Youth XL,checkedOut}')::int, 0)),
    'Adult S',   jsonb_build_object('owned', coalesce((data#>>'{jerseys,Adult S,owned}')::int, 0) + 70,  'checkedOut', coalesce((data#>>'{jerseys,Adult S,checkedOut}')::int, 0)),
    'Adult M',   jsonb_build_object('owned', coalesce((data#>>'{jerseys,Adult M,owned}')::int, 0) + 66,  'checkedOut', coalesce((data#>>'{jerseys,Adult M,checkedOut}')::int, 0)),
    'Adult L',   jsonb_build_object('owned', coalesce((data#>>'{jerseys,Adult L,owned}')::int, 0) + 12,  'checkedOut', coalesce((data#>>'{jerseys,Adult L,checkedOut}')::int, 0)),
    'Adult XL',  jsonb_build_object('owned', coalesce((data#>>'{jerseys,Adult XL,owned}')::int, 0) + 18,  'checkedOut', coalesce((data#>>'{jerseys,Adult XL,checkedOut}')::int, 0)),
    'Adult XXL', jsonb_build_object('owned', coalesce((data#>>'{jerseys,Adult XXL,owned}')::int, 0),      'checkedOut', coalesce((data#>>'{jerseys,Adult XXL,checkedOut}')::int, 0))
  ),
  false
),
updated_at = now()
where id = 'inventory-2627';

-- Coach Pullovers -> Coach Hoodies, S-XXL, per invoice #4045 (131 total).
update public.budget
set data = (data - 'pullovers') || jsonb_build_object(
  'hoodies', jsonb_build_object(
    'Small',  jsonb_build_object('owned', 20, 'checkedOut', 0),
    'Medium', jsonb_build_object('owned', 26, 'checkedOut', 0),
    'Large',  jsonb_build_object('owned', 48, 'checkedOut', 0),
    'XL',     jsonb_build_object('owned', 32, 'checkedOut', 0),
    'XXL',    jsonb_build_object('owned', 5,  'checkedOut', 0)
  )
),
updated_at = now()
where id = 'inventory-2627';
