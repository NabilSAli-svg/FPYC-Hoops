# FPYC Summer Pilot — Product Spec

**Target launch:** June 16, 2026 (summer basketball season)
**Owner:** Commissioner (Nabil)
**Status:** Approved scope from spec interview, June 9 2026

---

## 1. Vision

Expand FPYC Hoops from a basketball demo into **one FPYC app** that every family
in the club eventually uses for every sport. The summer 2026 basketball season
is the pilot: real families, real schedules, real data on a shared backend.
A soccer preview built on demo data shows the board the multi-sport future
without committing to building it yet.

## 2. Pilot scope at a glance

| Decision | Choice |
|---|---|
| Sports live | Basketball (full pilot) |
| Sports previewed | Soccer (seeded demo data, clearly labeled "Preview") |
| Structure | One app with a sport switcher |
| Primary audience | Families / parents |
| Backend | Supabase (Postgres + Realtime + Auth) |
| Auth | Email + password |
| Pilot size | Whole summer program — under 15 teams |
| Hosting | Vercel or Netlify free tier (push-to-deploy from GitHub) |
| Deadline | June 16, 2026 |

### Launch must-haves (in priority order)
1. **Schedules + announcements** — families see games/practices; commissioner posts news. This is the core loop and ships no matter what.
2. **Live scores** — volunteer-parent scorekeeper console + realtime family scoreboard. **First feature cut if the week runs short**; it can follow as a week-2 in-season update without blocking launch.

### Explicitly deferred (in-season or post-pilot)
- RSVP + attendance
- Standings + playoffs (admin Playoffs view already exists on localStorage; migrates later)
- Payments, evaluations, draft board, officials pay tracking
- Baseball/softball, flag football, cheer

## 3. Users and roles

| Role | Who | Access |
|---|---|---|
| **Commissioner** | Nabil (single admin for pilot) | Full admin: teams, schedules, announcements, CSV import, game PINs |
| **Coach** | Volunteer coaches (~1 per team) | Their team's roster + schedule; can post team announcements (stretch) |
| **Family** | Parents/guardians | Their player's team schedule, club + team announcements, live scores |
| **Scorekeeper** | Rotating volunteer parents | **No account.** Enter a per-game PIN to open the score console for that game only |

The game-PIN model is required because a different parent keeps score each
game. The commissioner sees the PIN on each game in the admin schedule and
reads it out at the gym.

## 4. Onboarding flow

1. **Commissioner imports a CSV** exported from the registration spreadsheet:
   one row per player — player name, team, division, guardian email(s).
2. Import creates teams, rosters, and *pending family invitations* keyed by email.
3. **Families self-sign-up** with email + password. On signup, the email is
   matched against pending invitations and the account is auto-linked to their
   player(s). Unmatched emails land in a "claim your player" search (name +
   team) with commissioner approval as the fallback.
4. Multi-child families see all their players under one account.

## 5. Sport switcher

- App header gains an FPYC-wide sport switcher: **Basketball** and **Soccer**.
- Basketball → the real pilot (Supabase data).
- Soccer → same screens running on seeded demo data, with a persistent
  "Preview — Fall 2026" banner. Sport differences shown in the preview:
  halves instead of quarters, goals/assists instead of points, field locations.
- Architecturally: sport is a config object (`periods`, `scoringLabel`,
  `venueNoun`, theme accent) so adding a sport later is data + seed work, not
  new screens.

## 6. Architecture

### Current → target
- **Today:** React 18 + Vite, all state in `localStorage` via `useLocalStorage`
  hooks in `src/shared/store.js`. Single-device only.
- **Pilot:** Same front end; storage hooks re-pointed at Supabase with realtime
  subscriptions. The hook interface (`const [games, setGames] = useGames()`)
  is preserved so view components don't change.

### Supabase schema (pilot minimum)
```
sports        id, name, config jsonb
divisions     id, sport_id, name
teams         id, division_id, name, color
players       id, team_id, name, number, grade
profiles      id (auth.users), name, role (commissioner|coach|family)
family_players profile_id, player_id
games         id, division_id, home_team_id, away_team_id, starts_at,
              location, status (scheduled|live|final), home_score, away_score,
              score_pin
practices     id, team_id, starts_at, location, notes
announcements id, sport_id, title, body, type, target (all|team_id),
              pinned, created_at, author
```

### Row-level security (pilot-grade)
- Reads: any authenticated user can read schedule/announcement/score data
  for the basketball sport. (Club schedules aren't sensitive; keeps RLS simple.)
- Writes: commissioner role only — except `games.home_score/away_score/status`,
  writable through an RPC that validates the game's `score_pin`.
- Family↔player links visible only to the owning profile + commissioner.

### Realtime
- Family scoreboard and schedule subscribe to `games` changes — replaces the
  current cross-tab localStorage sync with cross-*device* sync.

## 7. Build plan (June 9 → June 16)

| Day | Deliverable |
|---|---|
| 1–2 | Supabase project, schema, RLS; auth (signup/login/reset); deploy skeleton to Vercel |
| 2–3 | Migrate store hooks: games, practices, announcements → Supabase with realtime |
| 3–4 | CSV import (admin) + family self-signup with player matching |
| 4–5 | Family portal on live data: schedule, announcements, home tab; admin: schedule + announcements CRUD |
| 5–6 | Live scores: game PIN console + realtime scoreboard *(cut line is here)* |
| 6 | Sport switcher + soccer preview with seeded demo data |
| 7 | Buffer: seed real teams from registration CSV, smoke test with 2–3 friendly families, fix list |

**Definition of done for 6/16:** a family can sign up, see their child's real
summer schedule on their phone, and read commissioner announcements — on
production hosting with shared data. Everything beyond that is upside.

## 8. Risks

| Risk | Mitigation |
|---|---|
| 1-week timeline | Hard cut order: soccer preview → live scores → never schedules/announcements |
| Email/password support burden (resets) | Supabase built-in reset emails; commissioner can manually reset |
| CSV data quality (emails, name mismatches) | Unmatched-signup fallback flow + commissioner approval queue |
| Volunteer scorekeeper confusion | PIN-only entry, console already mobile-tested, one-page cheat sheet PDF at the table |
| Free-tier limits | <15 teams ≈ hundreds of users — well within Supabase/Vercel free tiers |

## 9. Success criteria for the pilot

- ≥60% of program families create an account by week 2
- Every game's schedule and result visible in-app within 24h (same-night if live scores ship)
- Zero schedule-change phone-tree incidents — announcements carry all changes
- Board sees soccer preview and approves fall multi-sport expansion
