# FPYC Basketball Design System

A design system for **FPYC Basketball** — the basketball program of the Fairfax Police Youth Club (FPYC), a volunteer-run youth sports nonprofit serving Fairfax, Virginia.

This system is tuned for the **coach and league-admin audience**: people running rosters, lineups, schedules, attendance, and registration. It also covers the public-facing marketing surface so parents and players see a coherent brand.

---

## About FPYC

- **Who:** Fairfax Police Youth Club. Volunteer-run, nonprofit, community-rooted.
- **What:** Multi-sport youth org. This system is scoped to **Basketball**.
- **Programs:** House League (rec) and Select / Travel (competitive, FCYBL), grades K–8 plus skills clinics.
- **People:** Volunteer coaches, age-group directors, a Commissioner of Basketball, board members.
- **Tone:** Civic, community-first, sportsmanship-driven. A neighborhood institution — not a flashy AAU program.

## Sources used

- **Logo:** PNG provided by the user → `assets/logo-fpyc-basketball.png`
- **Reference site:** [fpycsports.com/sports/basketball](https://www.fpycsports.com/sports/basketball)
- No codebase, Figma, or additional brand guidelines were provided. Visual direction is derived from the logo (navy + varsity gold + basketball orange) and the tone of the public site.

## Products covered

1. **Coach & Admin Dashboard** (`ui_kits/admin/`) — primary surface. Rosters, schedule, lineup builder, attendance, evaluations.
2. **Marketing Website** (`ui_kits/website/`) — public-facing registration, programs, news, contact.

---

## Index

| Path | What it is |
|---|---|
| `README.md` | This file — brand, content, visual foundations, iconography |
| `SKILL.md` | Agent-Skills entry point |
| `colors_and_type.css` | All CSS variables + semantic styles |
| `assets/` | Logos, marks, imagery used in the system |
| `preview/` | Design-system cards (Colors, Type, Spacing, Components, Brand) |
| `ui_kits/admin/` | Coach/admin dashboard recreation |
| `ui_kits/website/` | Marketing site recreation |

---

## Content Fundamentals

FPYC writes the way it operates: **direct, civic, slightly old-school, volunteer-coded.** Not a brand voice that performs — a community announcement board.

### Voice in one line
> A volunteer coach talking to other volunteer coaches and parents, plainly, with care.

### Tone rules

- **"We" and "you."** "We need volunteers." "You should inform your coach of any conflicts."
- **Sentence case for body copy.** Title Case is reserved for program names ("Select Basketball", "House League", "Skills Clinic") and headings.
- **ALL CAPS for emphasis is allowed and on-brand** — reserve for one element per screen (dates, deadlines, championship moments).
- **Specific over abstract.** Real names, phone numbers, dates, grades, dollar amounts. Not "register today" — "Registration $195. Late fee $45 begins Nov 15."
- **No marketing jargon.** No "elevate," "ignite," "passion-driven." Say "play more games," "develop fundamentals," "have fun."
- **Numbers, dates, money are first-class.** Bold them. Tabular-figure them.
- **Sportsmanship language is unironic.** "Good sportsmanship," "hard work, dedication, and skill development" — keep them, don't ironize.

### Vibe

- **Volunteer-civic** — school-newsletter / rec-center bulletin board energy. Trustworthy.
- **Varsity-pride** — when celebrating teams or wins, lean into uppercase, bold gold-on-navy, championship language.
- **Inclusive on access** — scholarships, sibling discounts, and volunteer credits are highlighted, not hidden.

### Emoji & punctuation

- **No emoji.** Use real iconography (Lucide).
- **Multiple `!!` in announcements is tolerated**, sparingly.
- **Em dashes are fine.** Curly quotes for body. Straight quotes in UI/code.

### Sample copy

> **Hero:** Basketball Registration 2025–26 is Now Open
> **Sub:** House League and Select Travel. Walk-in registration Sept 27 & Oct 11, 10 a.m.–12 p.m.

> **Warning banner:** Late fees begin November 15. Register early.

> **Director's note:** FPYC is a completely volunteer-based organization. We need volunteers to help coach and run our leagues.

---

## Visual Foundations

The brand is **two-tone first** (navy + gold) with orange used as a punctuation only.

### Color

- **Court Navy** `#0A1F3D` — primary background, headers, buttons, type on light.
- **Varsity Gold** `#FFC72C` — primary accent, CTAs, highlights, score indicators. Bright, saturated, no gradient.
- **Net White** `#FFFFFF` & **Bone** `#F7F4EC` — surfaces. Bone is a warm 4% off-white that reads as paper.
- **Basketball Orange** `#E87722` — ONLY for the basketball glyph and live-game pulse.
- **Foul Red** `#C8102E` — destructive / red-card alerts.
- **Whistle** `#1A2436` — body text on light surfaces.
- **Court Lines** `#E4DECF` — hairlines on bone, gym-floor inspired.

Never use orange and gold together at equal weight. Always pick a hierarchy.

### Type

- **Display: Anton** — single weight, condensed grotesque. Matches the FPYC mark. ALL CAPS for scoreboards, hero headlines, jersey-style numerals, section titles.
- **Body: DM Sans** — clean humanist sans. Everything else. 400 / 500 / 700. Sentence case.
- **Numeric: JetBrains Mono** — tabular figures for stats, scores, schedules.

All three are Google Fonts and loaded from the Google CDN in `colors_and_type.css`. No font substitution required; flagged here so the user can replace with self-hosted files later if desired.

### Spacing

4px base grid. `--space-1` 4, `--space-2` 8, `--space-3` 12, `--space-4` 16, `--space-5` 24, `--space-6` 32, `--space-7` 48, `--space-8` 64, `--space-9` 96.

### Corner radii

Soft but not pillowy. The brand sits between civic (sharp) and friendly (rounded).

- `--radius-sm` 4px — inputs, small chips
- `--radius-md` 8px — cards, modals, buttons (default)
- `--radius-lg` 14px — large surfaces, hero cards
- `--radius-pill` 999px — status pills, tags, score chips
- **No `--radius-xl` blob shapes.** No fully circular images unless it's a player/coach headshot.

### Borders & lines

- 1px hairlines in `--court-lines` (#E4DECF) on bone surfaces.
- 1px hairlines in `rgba(255,255,255,0.08)` on navy surfaces.
- 2px navy borders for emphasis on important cards (mimics jersey piping).
- Never dashed. Never dotted (except score-divider sometimes).

### Shadows / elevation

Restrained. The brand feels printed, not skeuomorphic.

- `--shadow-1` `0 1px 2px rgba(10,31,61,0.06)` — resting cards.
- `--shadow-2` `0 4px 12px rgba(10,31,61,0.10)` — hover, active card.
- `--shadow-3` `0 16px 40px rgba(10,31,61,0.18)` — modal, popover.
- No inner shadows. No colored shadows except optional gold glow on the primary CTA.

### Backgrounds

- Default surface is **bone** (`#F7F4EC`). Pure white is for cards on top of bone.
- Hero sections use **Court Navy** as a flat background, often with a subtle **scoreboard grain** (`assets/scoreboard-grain.svg`) — a 4% noise overlay.
- Occasionally a single **court-lines** vector (`assets/court-half.svg`) sits behind hero headlines, low-contrast.
- **No gradients** as primary surfaces. The single allowed gradient: `radial-gradient(circle at 30% 30%, rgba(255,199,44,0.15), transparent 60%)` as a soft varsity glow behind a logo or trophy.
- **No bluish-purple gradients. Ever.**

### Imagery

- **Real action photography preferred** — gym shots, kids playing, coaches huddling. Placeholders show a labeled box (`#0A1F3D` with a gold corner tag) until real photos arrive.
- **Color treatment:** warm, slightly contrasty, no heavy filter. If a photo is desaturated for a hero, drop it to ~30% saturation and add a navy multiply (`mix-blend-mode: multiply` with `#0A1F3D` at 80%).
- **No stock illustration of basketball players.** The logo's basketball glyph is the only illustrated basketball motif allowed.

### Hover & press states

- **Buttons (primary navy):** hover → background `#143057` (10% lighter); press → background `#06152A` (darker) AND transform `scale(0.98)`.
- **Buttons (gold):** hover → background `#FFD451`; press → `#E5B324` + `scale(0.98)`.
- **Links:** underline on hover, color stays. Never change color on hover.
- **Cards:** hover → `--shadow-2` and `translateY(-1px)`. Cursor pointer only when clickable.
- **Icons:** hover → opacity 0.7 if standalone; otherwise inherit parent state.

### Animation

- **Easing:** `cubic-bezier(0.2, 0.8, 0.2, 1)` (a confident ease-out) for most UI motion. Duration `160ms` for state changes, `240ms` for layout, `400ms` for hero entrances.
- **No bounce.** No springy overshoots. This is civic and trustworthy, not playful.
- **Fades + small translates only.** Slide in 8px, fade in. No 3D, no rotation.
- **One exception:** the live-game pulse — the orange basketball glyph subtly scales 1.0 → 1.05 → 1.0 on a 1.6s loop when a game is LIVE.

### Transparency & blur

- **Sparingly.** A navy header may use `rgba(10,31,61,0.92)` + `backdrop-filter: blur(8px)` when over content. Otherwise prefer flat fills.
- **No glassmorphism panels.**

### Layout rules

- 12-column grid, 24px gutter, max content width 1200px (1280px for app shell).
- Sticky top nav on website (64px tall). Sticky sidebar on admin (240px). Sticky scoreboard ribbon during live games.
- Mobile: single column, 16px gutters, bottom-fixed primary CTA on key conversion screens.
- Tap targets ≥ 44px.

### Cards

Two card flavors only:

1. **Paper card** — white, `--radius-md`, `--shadow-1`, 1px hairline `--court-lines` border. Default for everything.
2. **Banner card** — Court Navy fill, gold accent stripe (4px) on the left edge OR a 4px gold top edge. Used for highlighted news, championship moments, and current-game callouts.

Never combine: no white card with a colored left-stripe (avoid that overused trope).

---

## Iconography

- **Primary icon system: [Lucide](https://lucide.dev/)** — loaded via CDN as `lucide@latest`. Stroke 2, line-cap round.
- **Why Lucide:** matches the brand's clean, civic-modern feel; consistent stroke; broad coverage including sports-adjacent icons (whistle, trophy, calendar, users, clipboard, list).
- **Substitution flag:** no native FPYC icon set exists in the source materials. Lucide is a substitute and should be reviewed.
- **Brand-specific glyphs:** the basketball mark from the logo (`assets/basketball-glyph.svg`) is the only custom glyph; use it for live-game indicators and brand moments. Do not redraw it.
- **No emoji** anywhere in product UI or marketing copy.
- **Unicode characters** for arrows are fine inside text (→, ←) but use Lucide for any standalone icon.
- **Icon sizing:** `--icon-sm` 16px, `--icon-md` 20px (default), `--icon-lg` 24px, `--icon-xl` 32px. Never scale below 14px.
- **Color:** icons inherit text color via `currentColor`. Never tint an icon a separate brand color unless it carries semantic meaning (gold = highlight, red = destructive, orange = live).
