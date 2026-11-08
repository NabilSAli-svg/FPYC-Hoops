-- Grant League Director access to Adam Basinger, Dan Sharma, and James
-- Brixius, each scoped to their own Rec age group. Safe to run before they
-- sign up too -- the updates/inserts just affect 0 rows until their
-- `profiles` row exists (created automatically on their first "Create an
-- account" at /admin). Re-run this after each of them signs up.

update profiles set role = 'league_director'
where email in ('adambasinger3@hotmail.com', 'dansharma@gmail.com', 'james.j.brixius@gmail.com');

insert into user_scopes (user_id, scope_type, scope_value)
select id, 'team', '5/6 Boys' from profiles where email = 'adambasinger3@hotmail.com'
on conflict (user_id, scope_type, scope_value) do nothing;

insert into user_scopes (user_id, scope_type, scope_value)
select id, 'team', '5/6 Girls' from profiles where email = 'dansharma@gmail.com'
on conflict (user_id, scope_type, scope_value) do nothing;

insert into user_scopes (user_id, scope_type, scope_value)
select id, 'team', '7/8 Girls' from profiles where email = 'james.j.brixius@gmail.com'
on conflict (user_id, scope_type, scope_value) do nothing;
