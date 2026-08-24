# Staging

A second Supabase project mirrors production so migrations can be tried before
they touch real family, coach and referee data.

## How it is wired

Vercel builds a preview for every branch and pull request. The two Supabase
variables are scoped by environment, so previews and production read different
databases:

| Variable | Production scope | Preview scope |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | live project | staging project |
| `VITE_SUPABASE_ANON_KEY` | live publishable key | staging publishable key |

Nothing in the code branches on environment — the client just reads whichever
values the build was given.

## Standing up a fresh database

1. Create a Supabase project.
2. Run `supabase/bootstrap.sql` in its SQL Editor. That creates 21 tables, the
   role helpers, 41 policies and the two coach RPCs in one pass. It is guarded
   throughout, so re-running it is safe.
3. Sign up through the app, then grant yourself access:

   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```

4. Optionally seed a season from the dated files in `supabase/` — the winter
   coach credentials, the fall gym permit and the skills clinic are the useful
   three.

## Keys

Use the **publishable** key (`sb_publishable_…`). It is designed to be shipped
in browser code and every table is protected by row-level security.

Never use the **secret** key (`sb_secret_…`) in the client. It bypasses RLS
entirely, which would undo every permission rule in `supabase/bootstrap.sql`.

## A caveat on bootstrap.sql

It is reconstructed from the migration history plus the columns the app reads
and writes — not a dump. `schema.sql` had drifted from the live database, so
before relying on staging to mirror production exactly, run
`supabase db dump --schema public` against production and diff the two.
