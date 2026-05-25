# FPYC Basketball — Admin / Coach Dashboard

The primary surface in this design system. Built for **volunteer coaches and league admins** to run their teams day-to-day.

## What's here

- `index.html` — interactive prototype: sidebar nav + 4 main screens, click-through.
- `Sidebar.jsx` — primary nav with team switcher.
- `TopBar.jsx` — global top bar with search, season switcher, profile.
- `DashboardView.jsx` — landing screen: next game, recent results, attendance, announcements.
- `RosterView.jsx` — player table with jersey #, grade, contact, status pills.
- `ScheduleView.jsx` — list of upcoming and recent games with scores.
- `LineupView.jsx` — drag-style starting-five builder.
- `Bits.jsx` — small shared building blocks (Button, Pill, Card, etc).

## Screens covered

1. **Dashboard** — overview of the team.
2. **Roster** — player list, add player.
3. **Schedule** — game list, RSVPs.
4. **Lineup** — set starting five for a game.

## What's NOT covered (intentionally)

Settings, messaging, payments — no source material existed for these. UI kits are not storybooks; they recreate visible product.
