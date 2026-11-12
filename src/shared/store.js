import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { useSupabaseTable, useSupabaseAssignments, useSupabaseJsonList } from './useSupabaseTable.js';
import { supabase } from './supabase.js';

export const TEAM_INFO = {
  name: '5/6 Boys',
  division: 'Winter Rec',
  record: '0–0',
  seed: '—',
  coach: 'Coach',
  coachEmail: '',
};

// `enabled: false` keeps a sport's data intact but hides it from pickers.
export const SPORTS = [
  { id: 'basketball', label: 'Basketball', tagline: 'FPYC Basketball', icon: 'circle-dot', enabled: true },
  { id: 'soccer',     label: 'Soccer',     tagline: 'FPYC Soccer',     icon: 'circle',     enabled: false },
  { id: 'football',   label: 'Football',   tagline: 'FPYC Lions Football', icon: 'shield', enabled: false },
];

export const ACTIVE_SPORTS = SPORTS.filter(s => s.enabled);

// Registration is handled by FPYC's Ottosport portal this season — the in-app
// /register wizard is disabled and every "sign up" link points here.
// FPYC was founded in 1963. Derive the anniversary so it never goes stale.
export const FOUNDED_YEAR = 1963;
export function yearsInFairfax() {
  return new Date().getFullYear() - FOUNDED_YEAR;
}

export const REGISTER_URL = 'https://fpycsports.ottosport.ai/_registration_login?to=https%3A%2F%2Ffpycsports.ottosport.ai%2F_registration';

export const REC_DIVISION    = 'Winter Rec';
export const SELECT_DIVISION = 'Winter Select';
export const CLINIC_DIVISION = 'Fall Skills Clinic';

export const TEAMS_INFO = {
  // ── Winter 2026–27 · Rec ───────────────────────────────────────────────────
  // K-3 is formed by skill/age — no draft.
  // The rest are house leagues, not teams themselves -- players land here
  // unassigned at registration, then a draft splits each into real teams
  // (created in Settings > My Teams and assigned a coach there). `pool: true`
  // keeps them out of any "teams" list while still letting the dashboard,
  // roster, and draft board use them as the player pool/division to draft.
  'K-3 3v3':    { id: 'k3-3v3', name: 'K-3 3v3',    division: REC_DIVISION, coach: 'Coach', color: '#0891B2', sport: 'basketball', noDraft: true },
  '3/4 Boys':   { id: '34boys', name: '3/4 Boys',   division: REC_DIVISION, coach: 'Coach', color: 'var(--court-navy)', sport: 'basketball', pool: true },
  '3/4 Girls':  { id: '34girls',name: '3/4 Girls',  division: REC_DIVISION, coach: 'Coach', color: '#BE185D', sport: 'basketball', pool: true },
  '5/6 Boys':   { id: '56boys', name: '5/6 Boys',   division: REC_DIVISION, coach: 'Coach', color: '#1D4ED8', sport: 'basketball', pool: true },
  '5/6 Girls':  { id: '56girls',name: '5/6 Girls',  division: REC_DIVISION, coach: 'Coach', color: '#DB2777', sport: 'basketball', pool: true },
  '7/8 Boys':   { id: '78boys', name: '7/8 Boys',   division: REC_DIVISION, coach: 'Coach', color: '#C8102E', sport: 'basketball', pool: true },
  '7/8 Girls':  { id: '78girls',name: '7/8 Girls',  division: REC_DIVISION, coach: 'Coach', color: '#9333EA', sport: 'basketball', pool: true },
  'HS Boys':    { id: 'hsboys', name: 'HS Boys',    division: REC_DIVISION, coach: 'Coach', color: '#111827', sport: 'basketball', pool: true },
  'HS Girls':   { id: 'hsgirls',name: 'HS Girls',   division: REC_DIVISION, coach: 'Coach', color: '#7C3AED', sport: 'basketball', pool: true },

  // ── Winter 2026–27 · Select ────────────────────────────────────────────────
  // Each grade may field a second team — add a "… 2" entry once tryouts settle.
  '5th Boys Select A':  { id: 'sel-5b', name: '5th Boys Select A',  division: SELECT_DIVISION, coach: 'Aidris Daud & Mike Hartwich', coachEmail: 'aidris@keydmv.com',            coachPhone: '703-447-1184', color: '#0369A1', sport: 'basketball' },
  '5th Girls Select': { id: 'sel-5g', name: '5th Girls Select', division: SELECT_DIVISION, coach: 'Fazle Taher',      coachEmail: 'coachftaher@gmail.com',        coachPhone: '703-835-1552', color: '#E11D48', sport: 'basketball' },
  '6th Boys Select A':  { id: 'sel-6b', name: '6th Boys Select A',  division: SELECT_DIVISION, coach: 'Thomas Schneider', coachEmail: 'schnet@gmail.com',             coachPhone: '603-809-2483', color: '#047857', sport: 'basketball' },
  '6th Girls Select': { id: 'sel-6g', name: '6th Girls Select', division: SELECT_DIVISION, coach: 'Michael Do',       coachEmail: 'michaeldo82@gmail.com',        coachPhone: '571-328-8126', color: '#A21CAF', sport: 'basketball' },
  '7th Boys Select A':  { id: 'sel-7b', name: '7th Boys Select A',  division: SELECT_DIVISION, coach: 'Tim Anderson',     coachEmail: 'timjanderson7@gmail.com',      coachPhone: '915-474-8825', color: '#B45309', sport: 'basketball' },
  '7th Girls Select': { id: 'sel-7g', name: '7th Girls Select', division: SELECT_DIVISION, coach: 'Earnest Williams', coachEmail: 'williamssrearnest@gmail.com',  coachPhone: '571-682-9432', color: '#BE123C', sport: 'basketball' },
  '8th Boys Select A':  { id: 'sel-8b', name: '8th Boys Select A',  division: SELECT_DIVISION, coach: 'Mike Lee',         coachEmail: 'michael.lee24@gmail.com',      coachPhone: '703-965-8104', color: '#1E40AF', sport: 'basketball' },
  '8th Girls Select': { id: 'sel-8g', name: '8th Girls Select', division: SELECT_DIVISION, coach: 'Brett Schmitz',    coachEmail: 'brettschmitz@yahoo.com',       coachPhone: '',             color: '#86198F', sport: 'basketball' },

  // Second boys teams, added once tryouts settled on numbers
  '5th Boys Select B': { id: 'sel-5b2', name: '5th Boys Select B', division: SELECT_DIVISION, coach: 'Nabil Ali',    coachEmail: 'syednabilali@gmail.com',    coachPhone: '703-994-2211', color: '#155E75', sport: 'basketball' },
  '6th Boys Select B': { id: 'sel-6b2', name: '6th Boys Select B', division: SELECT_DIVISION, coach: 'Shaun Ali',        coachEmail: 'shaunali34@gmail.com',  coachPhone: '703-989-0847', color: '#065F46', sport: 'basketball' },
  '7th Boys Select B': { id: 'sel-7b2', name: '7th Boys Select B', division: SELECT_DIVISION, coach: 'Tom Schneider',    coachEmail: 'schnet@gmail.com',      coachPhone: '603-809-2483', color: '#92400E', sport: 'basketball' },
  '8th Boys Select B': { id: 'sel-8b2', name: '8th Boys Select B', division: SELECT_DIVISION, coach: 'Keun Yoo',         coachEmail: 'keunyoo29@gmail.com',   coachPhone: '702-887-3034', color: '#1E3A8A', sport: 'basketball' },
  '6th Boys Select C': { id: 'sel-6b3', name: '6th Boys Select C', division: SELECT_DIVISION, coach: 'Matthew Dennis',  coachEmail: 'matthewsdennis@gmail.com', coachPhone: '', color: '#374151', sport: 'basketball' },

  // ── Fall 2026 · Skills Clinic ──────────────────────────────────────────────
  'Training - Beginner':     { id: 'fc-beg', name: 'Training - Beginner',     division: CLINIC_DIVISION, coach: 'Coach', color: '#0D9488', sport: 'basketball', noDraft: true },
  'Training - Intermediate': { id: 'fc-int', name: 'Training - Intermediate', division: CLINIC_DIVISION, coach: 'Coach', color: '#CA8A04', sport: 'basketball', noDraft: true },
  'Training - Advanced':     { id: 'fc-adv', name: 'Training - Advanced',     division: CLINIC_DIVISION, coach: 'Coach', color: '#DC2626', sport: 'basketball', noDraft: true },

  // ── Archived · Summer 2026 ─────────────────────────────────────────────────
  // Kept so past games/rosters still resolve; hidden from team pickers.
  'Rising 2nd-3rd Boys': { id: '23boys', name: 'Rising 2nd-3rd Boys', division: '3v3 Summer Cup', coach: 'Nick Blessing', color: 'var(--court-navy)', sport: 'basketball', archived: true },
  'Girls 3v3 (2nd-8th)': { id: 'girls',  name: 'Girls 3v3 (2nd-8th)', division: '3v3 Summer Cup', coach: 'Coach', color: '#1F8A5B', sport: 'basketball', archived: true },
  'Rising 4th-5th Boys': { id: '45boys', name: 'Rising 4th-5th Boys', division: '3v3 Summer Cup', coach: 'Joshua Nehr, Jim Quinn & Shaun Ali', color: '#C8102E', sport: 'basketball', archived: true },
  'Rising 6th-8th Boys': { id: '68boys', name: 'Rising 6th-8th Boys', division: '3v3 Summer Cup', coach: 'Coach', color: 'var(--basketball-orange)', sport: 'basketball', archived: true },
  'Aidris B5':   { id: 'ts-ab5',  name: 'Aidris B5',   division: 'Travel Select', coach: 'Coach Aidris',   color: '#7C3AED', sport: 'basketball', archived: true },
  'Tom B6':      { id: 'ts-tb6',  name: 'Tom B6',      division: 'Travel Select', coach: 'Coach Tom',      color: '#0369A1', sport: 'basketball', archived: true },
  'Mike Do G6':  { id: 'ts-mdg6', name: 'Mike Do G6',  division: 'Travel Select', coach: 'Mike Do',        color: '#059669', sport: 'basketball', archived: true },
  'Earnest G7':  { id: 'ts-eg7',  name: 'Earnest G7',  division: 'Travel Select', coach: 'Coach Earnest',  color: '#D97706', sport: 'basketball', archived: true },
  'Rene B7':     { id: 'ts-rb7',  name: 'Rene B7',     division: 'Travel Select', coach: 'Coach Rene',     color: '#BE185D', sport: 'basketball', archived: true },
  'Mike Lee B8': { id: 'ts-mlb8', name: 'Mike Lee B8', division: 'Travel Select', coach: 'Mike Lee',       color: '#1D4ED8', sport: 'basketball', archived: true },
  'Keun B8-2':   { id: 'ts-kb82', name: 'Keun B8-2',   division: 'Travel Select', coach: 'Coach Keun',     color: '#374151', sport: 'basketball', archived: true },
  'U9 Fairfax FC':  { id: 'soccer-u9',  name: 'U9 Fairfax FC',  division: 'PowerRec U9-U10',  coach: 'Rich Crowder', color: '#1F8A5B', sport: 'soccer' },
  'U12 Fairfax FC': { id: 'soccer-u12', name: 'U12 Fairfax FC', division: 'NCSL Rec U11-U19', coach: 'Coach', color: '#C8102E', sport: 'soccer' },

  // FPYC Flag Football — Spring 2026 (scheduler.leaguelobster.com/2636555/fpyc-flag-football)
  'Steelers (8U)':   { id: 'fb-8u-steelers',   name: 'Steelers (8U)',   division: '8U Coed Flag',  coach: 'Coach Morris',    color: '#C8102E', sport: 'football' },
  'Bucs (8U)':       { id: 'fb-8u-bucs',       name: 'Bucs (8U)',       division: '8U Coed Flag',  coach: 'Coach Mueller',   color: '#C8102E', sport: 'football' },
  'Dolphins (8U)':   { id: 'fb-8u-dolphins',   name: 'Dolphins (8U)',   division: '8U Coed Flag',  coach: 'Coach Townes',    color: '#C8102E', sport: 'football' },
  'Eagles (8U)':     { id: 'fb-8u-eagles',     name: 'Eagles (8U)',     division: '8U Coed Flag',  coach: 'Coach Fiallo',    color: '#C8102E', sport: 'football' },

  'Dolphins (10U)':  { id: 'fb-10u-dolphins',  name: 'Dolphins (10U)',  division: '10U Coed Flag', coach: 'Coach Pollack',   color: '#C8102E', sport: 'football' },
  'Broncos (10U)':   { id: 'fb-10u-broncos',   name: 'Broncos (10U)',   division: '10U Coed Flag', coach: 'Coach Greenberg', color: '#C8102E', sport: 'football' },
  'Commanders (10U)':{ id: 'fb-10u-commanders',name: 'Commanders (10U)',division: '10U Coed Flag', coach: 'Coach Turner',    color: '#C8102E', sport: 'football' },
  'Saints (10U)':    { id: 'fb-10u-saints',    name: 'Saints (10U)',    division: '10U Coed Flag', coach: 'Coach Rossman',   color: '#C8102E', sport: 'football' },
  'Ravens (10U)':    { id: 'fb-10u-ravens',    name: 'Ravens (10U)',    division: '10U Coed Flag', coach: 'Coach Ali',       color: '#C8102E', sport: 'football' },
  'Steelers (10U)':  { id: 'fb-10u-steelers',  name: 'Steelers (10U)',  division: '10U Coed Flag', coach: 'Coach Nehr',      color: '#C8102E', sport: 'football' },
  'Bucs (10U)':      { id: 'fb-10u-bucs',      name: 'Bucs (10U)',      division: '10U Coed Flag', coach: 'Coach Nishanov',  color: '#C8102E', sport: 'football' },
  'Eagles (10U)':    { id: 'fb-10u-eagles',    name: 'Eagles (10U)',    division: '10U Coed Flag', coach: 'Coach Vilasi',    color: '#C8102E', sport: 'football' },

  'Bucs (12U)':      { id: 'fb-12u-bucs',      name: 'Bucs (12U)',      division: '12U Coed Flag', coach: 'Coach Helmstutler', color: '#C8102E', sport: 'football' },
  'Saints (12U)':    { id: 'fb-12u-saints',    name: 'Saints (12U)',    division: '12U Coed Flag', coach: 'Coach Pollack',      color: '#C8102E', sport: 'football' },
  'Ravens (12U)':    { id: 'fb-12u-ravens',    name: 'Ravens (12U)',    division: '12U Coed Flag', coach: 'Coach Jeffress',     color: '#C8102E', sport: 'football' },
  'Commanders (12U)':{ id: 'fb-12u-commanders',name: 'Commanders (12U)',division: '12U Coed Flag', coach: 'Coach Komaily',      color: '#C8102E', sport: 'football' },
  'Steelers (12U)':  { id: 'fb-12u-steelers',  name: 'Steelers (12U)',  division: '12U Coed Flag', coach: 'Coach Vigna',        color: '#C8102E', sport: 'football' },
  'Eagles (12U)':    { id: 'fb-12u-eagles',    name: 'Eagles (12U)',    division: '12U Coed Flag', coach: 'Coach Millen',       color: '#C8102E', sport: 'football' },

  'Saints (15U)':    { id: 'fb-15u-saints',    name: 'Saints (15U)',    division: '15U Coed Flag', coach: 'Coach Justin',       color: '#C8102E', sport: 'football' },
  'Eagles (15U)':    { id: 'fb-15u-eagles',    name: 'Eagles (15U)',    division: '15U Coed Flag', coach: 'Coach Vecchione',    color: '#C8102E', sport: 'football' },
  'Steelers (15U)':  { id: 'fb-15u-steelers',  name: 'Steelers (15U)',  division: '15U Coed Flag', coach: 'Coach Ruiz',         color: '#C8102E', sport: 'football' },
  'Ravens (15U)':    { id: 'fb-15u-ravens',    name: 'Ravens (15U)',    division: '15U Coed Flag', coach: 'Coach Bruce',        color: '#C8102E', sport: 'football' },
  'Bucs (15U)':      { id: 'fb-15u-bucs',      name: 'Bucs (15U)',      division: '15U Coed Flag', coach: 'Coach Whitlock',     color: '#C8102E', sport: 'football' },
  'Commanders (15U)':{ id: 'fb-15u-commanders',name: 'Commanders (15U)',division: '15U Coed Flag', coach: 'Coach Parish',       color: '#C8102E', sport: 'football' },
};

// Team names for a sport, excluding archived (past-season) teams.
export function activeTeamNames(sport = 'basketball') {
  return activeTeamNamesFrom(TEAMS_INFO, sport);
}

// Same as activeTeamNames, but against a merged teams map (static + director-
// created teams from the `teams` table) rather than the hardcoded one.
export function activeTeamNamesFrom(teamsInfo, sport = 'basketball') {
  return Object.keys(teamsInfo).filter(
    name => (teamsInfo[name].sport || 'basketball') === sport && !teamsInfo[name].archived
  );
}

// Teams League Directors (or admins) created for their own age group, synced
// live from Supabase. Returns [rows, setRows] -- same shape as any other
// useSupabaseTable-backed list.
export function useCustomTeams() {
  return useSupabaseTable('custom_teams', []);
}

// Merge the static TEAMS_INFO map with director-created teams into one
// lookup keyed by team name, shaped like a TEAMS_INFO entry. A static entry
// always wins on a name clash.
export function mergeTeamsInfo(customTeams) {
  if (!customTeams || customTeams.length === 0) return TEAMS_INFO;
  const extra = {};
  for (const t of customTeams) {
    if (TEAMS_INFO[t.name]) continue;
    extra[t.name] = {
      id: t.id, name: t.name, division: t.division, sport: t.sport || 'basketball',
      color: t.color || 'var(--court-navy)', coach: t.coach || 'Coach',
      noDraft: t.no_draft, archived: t.archived, ageGroup: t.age_group, custom: true,
    };
  }
  return { ...TEAMS_INFO, ...extra };
}

// Active team names grouped by division, e.g. { 'Winter Rec': [...], 'Winter Select': [...] }.
export function activeTeamsByDivision(sport = 'basketball') {
  return activeTeamNames(sport).reduce((acc, name) => {
    const div = TEAMS_INFO[name].division || '—';
    (acc[div] ??= []).push(name);
    return acc;
  }, {});
}

// Divisions that hold a draft (K-3 forms teams by skill/age instead).
export function draftableDivisions(sport = 'basketball') {
  const divs = activeTeamNames(sport)
    .filter(name => !TEAMS_INFO[name].noDraft)
    .map(name => TEAMS_INFO[name].division);
  return [...new Set(divs)];
}


export const INITIAL_PLAYERS = [
  { id: 'p1', number: null, name: "Ishaaq Adam", grade: "2nd & 3rd", school: "Eagle View", guardian: "adamfamily0312@gmail.com", phone: "(703) 338-9601", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p2', number: null, name: "Ismaeel Adam", grade: "4th & 5th", school: "Eagle View", guardian: "adamfamily0312@gmail.com", phone: "(703) 338-9601", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p3', number: null, name: "Jenny Ahn", grade: "4th & 5th", school: "Mantua", guardian: "hello323235@gmail.com", phone: "7039091838", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p4', number: null, name: "Hamza Ali", grade: "4th & 5th", school: "Daniel’s Run", guardian: "syednabilali@gmail.com", phone: "(703) 994-2211", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p5', number: null, name: "Neal Beesam", grade: "4th & 5th", school: "Graham Road ES", guardian: "ashley@beesam.com", phone: "5714806621", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p6', number: null, name: "Michael Blessing", grade: "2nd & 3rd", school: "Greenbriar east", guardian: "stephanie.wyckoff@gmail.com", phone: "(571) 276-1154", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p7', number: null, name: "Derrick Booker jr", grade: "6th-8th", school: "Laurel Ridge Elementary", guardian: "devita_shorter@msn.com", phone: "6105643757", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p8', number: null, name: "Alexander Chang", grade: "6th-8th", school: "Mantua ES", guardian: "dcnycjjpkr@gmail.com", phone: "(703) 939-2859", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p9', number: null, name: "Misdy Contreras Martínez", grade: "2nd & 3rd", school: '', guardian: "karrrymartines@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p10', number: null, name: "Abby Cook", grade: "6th-8th", school: "Woodson", guardian: "dhciii@gmail.com", phone: "2408135457", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p11', number: null, name: "Alexsandra Cossio", grade: "6th-8th", school: "Cunnighan park", guardian: "alexsandrocossio@gmail.com", phone: "5714902828", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p12', number: null, name: "kirubel daniel", grade: "6th-8th", school: "Mosaic Elementary", guardian: "dagnu44@gmail.com", phone: "(615) 457-9822", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p13', number: null, name: "Anthony Del Fiore", grade: "4th & 5th", school: "willow Springs ES", guardian: "jimdelf@gmail.com", phone: "(401) 261-0205", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p14', number: null, name: "Cole Denton", grade: "6th-8th", school: "Daniels Run", guardian: "erinldenton@gmail.com", phone: "(571)379-6079", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p15', number: null, name: "Mason Drummey", grade: "4th & 5th", school: "Daniels Run Elementary", guardian: "saraabawi@gmail.com", phone: "703-328-5143", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p16', number: null, name: "Holden Duble", grade: "6th-8th", school: "Eagle View", guardian: "martin.duble@verizon.net", phone: "(703)968-5516", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p17', number: null, name: "Gio Flores", grade: "6th-8th", school: "Daniel’s Run", guardian: "jonrobflo@gmail.com", phone: "(703)209-6062", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p18', number: null, name: "Nate Fuge", grade: "4th & 5th", school: "Daniels Run ES", guardian: "davidfuge@gmail.com", phone: "(703) 244-2244", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p19', number: null, name: "Joshua Garvin", grade: "2nd & 3rd", school: "London Towne", guardian: "tarhealrn08@gmail.com", phone: "(703) 200-2179", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p20', number: null, name: "Faris Hamid", grade: "2nd & 3rd", school: "Eagle View", guardian: "hamid.ahmedm@gmail.com", phone: "(571) 331-1543", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p21', number: null, name: "Alex Handy", grade: "6th-8th", school: "Mantua", guardian: "wangl01@hotmail.com", phone: "(201) 320-3625", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p22', number: null, name: "Mira Hardwick", grade: "6th-8th", school: "Frost Middle School", guardian: "sw0000sh11@hotmail.com", phone: "575-749-2991", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p23', number: null, name: "Emerson Harvey", grade: "6th-8th", school: "Daniels Run Elementary School", guardian: "jeniharvey9@gmail.com", phone: "(703) 346-1194", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p24', number: null, name: "Ryan Harvey", grade: "4th & 5th", school: "Daniels Run Elementary School", guardian: "jeniharvey9@gmail.com", phone: "(703)346-1194", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p25', number: null, name: "Campbell Hastings", grade: "2nd & 3rd", school: "greenbriar east", guardian: "biohokie08@gmail.com", phone: "(540) 622-4484", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p26', number: null, name: "Declan Holmes", grade: "6th-8th", school: "Daniels Run", guardian: "slimkim35@gmail.com", phone: "(301)461-9447", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p27', number: null, name: "Nathan Jones", grade: "6th-8th", school: "Providence", guardian: "branjithan@yahoo.com", phone: "(703) 216-2728", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p28', number: null, name: "Norah Kamra- Rajpal", grade: "2nd & 3rd", school: "Providence ES", guardian: "h.analyst777@gmail.com", phone: "(516) 813-8657", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p29', number: null, name: "Ethan Kim", grade: "2nd & 3rd", school: "Province Elementary", guardian: "bambina833@gmail.com", phone: "(703) 473-6168", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p30', number: null, name: "Arjun Kintgen", grade: "6th-8th", school: "Mosaic", guardian: "ekintgen@gmail.com", phone: "8123404749", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p31', number: null, name: "Kabir Kintgen", grade: "4th & 5th", school: "Mosaic", guardian: "ekintgen@gmail.com", phone: "(812) 340-4749", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p32', number: null, name: "Mishel Kletska", grade: "6th-8th", school: "Daniel's Run elementary school", guardian: "rudolfina0908@gmail.com", phone: "5716405535", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p33', number: null, name: "BRUCE LEE", grade: "6th-8th", school: "Willow spring", guardian: "blee5451@gmail.com", phone: "(703)473-2341", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p34', number: null, name: "Kenson Lee", grade: "6th-8th", school: "Oak view", guardian: "maziejae@aol.com", phone: "(703) 474-5573", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p35', number: null, name: "Abu Bakr Lodin", grade: "4th & 5th", school: "Fairfax Villa Elementary School", guardian: "shukriahd@gmail.com", phone: "(571)318-7536", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p36', number: null, name: "Rhys Mancl", grade: "6th-8th", school: "Daniels Run", guardian: "mancl.amy@gmail.com", phone: "559-908-1523", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p37', number: null, name: "Avery McCray", grade: "4th & 5th", school: "Daniels Run", guardian: "rj.mccray@irs.gov", phone: "(318) 792-5330", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p38', number: null, name: "Levi McCray", grade: "2nd & 3rd", school: "Daniels Run", guardian: "rj.mccray@irs.gov", phone: "(318) 792-5330", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p39', number: null, name: "Aditya Menon", grade: "6th-8th", school: "Daniels Run Elementary", guardian: "binds29@gmail.com", phone: "(214)554-2004", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p40', number: null, name: "Isaac Nunes", grade: "4th & 5th", school: "oak view", guardian: "nunes8787@hotmail.com", phone: "(571) 621-2240", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p41', number: null, name: "Aiden Oh", grade: "2nd & 3rd", school: "Fairfax Villa elementary", guardian: "mike_oh1981@hotmail.co.kr", phone: "(703)899-5098", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p42', number: null, name: "Owen Pham", grade: "6th-8th", school: "Eagle View Elementary", guardian: "phamharvey@gmail.com", phone: "(757) 646-0336", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p43', number: null, name: "Oscar Potter", grade: "2nd & 3rd", school: "Daniel’s run", guardian: "liciaroberts@gmail.com", phone: "(571) 239-1370", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p44', number: null, name: "Quentin potter", grade: "6th-8th", school: "Daniel’s run", guardian: "liciaroberts@gmail.com", phone: "(571) 239-1370", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p45', number: null, name: "Adrian Prado", grade: "6th-8th", school: "Katherine Johnson Middle School", guardian: "twojagerbombs@gmail.com", phone: "(703)296-1607", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p46', number: null, name: "Benjamin Quinn", grade: "4th & 5th", school: "Oakton Elementary", guardian: "james.john.quinn@gmail.com", phone: "(201)951-2824", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p47', number: null, name: "Alonso Rivera", grade: "6th-8th", school: "Providence ES", guardian: "twojagerbombs@gmail.com", phone: "(703)296-1607", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p48', number: null, name: "Antonio Rivera", grade: "2nd & 3rd", school: "Katherine Johnson Middle School", guardian: "twojagerbombs@gmail.com", phone: "(703)296-1607", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p49', number: null, name: "Lucas Saal", grade: "4th & 5th", school: "Mantua", guardian: "b_saal@yahoo.com", phone: "(703) 609-4998", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p50', number: null, name: "Lucas RR Seal", grade: "2nd & 3rd", school: "Oakton ES", guardian: "seals_home@yahoo.com", phone: "(571)236-1351", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p51', number: null, name: "Thomas RR Seal", grade: "2nd & 3rd", school: "Oakton ES", guardian: "seals_home@yahoo.com", phone: "(571)236-1351", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p52', number: null, name: "Drea Seaton", grade: "6th-8th", school: "Providence", guardian: "deenarusso@mac.com", phone: "(240) 447-0602", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p53', number: null, name: "Rylen Shajib", grade: "2nd & 3rd", school: "eagle view", guardian: "milani.shajib@gmail.com", phone: "(240) 535-1318", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p54', number: null, name: "Jaxson Shajib", grade: "2nd & 3rd", school: "Eagle view", guardian: "milani.shajib@gmail.com", phone: "(240) 535-1318", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p55', number: null, name: "Hannah Swiercz", grade: "2nd & 3rd", school: "Mantua elem", guardian: "kelly.cage@gmail.com", phone: "(202) 425-3227", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p56', number: null, name: "Philip Tran", grade: "4th & 5th", school: "Daniels Run", guardian: "marwei.tam@gmail.com", phone: "(301) 806-0520", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p57', number: null, name: "Chase Vadakedathu", grade: "6th-8th", school: "Mantua Elementary", guardian: "linandcass@gmail.com", phone: "(508)556-0616", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p58', number: null, name: "Sarah Vadakedathu", grade: "6th-8th", school: "Mantua Elementary", guardian: "linandcass@gmail.com", phone: "(508)556-0616", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p59', number: null, name: "Kyrie Varela", grade: "4th & 5th", school: "Providence", guardian: "zelda.varela@gmail.com", phone: "(210) 286-1263", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p254', number: null, name: "Anna Arshad", grade: "4th & 5th", school: "Saint Leo the Great Catholic School", guardian: "l.richardson17@gmail.com", phone: "(202)718-7188", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p255', number: null, name: "David Sparling", grade: "4th & 5th", school: "Providence elementary", guardian: "yvonnemsparling@gmail.com", phone: "(703) 927-1062", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p256', number: null, name: "AARON Guison-Dowdy", grade: "4th & 5th", school: "Fairhill ES", guardian: "xai2k@hotmail.com", phone: "(703)280-0970", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p257', number: null, name: "Cru Tarugsa", grade: "2nd & 3rd", school: "Greenbriar West", guardian: "natee.tarugsa@gmail.com", phone: "(818) 388-9426", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p258', number: null, name: "Zach Ali", grade: "4th & 5th", school: "Willow Springs", guardian: "shaunali34@gmail.com", phone: "(703) 989-0847", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p259', number: null, name: "Dean Ali", grade: "4th & 5th", school: "Willow Springs", guardian: "shaunali34@gmail.com", phone: "(703) 989-0847", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p260', number: null, name: "Amen Emun", grade: "6th-8th", school: "Mosaic Elementary school", guardian: "hilawemun@gmail.com", phone: "(571)685-0566", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p261', number: null, name: "Taye Olibah", grade: "4th & 5th", school: "Willow Springs Elementary School", guardian: "bzolibah@gmail.com", phone: "(571) 214-1701", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p262', number: null, name: "James Schrecengost", grade: "4th & 5th", school: "Louise Archer Elementary", guardian: "rosengost.family@gmail.com", phone: "(202) 937-5119", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p263', number: null, name: "Jordan Schrecengost", grade: "2nd & 3rd", school: "Flint Hill Elementary", guardian: "rosengost.family@gmail.com", phone: "(202) 937-5119", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p264', number: null, name: "Linus Lee", grade: "4th & 5th", school: "Fairhill Elementary School", guardian: "kkiang@gmail.com", phone: "(970) 623-9363", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p265', number: null, name: "Luke Tran", grade: "4th & 5th", school: "Providence Elementary School", guardian: "dltran1216@gmail.com", phone: "(540) 797-4777", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p266', number: null, name: "Arantza Rivera Garcia", grade: "6th-8th", school: "Fairfax Villa", guardian: "ngarcia9680@hotmail.com", phone: "(703) 899-0013", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p267', number: null, name: "Anibal Rivera Garcia", grade: "6th-8th", school: "Fairfax Villa", guardian: "ngarcia9680@hotmail.com", phone: "(703) 899-0013", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p268', number: null, name: "Jack Van Wagner", grade: "4th & 5th", school: "Sunrise Valley ES", guardian: "dale.vanwagner@gmail.com", phone: "(215) 499-5165", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p60', number: null, name: "Rider Bohman", grade: "6th", school: "Daniels Run", guardian: "bohmanc@gmail.com", phone: "(571)606-7943", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '6th Boys Select B' },
  { id: 'p61', number: null, name: "Oliver Rodriguez", grade: "7th", school: "Daniels Run", guardian: "nancyrichman@gmail.com", phone: "(571) 388-6743", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p62', number: null, name: "Elias Nishanov", grade: "6th", school: "Fairfax HS, KJ MS", guardian: "dilya.pulatova@gmail.com", phone: "(202) 817-4036", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p63', number: null, name: "Zane MAsri", grade: "6th", school: "Oak View Elem", guardian: "wmasri@gmu.edu", phone: "(571) 470-3065", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p64', number: null, name: "Robert Stovall", grade: "8th", school: "Frost/Woodson", guardian: "ellen.sutey@gmail.com", phone: "7039693076", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p65', number: null, name: "Leonel Helmstutler", grade: "6th", school: "Providence ES", guardian: "s_yeganeh@hotmail.com", phone: "(703) 216-4235", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p66', number: null, name: "Kai Lowery", grade: "6th", school: "Daniels Run", guardian: "lowerykm@gmail.com", phone: "(703) 587-6556", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '6th Boys Select C' },
  { id: 'p67', number: null, name: "Sebastian Hanna", grade: "7th", school: "Fairfax HS", guardian: "hannatom15@gmail.com", phone: "(703) 268-8735", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p68', number: null, name: "Marshall Lee", grade: "7th", school: "Willow springs", guardian: "bannwang@gmail.com", phone: "(703) 801-7863", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p69', number: null, name: "Adrian Amartuvshin", grade: "6th", school: "Katherine Johnson MS", guardian: "oskoamartuvshin@gmail.com", phone: "(703) 389-3887", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '6th Boys Select C' },
  { id: 'p70', number: null, name: "Junu Yoo", grade: "7th", school: "Eagles ES", guardian: "ekchoi81@gmail.com", phone: "7037327785", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p71', number: null, name: "Sam Hartwich", grade: "6th", school: "Fairhill Elementary School", guardian: "gatrheel@gmail.com", phone: "(703) 516-0492", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p72', number: null, name: "Adam Hartwich", grade: "4th", school: "Fairhill Elementary School", guardian: "gatrheel@gmail.com", phone: "(703) 516-0492", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p73', number: null, name: "Charlotte Wallace", grade: "6th", school: "Katherine Johnson Middle", guardian: "wallace.k.omar@gmail.com", phone: "(301) 257-2923", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p74', number: null, name: "MARC OBANDO", grade: "8th", school: "Mantua ES", guardian: "meghendrickson@gmail.com", phone: "(703) 638-3998", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p75', number: null, name: "Jackson Seal", grade: "8th", school: "Fairview ES", guardian: "leslie.seal@fts-intl.com", phone: "(703) 744-0100", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p76', number: null, name: "Kai Douglas", grade: "6th", school: "Lee Corner", guardian: "natejdoug13@gmail.com", phone: "(562) 673-3773", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p77', number: null, name: "Nathaniel Anderson", grade: "6th", school: "Eagle View", guardian: "timjanderson7@gmail.com", phone: "(915) 474-8825", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p78', number: null, name: "Kinaan Phillips", grade: "6th", school: "Oak View elementary", guardian: "andrewsudan@yahoo.com.au", phone: "(571)587-9929", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p79', number: null, name: "Evan Kim", grade: "7th", school: "Rocky Run MS", guardian: "junkim1105@gmail.com", phone: "7033078305", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p80', number: null, name: "Ishan Natnithithadha", grade: "7th", school: "Daniels Run ES", guardian: "nnatnith@hotmail.com", phone: "2027468253", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p81', number: null, name: "Emerson Lee", grade: "5th", school: "Katherine Johnson", guardian: "lee.family.etc@gmail.com", phone: "(571) 730-8166", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p82', number: null, name: "Maddox Lee", grade: "7th", school: "Katherine Johnson", guardian: "lee.family.etc@gmail.com", phone: "(571) 730-8166", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p83', number: null, name: "Jeremiah Valts", grade: "8th", school: "Willow springs elementary", guardian: "samia3j@gmail.com", phone: "5712530372", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p84', number: null, name: "Abigail Barnhart", grade: "7th", school: "Frost", guardian: "parents@barnhart.family", phone: "(571) 488-3076", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p85', number: null, name: "JW Morgan", grade: "5th", school: "Providence Elementary", guardian: "justin.b.morgan@gmail.com", phone: "(240)925-6022", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p86', number: null, name: "Mercedes Burke", grade: "6th", school: "Providence", guardian: "cnsmith0725@gmail.com", phone: "(571)235-9389", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p87', number: null, name: "Eiman Hamidi", grade: "8th", school: "Colin Powell ES", guardian: "roya.o.hamid@gmail.com", phone: "(703) 740-6690", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p88', number: null, name: "David williams", grade: "8th", school: "Franklin Farm MD", guardian: "willangela78@gmail.com", phone: "(501)408-6159", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p89', number: null, name: "Milan Kanaan", grade: "7th", school: "Virginia Run Elementary", guardian: "ninapatel7@gmail.com", phone: "(773)677-2401", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p90', number: null, name: "Isaac Pearson", grade: "6th", school: "Providence ES", guardian: "justin.k.pearson@gmail.com", phone: "(703) 623-0738", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p91', number: null, name: "Olivia Clough", grade: "6th", school: "Williamsburg", guardian: "ginaclough@gmail.com", phone: "(703)915-1357", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p92', number: null, name: "Grant Sikorski", grade: "8th", school: "Willow Springs", guardian: "brian.j.sikorski@gmail.com", phone: "(703) 579-7862", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p93', number: null, name: "Maddox Drew", grade: "8th", school: "willow springs", guardian: "squeaky20@aol.com", phone: "(703)402-8985", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p94', number: null, name: "Joey Grandizio", grade: "6th", school: "Daniels Run", guardian: "lmgrandizio@verizon.net", phone: "(703)298-3413", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '6th Boys Select A' },
  { id: 'p95', number: null, name: "Kameron Singh", grade: "7th", school: "Colin Powell Elem", guardian: "singhkevinm@gmail.com", phone: "(703)869-0200", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p96', number: null, name: "Soliana Beyene", grade: "7th", school: "Frost", guardian: "helenkibrom1@yahoo.com", phone: "(703)395-1769", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p97', number: null, name: "Payton Cross", grade: "6th", school: "Liberty MS", guardian: "pocross23@gmail.com", phone: "5712832040", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p98', number: null, name: "Holden Lee", grade: "5th", school: "Fairfax Villa", guardian: "sanglee23@gmail.com", phone: "(301) 257-2368", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p99', number: null, name: "Joshua Bochert", grade: "5th", school: "Providence ES", guardian: "hsbochert@gmail.com", phone: "(703) 967-5679", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p100', number: null, name: "Bryce Hanlon", grade: "8th", school: "Willow Springs", guardian: "gayle.hanlon@gmail.com", phone: "2024414892", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p101', number: null, name: "Gabriel Alonso", grade: "8th", school: "Providence", guardian: "emilioalonso13@yahoo.com", phone: "(703) 731-6913", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p102', number: null, name: "Maxwell Menis", grade: "8th", school: "KATHERINE JOHNSON", guardian: "heathershawmenis@gmail.com", phone: "(301) 793-3399", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p103', number: null, name: "Sofia Ossenova-Singh", grade: "7th", school: "Franklin Farm", guardian: "asingh99@gmail.com", phone: "(703) 851-2129", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p104', number: null, name: "Mathew Lee", grade: "8th", school: "Liberty MS", guardian: "mky8282@hotmail.com", phone: "(213) 505-4881", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p105', number: null, name: "Emre Gallo", grade: "5th", school: "Terra Centre ES", guardian: "aylinsezmis1@gmail.com", phone: "(202) 379-6775", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p106', number: null, name: "Paresa Chongtrakul", grade: "6th", school: "Greenbriar east elementary school", guardian: "plesuda@hotmail.com", phone: "(571) 235-0642", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p107', number: null, name: "Dominic Shin", grade: "7th", school: "katherine johnson", guardian: "killersmile123@gmail.com", phone: "(858)761-5770", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p108', number: null, name: "London Yoo", grade: "7th", school: "Colin Powell", guardian: "keunyoo29@gmail.com", phone: "(703) 887-3034", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p109', number: null, name: "Kayla Kolar", grade: "7th", school: "Vienna elementary", guardian: "jkolar69@gmail.com", phone: "(703) 915-9231", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p110', number: null, name: "Dustin Lee", grade: "7th", school: "Rachel Carlson MS", guardian: "jlee1013@gmail.com", phone: "(703) 727-8274", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p111', number: null, name: "Anthony Head", grade: "5th", school: "Oak View", guardian: "brianjhead@gmail.com", phone: "2675468301", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p112', number: null, name: "Jason Ndukwe", grade: "7th", school: "Eagle view elementary", guardian: "irynaskids4@gmail.com", phone: "(571) 244-8216", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p113', number: null, name: "Lincoln Lee", grade: "7th", school: "Willow Springs ES", guardian: "michael.lee24@gmail.com", phone: "(703) 965-8104", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p114', number: null, name: "Avery Komaily", grade: "6th", school: "Oak View", guardian: "amykomaily@yahoo.com", phone: "(240) 498-5264", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p115', number: null, name: "Claire Bocian", grade: "6th", school: "Kathern Johnson Elementary", guardian: "alexandra.bocian@gmail.com", phone: "(202) 641-5259", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p116', number: null, name: "Ian Choi", grade: "8th", school: "Robinson MS", guardian: "philchoi1@gmail.com", phone: "(530) 848-7056", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p117', number: null, name: "Antony Bustamante", grade: "8th", school: "Fairfax HS", guardian: "kbustamante@cox.net", phone: "7037950345", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p118', number: null, name: "Riley Young", grade: "7th", school: "Daniels run", guardian: "casiea02@aol.com", phone: "(703)307-3839", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p119', number: null, name: "Ebenezer Esaias", grade: "8th", school: "Cooper Middle School", guardian: "tikdem0511@gmail.com", phone: "(240)688-2406", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p120', number: null, name: "Leia Lee", grade: "7th", school: "Shrevewood Elementary", guardian: "ml1herrell@gmail.com", phone: "(703) 867-0785", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p121', number: null, name: "Noelle Taylor", grade: "7th", school: "DANIELS RUN ES", guardian: "ciel.l.elizabeth@gmail.com", phone: "3023597780", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p122', number: null, name: "Logan McClevey", grade: "5th", school: "Fairfax Villa Elementary", guardian: "mccleveyfamily@gmail.com", phone: "(703) 338-5053", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p123', number: null, name: "Mary Alice Taylor", grade: "6th", school: "Fairfax Villa", guardian: "cstora@gmail.com", phone: "(703)919-4669", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p124', number: null, name: "Gram Paley", grade: "7th", school: "Katherine Johnson MS", guardian: "mgpaley@gmail.com", phone: "(571) 217-5836", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p125', number: null, name: "Vincent Velazco", grade: "6th", school: "Kings Glen ES", guardian: "rvela51@gmail.com", phone: "(703)338-6674", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p126', number: null, name: "Brady Schneider", grade: "5th", school: "Waples Mill Elementary", guardian: "schnet@gmail.com", phone: "(603) 809-2483", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p127', number: null, name: "Chase Yankosky", grade: "5th", school: "Mantua", guardian: "ljyankosky@gmail.com", phone: "(678)596-9576", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p128', number: null, name: "Brooks Yankosky", grade: "8th", school: "Frost", guardian: "lapolk@gmail.com", phone: "(404) 695-8780", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p129', number: null, name: "Christian Carter", grade: "6th", school: "Katherine Johnson Middle School", guardian: "bcarter1818@gmail.com", phone: "(202) 262-9769", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '6th Boys Select B' },
  { id: 'p130', number: null, name: "Oscar Manalansan", grade: "8th", school: "Willow Springs", guardian: "oscar-sharon@hotmail.com", phone: "(571)230-2883", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p131', number: null, name: "Chase Reinecke", grade: "8th", school: "St Leo the Great", guardian: "kevinreinecke@yahoo.com", phone: "(703) 507-1050", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p132', number: null, name: "Logan Saal", grade: "8th", school: "Mantua", guardian: "b_saal@yahoo.com", phone: "(703) 609-4994", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p133', number: null, name: "Devin Kenworthy", grade: "8th", school: "Daniels Run ES", guardian: "jenfrancioli@hotmail.com", phone: "(914) 589-7820", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p134', number: null, name: "Dane Mack", grade: "8th", school: "Frost", guardian: "kristopher.n.mack@gmail.com", phone: "(719) 930-2913", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p135', number: null, name: "Patrick Walsh", grade: "5th", school: "Waples Mill ES", guardian: "owenpwalsh@aol.com", phone: "(703)626-9392", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p136', number: null, name: "Morgan Ponzar", grade: "8th", school: "Liberty Middle School", guardian: "ponzarlaw@yahoo.com", phone: "(636) 577-1212", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p137', number: null, name: "Noah Clay", grade: "7th", school: "Mantua", guardian: "professor.clay@gmail.com", phone: "(312) 451-4795", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p138', number: null, name: "Joshua Plummer", grade: "8th", school: "Fairfax", guardian: "kevin.plummer@gmail.com", phone: "(540) 226-2105", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p139', number: null, name: "Olivia Johnson", grade: "7th", school: "Daniels Run", guardian: "jenwricsu@yahoo.com", phone: "(614) 266-3014", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p140', number: null, name: "Ellie Young", grade: "5th", school: "Daniels run", guardian: "casiea02@aol.com", phone: "(703) 307-3839", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p141', number: null, name: "Maddox Brown", grade: "5th", school: "Robinson", guardian: "gzne.brown@gmail.com", phone: "(770) 851-8470", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p142', number: null, name: "Maylee Bland", grade: "6th", school: "Canterbury Woods", guardian: "joibland@gmail.com", phone: "(704) 608-9162", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p143', number: null, name: "yusuf mohiuddin", grade: "8th", school: "Willow springs", guardian: "yusufrulesthesuns@gmail.com", phone: "(703) 899-4407", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p144', number: null, name: "Noah Chaudhry", grade: "7th", school: "Frost Middle School", guardian: "bilal.n.chaudhry@gmail.com", phone: "(703) 505-3703", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p145', number: null, name: "Genesis-Grace Mpeh", grade: "6th", school: "Daniels run", guardian: "cawadzi@verizon.net", phone: "(703) 565-8914", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p146', number: null, name: "Julia McGrath", grade: "5th", school: "Laurel Ridge Elemetary", guardian: "tyej3049@yahoo.com", phone: "5852306402", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p147', number: null, name: "Vicente Lopez Zawadzki", grade: "6th", school: "Waples Mill ES", guardian: "clopezvilardell@gmail.com", phone: "(415) 844-0244", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '6th Boys Select A' },
  { id: 'p148', number: null, name: "Rod A", grade: "7th", school: "Frost MS", guardian: "tammy1117@icloud.com", phone: "(703)419-0429", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p149', number: null, name: "Akash Adhikari", grade: "8th", school: "Katherine Johnson", guardian: "bishwosangit@gmail.com", phone: "7032686490", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p150', number: null, name: "Jack Agnew", grade: "7th", school: "Frost", guardian: "agnewjt4@hotmail.com", phone: "(703) 640-4849", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p151', number: null, name: "Bradley Banks", grade: "8th", school: "Oakton Elementary", guardian: "cwillisbanks@gmail.com", phone: "(703) 508-4708", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p152', number: null, name: "Landon McIntosh", grade: "5th", school: "Oakton ES", guardian: "ummcintosh@gmail.com", phone: "(703) 226-9368", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p153', number: null, name: "Luc Piguet", grade: "7th", school: "Frost Middle", guardian: "alexpiguet43@gmail.com", phone: "(571) 447-8095", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p154', number: null, name: "Noah Robel", grade: "4th", school: "Katherine Johnson", guardian: "robel.asheber@yahoo.com", phone: "(571)550-1777", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p155', number: null, name: "Gabriella Robel", grade: "6th", school: "Katherine JOhnson", guardian: "robel.asheber@yahoo.com", phone: "(571)550-1777", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p156', number: null, name: "Boaz Rowe", grade: "8th", school: "Rocky", guardian: "chargod2001@yahoo.com", phone: "(904)708-2693", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  // 5th Boys Select A roster (registered Sep 2026)
  { id: 'p269', number: null, name: "Jameson Lucas",  grade: "5th", school: "Mosaic Elementary",              guardian: "zoya.lucas@gmail.com",      phone: "(703) 347-1443", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select A' },
  { id: 'p270', number: null, name: "Andrew Donnelly", grade: "5th", school: "Providence",                     guardian: "mikedonnelly25@gmail.com",  phone: "(703) 728-5083", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select A' },
  { id: 'p271', number: null, name: "Adam Hartwich",  grade: "5th", school: "Fairhill Elementary School",      guardian: "gatrheel@gmail.com",        phone: "(919) 260-8350", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select A' },
  { id: 'p272', number: null, name: "Connor Meacham", grade: "5th", school: "Providence",                      guardian: "keithmeacham@gmail.com",    phone: "(571) 414-8707", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select A' },
  { id: 'p273', number: null, name: "Seva Singh",     grade: "5th", school: "Willow Springs",                  guardian: "meenooksingh@gmail.com",    phone: "(703) 389-3986", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select A' },
  { id: 'p274', number: null, name: "Luke Anderson",  grade: "5th", school: "Immanuel Christian",              guardian: "timjanderson7@gmail.com",   phone: "(915) 474-8825", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select A' },
  { id: 'p276', number: null, name: "Lawson Gutzler", grade: "5th", school: "Mosaic ES",                       guardian: "eb_law@yahoo.com",          phone: "(510) 847-7837", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select A' },
  { id: 'p277', number: null, name: "Hamza Ali",      grade: "5th", school: "Daniels Run",                     guardian: "syednabilali@gmail.com",    phone: "(703) 994-2211", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select B' },
  { id: 'p301', number: null, name: "Noah Lai",       grade: "5th", school: "Fairhill Elementary",             guardian: "jaalimusa07@gmail.com",     phone: "(571) 687-1158", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select A' },
  { id: 'p302', number: null, name: "Kaden Douglas",  grade: "5th", school: "Lees Corner",                     guardian: "erengpian@outlook.com",     phone: "(626) 485-5869", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select A' },
  // Winter 2026-27 Recreation (house league) players, from the registration export.
  // KG-4th grade 3v3 forms teams by skill/age (no draft) -- assigned straight to
  // 'K-3 3v3'. Everyone 3rd grade and up goes onto their age/gender team bucket
  // too (Rec has no A/B sub-teams like Select) -- evaluations + the draft balance
  // players within that roster, they don't move anyone to a different team.
  { id: 'p303', number: null, name: "Carlos Aguilar", grade: "3rd", school: "Daniels Run ES", guardian: "Herlinda Garcia", phone: "(571) 299-5006", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p304', number: null, name: "Bao An Pham", grade: "9th", school: "Oakton HS", guardian: "Quoc Bao Pham", phone: "(667)846-7386", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'HS Boys' },
  { id: 'p305', number: null, name: "Quoc An Pham", grade: "7th", school: "Thoreau MS", guardian: "Quoc Bao Pham", phone: "(667)846-7386", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p306', number: null, name: "Minh An Pham", grade: "4th", school: "Mosaic ES", guardian: "Quoc Bao Pham", phone: "(667)846-7386", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p307', number: null, name: "Rose Helmrick", grade: "2nd", school: "Providence Elementary", guardian: "Patricia Bailey", phone: "(503) 467-8049", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p308', number: null, name: "Savannah Bohman", grade: "4th", school: "Daniels Run", guardian: "Cassidy Bohman", phone: "(571) 606-7943", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Girls' },
  { id: 'p309', number: null, name: "Bowang Du", grade: "6th", school: "Oak View Elementary", guardian: "Yi Du", phone: "(573) 239-6467", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p310', number: null, name: "Tyler Burnette", grade: "K", school: "Waples Mill ES", guardian: "Brett Burnette", phone: "(571) 278-9927", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p311', number: null, name: "Dean Park", grade: "K", school: "White Oaks ES", guardian: "Eunice Park", phone: "(703)994-6642", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p312', number: null, name: "Azure McLaurin", grade: "4th", school: "Flint hill", guardian: "Timothy McLaurin", phone: "(703) 473-9410", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p313', number: null, name: "Cyan McLaurin", grade: "6th", school: "Flint hill", guardian: "Timothy McLaurin", phone: "(703) 473-9410", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p314', number: null, name: "Drea Seaton", grade: "Pre-K", school: "Fairfax Villa", guardian: "Deena Seaton", phone: "(240)447-0602", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p315', number: null, name: "Juliette McCrone", grade: "Pre-K", school: "Providence ES", guardian: "Stephanie McCrone", phone: "(703) 927-2234", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p316', number: null, name: "Hailey Zimmer", grade: "6th", school: "Greenbrier East", guardian: "Jay Zimmer", phone: "(703) 963-4979", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p317', number: null, name: "Mason Drummey", grade: "4th", school: "Daniels Run Elementary", guardian: "Saara Drummey", phone: "7033285143", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p318', number: null, name: "Jacob Freesmeier", grade: "K", school: "Oak View Elementary", guardian: "Natalie Freesmeier", phone: "(804) 389-1692", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p319', number: null, name: "Caleb Williams", grade: "6th", school: "Providence", guardian: "Diana Williams", phone: "(202) 718-2060", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p320', number: null, name: "Joshua Williams", grade: "4th", school: "Providence", guardian: "Diana Williams", phone: "(202) 718-2060", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p321', number: null, name: "Theodore Ho", grade: "Pre-K", school: "Providence ES", guardian: "Phuong Mai", phone: "(571) 527-9660", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p322', number: null, name: "Jonah Jackson", grade: "7th", school: "Johnson Middle School", guardian: "Alisha Jackson", phone: "(949) 333-9535", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p323', number: null, name: "Owen Riley", grade: "5th", school: "Providence", guardian: "Taylor Riley", phone: "(563) 564-9379", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p324', number: null, name: "James Van De Ven", grade: "2nd", school: "Homeschool", guardian: "Susan Van De Ven", phone: "(765)617-7893", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p325', number: null, name: "Alex Handy", grade: "8th", school: "Frost", guardian: "Lori Wang", phone: "(201) 320-3625", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p326', number: null, name: "Robert Tilman", grade: "2nd", school: "Daniels Run", guardian: "Laura Tilman", phone: "(703) 967-0405", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p327', number: null, name: "Lorenz Ringo", grade: "8th", school: "Katherine johnson", guardian: "Brett Ringo", phone: "(860) 593-9902", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p328', number: null, name: "Armond Ringo", grade: "8th", school: "Katherine Johnson", guardian: "Brett Ringo", phone: "(860) 593-9902", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p329', number: null, name: "Claire Brown", grade: "6th", school: "Daniels run", guardian: "Sherry Brown", phone: "(571) 426-5175", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p330', number: null, name: "Maya Brown", grade: "Pre-K", school: "Daniels run", guardian: "Sherry Brown", phone: "(571) 426-5175", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p331', number: null, name: "Mekail Hassan", grade: "Pre-K", school: "Katherine Johnson", guardian: "Kiran Burney", phone: "(571) 373-9038", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p332', number: null, name: "Mason Roh", grade: "8th", school: "Frost MS", guardian: "Jihye Kim", phone: "(512) 626-7287", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p333', number: null, name: "Harper Schiavone", grade: "5th", school: "Fairfax Villa", guardian: "Tong Li", phone: "(571) 265-4621", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p334', number: null, name: "Cameron Sorensen", grade: "5th", school: "Fairfax Villa", guardian: "Maria Carmela Sorensen", phone: "(703) 371-4472", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p335', number: null, name: "Anibal Rivera Garcia", grade: "8th", school: "frost middle school", guardian: "Nuria Garcia", phone: "(703) 899-0013", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p336', number: null, name: "Arantza Rivera Garcia", grade: "6th", school: "fairfax villa", guardian: "Nuria Garcia", phone: "(703) 899-0013", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p337', number: null, name: "Kinsley Harrington", grade: "Pre-K", school: "Oak View ES", guardian: "Sean Harrington", phone: "(781) 608-9678", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p338', number: null, name: "Teagan Harrington", grade: "Pre-K", school: "Oak View ES", guardian: "Sean Harrington", phone: "(781) 608-9678", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Girls' },
  { id: 'p339', number: null, name: "Farah Ahmadi", grade: "5th", school: "Daniels Run", guardian: "Marisa Alonso", phone: "(703) 863-1055", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p340', number: null, name: "Colton Campbell", grade: "K", school: "Fairfax Villa", guardian: "Rachel Campbell", phone: "(301)943-3047", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p341', number: null, name: "Emerson Harvey", grade: "7th", school: "Katherine Johnson MS", guardian: "Jeni Harvey", phone: "(703) 346-1194", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p342', number: null, name: "Ryan Harvey", grade: "5th", school: "Daniels Run ES", guardian: "Jeni Harvey", phone: "(703) 346-1194", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p343', number: null, name: "Tyler Khuon", grade: "7th", school: "Katherine Johnson MS", guardian: "Po Khuon", phone: "(571) 594-0175", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p344', number: null, name: "Chloe Khuon", grade: "8th", school: "Katherine Johnson MS", guardian: "Po Khuon", phone: "(571) 594-0175", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p345', number: null, name: "Thanh-Tam Nguyen", grade: "5th", school: "Orange Hunt Elementary", guardian: "Phu Nguyen", phone: "(703) 870-8432", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p346', number: null, name: "Dylan Chacaltana", grade: "4th", school: "Daniel's Run Elementary", guardian: "Marlon Chacaltana", phone: "(703) 220-9089", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p347', number: null, name: "Charlotte Jacobs", grade: "5th", school: "Daniels Run ES", guardian: "Nicole Jacobs", phone: "(303) 941-1904", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p348', number: null, name: "Harper Jacobs", grade: "7th", school: "K. Johnson MS", guardian: "Nicole Jacobs", phone: "(303) 941-1904", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p349', number: null, name: "Joshua Schuhlein", grade: "7th", school: "Thoreau MS", guardian: "David Schuhlein", phone: "(202) 570-3445", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p350', number: null, name: "Rosaline Han", grade: "5th", school: "Daniels run elementary", guardian: "Ki Han", phone: "(301) 704-9358", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p351', number: null, name: "Matthias Teferra", grade: "5th", school: "Camelot ES", guardian: "Matthias Teferra", phone: "(703) 595-5298", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p352', number: null, name: "Logan Gibson", grade: "1st", school: "Providence ES", guardian: "Annah Gibson", phone: "(703) 439-0699", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p353', number: null, name: "Jay Ahn", grade: "8th", school: "Katherine Johnson middle school", guardian: "Jin Ahn", phone: "7035777979", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p354', number: null, name: "Sofia Bhakta", grade: "7th", school: "Nysmith School", guardian: "Sonal Jagasia", phone: "(317) 730-4617", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p355', number: null, name: "Sana Magoon", grade: "7th", school: "Nysmith", guardian: "Sumeet Magoon", phone: "5717588205", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p356', number: null, name: "Elena Wilkins", grade: "3rd", school: "Fairfax Villa Elementary", guardian: "Benjamin Wilkins", phone: "(540) 458-1331", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Girls' },
  { id: 'p357', number: null, name: "Owen Wilkins", grade: "6th", school: "Fairfax Villa Elementary", guardian: "Benjamin Wilkins", phone: "(540) 458-1331", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p358', number: null, name: "Levi McCray", grade: "3rd", school: "Franconia Elementary", guardian: "LaToya Johnson", phone: "(434)594-5252", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p359', number: null, name: "Avery McCray", grade: "6th", school: "Franconia Elementary", guardian: "LaToya Johnson", phone: "(434)594-5252", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p360', number: null, name: "Rhys McKennon-Kelly", grade: "4th", school: "Forestdale Elementary", guardian: "Kate McKennon-Kelly", phone: "(979)574-9671", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p361', number: null, name: "Andrew Baugher", grade: "1st", school: "Mantua Elementary", guardian: "Joshua Baugher", phone: "7037278183", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p362', number: null, name: "Mj Saul", grade: "1st", school: "Mantua Elementary", guardian: "Kathleen Saul", phone: "(571) 228-5513", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p363', number: null, name: "Leo Marsh", grade: "1st", school: "Fairfax Villa Elementary School", guardian: "Daniel Marsh", phone: "(703) 517-4464", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p364', number: null, name: "Daisy Marsh", grade: "4th", school: "Fairfax Villa Elementary School", guardian: "Daniel Marsh", phone: "(703) 517-4464", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Girls' },
  { id: 'p365', number: null, name: "Leandro Suarez", grade: "9th", school: "Centreville HS", guardian: "Ingrid Suarez", phone: "(571) 426-3758", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'HS Boys' },
  { id: 'p366', number: null, name: "Jase Xhakolli", grade: "5th", school: "Daniels Run", guardian: "Angela Xhakolli", phone: "(202)253-8480", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p367', number: null, name: "Payton Burke", grade: "Pre-K", school: "Fairfax Villa", guardian: "Gavin Burke", phone: "(630)664-3958", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p368', number: null, name: "Colby Burke", grade: "Pre-K", school: "Fairfax Villa", guardian: "Gavin Burke", phone: "(630)664-3958", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p369', number: null, name: "Shawn Carter", grade: "3rd", school: "Providence", guardian: "Kristle Carter", phone: "(702) 596-1208", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p370', number: null, name: "Christopher Carter", grade: "5th", school: "Providence", guardian: "Kristle Carter", phone: "(702) 596-1208", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p371', number: null, name: "Grant DeDona", grade: "4th", school: "Flint Hill School", guardian: "Veronica DeDona", phone: "(301) 758-1929", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p372', number: null, name: "Joseph Grosso", grade: "2nd", school: "Providence Elem", guardian: "Jamie Grosso", phone: "(703) 909-5120", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p373', number: null, name: "Elisabeth Han", grade: "4th", school: "Willow Springs Elementary", guardian: "Michael Han", phone: "(703) 470-0320", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Girls' },
  { id: 'p374', number: null, name: "Samuel Han", grade: "9th", school: "Fairfax High", guardian: "Michael Han", phone: "(703) 470-0320", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'HS Boys' },
  { id: 'p375', number: null, name: "Caleb Collier", grade: "1st", school: "Providence", guardian: "Mary Collier", phone: "(571) 239-1811", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p376', number: null, name: "Penelope Herrington", grade: "4th", school: "Oak View Elementary", guardian: "Reagan Herrington", phone: "(813) 340-3673", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Girls' },
  { id: 'p377', number: null, name: "Paxton Goldberger", grade: "2nd", school: "Providence ES", guardian: "Tracey Goldberger", phone: "(703) 966-4124", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p378', number: null, name: "Natalia Dick", grade: "6th", school: "Laurel Ridge", guardian: "Ian Dick", phone: "(614) 783-4186", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p379', number: null, name: "Rafael Dick", grade: "3rd", school: "Laurel Ridge", guardian: "Ian Dick", phone: "(614) 783-4186", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p380', number: null, name: "Puttajak Ratanasuban", grade: "10th", school: "Oakton High SChool", guardian: "Siraphop Ratanasuban", phone: "(657) 257-9144", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'HS Boys' },
  { id: 'p381', number: null, name: "Max Mercado", grade: "10th", school: "Fairfax HS", guardian: "Humberto Mercado", phone: "(571) 331-7363", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'HS Boys' },
  { id: 'p382', number: null, name: "Luke Tran", grade: "4th", school: "PROVIDENCE ES", guardian: "Julie Pham", phone: "(540) 797-4777", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p383', number: null, name: "Oscar Potter", grade: "2nd", school: "Daniels Run Elem", guardian: "Elicia Potter", phone: "(571) 239-1370", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p384', number: null, name: "Siena Zamyatin", grade: "5th", school: "Mosaic Elementary", guardian: "Megan Zamyatin", phone: "(515) 450-2558", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p385', number: null, name: "Maddox Fulmer", grade: "3rd", school: "Willow Springs Elementary", guardian: "Greg Fulmer", phone: "(703) 801-7694", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p386', number: null, name: "Raina Manoharan", grade: "7th", school: "Kjms", guardian: "Anup Manoharan", phone: "(248) 302-4123", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p387', number: null, name: "Ethan Chau", grade: "7th", school: "Katherine Johnson", guardian: "Denise Vu", phone: "(571) 359-0330", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p388', number: null, name: "Evan Chau", grade: "Pre-K", school: "Providence Elementary", guardian: "Denise Vu", phone: "(571) 359-0330", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p389', number: null, name: "Cora Lee", grade: "1st", school: "Oakview Elementary School", guardian: "Esther Lee", phone: "(510) 368-5464", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p390', number: null, name: "Alden Schmidt", grade: "1st", school: "MSNV Hillbrook", guardian: "Sarah Schmidt", phone: "(302) 530-7939", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p391', number: null, name: "Andrew Schmidt", grade: "3rd", school: "MSNV Hillbrook", guardian: "Sarah Schmidt", phone: "(302) 530-7939", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p392', number: null, name: "Ammon Kofford", grade: "6th", school: "Providence Elementary", guardian: "Yvette Kofford", phone: "(703) 870-6083", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p393', number: null, name: "Anika Savdharia", grade: "Pre-K", school: "Katharine Johnson Middle School", guardian: "Kunal Savdharia", phone: "(703) 870-4493", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p394', number: null, name: "Aiden Oh", grade: "3rd", school: "Fairfax villa", guardian: "Mike Oh", phone: "(703) 899-5098", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p395', number: null, name: "Abby Cook", grade: "7th", school: "Oak View", guardian: "Dan Cook", phone: "(240) 813-5457", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p396', number: null, name: "Cullen Shanahan", grade: "8th", school: "Robinson", guardian: "Stephanie Shanahan", phone: "(360) 672-4077", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p397', number: null, name: "Charles Watts", grade: "7th", school: "St Leo the Great", guardian: "Kalyna Watts", phone: "(703)944-4982", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p398', number: null, name: "Nathaniel Roettger", grade: "6th", school: "Providence Elementary", guardian: "Stuart Roettger", phone: "(540) 287-4703", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p399', number: null, name: "Sophia Zhang", grade: "3rd", school: "willows springs elementary school", guardian: "Qinglong Zhang", phone: "(703) 678-6859", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Girls' },
  { id: 'p400', number: null, name: "Mason Methot", grade: "2nd", school: "Daniels run", guardian: "Jennifer Methot", phone: "(305) 441-7117", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p401', number: null, name: "Vivian Methot", grade: "5th", school: "Daniels run", guardian: "Jennifer Methot", phone: "(305) 441-7117", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p402', number: null, name: "Aidan Green", grade: "2nd", school: "Mosaic Elementary", guardian: "Kimberly Burns", phone: "(228)424-6369", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p403', number: null, name: "Derrick Booker jr", grade: "8th", school: "Robinson Secondary", guardian: "Devita Booker", phone: "(610) 564-3757", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p404', number: null, name: "Robert Martin", grade: "Pre-K", school: "Flint Hill School", guardian: "Courtney Martin", phone: "(703)795-1791", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p405', number: null, name: "Micah Lam", grade: "1st", school: "Old Creek", guardian: "Kenneth Lam", phone: "(925)817-7097", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p406', number: null, name: "Kara Lam", grade: "2nd", school: "Olde Creek", guardian: "Kenneth Lam", phone: "(925)817-7097", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p407', number: null, name: "Kenson Lee", grade: "6th", school: "Oakview elementary", guardian: "Beth Miller", phone: "(703) 474-5573", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p408', number: null, name: "Grason Johnson", grade: "3rd", school: "Fairfax Villa Elementary", guardian: "Valencia Johnson", phone: "(803) 427-5109", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p409', number: null, name: "Isla Pershing", grade: "3rd", school: "Fairfax Villa Elementary", guardian: "Andrew Pershing", phone: "(703) 216-0497", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Girls' },
  { id: 'p410', number: null, name: "Dastan Kazemi", grade: "5th", school: "Providence", guardian: "Debra Kazemi", phone: "(703)624-0488", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p411', number: null, name: "Oyut-Od Bilguun", grade: "7th", school: "KJMS", guardian: "Ben Ari", phone: "(703) 814-0848", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p412', number: null, name: "Saruul-Od Bilguun", grade: "4th", school: "WSES", guardian: "Ben Ari", phone: "(703) 814-0848", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p413', number: null, name: "Khuslen-Od Bilguun", grade: "9th", school: "FHS", guardian: "Ben Ari", phone: "(703) 814-0848", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'HS Boys' },
  { id: 'p414', number: null, name: "Alana Hogan", grade: "8th", school: "Thoreau Middle School", guardian: "Elizabeth Cordon", phone: "(860) 918-8714", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p415', number: null, name: "Victoria Sarac", grade: "5th", school: "Willow Springs Elementary School", guardian: "Victoria Sarac", phone: "(703) 625-1159", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p416', number: null, name: "Lena Continetti", grade: "5th", school: "Willow Springs", guardian: "Laura Continetti", phone: "(703) 447-5234", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p417', number: null, name: "Mohamed Moustafa", grade: "4th", school: "Providence Elementary School", guardian: "Nancy Moustafa", phone: "(202) 386-2229", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p418', number: null, name: "Leo Huang", grade: "9th", school: "Fairfax High School", guardian: "Sammie Lin", phone: "(443) 562-7057", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'HS Boys' },
  { id: 'p419', number: null, name: "Logan Valvis", grade: "4th", school: "Daniels Run Elementary School", guardian: "Alex Valvis", phone: "(973) 968-1900", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p420', number: null, name: "Audrey Lee", grade: "4th", school: "Willow Springs", guardian: "Mai Lan Lee", phone: "(703) 801-3079", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p421', number: null, name: "Ellie Sharma", grade: "4th", school: "Willow Springs", guardian: "Dan Sharma", phone: "(703) 376-7030", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p422', number: null, name: "Eleanor O'Loughlin", grade: "2nd", school: "Daniels Run", guardian: "Courtney O'Loughlin", phone: "(508) 954-6869", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p423', number: null, name: "Matteo Finocchiaro", grade: "2nd", school: "DRES", guardian: "Gulmira Z", phone: "(202) 812-9491", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p424', number: null, name: "Florence Foster", grade: "5th", school: "Providence Elementary", guardian: "Catherine Foster", phone: "(510) 847-8562", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p425', number: null, name: "Kai Soloski", grade: "3rd", school: "Westlawn Elementary", guardian: "Joyce Wang", phone: "(734)757-3156", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p426', number: null, name: "Quinton Kenworthy", grade: "11th", school: "Fairfax HS", guardian: "Jennifer Kenworthy", phone: "(914) 589-7820", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'HS Boys' },
  { id: 'p427', number: null, name: "Easton (C)** Achee", grade: "K", school: "Providence Elementary", guardian: "Stevie Achee", phone: "(614)736-7771", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p428', number: null, name: "Paresa Chongtrakul", grade: "7th", school: "KJMS", guardian: "Suda Vachiratamporn", phone: "(571) 235-0642", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p429', number: null, name: "Sean Cleary", grade: "7th", school: "Frost Middle School", guardian: "Joanna Cleary", phone: "(703) 795-2723", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p430', number: null, name: "Jaxson Luong", grade: "7th", school: "Frost Middle School", guardian: "P L", phone: "(571) 242-6770", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p431', number: null, name: "Sean Wu", grade: "9th", school: "Carter G. Woodson HS", guardian: "Yinghong Wu", phone: "(703) 887-9681", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'HS Boys' },
  { id: 'p432', number: null, name: "William Hermreck", grade: "9th", school: "Woodson High School", guardian: "Dennis Hermreck", phone: "(571)389-2533", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'HS Boys' },
  { id: 'p433', number: null, name: "Henry Hermreck", grade: "6th", school: "Mantua Elementary", guardian: "Dennis Hermreck", phone: "(571)389-2533", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p434', number: null, name: "Ava Galik", grade: "1st", school: "St Veronica", guardian: "Chris Galik", phone: "(703)304-2638", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p435', number: null, name: "William Harris", grade: "7th", school: "KJ middle school", guardian: "Frank Harris", phone: "(703) 582-7495", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p436', number: null, name: "Athena Westcrews", grade: "5th", school: "Daniels run elementary school", guardian: "Casey Westcrews", phone: "(703)505-4129", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p437', number: null, name: "Nolan Kundu", grade: "2nd", school: "Fairfax Villa Elementary School", guardian: "Dorothy Kundu", phone: "(703) 867-8274", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p438', number: null, name: "Zayd Ali", grade: "K", school: "Daniel’s Run", guardian: "Nabil Ali", phone: "(703) 994-2211", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p439', number: null, name: "Krisha Kulkarni", grade: "5th", school: "Willow spring elementary", guardian: "Sumaharsha Yelamanchi", phone: "(202) 640-8444", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p440', number: null, name: "Aiden Qualters", grade: "7th", school: "Frost", guardian: "James Qualters", phone: "(703) 216-0925", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p441', number: null, name: "Phoenix Jenkins", grade: "K", school: "Daniel Run", guardian: "Eduwell Jenkins", phone: "8082285386", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p442', number: null, name: "Hannah Haynie", grade: "5th", school: "Willow Springs", guardian: "Sarah Haynie", phone: "(202) 246-8230", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p443', number: null, name: "Mike DeSimone", grade: "7th", school: "Frost", guardian: "Christopher DeSimone", phone: "(703) 896-0601", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p444', number: null, name: "Charleigh Brixius", grade: "4th", school: "Daniels Run Elementary", guardian: "James Brixius", phone: "(703) 965-2650", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Girls' },
  { id: 'p445', number: null, name: "Ryleigh Brixius", grade: "7th", school: "Katherine Johnson Middle School", guardian: "James Brixius", phone: "(703) 965-2650", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p446', number: null, name: "Meghan Harris", grade: "Pre-K", school: "Daniels Run", guardian: "Frank Harris", phone: "(703) 582-7495", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Girls' },
  { id: 'p447', number: null, name: "Sydney Lipp", grade: "6th", school: "Daniels run elementary", guardian: "Kathryn Lipp", phone: "(703) 966-2447", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p448', number: null, name: "Tristan Baker", grade: "4th", school: "Daniel’s run", guardian: "Ross Baker", phone: "(413) 575-1501", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p449', number: null, name: "Claire Baker", grade: "7th", school: "Daniel’s run", guardian: "Ross Baker", phone: "(413) 575-1501", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p450', number: null, name: "Alejandro Chavez", grade: "3rd", school: "Willow Springs", guardian: "Adela Chavez", phone: "(301) 704-4543", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p451', number: null, name: "Kristina Bobis", grade: "6th", school: "Providence Elementary School", guardian: "Queenee Bobis", phone: "(571)201-7658", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p452', number: null, name: "Nathan Diamond", grade: "1st", school: "Providence ES", guardian: "Steven Diamond", phone: "(301) 537-5535", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p453', number: null, name: "Maximos Stellatos", grade: "7th", school: "Frost", guardian: "Allison Stellatos", phone: "(571) 243-9451", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p454', number: null, name: "Christopher Mazur", grade: "7th", school: "Frost MS", guardian: "Chrissy Mazur", phone: "(703) 409-7923", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p455', number: null, name: "William Rouhier", grade: "7th", school: "Frost", guardian: "Megan Rouhier", phone: "(443)562-8502", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p456', number: null, name: "Dylan Hollerieth", grade: "7th", school: "Frost middle school", guardian: "Neena Hollerieth", phone: "(703) 200-7706", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p457', number: null, name: "Christian Schulte", grade: "7th", school: "Frost", guardian: "Nicole Schulte", phone: "(309) 210-1595", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p458', number: null, name: "Santiago Rosand", grade: "Pre-K", school: "Frost MS", guardian: "Jorge Rosand", phone: "(571) 213-9901", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p459', number: null, name: "Anthony Shin", grade: "5th", school: "Fairfax Villa ES", guardian: "Tammy Lee", phone: "(858) 761-5770", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p460', number: null, name: "Owen Pham", grade: "7th", school: "Katherine Johnson Middle", guardian: "Harvey Pham", phone: "(757) 646-0336", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p461', number: null, name: "Kai Gofhamodimo", grade: "4th", school: "Fairfax villa", guardian: "Jaime Knight", phone: "(703) 867-6496", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p462', number: null, name: "Quinn Gofhamodimo", grade: "1st", school: "Fairfax Villa", guardian: "Jaime Knight", phone: "(703) 867-6496", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p463', number: null, name: "Riley Hill", grade: "K", school: "St. Leos", guardian: "Riley Hill", phone: "(703)963-0460", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p464', number: null, name: "Abu Bakr Lodin", grade: "4th", school: "Fairfax Villa Elementary School", guardian: "Shukriah Darab", phone: "(571) 318-7536", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p465', number: null, name: "George Cronberger", grade: "2nd", school: "Olde Creek Elementary", guardian: "Laura Cronberger", phone: "(248) 506-5014", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p466', number: null, name: "Owen Marion", grade: "Pre-K", school: "Willow Springs Elementary", guardian: "Ashley Marion", phone: "(240) 654-7293", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p467', number: null, name: "Jackson Kim", grade: "2nd", school: "Willow Springs", guardian: "Jane Lee", phone: "(703)244-8056", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p468', number: null, name: "Flynn Moody", grade: "8th", school: "Frost Middle School", guardian: "Brett Moody", phone: "(703)967-8203", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p469', number: null, name: "Luke Owen", grade: "Pre-K", school: "Providence", guardian: "Nathalie Owen", phone: "4157206315", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p470', number: null, name: "Jude Baer", grade: "1st", school: "Trinity Christian", guardian: "John Baer", phone: "(317)946-9942", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p471', number: null, name: "Avni Raikar", grade: "5th", school: "Willow Springs ES", guardian: "Sonya Raikar", phone: "(716) 417-1447", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p472', number: null, name: "Bree Dhakal", grade: "1st", school: "Fairhill Elementary", guardian: "Prashamsa Neupane Dhakal", phone: "(580)302-2357", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p473', number: null, name: "Bryce Dhakal", grade: "2nd", school: "Fairhill Elementary", guardian: "Prashamsa Neupane Dhakal", phone: "(580)302-2357", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p474', number: null, name: "John Pershing", grade: "1st", school: "Fairfax Villa Elementary", guardian: "Andrew Pershing", phone: "(703) 216-0497", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p475', number: null, name: "Abdullah Muslim", grade: "10th", school: "Oakton High School", guardian: "Mohammed Muslim", phone: "(571) 242-1641", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'HS Boys' },
  { id: 'p476', number: null, name: "Tenzin Rapden", grade: "3rd", school: "Oakton Elementary School", guardian: "Rapden P", phone: "(505) 603-6243", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p477', number: null, name: "Sonam Rapden", grade: "1st", school: "Oakton Elementary School", guardian: "Rapden P", phone: "(505) 603-6243", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p478', number: null, name: "Evan Veigel", grade: "10th", school: "Woodson High School", guardian: "Lisa Veigel", phone: "(202) 425-4041", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'HS Boys' },
  { id: 'p479', number: null, name: "Zach Ali", grade: "2nd", school: "Al Fatih Academy", guardian: "Shaun Ali", phone: "(703) 989-0847", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p480', number: null, name: "Ramsey Ali", grade: "Pre-K", school: "Al Fatih Academy", guardian: "Shaun Ali", phone: "(703) 989-0847", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p481', number: null, name: "Luke Habibi", grade: "1st", school: "Providence", guardian: "Sarah Habibi", phone: "(703) 725-4314", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p482', number: null, name: "Evelyn Boyd", grade: "Pre-K", school: "Fairfax Villa", guardian: "Steve Boyd", phone: "(703) 969-0646", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p483', number: null, name: "Liam Wie", grade: "3rd", school: "mosaic", guardian: "Brian Wie", phone: "(602) 909-0131", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p484', number: null, name: "Jack Steel", grade: "Pre-K", school: "Willow Springs", guardian: "Adam Steel", phone: "(304) 638-2984", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p485', number: null, name: "Michael Sharkey", grade: "3rd", school: "Daniels Run", guardian: "Sidney Sharkey", phone: "(419) 349-7783", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p486', number: null, name: "Dominic Sharkey", grade: "K", school: "Daniels Run", guardian: "Sidney Sharkey", phone: "(419) 349-7783", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p487', number: null, name: "Long Huynh", grade: "5th", school: "Hunters Woods ES", guardian: "Bao Huynh", phone: "(571) 361-0067", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p488', number: null, name: "Kate Spradlin", grade: "6th", school: "Fairfax Villa Elementary", guardian: "Brett Spradlin", phone: "(703) 901-0470", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p489', number: null, name: "Isabella Chavez", grade: "5th", school: "Willow Springs", guardian: "Adela Chavez", phone: "(301) 704-4543", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p490', number: null, name: "Davis Wotring", grade: "4th", school: "Mosaic Elementary", guardian: "Amy Wotring", phone: "(571) 286-9340", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p491', number: null, name: "Jw Morgan", grade: "6th", school: "Providence", guardian: "Justin Morgan", phone: "(240) 925-6022", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p492', number: null, name: "Hayden Townes", grade: "4th", school: "Willow springs.", guardian: "Steven Townes", phone: "(919) 539-2982", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p493', number: null, name: "Nathan Jones", grade: "6th", school: "St Leo the Great", guardian: "Bharathi Jones", phone: "(703) 216-2728", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p494', number: null, name: "Naya Patel", grade: "6th", school: "Fairfax Villa Elementary", guardian: "Avani Patel", phone: "(717) 903-6028", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p495', number: null, name: "Neel Patel", grade: "4th", school: "Fairfax villa elementary", guardian: "Avani Patel", phone: "(717) 903-6028", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p496', number: null, name: "Caleb Sands", grade: "7th", school: "KJ", guardian: "Mary Sands", phone: "(216) 408-9227", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p497', number: null, name: "Maren Sands", grade: "3rd", school: "Daniels Run", guardian: "Mary Sands", phone: "(216) 408-9227", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p498', number: null, name: "Barrett Marks", grade: "Pre-K", school: "Flint Hill Elementary", guardian: "Jackie Kelly", phone: "(703) 850-6873", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p499', number: null, name: "Mary clare Hanley", grade: "3rd", school: "Holy Spirit catholic school", guardian: "Jim Hanley", phone: "(585)414-2934", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Girls' },
  { id: 'p500', number: null, name: "Liam Adams", grade: "6th", school: "Daniels run", guardian: "Carolyn Adams", phone: "8325735840", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p501', number: null, name: "Edwin Salerno", grade: "3rd", school: "Montessori School of Oakton", guardian: "Patty Salerno", phone: "(703) 627-7849", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p502', number: null, name: "Valerie Salerno", grade: "5th", school: "Montessori School of Oakton", guardian: "Patty Salerno", phone: "(703) 627-7849", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p503', number: null, name: "Liam Poe", grade: "3rd", school: "Marshall Road Elementary", guardian: "Chris Poe", phone: "7033472954", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p504', number: null, name: "Emmett Yoon", grade: "Pre-K", school: "Olde Creek", guardian: "Joseph Yoon", phone: "(703) 629-5228", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p505', number: null, name: "Hudson Valvis", grade: "1st", school: "Daniel's Run", guardian: "Alex Valvis", phone: "(973) 968-1900", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p506', number: null, name: "Jonah Harris", grade: "7th", school: "Frost MS", guardian: "Stacey Harris", phone: "(703) 304-7568", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p507', number: null, name: "Olivia Graf", grade: "2nd", school: "St. Leo the Great", guardian: "Brittany Graf", phone: "(724) 875-9869", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p508', number: null, name: "Jason Pham", grade: "6th", school: "Oak View Elem", guardian: "Thao Le", phone: "(571) 358-0718", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p509', number: null, name: "Liam Stone", grade: "1st", school: "Providence Elementary", guardian: "Katie Stone", phone: "(815) 979-4543", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p510', number: null, name: "Gurnav Singh Kanyal", grade: "3rd", school: "Oakton Elementary", guardian: "Umesh Kanyal", phone: "(571)666-2757", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p511', number: null, name: "Mia Hankin", grade: "3rd", school: "Union Mill", guardian: "Michele Benevento", phone: "(571) 334-6629", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Girls' },
  { id: 'p512', number: null, name: "Benjamin Pyon", grade: "1st", school: "Mosaic ES", guardian: "Valerie Pyon", phone: "(804) 306-2311", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p513', number: null, name: "Matthew Hankin", grade: "Pre-K", school: "Union mill", guardian: "Michele Benevento", phone: "(571) 334-6629", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p514', number: null, name: "Lex Christopher", grade: "3rd", school: "Providence", guardian: "Matthew Christopher", phone: "(703) 223-6916", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p515', number: null, name: "Jackson Mazer", grade: "3rd", school: "Fairfax Villa", guardian: "Kimberly Mazer", phone: "(808) 321-7025", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p516', number: null, name: "Madeline Lo", grade: "7th", school: "Frost", guardian: "Sarah Lo", phone: "(540) 383-8548", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p517', number: null, name: "Elias Buendia", grade: "6th", school: "Mosaic Elementary", guardian: "Chris Buendia", phone: "(703) 731-3195", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p518', number: null, name: "Kaito Springer", grade: "2nd", school: "Oakton Elementary", guardian: "Yoko Springer", phone: "(917) 702-8504", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p519', number: null, name: "Aleena Ghazali", grade: "7th", school: "Rachel Carson Middle", guardian: "Hammad Ghazali", phone: "(313)701-9206", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p520', number: null, name: "Jax Gordon", grade: "6th", school: "Fairfax Villa Elementary", guardian: "Chris Gordon", phone: "(571) 215-7988", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p521', number: null, name: "Ava Gordon", grade: "4th", school: "Fairfax Villa Elementary", guardian: "Chris Gordon", phone: "(571) 215-7988", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Girls' },
  { id: 'p522', number: null, name: "Skyla Winslow", grade: "8th", school: "Johnson Middle", guardian: "Sean Winslow", phone: "(609) 351-4766", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p523', number: null, name: "Atticus Woody", grade: "4th", school: "Daniels Run ES", guardian: "Josh Alber", phone: "", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p524', number: null, name: "Liev Atashbarghi-Nehr", grade: "Pre-K", school: "Providence", guardian: "Sadaf Atashbarghi-Nehr", phone: "(703) 727-3927", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p525', number: null, name: "Paul Sayegh", grade: "Pre-K", school: "Mosaic", guardian: "Julie Donmez", phone: "(954)803-8778", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p526', number: null, name: "Kaleb Parker", grade: "6th", school: "Providence", guardian: "Adam Parker", phone: "(571) 242-2587", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p527', number: null, name: "Victoria Finn", grade: "8th", school: "Thoreau", guardian: "Patrick Finn", phone: "7038634587", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p528', number: null, name: "Elias Jose Velasco Cobo", grade: "6th", school: "Daniels Run Elementary School", guardian: "Tomas Velasco", phone: "(571) 577-0744", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p529', number: null, name: "Sana Sarsour", grade: "6th", school: "International scholars academy", guardian: "Hanady Sarsour", phone: "(703) 967-1234", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p530', number: null, name: "Liam Lynch", grade: "4th", school: "Eagle view", guardian: "Dora Lynch", phone: "(703) 401-0297", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p531', number: null, name: "Angelique Nisbet", grade: "7th", school: "Franklin Middle School", guardian: "Francine Nisbet", phone: "(703) 946-0996", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p532', number: null, name: "Miles Taylor", grade: "Pre-K", school: "Eagle View", guardian: "Joan Mlotkowski", phone: "(703)655-2086", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p533', number: null, name: "Jamsion Brown", grade: "2nd", school: "Providence Elementary", guardian: "Johnelle Brown", phone: "(571) 499-9435", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p534', number: null, name: "Faris Hamid", grade: "Pre-K", school: "Isa", guardian: "Ahmed Abdallah", phone: "(571) 331-1483", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p535', number: null, name: "Connor Murphy", grade: "7th", school: "Katherine Johnson Middle School", guardian: "Kevin Murphy", phone: "7573731925", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p536', number: null, name: "Ali Bora Hacigumus", grade: "10th", school: "Oakton hs", guardian: "Deniz Hacigumus", phone: "(571) 587-0872", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'HS Boys' },
  { id: 'p537', number: null, name: "Christopher Killian", grade: "7th", school: "Frost Middle School", guardian: "Robert Killian", phone: "(303)746-5918", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p538', number: null, name: "Oliver Grove", grade: "K", school: "Daniel’s Run", guardian: "Jamie Grove", phone: "(215) 480-2182", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p539', number: null, name: "Yusuf Iman", grade: "2nd", school: "Homeschooling", guardian: "Ilyas Iman", phone: "(571) 641-9295", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p540', number: null, name: "Sulaiman Iman", grade: "K", school: "Homeschooling", guardian: "Ilyas Iman", phone: "(571) 641-9295", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p541', number: null, name: "Vincent Baksi", grade: "3rd", school: "Fairhill Elementary", guardian: "Will Baksi", phone: "(703) 346-5071", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p542', number: null, name: "Lucas Saal", grade: "Pre-K", school: "Olde Creek", guardian: "Brian Saal", phone: "(703) 609-4994", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p543', number: null, name: "Asher Mancl", grade: "9th", school: "Fairfax HS", guardian: "Amy Mancl", phone: "559-908-1523", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'HS Boys' },
  { id: 'p544', number: null, name: "Rhys Mancl", grade: "7th", school: "KJMS", guardian: "Amy Mancl", phone: "559-908-1523", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p545', number: null, name: "Missy Lee", grade: "4th", school: "Willow springs", guardian: "Betty Wang", phone: "(703) 801-7863", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Girls' },
  { id: 'p546', number: null, name: "Emily Ren", grade: "7th", school: "Frost Middle", guardian: "Xiao Ren", phone: "(661)886-8613", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p547', number: null, name: "Rohan Natekar", grade: "1st", school: "Mosaic Elementary", guardian: "Andrea Falkenhagen", phone: "(201)780-9436", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p548', number: null, name: "Zoe Maxwell", grade: "6th", school: "Daniel’s Run Elementary", guardian: "Megan Maxwell", phone: "(325) 232-2310", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p549', number: null, name: "Ty Basinger", grade: "6th", school: "Providence", guardian: "Adam Basinger", phone: "(703) 943-6413", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p550', number: null, name: "Elizabeth Daley", grade: "5th", school: "Willow Springs", guardian: "Charley Daley", phone: "(703) 919-2623", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p551', number: null, name: "Eli Brooks", grade: "7th", school: "Frost Middle school", guardian: "Michelle Brooks", phone: "(571)217-6663", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p552', number: null, name: "Jake Gunnoe", grade: "2nd", school: "Daniel's Run", guardian: "Jenni Gonnoe", phone: "(234) 359-9810", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p553', number: null, name: "Samantha Kim", grade: "4th", school: "Willow Springs ES", guardian: "Joe Kim", phone: "(703) 965-2201", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Girls' },
  { id: 'p554', number: null, name: "Zoe Friedson", grade: "3rd", school: "Willow Springs Elementary School", guardian: "Molly Friedson", phone: "(315) 727-1256", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Girls' },
  { id: 'p555', number: null, name: "Paige Bowles", grade: "4th", school: "Providence", guardian: "Laura Bowles", phone: "(703) 835-1546", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Girls' },
  { id: 'p556', number: null, name: "Gavin Bowles", grade: "6th", school: "Providence", guardian: "Laura Bowles", phone: "(703) 835-1546", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p557', number: null, name: "Cora Andersen", grade: "2nd", school: "Daniels Run ELementary", guardian: "Kate Williamson", phone: "(484) 888-0444", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p558', number: null, name: "Jacob Gwaltney", grade: "7th", school: "Frost Middle", guardian: "Abby Gwaltney", phone: "(703) 932-0812", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p559', number: null, name: "Garrison Turner", grade: "1st", school: "Mosaic Elementary", guardian: "Ashley Turner", phone: "(215)275-4077", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p560', number: null, name: "Evan Meacham", grade: "3rd", school: "Providence", guardian: "Keith Meacham", phone: "(571) 414-8707", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p561', number: null, name: "Matthew Li", grade: "Pre-K", school: "Oakton Elementary School", guardian: "Tina Ma", phone: "(571) 789-6588", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p562', number: null, name: "Ryland Cerce", grade: "3rd", school: "Daniels Run", guardian: "Elizabeth Cerce", phone: "(314) 602-6712", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p563', number: null, name: "Khizar Usman", grade: "6th", school: "Daniels run elementary", guardian: "Usman Ahmed", phone: "(713) 396-9806", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p564', number: null, name: "Joshua Bochert", grade: "6th", school: "Providence ES", guardian: "Jimmy Bochert", phone: "(703)477-6118", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p565', number: null, name: "Eugene Brophy", grade: "Pre-K", school: "Daniels Run", guardian: "Christopher Brophy", phone: "(414) 477-7609", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p566', number: null, name: "Matilda Brophy", grade: "2nd", school: "Daniels Run", guardian: "Christopher Brophy", phone: "(414) 477-7609", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p567', number: null, name: "Isaac Ergas", grade: "4th", school: "Mosaic ES", guardian: "Jeremiah Ergas", phone: "(814) 242-6907", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p568', number: null, name: "Elias Ergas", grade: "1st", school: "Daniels Run ES", guardian: "Jeremiah Ergas", phone: "(814) 242-6907", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p569', number: null, name: "Evelyn Handler", grade: "6th", school: "Providence Elementary School", guardian: "Lynda Do", phone: "(703) 517-2750", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p570', number: null, name: "Aidan Barrett", grade: "2nd", school: "Providence", guardian: "Meaghan Barrett", phone: "(516) 884-4725", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p571', number: null, name: "Mateo Berdugo Nazary", grade: "1st", school: "Fairfax Villa", guardian: "Mari Nazary", phone: "(917)863-7368", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p572', number: null, name: "Shane Siegel", grade: "8th", school: "Frost", guardian: "Kevin Siegel", phone: "(703) 627-4245", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p573', number: null, name: "Ryan Siegel", grade: "6th", school: "Fox mill", guardian: "Kevin Siegel", phone: "(703) 627-4245", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p574', number: null, name: "Catherine Tressler", grade: "5th", school: "St. Anthony Academy", guardian: "James Tressler", phone: "(703) 475-8663", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p575', number: null, name: "Sebastian Shufflebarger", grade: "1st", school: "Fairfax Villa ES", guardian: "Matthew Shufflebarger", phone: "(703)772-6335", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p576', number: null, name: "Mason Pecora", grade: "1st", school: "Mosaic Elementary", guardian: "Aaron Pecora", phone: "(702)785-1784", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p577', number: null, name: "Kaiden Pecora", grade: "6th", school: "Mosaic Elementary", guardian: "Aaron Pecora", phone: "(702)785-1784", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p578', number: null, name: "Dianne Kim", grade: "K", school: "Yes", guardian: "Harum Jeon", phone: "(202)556-5562", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p579', number: null, name: "Ethan Wang", grade: "4th", school: "Mantua", guardian: "Jing Liang", phone: "(703) 203-0120", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p580', number: null, name: "Mia Butakova", grade: "2nd", school: "Daniels Run ES", guardian: "Maria Butakova", phone: "(571)686-2343", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p581', number: null, name: "Declan Holmes", grade: "6th", school: "Daniels Run", guardian: "Kimberly Holmes", phone: "(301) 461-9447", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p582', number: null, name: "Soleil St. Jacques", grade: "7th", school: "Franklin Middle", guardian: "Emily St. Jacques", phone: "(703) 851-2201", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p583', number: null, name: "Augustus Lanphere", grade: "Pre-K", school: "Mosaic", guardian: "Sara Lanphere", phone: "(571) 243-8681", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p584', number: null, name: "Penelope Lanphere", grade: "7th", school: "Katherine Johnson", guardian: "Sara Lanphere", phone: "(571) 243-8681", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p585', number: null, name: "Ryan Attoh", grade: "1st", school: "Fairfax Villa", guardian: "Ellie Addae", phone: "(703)485-5006", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p586', number: null, name: "Malachi Mfuko", grade: "4th", school: "Waples mill", guardian: "Walter Mfuko", phone: "(413) 654-0124", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p587', number: null, name: "Levi Bae", grade: "5th", school: "Providence ES", guardian: "David Bae", phone: "(804) 513-8940", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p588', number: null, name: "Grace Yonathan", grade: "7th", school: "KJMS", guardian: "Erin Barth", phone: "(701) 471-5734", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p589', number: null, name: "Samantha Stalnaker", grade: "6th", school: "Daniels Run Elementary School", guardian: "Carrie Stalnaker", phone: "(703) 994-7726", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p590', number: null, name: "Connor Steel", grade: "5th", school: "Willow Springs Elementary", guardian: "Shawn Steel", phone: "(703) 350-5940", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p591', number: null, name: "Reid Heck", grade: "4th", school: "Trinity Christian School", guardian: "Chris Heck", phone: "(646) 335-7696", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p592', number: null, name: "Aditya Menon", grade: "7th", school: "Katherine Johnson", guardian: "Bindu Venugopal", phone: "(214) 554-2004", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p593', number: null, name: "Kai Fadoul", grade: "7th", school: "Lake Braddock SS", guardian: "Parker Fadoul", phone: "7037867075", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p594', number: null, name: "Cohen Barclay", grade: "6th", school: "Providence Elementary", guardian: "Danielle Powell", phone: "(571) 228-6323", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p595', number: null, name: "Justin Oh", grade: "7th", school: "Frost MS", guardian: "Jamie Oh", phone: "(703) 647-0600", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p596', number: null, name: "Noah Everett", grade: "4th", school: "Mosaic Elementary", guardian: "Meredith Everett", phone: "(703) 855-8315", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p597', number: null, name: "Aveer Khurana", grade: "3rd", school: "Fairhill Elementary", guardian: "Munny Khurana", phone: "(571) 218-7278", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p598', number: null, name: "Aryav Khurana", grade: "1st", school: "Fairhill Elementary", guardian: "Munny Khurana", phone: "(571) 218-7278", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p599', number: null, name: "Simon Sumner", grade: "6th", school: "Providence", guardian: "Vicki Sumner", phone: "(352) 665-5155", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p600', number: null, name: "Zia Zaatar", grade: "K", school: "Eagle View Elementary School", guardian: "Emmalee Zaatar", phone: "(703)625-2579", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p601', number: null, name: "Royce Watkins", grade: "6th", school: "Waples", guardian: "Kalisha Watkins", phone: "(404) 721-8771", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p602', number: null, name: "Yeonhoo Joo", grade: "8th", school: "Katherine Johnson Middle School", guardian: "Seonghee Seok", phone: "5716620383", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p603', number: null, name: "Long Tran", grade: "8th", school: "Frost Middle School", guardian: "Julie Tran", phone: "(804)873-5206", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p604', number: null, name: "Ansh Shah", grade: "3rd", school: "Mosaic Elementary", guardian: "Ankit Shah", phone: "(732) 648-3364", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p605', number: null, name: "Arjun Boppana", grade: "7th", school: "Frost Middle School", guardian: "Rama Boppana", phone: "(480) 330-1855", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Boys' },
  { id: 'p606', number: null, name: "Rory Miller", grade: "K", school: "Fair Hill Elementary", guardian: "Brendan Miller", phone: "(202) 487-0392", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p607', number: null, name: "Emma Chau", grade: "1st", school: "Providence Elementary", guardian: "Denise Vu", phone: "(571) 359-0330", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p608', number: null, name: "Kaylee Shilling", grade: "4th", school: "Willow Springs", guardian: "Chris Shilling", phone: "(703) 338-0098", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Girls' },
  { id: 'p609', number: null, name: "Catherine Rene", grade: "8th", school: "Frost", guardian: "Christine Rene", phone: "(703) 786-6140", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p610', number: null, name: "Maya Gonzales", grade: "8th", school: "Frost MS", guardian: "Urvi Gonzales", phone: "(773) 744-9340", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p611', number: null, name: "Elias Wang", grade: "3rd", school: "Oakton ES", guardian: "Eric Wang", phone: "(408) 483-8984", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '3/4 Boys' },
  { id: 'p612', number: null, name: "Sadie McKittrick", grade: "8th", school: "Frost Middle", guardian: "Michael McKittrick", phone: "(716) 481-7838", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  { id: 'p613', number: null, name: "Ana Burkhart", grade: "3rd", school: "Fairfax Baptist Temple Academy", guardian: "Jeremy Burkhart", phone: "(740) 360-3776", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: 'K-3 3v3' },
  { id: 'p614', number: null, name: "Myles Durham", grade: "6th", school: "Providence", guardian: "Teresa Durham", phone: "(703) 223-1661", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '5/6 Boys' },
  { id: 'p615', number: null, name: "Sophia Myers", grade: "7th", school: "Franklin middle school", guardian: "Aggie Myers", phone: "(703) 608-3131", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: '7/8 Girls' },
  // 6th Boys Select A roster (partial -- registration export didn't include guardian/school for these)
  { id: 'p279', number: null, name: "Giovanni Firenze",        grade: "6th", school: "", guardian: "", phone: "(850) 529-5349", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '6th Boys Select A' },
  { id: 'p280', number: null, name: "Gavin Bowles",            grade: "6th", school: "", guardian: "", phone: "(703) 835-1546", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '6th Boys Select A' },
  { id: 'p281', number: null, name: "Ridaan Gadkar",           grade: "6th", school: "", guardian: "", phone: "(202) 957-4953", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '6th Boys Select A' },
  { id: 'p283', number: null, name: "Judah Pak",               grade: "6th", school: "", guardian: "", phone: "(703) 589-4845", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '6th Boys Select A' },
  // 6th Boys Select B roster (Shaun Ali, Team B) -- partial, no guardian/school for these
  { id: 'p284', number: null, name: "Quentin Potter", grade: "6th", school: "", guardian: "", phone: "",                position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '6th Boys Select B' },
  { id: 'p285', number: null, name: "Jackson Chong",  grade: "6th", school: "", guardian: "", phone: "",                position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '6th Boys Select B' },
  { id: 'p286', number: null, name: "Zeeshan Akhtar", grade: "6th", school: "", guardian: "", phone: "(703) 984-9226",  position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '6th Boys Select B' },
  { id: 'p287', number: null, name: "Imran Akhtar",   grade: "6th", school: "", guardian: "", phone: "(703) 984-9226",  position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '6th Boys Select B' },
  // 6th Boys Select C roster (Matthew Dennis, Team C) -- partial, no guardian/school for these
  { id: 'p288', number: null, name: "Max Krug",       grade: "6th", school: "", guardian: "", phone: "(703) 517-1682",  position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '6th Boys Select C' },
  { id: 'p289', number: null, name: "Sawyer Dennis",  grade: "6th", school: "", guardian: "", phone: "(703) 915-9415",  position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '6th Boys Select C' },
  { id: 'p290', number: null, name: "William Agnew",  grade: "6th", school: "", guardian: "", phone: "(703) 640-4849",  position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '6th Boys Select C' },
  { id: 'p291', number: null, name: "Gio Flores",     grade: "6th", school: "", guardian: "", phone: "(703) 209-6062",  position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '6th Boys Select C' },
  // 5th Boys Select B roster additions (registered Sep-Oct 2026)
  { id: 'p292', number: null, name: "Nathan Fuge",            grade: "5th", school: "Daniels Run",            guardian: "emclaughlin929@gmail.com", phone: "(703) 915-4299", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select B' },
  { id: 'p293', number: null, name: "Samuel Greenberg-Rios",  grade: "5th", school: "Daniel's Run",           guardian: "erios55@hotmail.com",      phone: "(989) 501-5028", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select B' },
  { id: 'p294', number: null, name: "Julian Hanna",           grade: "5th", school: "Daniels Run ES",         guardian: "hannatom15@gmail.com",     phone: "(703) 268-8735", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select B' },
  { id: 'p295', number: null, name: "Grant Larson",           grade: "5th", school: "Trinity Christian School", guardian: "merissaklarson@yahoo.com", phone: "(703) 585-1546", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select B' },
  { id: 'p296', number: null, name: "Kabir Kintgen",          grade: "5th", school: "Providence",             guardian: "ekintgen@gmail.com",       phone: "(812) 340-4749", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select B' },
  { id: 'p297', number: null, name: "Logan Guill",            grade: "5th", school: "Home school",            guardian: "guilljp2@gmail.com",       phone: "(571) 239-7699", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select B' },
  { id: 'p298', number: null, name: "Andrew Kennedy",         grade: "5th", school: "Providence",             guardian: "jfkmail@yahoo.com",        phone: "(202) 445-1111", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select B' },
  { id: 'p299', number: null, name: "Anthony Del Fiore",      grade: "5th", school: "Fox Mill Elementary",    guardian: "jimdelf@gmail.com",        phone: "(401) 261-0205", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select B' },
  { id: 'p300', number: null, name: "Jayceon Murphy",         grade: "5th", school: "Providence",             guardian: "kaitlynmmurphy13@gmail.com", phone: "(571) 418-9613", position: '', status: 'active', waiver: true, program: 'Select', division: SELECT_DIVISION, team: '5th Boys Select B' },
  { id: 'p157', number: null, name: "Anthony Del Fiore", grade: "4th", school: "", guardian: "jimdelf@gmail.com", phone: "(401) 261-0205", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p158', number: null, name: "Adam Nawaz", grade: "1st", school: "", guardian: "imran.nawaz@gmail.com", phone: "(703) 625-6873", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p159', number: null, name: "Jay McGrane", grade: "5th", school: "", guardian: "jason.mcgrane@ey.com", phone: "(724)980-6624", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p160', number: null, name: "Leah Godofsky", grade: "1st", school: "", guardian: "alex.godofsky@gmail.com", phone: "(703) 298-0975", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p161', number: null, name: "Ethan Kim", grade: "1st", school: "", guardian: "bambina833@gmail.com", phone: "(703) 473-6168", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p162', number: null, name: "Josander Contreras", grade: "8th", school: "", guardian: "carla.chicas@gmail.com", phone: "(703) 895-8576", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p163', number: null, name: "Dilan Amin", grade: "4th", school: "", guardian: "kaushalpurvee@gmail.com", phone: "(703) 994-6338", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p164', number: null, name: "Aiden Oh", grade: "2nd", school: "", guardian: "mike_oh1981@hotmail.co.kr", phone: "(703)899-5098", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p165', number: null, name: "Kaito Springer", grade: "1st", school: "", guardian: "springeryoko@gmail.com", phone: "(917) 702-8504", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p166', number: null, name: "Sean Bullen", grade: "8th", school: "", guardian: "bullenjl@gmail.com", phone: "(703) 975-3362", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p167', number: null, name: "Dylan Choque", grade: "2nd", school: "", guardian: "bilop25@outlook.com", phone: "5718392728", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p168', number: null, name: "Veeraj Roy", grade: "2nd", school: "", guardian: "shanonbrar1@gmail.com", phone: "(703) 229-3016", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p169', number: null, name: "Nishaan Khangoora", grade: "3rd", school: "", guardian: "v.khangoora@gmail.com", phone: "(410) 865-9672", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p170', number: null, name: "Nathaniel Roettger", grade: "5th", school: "", guardian: "stuartandsuzanne21@yahoo.com", phone: "(540) 287-4703", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p171', number: null, name: "Kayden Nathani", grade: "3rd", school: "", guardian: "afzaa.khwaja@gmail.com", phone: "(770) 596-5638", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p172', number: null, name: "Nate Fuge", grade: "4th", school: "", guardian: "davidfuge@gmail.com", phone: "(703) 244-2244", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p173', number: null, name: "Jack Kurtz", grade: "4th", school: "", guardian: "searchkm@gmail.com", phone: "(571) 216-3162", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p174', number: null, name: "Alan N. Veliz", grade: "3rd", school: "", guardian: "alan4veliz@gmail.com", phone: "2403838624", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p175', number: null, name: "Jacob Abraham", grade: "K", school: "", guardian: "noahmaxepstein@gmail.com", phone: "(646) 385-5858", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p176', number: null, name: "Ulysses Hunstock", grade: "2nd", school: "", guardian: "drewhunstock@gmail.com", phone: "(325)261-2622", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p177', number: null, name: "Gaius Hunstock", grade: "5th", school: "", guardian: "drewhunstock@gmail.com", phone: "(325)261-2622", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p178', number: null, name: "Drea Seaton", grade: "5th", school: "", guardian: "deenarusso@mac.com", phone: "(240)447-0602", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p179', number: null, name: "Mia Angulo", grade: "1st", school: "", guardian: "sangulo1031@gmail.com", phone: "7036061486", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p180', number: null, name: "Camilla Doan", grade: "2nd", school: "Willow Springs ES", guardian: "moonheedoan@gmail.com", phone: "(703) 463-7307", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p181', number: null, name: "Faris Hamid", grade: "3rd", school: "", guardian: "hamid.ahmedm@gmail.com", phone: "(571) 331-1483", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p182', number: null, name: "Kaiden Moscova", grade: "1st", school: "", guardian: "tiffany_parkes@yahoo.com", phone: "(646) 245-3201", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p183', number: null, name: "Kavi Uhlig", grade: "3rd", school: "", guardian: "pmanocha@gmail.com", phone: "(646) 642-0837", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p184', number: null, name: "Rohan Uhlig", grade: "K", school: "", guardian: "pmanocha@gmail.com", phone: "(646) 642-0837", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p185', number: null, name: "Rose Dwyer", grade: "3rd", school: "", guardian: "dwyer.eo@gmail.com", phone: "(908) 337-3928", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p186', number: null, name: "Molly Dwyer", grade: "3rd", school: "", guardian: "dwyer.eo@gmail.com", phone: "(908) 337-3928", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p187', number: null, name: "Gael Crespo", grade: "4th", school: "", guardian: "crespojhanett@gmail.com", phone: "5714899702", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p188', number: null, name: "Deacon Linton", grade: "9th Grade", school: "", guardian: "jaymelinton@gmail.com", phone: "(828) 999-2066", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p189', number: null, name: "Tyler Esterline", grade: "4th", school: "", guardian: "esterlinefamilyva@gmail.com", phone: "(520)390-7486", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p190', number: null, name: "Charlie Meyers", grade: "8th", school: "", guardian: "georgiaseeley@hotmail.com", phone: "(703) 400-1962", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p191', number: null, name: "Lillian Jones", grade: "9th Grade", school: "", guardian: "curtjones@mac.com", phone: "(901)679-7240", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p192', number: null, name: "Aisha Aldayarova", grade: "6th", school: "", guardian: "gulira.alieva@gmail.com", phone: "(202) 805-8050", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p193', number: null, name: "Zacharia Shah", grade: "K", school: "", guardian: "imran.m.shah@gmail.com", phone: "(703) 296-7762", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p194', number: null, name: "Alejandro Chavez", grade: "2nd", school: "", guardian: "spot82@gmail.com", phone: "(301) 704-4543", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p195', number: null, name: "Jake Gunnoe", grade: "1st", school: "", guardian: "jennigunnoe@gmail.com", phone: "(234)359-9810", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p196', number: null, name: "Khizar Usman", grade: "5th", school: "", guardian: "usman.7@hotmail.com", phone: "(713) 396-9806", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p197', number: null, name: "Sulaiman Chaudhry", grade: "5th", school: "", guardian: "naimahjamal@gmail.com", phone: "(571) 499-9927", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p198', number: null, name: "Antony Bustamante", grade: "8th", school: "", guardian: "kbustamante@cox.net", phone: "(703) 795-0345", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p199', number: null, name: "Arthur Casarim", grade: "6th", school: "", guardian: "fcasarim@gmail.com", phone: "(202) 520-0265", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p200', number: null, name: "Kingston Perry", grade: "9th Grade", school: "", guardian: "personalemale@pm.me", phone: "(312) 576-1637", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p201', number: null, name: "Mergen Darby", grade: "9th Grade", school: "", guardian: "markusdarby@gmail.com", phone: "(703) 725-7006", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p202', number: null, name: "Wren Evans", grade: "5th", school: "", guardian: "staceykluck@msn.com", phone: "(703) 785-6557", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p203', number: null, name: "Leonel Hidalgo", grade: "7th", school: "", guardian: "hidalgofamily2708@gmail.com", phone: "(571) 215-6489", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p204', number: null, name: "Valentina Hidalgo", grade: "10th Grade", school: "", guardian: "hidalgofamily2708@gmail.com", phone: "(571) 215-6489", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p205', number: null, name: "Mila Singh", grade: "3rd", school: "", guardian: "meenooksingh@gmail.com", phone: "(703) 389-3986", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p206', number: null, name: "Jack Gibson", grade: "8th", school: "", guardian: "andy.gibson@outlook.com", phone: "(703) 395-2108", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p207', number: null, name: "ABDURAKHMON BOBOYOROV", grade: "7th", school: "", guardian: "boburboboyorov@gmail.com", phone: "(615) 589-8837", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p208', number: null, name: "Aariv Amin", grade: "5th", school: "", guardian: "purveeamin@gmail.com", phone: "(703)994-6338", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p209', number: null, name: "Rashdan Khan", grade: "K", school: "", guardian: "emonfiu@yahoo.com", phone: "(240) 551-6822", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p210', number: null, name: "Jonah Harris", grade: "6th", school: "", guardian: "staceyrose55@gmail.com", phone: "(703) 304-7568", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p211', number: null, name: "Rhys Mancl", grade: "6th", school: "", guardian: "mancl.amy@gmail.com", phone: "559-908-1523", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p212', number: null, name: "Rohan Chandarana", grade: "5th", school: "", guardian: "cmohit@yahoo.com", phone: "(703) 870-6875", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p213', number: null, name: "Elias Nishanov", grade: "6th", school: "", guardian: "dilya.pulatova@gmail.com", phone: "(202) 817-4036", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p214', number: null, name: "Lily Booher", grade: "8th", school: "", guardian: "analiafelixbooher@yahoo.com", phone: "(918) 257-1079", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p215', number: null, name: "Lía Booher", grade: "2nd", school: "", guardian: "analiafelixbooher@yahoo.com", phone: "(918) 257-1079", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p216', number: null, name: "Cullen Shanahan", grade: "7th", school: "", guardian: "stephanieshanahan@yahoo.com", phone: "(360) 672-4077", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p217', number: null, name: "Samuel Kim", grade: "9th Grade", school: "", guardian: "jinajykim07@gmail.com", phone: "(510) 828-3064", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p218', number: null, name: "Jaxson Shajib", grade: "1st", school: "Eagle view", guardian: "milani.shajib@gmail.com", phone: "(240) 535-1318", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p219', number: null, name: "Rylen Shajib", grade: "2nd", school: "eagle view", guardian: "milani.shajib@gmail.com", phone: "(240) 535-1318", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p220', number: null, name: "Conner Yi", grade: "9th Grade", school: "", guardian: "qyi0204@gmail.com", phone: "(703) 618-6838", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p221', number: null, name: "Jaden Chu", grade: "10th Grade", school: "", guardian: "sarahchoi21@gmail.com", phone: "(510)381-9173", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p222', number: null, name: "Evan Chu", grade: "9th Grade", school: "", guardian: "sarahchoi21@gmail.com", phone: "(510)381-9173", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p223', number: null, name: "Sarah Ferreira", grade: "9th Grade", school: "", guardian: "celsomoller@hotmail.com", phone: "(979) 204-3398", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p224', number: null, name: "Pakhin Chongtrakul", grade: "9th Grade", school: "", guardian: "plesuda@hotmail.com", phone: "(571) 235-0642", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p225', number: null, name: "Roxy Witenstein", grade: "9th Grade", school: "", guardian: "bwitenstein@hotmail.com", phone: "(540) 454-6201", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p226', number: null, name: "Samuel Espinosa", grade: "9th Grade", school: "", guardian: "adrianaluciamoros@gmail.com", phone: "7038683706", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p227', number: null, name: "Zeeshan Akhtar", grade: "5th", school: "", guardian: "azer.akhtar@gmail.com", phone: "(703) 984-9226", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p228', number: null, name: "Imran Akhtar", grade: "5th", school: "", guardian: "azer.akhtar@gmail.com", phone: "(703) 984-9226", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p229', number: null, name: "Puttajak Ratansuban", grade: "9th Grade", school: "", guardian: "ratanasuban@gmail.com", phone: "(657) 257-9144", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p230', number: null, name: "Ianthina Osman", grade: "3rd", school: "", guardian: "shoukut@gmail.com", phone: "(571)386-9047", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p231', number: null, name: "Alisha Zaidi", grade: "9th Grade", school: "", guardian: "najiahus@gmail.com", phone: "(571)412-7827", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p232', number: null, name: "Alex Nguyen", grade: "3rd", school: "", guardian: "yanniegwu@yahoo.com", phone: "(202) 299-7665", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p233', number: null, name: "Enzo Rinker", grade: "4th", school: "", guardian: "justin.rinker@gmail.com", phone: "(571) 383-8879", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p234', number: null, name: "Christopher Barahona", grade: "7th", school: "", guardian: "alfredobarahona82@gmail.com", phone: "(703)732-0200", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p235', number: null, name: "Jude Rowland", grade: "4th", school: "", guardian: "rowland.andrewj@gmail.com", phone: "(703) 408-7388", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p236', number: null, name: "Jacob Rowland", grade: "1st", school: "", guardian: "rowland.andrewj@gmail.com", phone: "(703) 408-7388", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p237', number: null, name: "Arjun Armwood", grade: "2nd", school: "", guardian: "amishaster@gmail.com", phone: "(412) 443-4528", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p238', number: null, name: "Rishaan Gudishetty", grade: "3rd", school: "", guardian: "radhikanookala@gmail.com", phone: "(571) 268-3754", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p239', number: null, name: "Harper Schiavone", grade: "4th", school: "", guardian: "helen_r44444@yahoo.com", phone: "(571) 265-4621", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p240', number: null, name: "Elias Flores", grade: "8th", school: "", guardian: "jonrobflo@gmail.com", phone: "(703) 362-5518", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p241', number: null, name: "Aiden Machuca", grade: "3rd", school: "", guardian: "jackelynmachuca@gmail.com", phone: "(703) 231-6974", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p242', number: null, name: "Aarav Jain", grade: "7th", school: "", guardian: "pulugundlak@gmail.com", phone: "(571) 214-5589", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p243', number: null, name: "Aarit Chandarana", grade: "10th Grade", school: "", guardian: "cmohit@yahoo.com", phone: "(703) 870-6875", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p244', number: null, name: "Ethan Douglas", grade: "1st", school: "", guardian: "wudd82@gmail.com", phone: "(571) 306-0306", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p245', number: null, name: "Sufian Chhipa", grade: "5th", school: "", guardian: "k.chhipa@gmail.com", phone: "(585) 802-2734", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p246', number: null, name: "Mira Asiri", grade: "1st", school: "", guardian: "alsulami4t@gmail.com", phone: "(703)478-4651", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p247', number: null, name: "Greyson Quintana", grade: "1st", school: "", guardian: "maheba_pedroso@yahoo.com", phone: "(305)613-1809", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p248', number: null, name: "Michael Sharkey", grade: "2nd", school: "", guardian: "thesharkeys12@gmail.com", phone: "(419) 349-7783", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p249', number: null, name: "Mohil Bhandari", grade: "4th", school: "", guardian: "rishabh.bhandari@gmail.com", phone: "(804) 432-4867", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p250', number: null, name: "Adrianna Walker", grade: "9th Grade", school: "", guardian: "acsourmany@gmail.com", phone: "(240) 421-0648", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p251', number: null, name: "Lucas Saal", grade: "4th", school: "Mantua", guardian: "b_saal@yahoo.com", phone: "(703) 609-4994", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p252', number: null, name: "James Coscia", grade: "1st", school: "", guardian: "shelleythomp@gmail.com", phone: "(805)698-1220", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p253', number: null, name: "Jordan Lesniewski", grade: "K", school: "", guardian: "emilyhopk@gmail.com", phone: "(703) 862-7467", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  // Soccer — Spring 2026
  { id: 'sp1', number: 2,  name: "Owen Carter",    grade: "3rd", school: "Daniels Run", guardian: "carterfamily@example.com", phone: "(703) 555-1101", position: 'Defender', status: 'active', waiver: true, program: 'Recreation', division: "PowerRec U9-U10", team: "U9 Fairfax FC" },
  { id: 'sp2', number: 7,  name: "Maya Singh",     grade: "4th", school: "Mantua",      guardian: "singhfamily@example.com",  phone: "(703) 555-1102", position: 'Forward',  status: 'active', waiver: true, program: 'Recreation', division: "PowerRec U9-U10", team: "U9 Fairfax FC" },
  { id: 'sp3', number: 1,  name: "Leo Martinez",   grade: "4th", school: "Eagle View",  guardian: "martinezfamily@example.com", phone: "(703) 555-1103", position: 'Goalkeeper', status: 'active', waiver: true, program: 'Recreation', division: "PowerRec U9-U10", team: "U9 Fairfax FC" },
  { id: 'sp4', number: 9,  name: "Ava Thompson",   grade: "3rd", school: "Greenbriar East", guardian: "thompsonfamily@example.com", phone: "(703) 555-1104", position: 'Forward', status: 'active', waiver: true, program: 'Recreation', division: "PowerRec U9-U10", team: "U9 Fairfax FC" },
  { id: 'sp5', number: 4,  name: "Noah Kim",       grade: "5th", school: "Woodson",     guardian: "kimfamily@example.com", phone: "(703) 555-1105", position: 'Midfielder', status: 'active', waiver: true, program: 'Recreation', division: "PowerRec U9-U10", team: "U9 Fairfax FC" },
  { id: 'sp11', number: 5, name: "Sofia Hernandez", grade: "6th", school: "Lanier MS",  guardian: "hernandezfamily@example.com", phone: "(703) 555-1111", position: 'Defender', status: 'active', waiver: true, program: 'Select', division: "NCSL Rec U11-U19", team: "U12 Fairfax FC" },
  { id: 'sp12', number: 10, name: "Ethan Brooks",  grade: "6th", school: "Lanier MS",  guardian: "brooksfamily@example.com", phone: "(703) 555-1112", position: 'Midfielder', status: 'active', waiver: true, program: 'Select', division: "NCSL Rec U11-U19", team: "U12 Fairfax FC" },
  { id: 'sp13', number: 11, name: "Chloe Davis",   grade: "7th", school: "Frost MS",    guardian: "davisfamily@example.com", phone: "(703) 555-1113", position: 'Forward', status: 'active', waiver: true, program: 'Select', division: "NCSL Rec U11-U19", team: "U12 Fairfax FC" },
  { id: 'sp14', number: 12, name: "Mason Lee",     grade: "7th", school: "Frost MS",    guardian: "leefamily@example.com", phone: "(703) 555-1114", position: 'Goalkeeper', status: 'active', waiver: true, program: 'Select', division: "NCSL Rec U11-U19", team: "U12 Fairfax FC" },

  // ── Travel Select — Summer 2026 ──────────────────────────────────────────────
  { id: 'tsp1', number: null, name: 'Vihaan Gupta', grade: '4th Grade', school: 'Mantua', guardian: 'vikashdgupta@gmail.com', phone: '(703) 200-5804', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp2', number: null, name: 'Sai Jackson', grade: '4th Grade', school: 'Mantua', guardian: 'gavin320@gmail.com', phone: '(703)835-3902', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp3', number: null, name: 'Baron Camacho', grade: '4th Grade', school: 'Westbriar ES', guardian: 'gcamacho33@gmail.com', phone: '(703) 599-9376', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp4', number: null, name: 'Adam Hartwich', grade: '4th Grade', school: 'Fairhill Elementary School', guardian: 'gatrheel@gmail.com', phone: '(919) 260-8350', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp5', number: null, name: 'Connor Steel', grade: '5th Grade', school: 'Willow Springs Elementary School', guardian: 'shawn@famofsteel.com', phone: '(703) 350-5940', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp6', number: null, name: 'Jameson Lucas', grade: '5th Grade', school: 'Mosaic Elementary', guardian: 'timluc30@gmail.com', phone: '(703) 209-2531', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp7', number: null, name: 'Rylan Dodge', grade: '5th Grade', school: 'Oakton Elementary School', guardian: 'kyle.dodge28@gmail.com', phone: '(757) 871-8764', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp8', number: null, name: 'Michael Gutzler', grade: '4th Grade', school: 'Mosaic ES', guardian: 'eb_law@yahoo.com', phone: '(510) 847-7837', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp9', number: null, name: 'Andrew Donnelly', grade: '4th Grade', school: 'Providence ES', guardian: 'mikedonnelly25@gmail.com', phone: '(703) 728-5083', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp10', number: null, name: 'Jayceon Murphy', grade: '4th Grade', school: 'Providence', guardian: 'kaitlynmmurphy13@gmail.com', phone: '(571) 418-9613', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp11', number: null, name: 'Aryan Kamawal', grade: '5th Grade', school: 'Eagle View', guardian: 'akamawal@yahoo.com', phone: '(571) 363-8444', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp12', number: null, name: 'Mikhail Chaudhry', grade: '5th Grade', school: 'Mantua Elementary', guardian: 'bilal.n.chaudhry@gmail.com', phone: '(703) 505-3703', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp13', number: null, name: 'Christian Carter', grade: '5th Grade', school: 'Waples Mill ES', guardian: 'bcarter1818@gmail.com', phone: '(202) 262-9769', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp14', number: null, name: 'Kian Shirazi', grade: '4th Grade', school: 'Oakton Elementary School', guardian: 'ehsan1shirazi@gmail.com', phone: '(410) 300-0877', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp15', number: null, name: 'Jonas Lee', grade: '5th Grade', school: 'Stenwood Elementary School', guardian: 'popcorn2424@gmail.com', phone: '(703) 489-5016', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp16', number: null, name: 'Cyan McLaurin', grade: '5th Grade', school: 'Flint Hill Lower School', guardian: 'mclaurint@gmail.com', phone: '7034739410', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp17', number: null, name: 'Wren Evans', grade: '5th Grade', school: 'Mantua', guardian: 'staceykluck@msn.com', phone: '(703) 785-6557', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp18', number: null, name: 'Kai Lowery', grade: '6th Grade', school: 'Mosaic', guardian: 'lowerykm@gmail.com', phone: '(703) 587-6556', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp19', number: null, name: 'JW Morgan', grade: '6th Grade', school: 'Providence Elementary', guardian: 'justin.b.morgan@gmail.com', phone: '(240) 925-6022', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp20', number: null, name: 'Sulaiman Chaudhry', grade: '5th Grade', school: 'Oakton Elementary', guardian: 'naimahjamal@gmail.com', phone: '(571) 499-9927', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp21', number: null, name: 'Joey Grandizio', grade: '5th Grade', school: 'Daniels Run', guardian: 'lmgrandizio@verizon.net', phone: '(703) 298-3413', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp22', number: null, name: 'Adrian Amartuvshin', grade: '6th Grade', school: 'Willow Springs ES', guardian: 'oskoamartuvshin@gmail.com', phone: '(703) 389-3887', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp23', number: null, name: 'Aariv Amin', grade: '5th Grade', school: 'Daniels Run Elementary School', guardian: 'kaushalpurvee@gmail.com', phone: '(703) 994-6338', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp24', number: null, name: 'Gavin Bowles', grade: '6th Grade', school: 'Providence Elementary', guardian: 'lauralbowles@gmail.com', phone: '(703) 835-1546', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp25', number: null, name: 'Joshua Bochert', grade: '6th Grade', school: 'Providence', guardian: 'jodimichele1517@gmail.com', phone: '(703) 967-5679', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp26', number: null, name: 'Ethan Lee', grade: '5th Grade', school: 'Greenbriar West ES', guardian: 'jennyhwang26@gmail.com', phone: '(267) 992-9886', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp27', number: null, name: 'Gio Flores', grade: '5th Grade', school: "Daniel's Run Elementary", guardian: 'jonrobflo@gmail.com', phone: '(703) 362-5518', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp28', number: null, name: 'Emerson Lee', grade: '5th Grade', school: 'Fairfax Villa Elementary', guardian: 'lee.family.etc@gmail.com', phone: '(571) 730-8166', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp29', number: null, name: 'Holden Lee', grade: '5th Grade', school: 'Providence', guardian: 'sanglee23@gmail.com', phone: '(301) 257-2368', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp30', number: null, name: 'Emre Gallo', grade: '5th Grade', school: 'Orange Hunt ES', guardian: 'aylinsezmis1@gmail.com', phone: '(202) 379-6775', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp31', number: null, name: 'Brady Schneider', grade: '5th Grade', school: 'St. Leo', guardian: 'schnet@gmail.com', phone: '(603) 809-2483', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp32', number: null, name: 'Cole LaVine', grade: '5th Grade', school: 'Daniels Run', guardian: 'kennethlavine@gmail.com', phone: '(301) 775-1186', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp33', number: null, name: 'Alexandra Do', grade: '5th Grade', school: 'Mantua', guardian: 'michaeldo82@gmail.com', phone: '(571) 328-8126', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Girls', team: 'Mike Do G6' },
  { id: 'tsp34', number: null, name: 'Avery Jensen', grade: '6th Grade', school: 'Mantua', guardian: 'jen.jensen345@gmail.com', phone: '(801) 995-0452', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Girls', team: 'Mike Do G6' },
  { id: 'tsp35', number: null, name: 'Ruby Tran', grade: 'Pre-K', school: 'Fairfax Villa', guardian: 'hauquyen2008@gmail.com', phone: '(703) 371-3293', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Girls', team: 'Mike Do G6' },
  { id: 'tsp36', number: null, name: 'Lilliana Chu', grade: '5th Grade', school: 'Mantua Elementary School', guardian: 'juliet.sue.kim@gmail.com', phone: '(571)230-9204', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Girls', team: 'Mike Do G6' },
  { id: 'tsp37', number: null, name: 'Ellie Young', grade: '5th Grade', school: 'Providence', guardian: 'casiea02@aol.com', phone: '(703) 307-3839', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Girls', team: 'Mike Do G6' },
  { id: 'tsp38', number: null, name: 'Arya Nguyen', grade: '5th Grade', school: 'Mosaic ES', guardian: 'tonyn107@gmail.com', phone: '(714) 851-0070', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Girls', team: 'Mike Do G6' },
  { id: 'tsp39', number: null, name: 'Drea Seaton', grade: '5th Grade', school: 'Fairfax Villa', guardian: 'deenarusso@mac.com', phone: '(240)447-0602', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Girls', team: 'Mike Do G6' },
  { id: 'tsp40', number: null, name: 'Lily Buhr', grade: '5th Grade', school: 'Fairfax Villa', guardian: 'jeannierose@gmail.com', phone: '(703) 859-1477', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Girls', team: 'Mike Do G6' },
  { id: 'tsp41', number: null, name: 'Eliana Smith', grade: '6th Grade', school: 'Orange Hunt', guardian: 'nadiamike814@gmail.com', phone: '(301) 752-9863', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Girls', team: 'Mike Do G6' },
  { id: 'tsp42', number: null, name: 'Jayden Swain', grade: '6th Grade', school: 'Mary Ellen Henderson MS', guardian: 'autumnalena@gmail.com', phone: '(608)217-2172', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp43', number: null, name: 'Ethan Sontag', grade: '7th Grade', school: 'Franklin MS', guardian: 'jennsontag@gmail.com', phone: '(703) 861-1620', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp44', number: null, name: 'Zane Masri', grade: '6th Grade', school: 'Oak View Elem', guardian: 'wmasri@gmu.edu', phone: '(857) 242-8371', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp45', number: null, name: 'Ellis Harrison', grade: '7th Grade', school: 'Flint Hill Elementary School', guardian: 'drewbharrison@gmail.com', phone: '(571) 277-5125', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp46', number: null, name: 'Arthur Casarim', grade: '6th Grade', school: 'Daniels Run', guardian: 'fcasarim@gmail.com', phone: '(202) 520-0265', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp47', number: null, name: 'Mason Cavada', grade: '6th Grade', school: 'Willow Springs', guardian: 'jcavada19@gmail.com', phone: '(703) 568-6848', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp48', number: null, name: 'Vincent Velazco', grade: '6th Grade', school: 'Daniels Run ES', guardian: 'rvela51@gmail.com', phone: '(703) 338-6674', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp49', number: null, name: 'Tyler Khuon', grade: '7th Grade', school: 'Providence Elementary', guardian: 'po.khuon@gmail.com', phone: '(571) 594-0175', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp50', number: null, name: 'Sam Hartwich', grade: '6th Grade', school: 'Fairhill Elementary School', guardian: 'gatrheel@gmail.com', phone: '(919) 260-8350', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp51', number: null, name: 'Mason Greenzweig', grade: '7th Grade', school: 'Providence', guardian: 'jamiemgreenzweig@gmail.com', phone: '(571) 585-9196', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp52', number: null, name: 'Elijah Atashbarghi-Nehr', grade: '6th Grade', school: 'Providence', guardian: 'satashbarghi@gmail.com', phone: '(703) 727-3927', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp53', number: null, name: 'Kinaan Phillips', grade: '6th Grade', school: 'Oak View Elementary', guardian: 'andrewsudan@yahoo.com.au', phone: '(571) 587-9929', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp54', number: null, name: 'Ibraheem Adam', grade: '6th Grade', school: 'Al-Huda School', guardian: 'adamfamily0312@gmail.com', phone: '(703) 338-9601', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp55', number: null, name: 'Elias Nishanov', grade: '6th Grade', school: 'Providence', guardian: 'dilya.pulatova@gmail.com', phone: '(202) 817-4036', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp56', number: null, name: 'Leonel Helmstutler', grade: '6th Grade', school: 'Providence', guardian: 's_yeganeh@hotmail.com', phone: '(703) 216-4235', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp57', number: null, name: 'Jason Ndukwe', grade: '7th Grade', school: 'Kathleen Johnson Middle School', guardian: 'irynaskids4@gmail.com', phone: '(571) 244-8216', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp58', number: null, name: 'Mark Schneider', grade: '6th Grade', school: 'St. Leo', guardian: 'schnet@gmail.com', phone: '(603) 809-2483', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp59', number: null, name: 'Nathaniel Anderson', grade: '7th Grade', school: 'Immanuel Christian', guardian: 'timjanderson7@gmail.com', phone: '(915) 474-8825', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp60', number: null, name: 'Rehan Samir', grade: '7th Grade', school: 'Cooper Middle', guardian: 'homeva2011@gmail.com', phone: '(703) 828-7746', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp61', number: null, name: 'Paresa Chongtrakul', grade: '6th Grade', school: 'Greenbrier East Elementary School', guardian: 'plesuda@hotmail.com', phone: '(571) 235-0642', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp62', number: null, name: 'Mary Alice Taylor', grade: '7th Grade', school: 'Frost Middle', guardian: 'cstora@gmail.com', phone: '(703) 919-4669', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp63', number: null, name: 'Genesis-Grace Mpeh', grade: '6th Grade', school: 'Mosaic Elementary', guardian: 'cawadzi@verizon.net', phone: '(703) 565-8914', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp64', number: null, name: 'Maylee Bland', grade: '7th Grade', school: 'Canterbury Woods ES', guardian: 'joibland@gmail.com', phone: '(704) 608-9162', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp65', number: null, name: 'Olivia Clough', grade: '7th Grade', school: 'Williamsburg Middle School', guardian: 'ginaclough@gmail.com', phone: '(703) 915-1357', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp66', number: null, name: 'Aisha Aldayarova', grade: '6th Grade', school: 'Mosaic ES', guardian: 'gulira.alieva@gmail.com', phone: '(202) 805-8050', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp67', number: null, name: 'Evelyn Shirk', grade: '6th Grade', school: 'Sangster', guardian: 'cynthia.shirk@gmail.com', phone: '(920) 344-6068', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp68', number: null, name: 'Alison Zou', grade: '6th Grade', school: 'Kent Gardens Elementary School', guardian: 'shenli2004@gmail.com', phone: '(518) 424-5488', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp69', number: null, name: 'Charlotte Wallace', grade: '6th Grade', school: 'Waples Mills', guardian: 'wallace.k.omar@gmail.com', phone: '(301) 257-1854', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp70', number: null, name: 'Reenad Refaat', grade: '6th Grade', school: 'Mantua ES', guardian: 'haidynada@hotmail.com', phone: '(571) 244-2494', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp71', number: null, name: 'Mercedes Burke', grade: '6th Grade', school: 'Providence Elementary School', guardian: 'cheriesmith0725@yahoo.com', phone: '(571) 235-9389', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp72', number: null, name: 'Rohi Sapkota', grade: '6th Grade', school: 'Mantua Elementary School', guardian: 'sur78@yahoo.com', phone: '(703)509-1127', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp73', number: null, name: 'Kensie Isabella', grade: '6th Grade', school: 'Lemon Road Elementary', guardian: 'coryji02@gmail.com', phone: '(703)798-6909', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp74', number: null, name: 'Piper Jackson', grade: '6th Grade', school: 'Springfield Estates Elementary', guardian: 'shenwalk@gmail.com', phone: '(919)451-5037', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp75', number: null, name: 'Julia McGrath', grade: '5th Grade', school: 'Laurel Ridge Elementary', guardian: 'tyej3049@yahoo.com', phone: '5852306402', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp76', number: null, name: 'Celine Ngo', grade: '7th Grade', school: 'Mary Ellen Henderson', guardian: 'chloenguyen10@gmail.com', phone: '(202) 531-1494', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp77', number: null, name: 'Marshall Lee', grade: '8th Grade', school: 'KJMS', guardian: 'bannwang@gmail.com', phone: '(703) 801-7863', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp78', number: null, name: 'Silas Kareliusson', grade: '7th Grade', school: 'Frost Middle School', guardian: 'jennclore@gmail.com', phone: '(703) 477-7350', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp79', number: null, name: 'Noah Chaudhry', grade: '7th Grade', school: 'Frost Middle School', guardian: 'bilal.n.chaudhry@gmail.com', phone: '(703) 505-3703', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp80', number: null, name: 'Oliver Rodriguez', grade: '7th Grade', school: 'Katherine Johnson Middle', guardian: 'nancyrichman@gmail.com', phone: '(571) 201-2010', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp81', number: null, name: 'Luc Piguet', grade: '8th Grade', school: 'Frost Middle', guardian: 'alexpiguet43@gmail.com', phone: '(703) 966-4684', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp82', number: null, name: 'Rod Asadzadeh', grade: '7th Grade', school: 'Frost MS', guardian: 'tammy1117@icloud.com', phone: '(703) 419-0429', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp83', number: null, name: 'Timothy Nguyen', grade: '8th Grade', school: 'Luther Jackson', guardian: 'mqtrieu@gmail.com', phone: '(703) 677-6704', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp84', number: null, name: 'Christopher Barahona', grade: '7th Grade', school: 'Katherine Johnson Middle School', guardian: 'alfredobarahona82@gmail.com', phone: '(703)732-0200', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp85', number: null, name: 'Princeton Antoine', grade: '7th Grade', school: 'Katherine Johnson', guardian: 'onerichardantoine@gmail.com', phone: '(301) 996-4795', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp86', number: null, name: 'Gram Paley', grade: '7th Grade', school: 'Katherine Johnson MS', guardian: 'mgpaley@gmail.com', phone: '(571)217-2650', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp87', number: null, name: 'Junu Yoo', grade: '8th Grade', school: 'Katherine Johnson', guardian: 'ekchoi81@gmail.com', phone: '(703) 789-6778', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp88', number: null, name: 'Klenz Danleigh Martinez', grade: '7th Grade', school: 'Glasgow MS', guardian: 'klenzdanleigh@yahoo.com', phone: '(571) 775-9128', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp89', number: null, name: 'Milan Kanaan', grade: '7th Grade', school: 'Stone Middle School', guardian: 'ninapatel7@gmail.com', phone: '(773) 677-2401', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp90', number: null, name: 'Kameron Singh', grade: '7th Grade', school: 'Katherine Johnson', guardian: 'priyamath@gmail.com', phone: '(202) 255-6225', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp91', number: null, name: 'Rod Asadzadeh', grade: '8th Grade', school: 'Frost Middle School', guardian: 'tammy1117@icloud.com', phone: '(703) 419-0429', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp92', number: null, name: 'Dominic Shin', grade: '7th Grade', school: 'Frost Middle School', guardian: 'killersmile123@gmail.com', phone: '(703) 505-3456', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp93', number: null, name: 'Maddox Lee', grade: '7th Grade', school: 'Frost Middle School', guardian: 'lee.family.etc@gmail.com', phone: '(571) 730-8166', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp94', number: null, name: 'Lincoln Lee', grade: '7th Grade', school: 'Katherine Johnson MS', guardian: 'michael.lee24@gmail.com', phone: '(703) 965-8104', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp95', number: null, name: 'Sebastian Hanna', grade: '7th Grade', school: 'KJMS', guardian: 'hannatom15@gmail.com', phone: '(703) 268-8735', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp96', number: null, name: 'London Yoo', grade: '7th Grade', school: 'Katherine Johnson', guardian: 'keunyoo29@gmail.com', phone: '(702) 887-3034', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp97', number: null, name: 'Noah Clay', grade: '8th Grade', school: 'Frost', guardian: 'curtisclay@gmail.com', phone: '(312)451-4795', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },

  // ── Added from the 2026-11-11 Ottosport registration export (deltas only) ──
  { id: 'p616', number: null, name: "Luka Schuckman-Brixius", grade: "Pre-K", school: "Daniels Run Elementary", guardian: "MaryKathleen Schuckman", phone: "(703)980-3994", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "K-3 3v3" },
  { id: 'p617', number: null, name: "Fredy Henriquez", grade: "Pre-K", school: "Eagle view elm", guardian: "Bridget Coral", phone: "7037895441", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "K-3 3v3" },
  { id: 'p618', number: null, name: "Maeve Andersen", grade: "1st Grade", school: "Daniels Run Elementary", guardian: "Kate Williamson", phone: "(484) 888-0444", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "K-3 3v3" },
  { id: 'p619', number: null, name: "Emma Rivera", grade: "1st Grade", school: "Providence ES", guardian: "Guillermo Rivera", phone: "(703) 296-1607", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "K-3 3v3" },
  { id: 'p620', number: null, name: "Shaan Kirpalani", grade: "3rd Grade", school: "Daniels Run", guardian: "Gowri Kirpalani", phone: "(571) 723-1552", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "K-3 3v3" },
  { id: 'p621', number: null, name: "Jacob Lee", grade: "Kindergarten", school: "Fairfax Villa Elementary", guardian: "Bobby Lee", phone: "(443) 610-9521", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "K-3 3v3" },
  { id: 'p622', number: null, name: "Lukas Flores", grade: "Pre-K", school: "Woodson high school", guardian: "Edgar Flores", phone: "(571) 232-1926", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "K-3 3v3" },
  { id: 'p623', number: null, name: "Emilio Peralta", grade: "Pre-K", school: "Fairfax Villa", guardian: "German Peralta", phone: "(703)577-6485", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "K-3 3v3" },
  { id: 'p624', number: null, name: "Brayden Freitas", grade: "Pre-K", school: "Fairview Elementary", guardian: "Ashley Freitas", phone: "(916) 626-7232", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "K-3 3v3" },
  { id: 'p625', number: null, name: "Abigail Anderson", grade: "2nd Grade", school: "Eagle View", guardian: "Timothy Anderson", phone: "(915) 474-8825", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "3/4 Girls" },
  { id: 'p626', number: null, name: "Maggie Schneider", grade: "4th Grade", school: "Waples Mill", guardian: "Thomas Schneider", phone: "(603) 809-2483", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "3/4 Girls" },
  { id: 'p627', number: null, name: "Nora White", grade: "2nd Grade", school: "Daniels Run Elementary", guardian: "Brianna White", phone: "(740) 709-9351", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "3/4 Girls" },
  { id: 'p628', number: null, name: "Claire Rozzelle", grade: "", school: "", guardian: "Linda Rozzelle", phone: "(703)609-3474", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "3/4 Girls" },
  { id: 'p629', number: null, name: "Morgan Mazer", grade: "2nd Grade", school: "Fairfax Villa ES", guardian: "Kimberly Mazer", phone: "(808) 321-7025", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "3/4 Girls" },
  { id: 'p630', number: null, name: "Sam Habibi", grade: "5th Grade", school: "Providence Elementary", guardian: "Sarah Habibi", phone: "(703) 725-4314", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "5/6 Boys" },
  { id: 'p631', number: null, name: "Noah Pierce", grade: "6th Grade", school: "ROBINSON SECONDARY", guardian: "Layne Bouchard", phone: "(703) 932-9298", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "5/6 Boys" },
  { id: 'p632', number: null, name: "Andrew Kennedy", grade: "5th Grade", school: "KJMS", guardian: "John Kennedy", phone: "(202) 445-1111", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "5/6 Boys" },
  { id: 'p633', number: null, name: "Armaan Kirpalani", grade: "6th Grade", school: "Daniels run", guardian: "Gowri Kirpalani", phone: "(571) 723-1552", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "5/6 Boys" },
  { id: 'p634', number: null, name: "Jack Cressman", grade: "6th Grade", school: "Mosaic", guardian: "John Cressman", phone: "(703) 585-9411", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "5/6 Boys" },
  { id: 'p635', number: null, name: "Giacomo Carabelli", grade: "6th Grade", school: "Daniels Run", guardian: "Maria Carabelli", phone: "(703)338-1707", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "5/6 Boys" },
  { id: 'p636', number: null, name: "Colin Shepelev", grade: "6th Grade", school: "Daniels Run Elementary School", guardian: "Phimolwan Shepelev", phone: "(703) 973-6176", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "5/6 Boys" },
  { id: 'p637', number: null, name: "Alex Shepelev", grade: "5th Grade", school: "Daniels Run Elementary School", guardian: "Phimolwan Shepelev", phone: "(703) 973-6176", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "5/6 Boys" },
  { id: 'p638', number: null, name: "Kayla Carbins", grade: "5th Grade", school: "Woodson", guardian: "Amy Carbins", phone: "(503) 781-7809", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "5/6 Girls" },
  { id: 'p639', number: null, name: "Aydan Lloyd", grade: "7th Grade", school: "KJMS", guardian: "Kimberly Lloyd", phone: "(703) 650-8058", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "7/8 Boys" },
  { id: 'p640', number: null, name: "Mason Greenzweig", grade: "7th Grade", school: "Katherine Johnson Middle School", guardian: "Jamie Greenzweig", phone: "(571) 585-9196", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "7/8 Boys" },
  { id: 'p641', number: null, name: "Junseok Jung", grade: "8th Grade", school: "Providence es", guardian: "Young Been Jung", phone: "2025685914", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "7/8 Boys" },
  { id: 'p642', number: null, name: "Gabriel Yanes Perez", grade: "7th Grade", school: "Katherine Johnson MS", guardian: "Karina Perez", phone: "(571)484-2826", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "7/8 Boys" },
  { id: 'p643', number: null, name: "McKinely Smith", grade: "7th Grade", school: "Daniels Run", guardian: "Lori Smith", phone: "(571) 245-9591", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "7/8 Girls" },
  { id: 'p644', number: null, name: "Katherine Emerick", grade: "7th Grade", school: "Flint Hill Private", guardian: "kelly emerick", phone: "(703) 731-3792", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "7/8 Girls" },
  { id: 'p645', number: null, name: "Juliet Tetreault", grade: "", school: "", guardian: "Laura Tetreault", phone: "(703) 244-1780", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "7/8 Girls" },
  { id: 'p646', number: null, name: "Dylan Kashyap", grade: "9th Grade", school: "Eagleview ES", guardian: "Pallavi Kashyap", phone: "(571) 228-4233", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "HS Boys" },
  { id: 'p647', number: null, name: "Shea Donovan", grade: "10th Grade", school: "Fairfax High School", guardian: "Edwin Donovan", phone: "(703) 434-0822", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "HS Boys" },
  { id: 'p648', number: null, name: "Calvin Williams", grade: "9th Grade", school: "Little Run", guardian: "Caroline Williams", phone: "(760) 518-1770", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "HS Boys" },
  { id: 'p649', number: null, name: "Marko Ilijoski", grade: "9th Grade", school: "Daniels run", guardian: "Tamara Ilijoski", phone: "(703) 589-7766", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "HS Boys" },
  { id: 'p650', number: null, name: "Noah Maxwell", grade: "10th Grade", school: "Fairfax High School", guardian: "Megan Maxwell", phone: "(325) 232-2310", position: '', status: 'active', waiver: true, program: "Recreation", division: REC_DIVISION, team: "HS Boys" },

  // ── Added from the 2026-11-12 Ottosport registration export (deltas only) ──
  { id: 'p651', number: null, name: "Dimitrios Maroulis", grade: "1st Grade", school: "Rolling valley", guardian: "Nicolette Maroulis", phone: "(571) 705-9928", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: "K-3 3v3" },
  { id: 'p652', number: null, name: "Zeke Szymanski", grade: "Kindergarten", school: "Wakefield Chappel", guardian: "Elly Szymanski", phone: "", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: "K-3 3v3" },
  { id: 'p653', number: null, name: "Alan N. Veliz", grade: "4th Grade", school: "Fairfax villa elementary School", guardian: "Alan Veliz", phone: "2403838624", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: "3/4 Boys" },
  { id: 'p654', number: null, name: "Zayne Khayata", grade: "6th Grade", school: "Eagle view", guardian: "Issam Khayata", phone: "(617) 600-4668", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: "5/6 Boys" },
  { id: 'p655', number: null, name: "Kian Shirazi", grade: "5th Grade", school: "Oakton Elementary School", guardian: "Ehsan Shirazi", phone: "(410) 300-0877", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: "5/6 Boys" },
  { id: 'p656', number: null, name: "David (Euimin) Lee", grade: "5th Grade", school: "Oakton Elementary School", guardian: "Juyoung Lee", phone: "(571)396-2432", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: "5/6 Boys" },
  { id: 'p657', number: null, name: "Owen McLenahan", grade: "6th Grade", school: "Oakton ES", guardian: "Mike McLenahan", phone: "(703) 303-9848", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: "5/6 Boys" },
  { id: 'p658', number: null, name: "Aniela Radwanski", grade: "6th Grade", school: "Daniels Run", guardian: "Dave Radwanski", phone: "(571) 338-0385", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: "5/6 Girls" },
  { id: 'p659', number: null, name: "Alexandra Maroulis", grade: "7th Grade", school: "Rolling valley", guardian: "Nicolette Maroulis", phone: "(571) 705-9928", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: "7/8 Girls" },
  { id: 'p660', number: null, name: "Efstathia Maroulis", grade: "7th Grade", school: "Rolling valley", guardian: "Nicolette Maroulis", phone: "(571) 705-9928", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: "7/8 Girls" },
  { id: 'p661', number: null, name: "Callum DiTeresi", grade: "9th Grade", school: "Fairfax", guardian: "DiTeresi family", phone: "(773) 750-0767", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: "HS Boys" },
  { id: 'p662', number: null, name: "Logan Gulino", grade: "9th Grade", school: "Laurel Ridge ES", guardian: "Crystal Gulino", phone: "(703) 407-1472", position: '', status: 'active', waiver: true, program: 'Recreation', division: REC_DIVISION, team: "HS Boys" },
];

export const INITIAL_GAMES = [
  { id: 'g231', status: 'scheduled', month: 'Jun', date: 16, weekday: 'Tue', day: 'Tue, Jun 16', time: '6:30 PM - 7:30 PM', opponent: 'Week 1: Opening Night Tournament', location: 'TBD', home: true, team: 'Rising 2nd-3rd Boys' },
  { id: 'g232', status: 'scheduled', month: 'Jun', date: 23, weekday: 'Tue', day: 'Tue, Jun 23', time: '6:30 PM - 7:30 PM', opponent: 'Week 2: King of the Court', location: 'TBD', home: true, team: 'Rising 2nd-3rd Boys' },
  { id: 'g233', status: 'scheduled', month: 'Jun', date: 30, weekday: 'Tue', day: 'Tue, Jun 30', time: '6:30 PM - 7:30 PM', opponent: 'Week 3: World Cup Night', location: 'TBD', home: true, team: 'Rising 2nd-3rd Boys' },
  { id: 'g234', status: 'scheduled', month: 'Jul', date: 7, weekday: 'Tue', day: 'Tue, Jul 7', time: '6:30 PM - 7:30 PM', opponent: 'Week 4: Rivalry Night', location: 'TBD', home: true, team: 'Rising 2nd-3rd Boys' },
  { id: 'g235', status: 'scheduled', month: 'Jul', date: 14, weekday: 'Tue', day: 'Tue, Jul 14', time: '6:30 PM - 7:30 PM', opponent: 'Week 5: All-Star Challenge', location: 'TBD', home: true, team: 'Rising 2nd-3rd Boys' },
  { id: 'g236', status: 'scheduled', month: 'Jul', date: 21, weekday: 'Tue', day: 'Tue, Jul 21', time: '6:30 PM - 7:30 PM', opponent: 'Week 6: Summer Cup Finals', location: 'TBD', home: true, team: 'Rising 2nd-3rd Boys' },
  { id: 'gg1', status: 'scheduled', month: 'Jun', date: 16, weekday: 'Tue', day: 'Tue, Jun 16', time: '7:30 PM - 8:30 PM', opponent: 'Week 1: Opening Night Tournament', location: 'TBD', home: true, team: 'Girls 3v3 (2nd-8th)' },
  { id: 'gg2', status: 'scheduled', month: 'Jun', date: 23, weekday: 'Tue', day: 'Tue, Jun 23', time: '7:30 PM - 8:30 PM', opponent: 'Week 2: King of the Court', location: 'TBD', home: true, team: 'Girls 3v3 (2nd-8th)' },
  { id: 'gg3', status: 'scheduled', month: 'Jun', date: 30, weekday: 'Tue', day: 'Tue, Jun 30', time: '7:30 PM - 8:30 PM', opponent: 'Week 3: World Cup Night', location: 'TBD', home: true, team: 'Girls 3v3 (2nd-8th)' },
  { id: 'gg4', status: 'scheduled', month: 'Jul', date: 7, weekday: 'Tue', day: 'Tue, Jul 7', time: '7:30 PM - 8:30 PM', opponent: 'Week 4: Rivalry Night', location: 'TBD', home: true, team: 'Girls 3v3 (2nd-8th)' },
  { id: 'gg5', status: 'scheduled', month: 'Jul', date: 14, weekday: 'Tue', day: 'Tue, Jul 14', time: '7:30 PM - 8:30 PM', opponent: 'Week 5: All-Star Challenge', location: 'TBD', home: true, team: 'Girls 3v3 (2nd-8th)' },
  { id: 'gg6', status: 'scheduled', month: 'Jul', date: 21, weekday: 'Tue', day: 'Tue, Jul 21', time: '7:30 PM - 8:30 PM', opponent: 'Week 6: Summer Cup Finals', location: 'TBD', home: true, team: 'Girls 3v3 (2nd-8th)' },
  { id: 'g451', status: 'scheduled', month: 'Jun', date: 18, weekday: 'Thu', day: 'Thu, Jun 18', time: '6:30 PM - 7:30 PM', opponent: 'Week 1: Opening Night Tournament', location: 'TBD', home: true, team: 'Rising 4th-5th Boys' },
  { id: 'g452', status: 'scheduled', month: 'Jun', date: 25, weekday: 'Thu', day: 'Thu, Jun 25', time: '6:30 PM - 7:30 PM', opponent: 'Week 2: King of the Court', location: 'TBD', home: true, team: 'Rising 4th-5th Boys' },
  { id: 'g453', status: 'scheduled', month: 'Jul', date: 2, weekday: 'Thu', day: 'Thu, Jul 2', time: '6:30 PM - 7:30 PM', opponent: 'Week 3: World Cup Night', location: 'TBD', home: true, team: 'Rising 4th-5th Boys' },
  { id: 'g454', status: 'scheduled', month: 'Jul', date: 9, weekday: 'Thu', day: 'Thu, Jul 9', time: '6:30 PM - 7:30 PM', opponent: 'Week 4: Rivalry Night', location: 'TBD', home: true, team: 'Rising 4th-5th Boys' },
  { id: 'g455', status: 'scheduled', month: 'Jul', date: 16, weekday: 'Thu', day: 'Thu, Jul 16', time: '6:30 PM - 7:30 PM', opponent: 'Week 5: All-Star Challenge', location: 'TBD', home: true, team: 'Rising 4th-5th Boys' },
  { id: 'g456', status: 'scheduled', month: 'Jul', date: 23, weekday: 'Thu', day: 'Thu, Jul 23', time: '6:30 PM - 7:30 PM', opponent: 'Week 6: Summer Cup Finals', location: 'TBD', home: true, team: 'Rising 4th-5th Boys' },
  { id: 'g681', status: 'scheduled', month: 'Jun', date: 18, weekday: 'Thu', day: 'Thu, Jun 18', time: '7:30 PM - 8:30 PM', opponent: 'Week 1: Opening Night Tournament', location: 'TBD', home: true, team: 'Rising 6th-8th Boys' },
  { id: 'g682', status: 'scheduled', month: 'Jun', date: 25, weekday: 'Thu', day: 'Thu, Jun 25', time: '7:30 PM - 8:30 PM', opponent: 'Week 2: King of the Court', location: 'TBD', home: true, team: 'Rising 6th-8th Boys' },
  { id: 'g683', status: 'scheduled', month: 'Jul', date: 2, weekday: 'Thu', day: 'Thu, Jul 2', time: '7:30 PM - 8:30 PM', opponent: 'Week 3: World Cup Night', location: 'TBD', home: true, team: 'Rising 6th-8th Boys' },
  { id: 'g684', status: 'scheduled', month: 'Jul', date: 9, weekday: 'Thu', day: 'Thu, Jul 9', time: '7:30 PM - 8:30 PM', opponent: 'Week 4: Rivalry Night', location: 'TBD', home: true, team: 'Rising 6th-8th Boys' },
  { id: 'g685', status: 'scheduled', month: 'Jul', date: 16, weekday: 'Thu', day: 'Thu, Jul 16', time: '7:30 PM - 8:30 PM', opponent: 'Week 5: All-Star Challenge', location: 'TBD', home: true, team: 'Rising 6th-8th Boys' },
  { id: 'g686', status: 'scheduled', month: 'Jul', date: 23, weekday: 'Thu', day: 'Thu, Jul 23', time: '7:30 PM - 8:30 PM', opponent: 'Week 6: Summer Cup Finals', location: 'TBD', home: true, team: 'Rising 6th-8th Boys' },
  // Soccer — Spring 2026
  { id: 'sg1', status: 'final', us: 4, them: 1, month: 'Apr', date: 11, weekday: 'Sat', day: 'Sat, Apr 11', time: '9:00 AM', opponent: 'Vienna Youth SC', location: 'Westmore Park', home: true, team: 'U9 Fairfax FC' },
  { id: 'sg2', status: 'final', us: 1, them: 2, month: 'Apr', date: 18, weekday: 'Sat', day: 'Sat, Apr 18', time: '9:00 AM', opponent: 'Reston Rovers', location: 'Daniels Run Park', home: false, team: 'U9 Fairfax FC' },
  { id: 'sg3', status: 'final', us: 3, them: 0, month: 'Apr', date: 25, weekday: 'Sat', day: 'Sat, Apr 25', time: '9:00 AM', opponent: 'Oakton United', location: 'Westmore Park', home: true, team: 'U9 Fairfax FC' },
  { id: 'sg4', status: 'scheduled', month: 'May', date: 2, weekday: 'Sat', day: 'Sat, May 2', time: '9:00 AM', opponent: 'Centreville SC', location: 'Greenbriar Park', home: false, team: 'U9 Fairfax FC' },
  { id: 'sg11', status: 'final', us: 2, them: 1, month: 'Apr', date: 11, weekday: 'Sat', day: 'Sat, Apr 11', time: '11:00 AM', opponent: 'Annandale SC', location: 'Westmore Park', home: true, team: 'U12 Fairfax FC' },
  { id: 'sg12', status: 'final', us: 0, them: 3, month: 'Apr', date: 18, weekday: 'Sat', day: 'Sat, Apr 18', time: '12:30 PM', opponent: 'Burke United', location: 'Burke Lake Park', home: false, team: 'U12 Fairfax FC' },
  { id: 'sg13', status: 'final', us: 5, them: 2, month: 'Apr', date: 25, weekday: 'Sat', day: 'Sat, Apr 25', time: '11:00 AM', opponent: 'Springfield FC', location: 'Westmore Park', home: true, team: 'U12 Fairfax FC' },
  { id: 'sg14', status: 'scheduled', month: 'May', date: 2, weekday: 'Sat', day: 'Sat, May 2', time: '1:00 PM', opponent: 'Vienna Youth SC', location: 'James Madison HS', home: false, team: 'U12 Fairfax FC' },
];

export const INITIAL_PRACTICES = [
  // ── Summer 2026 Travel Select ─────────────────────────────────────────────────
  // Mon/Wed/Fri · 8 weeks (Jun 15 – Aug 7)
  // Week 1 (Jun 15/17/19): Providence ES
  //   Court A 6:00–7:30 PM → Aidris B5, Mike Do G6
  //   Court B 7:30–9:00 PM → Tom B6, Earnest G7
  // Weeks 2–8 (Jun 22 – Aug 7): KJMS
  //   KJMS #1 6:00–7:30 PM → Aidris B5 · 7:30–9:00 PM → Tom B6
  //   KJMS #2 6:00–7:30 PM → Mike Do G6 · 7:30–9:00 PM → Earnest G7

  // Week 1 — Providence ES
  { id: 'ts_ab5_1',  date: 'Mon, Jun 15', time: '6:00-7:30 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_mdg6_1', date: 'Mon, Jun 15', time: '6:00-7:30 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_tb6_1',  date: 'Mon, Jun 15', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_eg7_1',  date: 'Mon, Jun 15', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_2',  date: 'Wed, Jun 17', time: '6:00-7:30 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_mdg6_2', date: 'Wed, Jun 17', time: '6:00-7:30 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_tb6_2',  date: 'Wed, Jun 17', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_eg7_2',  date: 'Wed, Jun 17', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_3',  date: 'Fri, Jun 19', time: '6:00-7:30 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_mdg6_3', date: 'Fri, Jun 19', time: '6:00-7:30 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_tb6_3',  date: 'Fri, Jun 19', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_eg7_3',  date: 'Fri, Jun 19', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },

  // Week 2 — KJMS (Jun 22/24/26)
  { id: 'ts_ab5_4',  date: 'Mon, Jun 22', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_4',  date: 'Mon, Jun 22', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_4', date: 'Mon, Jun 22', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_4',  date: 'Mon, Jun 22', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_5',  date: 'Wed, Jun 24', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_5',  date: 'Wed, Jun 24', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_5', date: 'Wed, Jun 24', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_5',  date: 'Wed, Jun 24', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_6',  date: 'Fri, Jun 26', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_6',  date: 'Fri, Jun 26', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_6', date: 'Fri, Jun 26', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_6',  date: 'Fri, Jun 26', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },

  // Week 3 — KJMS (Jun 29 / Jul 1 / Jul 3)
  { id: 'ts_ab5_7',  date: 'Mon, Jun 29', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_7',  date: 'Mon, Jun 29', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_7', date: 'Mon, Jun 29', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_7',  date: 'Mon, Jun 29', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_8',  date: 'Wed, Jul 1',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_8',  date: 'Wed, Jul 1',  time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_8', date: 'Wed, Jul 1',  time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_8',  date: 'Wed, Jul 1',  time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_9',  date: 'Fri, Jul 3',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_9',  date: 'Fri, Jul 3',  time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_9', date: 'Fri, Jul 3',  time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_9',  date: 'Fri, Jul 3',  time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },

  // Week 4 — KJMS (Jul 6/8/10)
  { id: 'ts_ab5_10',  date: 'Mon, Jul 6',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_10',  date: 'Mon, Jul 6',  time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_10', date: 'Mon, Jul 6',  time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_10',  date: 'Mon, Jul 6',  time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_11',  date: 'Wed, Jul 8',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_11',  date: 'Wed, Jul 8',  time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_11', date: 'Wed, Jul 8',  time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_11',  date: 'Wed, Jul 8',  time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_12',  date: 'Fri, Jul 10', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_12',  date: 'Fri, Jul 10', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_12', date: 'Fri, Jul 10', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_12',  date: 'Fri, Jul 10', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },

  // Week 5 — KJMS (Jul 13/15/17)
  { id: 'ts_ab5_13',  date: 'Mon, Jul 13', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_13',  date: 'Mon, Jul 13', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_13', date: 'Mon, Jul 13', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_13',  date: 'Mon, Jul 13', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_14',  date: 'Wed, Jul 15', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_14',  date: 'Wed, Jul 15', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_14', date: 'Wed, Jul 15', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_14',  date: 'Wed, Jul 15', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_15',  date: 'Fri, Jul 17', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_15',  date: 'Fri, Jul 17', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_15', date: 'Fri, Jul 17', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_15',  date: 'Fri, Jul 17', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },

  // Week 6 — KJMS (Jul 20/22/24)
  { id: 'ts_ab5_16',  date: 'Mon, Jul 20', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_16',  date: 'Mon, Jul 20', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_16', date: 'Mon, Jul 20', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_16',  date: 'Mon, Jul 20', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_17',  date: 'Wed, Jul 22', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_17',  date: 'Wed, Jul 22', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_17', date: 'Wed, Jul 22', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_17',  date: 'Wed, Jul 22', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_18',  date: 'Fri, Jul 24', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_18',  date: 'Fri, Jul 24', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_18', date: 'Fri, Jul 24', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_18',  date: 'Fri, Jul 24', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },

  // Week 7 — KJMS (Jul 27/29/31)
  { id: 'ts_ab5_19',  date: 'Mon, Jul 27', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_19',  date: 'Mon, Jul 27', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_19', date: 'Mon, Jul 27', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_19',  date: 'Mon, Jul 27', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_20',  date: 'Wed, Jul 29', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_20',  date: 'Wed, Jul 29', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_20', date: 'Wed, Jul 29', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_20',  date: 'Wed, Jul 29', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_21',  date: 'Fri, Jul 31', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_21',  date: 'Fri, Jul 31', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_21', date: 'Fri, Jul 31', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_21',  date: 'Fri, Jul 31', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },

  // Week 8 — KJMS (Aug 3/5/7)
  { id: 'ts_ab5_22',  date: 'Mon, Aug 3',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_22',  date: 'Mon, Aug 3',  time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_22', date: 'Mon, Aug 3',  time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_22',  date: 'Mon, Aug 3',  time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_23',  date: 'Wed, Aug 5',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_23',  date: 'Wed, Aug 5',  time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_23', date: 'Wed, Aug 5',  time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_23',  date: 'Wed, Aug 5',  time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_24',  date: 'Fri, Aug 7',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_24',  date: 'Fri, Aug 7',  time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_24', date: 'Fri, Aug 7',  time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_24',  date: 'Fri, Aug 7',  time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },

  // ── Fall 2026 Skills Clinic ───────────────────────────────────────────────
  // Mondays at Providence ES through Sep 21 (that session moved to Daniels Run
  // ES — no Providence permit Sep 21). Moved to Tuesdays from Sep 29 onward —
  // Monday had no fully-open slot at Providence ES, Tuesday did.
  // Beginner 6-7, Intermediate 7-8, Advanced 8-9. No session Oct 12.

  { id: 'fc_beg_1', date: 'Mon, Sep 14', time: '6:00-7:00 PM', gym: 'Providence ES', type: 'Clinic', rsvp: 0, notes: 'Gym subject to change', team: 'Training - Beginner' },
  { id: 'fc_int_1', date: 'Mon, Sep 14', time: '7:00-8:00 PM', gym: 'Providence ES', type: 'Clinic', rsvp: 0, notes: 'Gym subject to change', team: 'Training - Intermediate' },
  { id: 'fc_adv_1', date: 'Mon, Sep 14', time: '8:00-9:00 PM', gym: 'Providence ES', type: 'Clinic', rsvp: 0, notes: 'Gym subject to change', team: 'Training - Advanced' },
  { id: 'fc_beg_2', date: 'Mon, Sep 21', time: '6:00-7:00 PM', gym: 'Daniels Run ES', type: 'Clinic', rsvp: 0, notes: 'At Daniels Run ES this week — no Providence permit Sep 21', team: 'Training - Beginner' },
  { id: 'fc_int_2', date: 'Mon, Sep 21', time: '7:00-8:00 PM', gym: 'Daniels Run ES', type: 'Clinic', rsvp: 0, notes: 'At Daniels Run ES this week — no Providence permit Sep 21', team: 'Training - Intermediate' },
  { id: 'fc_adv_2', date: 'Mon, Sep 21', time: '8:00-9:00 PM', gym: 'Daniels Run ES', type: 'Clinic', rsvp: 0, notes: 'At Daniels Run ES this week — no Providence permit Sep 21', team: 'Training - Advanced' },
  { id: 'fc_beg_3', date: 'Tue, Sep 29', time: '6:00-7:00 PM', gym: 'Providence ES', type: 'Clinic', rsvp: 0, notes: 'Moved to Tuesdays', team: 'Training - Beginner' },
  { id: 'fc_int_3', date: 'Tue, Sep 29', time: '7:00-8:00 PM', gym: 'Providence ES', type: 'Clinic', rsvp: 0, notes: 'Moved to Tuesdays', team: 'Training - Intermediate' },
  { id: 'fc_adv_3', date: 'Tue, Sep 29', time: '8:00-9:00 PM', gym: 'Providence ES', type: 'Clinic', rsvp: 0, notes: 'Moved to Tuesdays', team: 'Training - Advanced' },
  { id: 'fc_beg_4', date: 'Tue, Oct 6', time: '6:00-7:00 PM', gym: 'Providence ES', type: 'Clinic', rsvp: 0, notes: 'Gym subject to change', team: 'Training - Beginner' },
  { id: 'fc_int_4', date: 'Tue, Oct 6', time: '7:00-8:00 PM', gym: 'Providence ES', type: 'Clinic', rsvp: 0, notes: 'Gym subject to change', team: 'Training - Intermediate' },
  { id: 'fc_adv_4', date: 'Tue, Oct 6', time: '8:00-9:00 PM', gym: 'Providence ES', type: 'Clinic', rsvp: 0, notes: 'Gym subject to change', team: 'Training - Advanced' },
  { id: 'fc_beg_5', date: 'Tue, Oct 20', time: '6:00-7:00 PM', gym: 'Providence ES', type: 'Clinic', rsvp: 0, notes: 'Gym subject to change', team: 'Training - Beginner' },
  { id: 'fc_int_5', date: 'Tue, Oct 20', time: '7:00-8:00 PM', gym: 'Providence ES', type: 'Clinic', rsvp: 0, notes: 'Gym subject to change', team: 'Training - Intermediate' },
  { id: 'fc_adv_5', date: 'Tue, Oct 20', time: '8:00-9:00 PM', gym: 'Providence ES', type: 'Clinic', rsvp: 0, notes: 'Gym subject to change', team: 'Training - Advanced' },
  { id: 'fc_beg_6', date: 'Tue, Oct 27', time: '6:00-7:00 PM', gym: 'Providence ES', type: 'Clinic', rsvp: 0, notes: 'Gym subject to change', team: 'Training - Beginner' },
  { id: 'fc_int_6', date: 'Tue, Oct 27', time: '7:00-8:00 PM', gym: 'Providence ES', type: 'Clinic', rsvp: 0, notes: 'Gym subject to change', team: 'Training - Intermediate' },
  { id: 'fc_adv_6', date: 'Tue, Oct 27', time: '8:00-9:00 PM', gym: 'Providence ES', type: 'Clinic', rsvp: 0, notes: 'Gym subject to change', team: 'Training - Advanced' },

  // ── Fall 2026 Select Open Gyms (not tryouts) — KJMS sessions default to #1 ──
  { id: 'og_5b_0910', date: 'Thu, Sep 10', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Open Gym', rsvp: 0, notes: 'Coach Aidris Daud', team: '5th Boys Select A' },
  { id: 'og_5b_0911', date: 'Fri, Sep 11', time: '7:30-9:00 PM', gym: 'KJMS #1',       type: 'Open Gym', rsvp: 0, notes: 'Coach Aidris Daud', team: '5th Boys Select A' },
  { id: 'og_5b_0918', date: 'Fri, Sep 18', time: '7:30-9:00 PM', gym: 'KJMS #1',       type: 'Open Gym', rsvp: 0, notes: 'Coach Aidris Daud', team: '5th Boys Select A' },
  { id: 'og_5b_0924', date: 'Thu, Sep 24', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Open Gym', rsvp: 0, notes: 'Coach Aidris Daud', team: '5th Boys Select A' },
  { id: 'og_5b_0925', date: 'Fri, Sep 25', time: '7:30-9:00 PM', gym: 'KJMS #1',       type: 'Open Gym', rsvp: 0, notes: 'Coach Aidris Daud', team: '5th Boys Select A' },

  { id: 'og_6b_0908', date: 'Tue, Sep 8',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Open Gym', rsvp: 0, notes: 'Coach Thomas Schneider', team: '6th Boys Select A' },
  { id: 'og_6b_0910', date: 'Thu, Sep 10', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Open Gym', rsvp: 0, notes: 'Coach Thomas Schneider', team: '6th Boys Select A' },
  { id: 'og_6b_0915', date: 'Tue, Sep 15', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Open Gym', rsvp: 0, notes: 'Coach Thomas Schneider', team: '6th Boys Select A' },
  { id: 'og_6b_0917', date: 'Thu, Sep 17', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Open Gym', rsvp: 0, notes: 'Coach Thomas Schneider', team: '6th Boys Select A' },
  { id: 'og_6b_0922', date: 'Tue, Sep 22', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Open Gym', rsvp: 0, notes: 'Coach Thomas Schneider', team: '6th Boys Select A' },
  { id: 'og_6b_0924', date: 'Thu, Sep 24', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Open Gym', rsvp: 0, notes: 'Coach Thomas Schneider', team: '6th Boys Select A' },

  { id: 'og_8b_0910', date: 'Thu, Sep 10', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Open Gym', rsvp: 0, notes: 'Coach Mike Lee', team: '8th Boys Select A' },
  { id: 'og_8b_0914', date: 'Mon, Sep 14', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Open Gym', rsvp: 0, notes: 'Coach Mike Lee', team: '8th Boys Select A' },
  { id: 'og_8b_0917', date: 'Thu, Sep 17', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Open Gym', rsvp: 0, notes: 'Coach Mike Lee', team: '8th Boys Select A' },
  { id: 'og_8b_0924', date: 'Thu, Sep 24', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Open Gym', rsvp: 0, notes: 'Coach Mike Lee', team: '8th Boys Select A' },

  { id: 'og_5g_0916', date: 'Wed, Sep 16', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Open Gym', rsvp: 0, notes: 'Coach Fazle Taher', team: '5th Girls Select' },
  { id: 'og_5g_0923', date: 'Wed, Sep 23', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Open Gym', rsvp: 0, notes: 'Coach Fazle Taher', team: '5th Girls Select' },

  { id: 'og_6g_0914', date: 'Mon, Sep 14', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Open Gym', rsvp: 0, notes: 'Coach Michael Do', team: '6th Girls Select' },
  { id: 'og_6g_0916', date: 'Wed, Sep 16', time: '6:00-7:30 PM', gym: 'Providence ES',  type: 'Open Gym', rsvp: 0, notes: 'Coach Michael Do', team: '6th Girls Select' },
  { id: 'og_6g_0923', date: 'Wed, Sep 23', time: '6:00-7:30 PM', gym: 'Providence ES',  type: 'Open Gym', rsvp: 0, notes: 'Coach Michael Do', team: '6th Girls Select' },

  { id: 'og_7g_0910', date: 'Thu, Sep 10', time: '7:30-9:00 PM', gym: 'KJMS #1',       type: 'Open Gym', rsvp: 0, notes: 'Coach Earnest Williams', team: '7th Girls Select' },
  { id: 'og_7g_0911', date: 'Fri, Sep 11', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Open Gym', rsvp: 0, notes: 'Coach Earnest Williams', team: '7th Girls Select' },
  { id: 'og_7g_0917', date: 'Thu, Sep 17', time: '7:30-9:00 PM', gym: 'KJMS #1',       type: 'Open Gym', rsvp: 0, notes: 'Coach Earnest Williams', team: '7th Girls Select' },
  { id: 'og_7g_0918', date: 'Fri, Sep 18', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Open Gym', rsvp: 0, notes: 'Coach Earnest Williams', team: '7th Girls Select' },
  { id: 'og_7g_0924', date: 'Thu, Sep 24', time: '7:30-9:00 PM', gym: 'KJMS #1',       type: 'Open Gym', rsvp: 0, notes: 'Coach Earnest Williams', team: '7th Girls Select' },
  { id: 'og_7g_0925', date: 'Fri, Sep 25', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Open Gym', rsvp: 0, notes: 'Coach Earnest Williams', team: '7th Girls Select' },

  // ── Winter 2026-27 Select Tryouts — KJMS sessions default to #1 ─────────────
  { id: 'tr_5b_1001', date: 'Thu, Oct 1',  time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Tryout', rsvp: 0, notes: 'Coach Aidris Daud', team: '5th Boys Select A' },
  { id: 'tr_5b_1005', date: 'Mon, Oct 5',  time: '6:00-7:30 PM', gym: 'KJMS #1',       type: 'Tryout', rsvp: 0, notes: 'Coach Aidris Daud', team: '5th Boys Select A' },
  { id: 'tr_5b_1006', date: 'Tue, Oct 6',  time: '6:00-7:30 PM', gym: 'Providence ES', type: 'Tryout', rsvp: 0, notes: 'Coach Aidris Daud', team: '5th Boys Select A' },
  { id: 'tr_5b_1008', date: 'Thu, Oct 8',  time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Tryout', rsvp: 0, notes: 'Coach Aidris Daud', team: '5th Boys Select A' },

  { id: 'tr_6b_1001', date: 'Thu, Oct 1',  time: '6:00-7:30 PM', gym: 'Providence ES', type: 'Tryout', rsvp: 0, notes: 'Coach Thomas Schneider', team: '6th Boys Select A' },
  { id: 'tr_6b_1006', date: 'Tue, Oct 6',  time: '6:00-7:30 PM', gym: 'KJMS #1',       type: 'Tryout', rsvp: 0, notes: 'Coach Thomas Schneider', team: '6th Boys Select A' },
  { id: 'tr_6b_1008', date: 'Thu, Oct 8',  time: '6:00-7:30 PM', gym: 'Providence ES', type: 'Tryout', rsvp: 0, notes: 'Coach Thomas Schneider', team: '6th Boys Select A' },

  { id: 'tr_7b_1002', date: 'Fri, Oct 2',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Tryout', rsvp: 0, notes: 'Coach Tim Anderson', team: '7th Boys Select A' },
  { id: 'tr_7b_1005', date: 'Mon, Oct 5',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Tryout', rsvp: 0, notes: 'Coach Tim Anderson', team: '7th Boys Select A' },
  { id: 'tr_7b_1009', date: 'Fri, Oct 9',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Tryout', rsvp: 0, notes: 'Coach Tim Anderson', team: '7th Boys Select A' },
  { id: 'tr_7b_1012', date: 'Mon, Oct 12', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Tryout', rsvp: 0, notes: 'Coach Tim Anderson', team: '7th Boys Select A' },

  { id: 'tr_8b_1001', date: 'Thu, Oct 1',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Tryout', rsvp: 0, notes: 'Coach Mike Lee / Kuen Yoo', team: '8th Boys Select A' },
  { id: 'tr_8b_1005', date: 'Mon, Oct 5',  time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Tryout', rsvp: 0, notes: 'Coach Mike Lee / Kuen Yoo', team: '8th Boys Select A' },
  { id: 'tr_8b_1008', date: 'Thu, Oct 8',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Tryout', rsvp: 0, notes: 'Coach Mike Lee / Kuen Yoo', team: '8th Boys Select A' },

  { id: 'tr_5g_1001', date: 'Thu, Oct 1',  time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Tryout', rsvp: 0, notes: 'Coach Fazle Taher', team: '5th Girls Select' },
  { id: 'tr_5g_1007', date: 'Wed, Oct 7',  time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Tryout', rsvp: 0, notes: 'Coach Fazle Taher', team: '5th Girls Select' },
  { id: 'tr_5g_1012', date: 'Mon, Oct 12', time: '6:00-7:30 PM', gym: 'KJMS #1',        type: 'Tryout', rsvp: 0, notes: 'Coach Fazle Taher', team: '5th Girls Select' },
  { id: 'tr_5g_1013', date: 'Tue, Oct 13', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Tryout', rsvp: 0, notes: 'Coach Fazle Taher', team: '5th Girls Select' },

  { id: 'tr_6g_1005', date: 'Mon, Oct 5',  time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Tryout', rsvp: 0, notes: 'Coach Michael Do', team: '6th Girls Select' },
  { id: 'tr_6g_1007', date: 'Wed, Oct 7',  time: '6:00-7:30 PM', gym: 'Providence ES',  type: 'Tryout', rsvp: 0, notes: 'Coach Michael Do', team: '6th Girls Select' },
  { id: 'tr_6g_1012', date: 'Mon, Oct 12', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Tryout', rsvp: 0, notes: 'Coach Michael Do', team: '6th Girls Select' },
  { id: 'tr_6g_1013', date: 'Tue, Oct 13', time: '6:00-7:30 PM', gym: 'Providence ES',  type: 'Tryout', rsvp: 0, notes: 'Coach Michael Do', team: '6th Girls Select' },

  { id: 'tr_7g_1001', date: 'Thu, Oct 1', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Tryout', rsvp: 0, notes: 'Coach Earnest Williams', team: '7th Girls Select' },
  { id: 'tr_7g_1002', date: 'Fri, Oct 2', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Tryout', rsvp: 0, notes: 'Coach Earnest Williams', team: '7th Girls Select' },
  { id: 'tr_7g_1007', date: 'Thu, Oct 7', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Tryout', rsvp: 0, notes: 'Coach Earnest Williams', team: '7th Girls Select' },
  { id: 'tr_7g_1009', date: 'Fri, Oct 9', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Tryout', rsvp: 0, notes: 'Coach Earnest Williams', team: '7th Girls Select' },

  { id: 'tr_8g_1001', date: 'Thu, Oct 1', time: '7:30-9:00 PM', gym: 'KJMS #1',        type: 'Tryout', rsvp: 0, notes: 'Coach Brett Schmitz', team: '8th Girls Select' },
  { id: 'tr_8g_1005', date: 'Mon, Oct 5', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Tryout', rsvp: 0, notes: 'Coach Brett Schmitz', team: '8th Girls Select' },
  { id: 'tr_8g_1007', date: 'Wed, Oct 7', time: '7:30-9:00 PM', gym: 'Providence ES',  type: 'Tryout', rsvp: 0, notes: 'Coach Brett Schmitz', team: '8th Girls Select' },
  { id: 'tr_8g_1009', date: 'Fri, Oct 9', time: '7:30-9:00 PM', gym: 'Providence ES',  type: 'Tryout', rsvp: 0, notes: 'Coach Brett Schmitz', team: '8th Girls Select' },

  // ── 2026-27 Select Practice Schedule (full season) ──────────────────────────
  { id: 'sp_7b_001', date: 'Mon, Sep 14', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_002', date: 'Mon, Sep 28', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_003', date: 'Mon, Oct 19', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_004', date: 'Mon, Oct 26', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_005', date: 'Mon, Nov 2', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_006', date: 'Mon, Nov 9', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_007', date: 'Mon, Nov 16', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_008', date: 'Mon, Nov 23', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_009', date: 'Mon, Nov 30', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_010', date: 'Mon, Dec 7', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_011', date: 'Mon, Dec 14', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_012', date: 'Mon, Jan 4', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_013', date: 'Mon, Jan 11', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_014', date: 'Mon, Jan 25', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_015', date: 'Mon, Feb 1', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_016', date: 'Mon, Feb 8', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_017', date: 'Mon, Feb 22', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_018', date: 'Mon, Mar 1', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_8b2_001', date: 'Mon, Sep 14', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_002', date: 'Mon, Sep 28', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_003', date: 'Mon, Oct 5', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_004', date: 'Mon, Oct 12', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_005', date: 'Mon, Oct 19', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_006', date: 'Mon, Oct 26', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_007', date: 'Mon, Nov 2', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_008', date: 'Mon, Nov 9', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_009', date: 'Mon, Nov 16', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_010', date: 'Mon, Nov 23', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_011', date: 'Mon, Nov 30', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_012', date: 'Mon, Dec 7', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_013', date: 'Mon, Dec 14', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_014', date: 'Mon, Jan 4', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_015', date: 'Mon, Jan 11', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_016', date: 'Mon, Jan 25', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_017', date: 'Mon, Feb 1', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_018', date: 'Mon, Feb 8', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_019', date: 'Mon, Feb 22', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_020', date: 'Mon, Mar 1', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b_001', date: 'Tue, Dec 1', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_002', date: 'Tue, Dec 8', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_003', date: 'Tue, Dec 15', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_004', date: 'Tue, Jan 5', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_005', date: 'Tue, Jan 12', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_006', date: 'Tue, Jan 19', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_007', date: 'Tue, Jan 26', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_008', date: 'Tue, Feb 2', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_009', date: 'Tue, Feb 9', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_010', date: 'Tue, Feb 16', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_011', date: 'Tue, Feb 23', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_012', date: 'Tue, Mar 2', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_5g_001', date: 'Tue, Nov 10', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_002', date: 'Tue, Nov 17', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_003', date: 'Tue, Nov 24', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_004', date: 'Tue, Dec 1', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_005', date: 'Tue, Dec 8', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_006', date: 'Tue, Dec 15', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_007', date: 'Tue, Jan 5', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_008', date: 'Tue, Jan 12', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_009', date: 'Tue, Jan 19', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_010', date: 'Tue, Jan 26', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_011', date: 'Tue, Feb 2', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_012', date: 'Tue, Feb 9', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_013', date: 'Tue, Feb 16', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_014', date: 'Tue, Feb 23', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_015', date: 'Tue, Mar 2', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_6b2_001', date: 'Tue, Sep 8', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_002', date: 'Tue, Sep 15', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_003', date: 'Tue, Oct 20', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_004', date: 'Tue, Oct 27', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_005', date: 'Tue, Nov 3', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_006', date: 'Tue, Nov 10', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_007', date: 'Tue, Nov 17', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_008', date: 'Tue, Nov 24', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_009', date: 'Tue, Dec 1', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_010', date: 'Tue, Dec 8', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_011', date: 'Tue, Dec 15', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_012', date: 'Tue, Jan 5', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_013', date: 'Tue, Jan 12', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_014', date: 'Tue, Jan 19', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_015', date: 'Tue, Jan 26', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_016', date: 'Tue, Feb 2', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_017', date: 'Tue, Feb 9', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_018', date: 'Tue, Feb 16', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_019', date: 'Tue, Feb 23', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_020', date: 'Tue, Mar 2', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b_001', date: 'Tue, Sep 29', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_002', date: 'Tue, Oct 13', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_003', date: 'Tue, Oct 20', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_004', date: 'Tue, Oct 27', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_005', date: 'Tue, Nov 3', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_006', date: 'Tue, Nov 10', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_007', date: 'Tue, Nov 17', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_008', date: 'Tue, Nov 24', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_009', date: 'Tue, Dec 1', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_010', date: 'Tue, Dec 8', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_011', date: 'Tue, Dec 15', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_012', date: 'Tue, Jan 5', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_013', date: 'Tue, Jan 12', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_014', date: 'Tue, Jan 19', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_015', date: 'Tue, Jan 26', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_016', date: 'Tue, Feb 2', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_017', date: 'Tue, Feb 9', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_018', date: 'Tue, Feb 16', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_019', date: 'Tue, Feb 23', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_020', date: 'Tue, Mar 2', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_7b2_001', date: 'Tue, Oct 13', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_002', date: 'Tue, Oct 20', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_003', date: 'Tue, Oct 27', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_004', date: 'Tue, Nov 3', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_005', date: 'Tue, Nov 10', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_006', date: 'Tue, Nov 17', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_007', date: 'Tue, Nov 24', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_008', date: 'Tue, Dec 1', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_009', date: 'Tue, Dec 8', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_010', date: 'Tue, Dec 15', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_011', date: 'Tue, Jan 5', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_012', date: 'Tue, Jan 12', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_013', date: 'Tue, Jan 19', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_014', date: 'Tue, Jan 26', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_015', date: 'Tue, Feb 2', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_016', date: 'Tue, Feb 9', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_017', date: 'Tue, Feb 16', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_018', date: 'Tue, Feb 23', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_019', date: 'Tue, Mar 2', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_8g_001', date: 'Wed, Sep 23', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Girls Select' },
  { id: 'sp_5g_016', date: 'Wed, Sep 9', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_017', date: 'Wed, Sep 30', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_018', date: 'Wed, Oct 14', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_019', date: 'Wed, Oct 21', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_020', date: 'Wed, Oct 28', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_021', date: 'Wed, Nov 4', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_8b2_021', date: 'Wed, Sep 9', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_022', date: 'Wed, Sep 16', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_023', date: 'Wed, Sep 23', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_024', date: 'Wed, Sep 30', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_025', date: 'Wed, Oct 7', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_026', date: 'Wed, Oct 14', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_027', date: 'Wed, Oct 21', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_028', date: 'Wed, Oct 28', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_029', date: 'Wed, Nov 4', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_030', date: 'Wed, Nov 11', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_031', date: 'Wed, Nov 18', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_5b_001', date: 'Wed, Dec 2', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_002', date: 'Wed, Dec 9', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_003', date: 'Wed, Dec 16', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_004', date: 'Wed, Jan 6', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_005', date: 'Wed, Jan 13', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_006', date: 'Wed, Jan 20', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_007', date: 'Wed, Jan 27', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_008', date: 'Wed, Feb 3', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_009', date: 'Wed, Feb 10', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_010', date: 'Wed, Feb 17', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_011', date: 'Wed, Feb 24', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_012', date: 'Wed, Mar 3', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_8b2_032', date: 'Wed, Dec 2', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_033', date: 'Wed, Dec 9', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_034', date: 'Wed, Dec 16', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_035', date: 'Wed, Jan 6', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_036', date: 'Wed, Jan 13', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_037', date: 'Wed, Jan 20', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_038', date: 'Wed, Jan 27', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_039', date: 'Wed, Feb 3', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_040', date: 'Wed, Feb 10', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_041', date: 'Wed, Feb 17', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_042', date: 'Wed, Feb 24', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_043', date: 'Wed, Mar 3', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_5b_013', date: 'Thu, Sep 17', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_014', date: 'Thu, Oct 15', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_015', date: 'Thu, Oct 22', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_016', date: 'Thu, Oct 29', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_017', date: 'Thu, Nov 5', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_018', date: 'Thu, Nov 12', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_019', date: 'Thu, Nov 19', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_020', date: 'Thu, Dec 3', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_021', date: 'Thu, Dec 10', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_022', date: 'Thu, Dec 17', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_023', date: 'Thu, Jan 7', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_024', date: 'Thu, Jan 14', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_025', date: 'Thu, Jan 21', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_026', date: 'Thu, Jan 28', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_027', date: 'Thu, Feb 4', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_028', date: 'Thu, Feb 11', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_029', date: 'Thu, Feb 18', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_030', date: 'Thu, Feb 25', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_031', date: 'Thu, Mar 4', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5g_022', date: 'Thu, Sep 10', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_023', date: 'Thu, Sep 17', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_024', date: 'Thu, Sep 24', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_025', date: 'Thu, Oct 8', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_026', date: 'Thu, Oct 15', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_027', date: 'Thu, Oct 22', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_028', date: 'Thu, Oct 29', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_029', date: 'Thu, Nov 5', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_030', date: 'Thu, Nov 12', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_031', date: 'Thu, Nov 19', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_032', date: 'Thu, Dec 3', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_033', date: 'Thu, Dec 10', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_034', date: 'Thu, Dec 17', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_035', date: 'Thu, Jan 7', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_036', date: 'Thu, Jan 14', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_037', date: 'Thu, Jan 21', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_038', date: 'Thu, Jan 28', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_039', date: 'Thu, Feb 4', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_040', date: 'Thu, Feb 11', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_041', date: 'Thu, Feb 18', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_042', date: 'Thu, Feb 25', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_5g_043', date: 'Thu, Mar 4', time: '6:00-7:30 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Girls Select' },
  { id: 'sp_6b2_021', date: 'Thu, Sep 10', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_022', date: 'Thu, Oct 15', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_023', date: 'Thu, Oct 22', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_024', date: 'Thu, Oct 29', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_025', date: 'Thu, Nov 5', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_026', date: 'Thu, Nov 12', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_027', date: 'Thu, Nov 19', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_028', date: 'Thu, Dec 3', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_029', date: 'Thu, Dec 10', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_030', date: 'Thu, Dec 17', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_031', date: 'Thu, Jan 7', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_032', date: 'Thu, Jan 14', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_033', date: 'Thu, Jan 21', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_034', date: 'Thu, Jan 28', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_035', date: 'Thu, Feb 4', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_036', date: 'Thu, Feb 11', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_037', date: 'Thu, Feb 18', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_038', date: 'Thu, Feb 25', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_6b2_039', date: 'Thu, Mar 4', time: '7:30-9:00 PM', gym: 'Daniels Run ES', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select B' },
  { id: 'sp_8b2_044', date: 'Thu, Sep 24', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_045', date: 'Thu, Oct 1', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_8b2_046', date: 'Thu, Oct 8', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select B' },
  { id: 'sp_6b_021', date: 'Thu, Oct 15', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_022', date: 'Thu, Oct 22', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_023', date: 'Thu, Oct 29', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_024', date: 'Thu, Nov 5', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_025', date: 'Thu, Nov 12', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_026', date: 'Thu, Nov 19', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_027', date: 'Thu, Dec 3', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_028', date: 'Thu, Dec 10', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_029', date: 'Thu, Dec 17', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_030', date: 'Thu, Jan 7', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_031', date: 'Thu, Jan 14', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_032', date: 'Thu, Jan 21', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_033', date: 'Thu, Jan 28', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_034', date: 'Thu, Feb 4', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_035', date: 'Thu, Feb 11', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_036', date: 'Thu, Feb 18', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_037', date: 'Thu, Feb 25', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_6b_038', date: 'Thu, Mar 4', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '6th Boys Select A' },
  { id: 'sp_8g_002', date: 'Thu, Sep 17', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Girls Select' },
  { id: 'sp_8g_003', date: 'Thu, Sep 24', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Girls Select' },
  { id: 'sp_7b2_020', date: 'Thu, Oct 15', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_021', date: 'Thu, Oct 22', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_022', date: 'Thu, Oct 29', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_023', date: 'Thu, Nov 5', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_024', date: 'Thu, Nov 12', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_025', date: 'Thu, Nov 19', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_026', date: 'Thu, Dec 3', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_027', date: 'Thu, Dec 10', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_028', date: 'Thu, Dec 17', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_029', date: 'Thu, Jan 7', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_030', date: 'Thu, Jan 14', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_031', date: 'Thu, Jan 21', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_032', date: 'Thu, Jan 28', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_033', date: 'Thu, Feb 4', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_034', date: 'Thu, Feb 11', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_035', date: 'Thu, Feb 18', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_036', date: 'Thu, Feb 25', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_7b2_037', date: 'Thu, Mar 4', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select B' },
  { id: 'sp_8b_013', date: 'Thu, Oct 15', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_014', date: 'Thu, Oct 22', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_015', date: 'Thu, Oct 29', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_016', date: 'Thu, Nov 5', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_017', date: 'Thu, Nov 12', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_018', date: 'Thu, Nov 19', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_7g_001', date: 'Thu, Oct 8', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_002', date: 'Thu, Oct 15', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_003', date: 'Thu, Oct 22', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_004', date: 'Thu, Oct 29', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_005', date: 'Thu, Nov 5', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_006', date: 'Thu, Nov 12', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_007', date: 'Thu, Nov 19', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_008', date: 'Thu, Dec 3', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_009', date: 'Thu, Dec 10', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_010', date: 'Thu, Dec 17', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_011', date: 'Thu, Jan 7', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_012', date: 'Thu, Jan 14', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_013', date: 'Thu, Jan 21', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_014', date: 'Thu, Jan 28', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_015', date: 'Thu, Feb 4', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_016', date: 'Thu, Feb 11', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_017', date: 'Thu, Feb 18', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_018', date: 'Thu, Feb 25', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_019', date: 'Thu, Mar 4', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_8b_019', date: 'Fri, Sep 11', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_020', date: 'Fri, Sep 18', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_021', date: 'Fri, Sep 25', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_022', date: 'Fri, Oct 2', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_023', date: 'Fri, Oct 9', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_024', date: 'Fri, Oct 16', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_025', date: 'Fri, Oct 23', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_026', date: 'Fri, Oct 30', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_027', date: 'Fri, Nov 6', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_028', date: 'Fri, Nov 13', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_029', date: 'Fri, Nov 20', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_030', date: 'Fri, Dec 4', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_031', date: 'Fri, Dec 11', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_032', date: 'Fri, Dec 18', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_033', date: 'Fri, Jan 8', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_034', date: 'Fri, Jan 15', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_035', date: 'Fri, Jan 22', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_036', date: 'Fri, Jan 29', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_037', date: 'Fri, Feb 5', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_038', date: 'Fri, Feb 12', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_039', date: 'Fri, Feb 19', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_040', date: 'Fri, Feb 26', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_8b_041', date: 'Fri, Mar 5', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '8th Boys Select A' },
  { id: 'sp_5b_032', date: 'Fri, Oct 2', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_033', date: 'Fri, Oct 9', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_034', date: 'Fri, Oct 16', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_035', date: 'Fri, Oct 23', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_036', date: 'Fri, Oct 30', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_037', date: 'Fri, Nov 6', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_038', date: 'Fri, Nov 13', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  { id: 'sp_5b_039', date: 'Fri, Nov 20', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select A' },
  // 5th Boys Select B -- coached by Nabil Ali, new recurring Mon KJMS #1 / Wed Providence ES
  { id: 'sp_5b2_m001', date: 'Mon, Sep 14', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_m002', date: 'Mon, Sep 28', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_m003', date: 'Mon, Oct 12', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_m004', date: 'Mon, Oct 19', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_m005', date: 'Mon, Oct 26', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_m006', date: 'Mon, Nov 2', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_m007', date: 'Mon, Nov 9', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_m008', date: 'Mon, Nov 16', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_m009', date: 'Mon, Nov 23', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_m010', date: 'Mon, Nov 30', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_m011', date: 'Mon, Dec 7', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_m012', date: 'Mon, Dec 14', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_m013', date: 'Mon, Jan 4', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_m014', date: 'Mon, Jan 11', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_m015', date: 'Mon, Jan 25', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_m016', date: 'Mon, Feb 1', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_m017', date: 'Mon, Feb 8', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_m018', date: 'Mon, Feb 22', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_m019', date: 'Mon, Mar 1', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w001', date: 'Wed, Sep 9', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w002', date: 'Wed, Sep 16', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w003', date: 'Wed, Sep 30', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w004', date: 'Wed, Oct 7', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w005', date: 'Wed, Oct 14', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w006', date: 'Wed, Oct 21', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w007', date: 'Wed, Oct 28', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w008', date: 'Wed, Nov 4', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w009', date: 'Wed, Nov 11', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w010', date: 'Wed, Nov 18', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w011', date: 'Wed, Dec 2', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w012', date: 'Wed, Dec 9', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w013', date: 'Wed, Dec 16', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w014', date: 'Wed, Jan 6', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w015', date: 'Wed, Jan 13', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w016', date: 'Wed, Jan 20', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w017', date: 'Wed, Jan 27', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w018', date: 'Wed, Feb 3', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w019', date: 'Wed, Feb 10', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w020', date: 'Wed, Feb 17', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w021', date: 'Wed, Feb 24', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_5b2_w022', date: 'Wed, Mar 3', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: '5th Boys Select B' },
  { id: 'sp_7b_019', date: 'Fri, Sep 11', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_020', date: 'Fri, Sep 18', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_021', date: 'Fri, Sep 25', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_022', date: 'Fri, Oct 16', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_023', date: 'Fri, Oct 23', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_024', date: 'Fri, Oct 30', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_025', date: 'Fri, Nov 6', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_026', date: 'Fri, Nov 13', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_027', date: 'Fri, Nov 20', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_028', date: 'Fri, Dec 4', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_029', date: 'Fri, Dec 11', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_030', date: 'Fri, Dec 18', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_031', date: 'Fri, Jan 8', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_032', date: 'Fri, Jan 15', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_033', date: 'Fri, Jan 22', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_034', date: 'Fri, Jan 29', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_035', date: 'Fri, Feb 5', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_036', date: 'Fri, Feb 12', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_037', date: 'Fri, Feb 19', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_038', date: 'Fri, Feb 26', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_7b_039', date: 'Fri, Mar 5', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Boys Select A' },
  { id: 'sp_8g_004', date: 'Fri, Sep 25', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '8th Girls Select' },
  { id: 'sp_7g_020', date: 'Fri, Oct 16', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_021', date: 'Fri, Oct 23', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_022', date: 'Fri, Oct 30', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_023', date: 'Fri, Nov 6', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_024', date: 'Fri, Nov 13', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_025', date: 'Fri, Nov 20', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_026', date: 'Fri, Dec 4', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_027', date: 'Fri, Dec 11', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_028', date: 'Fri, Dec 18', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_029', date: 'Fri, Jan 8', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_030', date: 'Fri, Jan 15', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_031', date: 'Fri, Jan 22', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_032', date: 'Fri, Jan 29', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_033', date: 'Fri, Feb 5', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_034', date: 'Fri, Feb 12', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_035', date: 'Fri, Feb 19', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_036', date: 'Fri, Feb 26', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
  { id: 'sp_7g_037', date: 'Fri, Mar 5', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: '7th Girls Select' },
];

// No seed messages — real ones come from coaches via the portal.
// (Anything listed here is re-inserted by useSupabaseTable after you delete it.)
export const INITIAL_MESSAGES = [];

export const INITIAL_STAFF = [
  { id: 'st1', name: "Joshua Nehr", role: "Coach", program: 'Recreation', team: "Rising 4th-5th Boys", email: "joshuanehr@gmail.com", phone: "(720) 532-5737", bgCheckStatus: "Expired", bgCheckDate: '' },
  { id: 'st2', name: "Artemus Gwynn", role: "Scorekeeper", program: 'Recreation', team: "Rising 2nd-3rd Boys", email: "artemus.gwynn@gmail.com", phone: "(336) 577-4105", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'st3', name: "Nabil Ali", role: "League Director", program: 'Recreation', team: "Rising 4th-5th Boys", email: "syednabilali@gmail.com", phone: "(703) 994-2211", bgCheckStatus: "Expired", bgCheckDate: '' },
  { id: 'st4', name: "Gene Kintgen", role: "Assistant Coach", program: 'Recreation', team: "Rising 4th-5th Boys", email: "ekintgen@gmail.com", phone: "(812) 340-4749", bgCheckStatus: "Expired", bgCheckDate: '' },
  { id: 'st5', name: "Braylen Coleman", role: "Scorekeeper", program: 'Recreation', team: "Girls 3v3 (2nd-8th)", email: "braylenjcoleman@icloud.com", phone: "(571) 221-2134", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'st6', name: "Nick Blessing", role: "Coach", program: 'Recreation', team: "Rising 2nd-3rd Boys", email: "n.blessing33@gmail.com", phone: "7034479462", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'st7', name: "Jim Quinn", role: "Coach", program: 'Recreation', team: "Rising 4th-5th Boys", email: "james.john.quinn@gmail.com", phone: "(201)951-2824", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'st8', name: "Shaun Ali", role: "Coach", program: 'Recreation', team: "Rising 4th-5th Boys", email: "shaunali34@gmail.com", phone: "(703) 989-0847", bgCheckStatus: "Expired", bgCheckDate: '' },
  { id: 'st9', name: "Adam Schrecengost", role: "Assistant Coach", program: 'Recreation', team: "Rising 4th-5th Boys", email: "schreckdc@gmail.com", phone: "(202)937-5119", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'st10', name: "Adam Schrecengost", role: "Assistant Coach", program: 'Recreation', team: "Girls 3v3 (2nd-8th)", email: "schreckdc@gmail.com", phone: "(202)937-5119", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'st11', name: "Dale Van Wagner", role: "Assistant Coach", program: 'Recreation', team: "Rising 4th-5th Boys", email: "dale.vanwagner@gmail.com", phone: "(215) 499-5165", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'st12', name: "Kesara Liyanage", role: "Coach", program: 'Recreation', team: "Rising 4th-5th Boys", email: "kliyanage30@gmail.com", phone: "", bgCheckStatus: "Not Started", bgCheckDate: '' },
  // Travel Select coaches — Summer 2026 (program: 'Select' so they appear under the Select tab)
  { id: 'ts_c1', name: "Aidris Daud",   role: "Head Coach", program: 'Select', team: "Aidris B5",   email: "aidris@keydmv.com", phone: "703-447-1184", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'ts_c2', name: "Coach Tom",     role: "Head Coach", program: 'Select', team: "Tom B6",      email: "", phone: "", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'ts_c3', name: "Mike Do",       role: "Head Coach", program: 'Select', team: "Mike Do G6",  email: "michaeldo82@gmail.com", phone: "(571) 328-8126", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'ts_c4', name: "Coach Earnest", role: "Head Coach", program: 'Select', team: "Earnest G7",  email: "", phone: "", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'ts_c5', name: "Coach Rene",    role: "Head Coach", program: 'Select', team: "Rene B7",     email: "", phone: "", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'ts_c6', name: "Mike Lee",      role: "Head Coach", program: 'Select', team: "Mike Lee B8", email: "", phone: "", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'ts_c7', name: "Coach Keun",    role: "Head Coach", program: 'Select', team: "8th Boys Select B",   email: "keunyoo29@gmail.com", phone: "(702) 887-3034", bgCheckStatus: "Not Started", bgCheckDate: null },
  // Winter 2026-27 Select coaches
  { id: 'sel_c5b', name: "Aidris Daud",      role: "Head Coach", program: 'Select', team: "5th Boys Select A",  email: "aidris@keydmv.com",           phone: "703-447-1184", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'sel_c5g', name: "Fazle Taher",      role: "Head Coach", program: 'Select', team: "5th Girls Select", email: "coachftaher@gmail.com",       phone: "703-835-1552", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'sel_c6b', name: "Thomas Schneider", role: "Head Coach", program: 'Select', team: "6th Boys Select A",  email: "schnet@gmail.com",            phone: "603-809-2483", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'sel_c6g', name: "Michael Do",       role: "Head Coach", program: 'Select', team: "6th Girls Select", email: "michaeldo82@gmail.com",       phone: "571-328-8126", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'sel_c7b', name: "Tim Anderson",     role: "Head Coach", program: 'Select', team: "7th Boys Select A",  email: "timjanderson7@gmail.com",     phone: "915-474-8825", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'sel_c7g', name: "Earnest Williams", role: "Head Coach", program: 'Select', team: "7th Girls Select", email: "williamssrearnest@gmail.com", phone: "571-682-9432", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'sel_c8b', name: "Mike Lee",         role: "Head Coach", program: 'Select', team: "8th Boys Select A",  email: "michael.lee24@gmail.com",     phone: "703-965-8104", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'sel_c8g', name: "Brett Schmitz",    role: "Head Coach", program: 'Select', team: "8th Girls Select", email: "brettschmitz@yahoo.com",      phone: "",              bgCheckStatus: "Not Started", bgCheckDate: null },
  // Second boys teams, added once tryouts settled on numbers
  { id: 'sel_c5b2', name: "Mike Hartwich",   role: "Assistant Coach", program: 'Select', team: "5th Boys Select A", email: "gatrheel@gmail.com", phone: "",             bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'sel_c5b3', name: "Nabil Ali",       role: "Head Coach", program: 'Select', team: "5th Boys Select B", email: "syednabilali@gmail.com", phone: "703-994-2211", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'sel_c6b2', name: "Shaun Ali",       role: "Head Coach", program: 'Select', team: "6th Boys Select B", email: "shaunali34@gmail.com", phone: "703-989-0847", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'sel_c7b2', name: "Tom Schneider",   role: "Head Coach", program: 'Select', team: "7th Boys Select B", email: "schnet@gmail.com",    phone: "603-809-2483", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'sel_c6b3', name: "Matthew Dennis",  role: "Head Coach", program: 'Select', team: "6th Boys Select C", email: "matthewsdennis@gmail.com", phone: "", bgCheckStatus: "Not Started", bgCheckDate: null },
  // Training staff
  { id: 'tr1', name: "Nabil Ali",            role: "Director",  program: 'Training', team: '', email: "syednabilali@gmail.com",  phone: "(703) 994-2211", bgCheckStatus: "Expired",     bgCheckDate: null },
  { id: 'tr2', name: "Shaun Ali",            role: "Trainer",   program: 'Training', team: '', email: "shaunali34@gmail.com",    phone: "(703) 989-0847", bgCheckStatus: "Expired",     bgCheckDate: null },
  { id: 'tr3', name: "Kesara Liyanage",      role: "Trainer",   program: 'Training', team: '', email: "kliyanage30@gmail.com",   phone: "",               bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'tr4', name: "Aidris Daud",          role: "Trainer",   program: 'Training', team: '', email: "aidris@keydmv.com",       phone: "703-447-1184",   bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'tr5', name: "PJ Kelly",             role: "Trainer",   program: 'Training', team: '', email: "",                        phone: "",               bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'tr6', name: "Nikan",                role: "Trainer",   program: 'Training', team: '', email: "",                        phone: "",               bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'tr7', name: "Margad Choijilsuren",  role: "Trainer",   program: 'Training', team: '', email: "",                        phone: "",               bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'tr8', name: "Hafsa Ali",            role: "Trainer",   program: 'Training', team: '', email: "",                        phone: "",               bgCheckStatus: "Not Started", bgCheckDate: null },
  // Board / Operations
  { id: 'op1', name: "Rubaat Ali",           role: "Operations Director", program: 'Operations', team: '', email: "rubaat.i@gmail.com", phone: "", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'op2', name: "George Ragan",         role: "Select Director",    program: 'Operations', team: '', email: "fpycselect@gmail.com", phone: "", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'op3', name: "Russell Finelson",     role: "Ref Director",       program: 'Operations', team: '', email: "fpycreferee@gmail.com", phone: "", bgCheckStatus: "Not Started", bgCheckDate: null },
  // Winter 2026-27 Recreation (house league) staff, from the registration export.
  // team: 'Unassigned' = registered but no Boys/Girls team on their form yet --
  // needs manual follow-up to confirm which team they're actually with.
  { id: 'rst1', name: "Jay Zimmer", role: "Assistant Coach", program: 'Recreation', team: "5/6 Girls", email: "jay.w.zimmer@gmail.com", phone: "(703) 963-4979", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst2', name: "Brett Ringo", role: "Assistant Coach", program: 'Recreation', team: "7/8 Boys", email: "ringob5516@gmail.com", phone: "(860) 593-9902", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst3', name: "Sean Harrington", role: "Assistant Coach", program: 'Recreation', team: "5/6 Girls", email: "wreck.harrington@gmail.com", phone: "(781) 608-9678", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst4', name: "Sean Harrington", role: "Assistant Coach", program: 'Recreation', team: "3/4 Girls", email: "wreck.harrington@gmail.com", phone: "(781) 608-9678", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst5', name: "LaToya Johnson", role: "Coach", program: 'Recreation', team: "5/6 Girls", email: "rj.mccray@irs.gov", phone: "(434)594-5252", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst6', name: "RJ McCray", role: "Assistant Coach", program: 'Recreation', team: "Unassigned", email: "mccrayrj@hotmail.com", phone: "(318) 792-5330", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst7', name: "Daniel Marsh", role: "Coach", program: 'Recreation', team: "K-3 3v3", email: "dancmarsh@gmail.com", phone: "(703) 517-4464", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst8', name: "Ainsley Marsh", role: "Coach", program: 'Recreation', team: "3/4 Girls", email: "ainsleyerin421@gmail.com", phone: "(703) 517-1357", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst9', name: "Joey Grosso", role: "Assistant Coach", program: 'Recreation', team: "K-3 3v3", email: "grossojv70@gmail.com", phone: "(215)495-2962", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst10', name: "Jonathan Goldberger", role: "Assistant Coach", program: 'Recreation', team: "K-3 3v3", email: "Jgoldber@gmail.com", phone: "7039817695", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst11', name: "Humberto Mercado", role: "Coach", program: 'Recreation', team: "HS Boys", email: "mercadosfam5@gmail.com", phone: "(571) 331-7363", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst12', name: "Megan Zamyatin", role: "Assistant Coach", program: 'Recreation', team: "5/6 Girls", email: "meganzamyatin@gmail.com", phone: "(515) 450-2558", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst13', name: "Anup Manoharan", role: "Coach", program: 'Recreation', team: "7/8 Girls", email: "emanoh@hotmail.com", phone: "(248) 302-4123", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst14', name: "Kunal Savdharia", role: "Assistant Coach", program: 'Recreation', team: "Unassigned", email: "kunaljs@outlook.com", phone: "(703) 870-4493", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst15', name: "Kunal Savdharia", role: "Assistant Coach", program: 'Recreation', team: "7/8 Girls", email: "kunaljs@outlook.com", phone: "(703) 870-4493", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst16', name: "Dan Cook", role: "Coach", program: 'Recreation', team: "7/8 Girls", email: "dhciii@gmail.com", phone: "(240) 813-5457", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst17', name: "Kalyna Watts", role: "Scorekeeper", program: 'Recreation', team: "7/8 Boys", email: "kalynamalm@gmail.com", phone: "(703)944-4982", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst18', name: "Nicholas Continetti", role: "Assistant Coach", program: 'Recreation', team: "5/6 Girls", email: "n.continetti@gmail.com", phone: "(703) 304-1284", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst19', name: "Alex Valvis", role: "Assistant Coach", program: 'Recreation', team: "3/4 Boys", email: "alex.valvis@gmail.com", phone: "(973) 968-1900", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst20', name: "Dan Sharma", role: "League Director", program: 'Recreation', team: "5/6 Girls", email: "dansharma@gmail.com", phone: "(703) 376-7030", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst21', name: "Catherine Foster", role: "Scorekeeper", program: 'Recreation', team: "5/6 Girls", email: "catherinepfoster@gmail.com", phone: "(510) 847-8562", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst22', name: "Brian Cleary", role: "Coach", program: 'Recreation', team: "7/8 Boys", email: "clearybrianj@gmail.com", phone: "7035178350", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst23', name: "Nabil Ali", role: "League Director", program: 'Recreation', team: "K-3 3v3", email: "syednabilali@gmail.com", phone: "(703) 994-2211", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst24', name: "Eduwell Jenkins", role: "Assistant Coach", program: 'Recreation', team: "K-3 3v3", email: "ejenkins82@gmail.com", phone: "8082285386", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst25', name: "Christopher DeSimone", role: "Assistant Coach", program: 'Recreation', team: "7/8 Boys", email: "cjdesimone@gmail.com", phone: "(703) 896-0601", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst26', name: "James Brixius", role: "Coach", program: 'Recreation', team: "3/4 Girls", email: "james.j.brixius@gmail.com", phone: "(703) 965-2650", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst27', name: "James Brixius", role: "Coach", program: 'Recreation', team: "7/8 Girls", email: "james.j.brixius@gmail.com", phone: "(703) 965-2650", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst28', name: "Ross Baker", role: "Coach", program: 'Recreation', team: "3/4 Boys", email: "bossraker@gmail.com", phone: "(413) 575-1501", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst29', name: "Ross Baker", role: "Assistant Coach", program: 'Recreation', team: "7/8 Girls", email: "bossraker@gmail.com", phone: "(413) 575-1501", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst30', name: "Steven Diamond", role: "Coach", program: 'Recreation', team: "K-3 3v3", email: "steve.diamond09@gmail.com", phone: "(301) 537-5535", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst31', name: "John Baer", role: "Coach", program: 'Recreation', team: "K-3 3v3", email: "jdbaer@hotmail.com", phone: "(317)946-9942", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst32', name: "Shaun Ali", role: "League Director", program: 'Recreation', team: "3/4 Boys", email: "shaunali34@gmail.com", phone: "(703) 989-0847", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst33', name: "Shaun Ali", role: "Coach", program: 'Recreation', team: "K-3 3v3", email: "shaunali34@gmail.com", phone: "(703) 989-0847", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst34', name: "Steven Townes", role: "Assistant Coach", program: 'Recreation', team: "5/6 Girls", email: "stownes@gmail.com", phone: "(919) 539-2982", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst35', name: "Jim Hanley", role: "Scorekeeper", program: 'Recreation', team: "3/4 Girls", email: "jasrhanley12@gmail.com", phone: "(585)414-2934", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst36', name: "Sean Mazer", role: "Coach", program: 'Recreation', team: "3/4 Boys", email: "seanamazer@gmail.com", phone: "8083217653", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst37', name: "DeAndre Harris", role: "Coach", program: 'Recreation', team: "Unassigned", email: "deandreh5@gmail.com", phone: "(703) 728-2564", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst38', name: "DeAndre Harris", role: "Scorekeeper", program: 'Recreation', team: "Unassigned", email: "deandreh5@gmail.com", phone: "(703) 728-2564", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst39', name: "Vishal Bhakta", role: "Assistant Coach", program: 'Recreation', team: "7/8 Girls", email: "vishal.bhakta@gmail.com", phone: "4792833785", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst40', name: "Brian Saal", role: "Scorekeeper", program: 'Recreation', team: "5/6 Boys", email: "b_saal@yahoo.com", phone: "(703) 609-4994", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst41', name: "Adam Basinger", role: "League Director", program: 'Recreation', team: "5/6 Boys", email: "adambasinger3@hotmail.com", phone: "(703) 943-6413", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst42', name: "Molly Friedson", role: "Assistant Coach", program: 'Recreation', team: "3/4 Girls", email: "mdubsfriedson@gmail.com", phone: "(315) 727-1256", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst43', name: "Laura Bowles", role: "Coach", program: 'Recreation', team: "Unassigned", email: "lauralbowles@gmail.com", phone: "(703) 835-1546", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst44', name: "Laura Bowles", role: "Coach", program: 'Recreation', team: "3/4 Girls", email: "lauralbowles@gmail.com", phone: "(703) 835-1546", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst45', name: "Laura Bowles", role: "Assistant Coach", program: 'Recreation', team: "5/6 Boys", email: "lauralbowles@gmail.com", phone: "(703) 835-1546", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst46', name: "Haoran Li", role: "Assistant Coach", program: 'Recreation', team: "K-3 3v3", email: "haoran1925@gmail.com", phone: "(571)789-6678", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst47', name: "Christopher Brophy", role: "Assistant Coach", program: 'Recreation', team: "3/4 Boys", email: "brophyct@gmail.com", phone: "(414) 477-7609", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst48', name: "Thomas Barrett", role: "Assistant Coach", program: 'Recreation', team: "K-3 3v3", email: "Thomas.john.barrett@gmail.com", phone: "(978) 314-6941", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst49', name: "Emily St. Jacques", role: "Assistant Coach", program: 'Recreation', team: "7/8 Girls", email: "emily.stube@gmail.com", phone: "(703) 851-2201", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst50', name: "Shawn Steel", role: "Assistant Coach", program: 'Recreation', team: "5/6 Boys", email: "shawn@famofsteel.com", phone: "(703) 350-5940", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst51', name: "Matt Habibi", role: "Assistant Coach", program: 'Recreation', team: "Unassigned", email: "warden26@yahoo.com", phone: "(571) 215-6232", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst52', name: "Danielle Powell", role: "Assistant Coach", program: 'Recreation', team: "5/6 Boys", email: "danielle.powell10@gmail.com", phone: "(571) 228-6323", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst53', name: "Victor Imoh", role: "Assistant Coach", program: 'Recreation', team: "Unassigned", email: "victorimoh@gmail.com", phone: "7038620738", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst54', name: "Jeremy Burkhart", role: "Coach", program: 'Recreation', team: "K-3 3v3", email: "jeremy.d.burkhart@gmail.com", phone: "(740) 360-3776", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst55', name: "Alex Valvis", role: "Assistant Coach", program: 'Recreation', team: "K-3 3v3", email: "alex.valvis@gmail.com", phone: "(973) 968-1900", bgCheckStatus: "Not Started", bgCheckDate: null },
  { id: 'rst56', name: "Marcus Habibi", role: "Scorekeeper", program: 'Recreation', team: "Unassigned", email: "mhabibi@gwu.edu", phone: "(571) 215-6232", bgCheckStatus: "Not Started", bgCheckDate: null },

  // ── Added from the 2026-11-11 Ottosport team staff export (deltas only;
  // these registrations show PENDING REVIEW there, so double-check bg checks) ──
  { id: 'rst57', name: "Jay Zimmer", role: "Coach", program: 'Recreation', team: "5/6 Girls", email: "jay.w.zimmer@gmail.com", phone: "(703) 963-4979", bgCheckStatus: 'Not Started', bgCheckDate: null },
  { id: 'rst58', name: "Matt Habibi", role: "Assistant Coach", program: 'Recreation', team: "5/6 Boys", email: "warden26@yahoo.com", phone: "(571) 215-6232", bgCheckStatus: 'Not Started', bgCheckDate: null },
  { id: 'rst59', name: "Deborah Anderson", role: "Coach", program: 'Recreation', team: "3/4 Girls", email: "tdjanderson@gmail.com", phone: "(209)404-6285", bgCheckStatus: 'Not Started', bgCheckDate: null },
  { id: 'rst60', name: "Bobby Lee", role: "Coach", program: 'Recreation', team: "K-3 3v3", email: "bobbylee810@gmail.com", phone: "(443) 610-9521", bgCheckStatus: 'Not Started', bgCheckDate: null },
  { id: 'rst61', name: "Amy Spradlin", role: "Assistant Coach", program: 'Recreation', team: "5/6 Girls", email: "amy.spradlin@gmail.com", phone: "(703)283-6113", bgCheckStatus: 'Not Started', bgCheckDate: null },
  { id: 'rst62', name: "John Cressman", role: "Coach", program: 'Recreation', team: "5/6 Boys", email: "jcressma@gmu.edu", phone: "(703) 585-9411", bgCheckStatus: 'Not Started', bgCheckDate: null },
  { id: 'rst63', name: "Bryson Smith", role: "Coach", program: 'Recreation', team: "7/8 Girls", email: "brysonsmith@vaumc.org", phone: "(571)245-9627", bgCheckStatus: 'Not Started', bgCheckDate: null },
  { id: 'rst64', name: "Adam Parker", role: "Coach", program: 'Recreation', team: "5/6 Boys", email: "threekaps@gmail.com", phone: "(703) 209-7636", bgCheckStatus: 'Not Started', bgCheckDate: null },
  { id: 'rst65', name: "Ashley Freitas", role: "Scorekeeper", program: 'Recreation', team: "K-3 3v3", email: "ashleymba2010@gmail.com", phone: "(916) 626-7232", bgCheckStatus: 'Not Started', bgCheckDate: null },
  { id: 'rst66', name: "Eric Lipp", role: "Coach", program: 'Recreation', team: "5/6 Girls", email: "wvlippo@gmail.com", phone: "(703)470-3518", bgCheckStatus: 'Not Started', bgCheckDate: null },
  { id: 'rst67', name: "Tyler Maxwell", role: "Assistant Coach", program: 'Recreation', team: "HS Boys", email: "tylerdmaxwell529@gmail.com", phone: "(907) 227-1114", bgCheckStatus: 'Not Started', bgCheckDate: null },

  // ── Added from the 2026-11-12 Ottosport team staff export (deltas only) ──
  { id: 'rst68', name: "Ehsan Shirazi", role: "Coach", program: 'Recreation', team: "5/6 Boys", email: "ehsan1shirazi@gmail.com", phone: "(410) 300-0877", bgCheckStatus: 'Not Started', bgCheckDate: null },
  { id: 'rst69', name: "Mike McLenahan", role: "Coach", program: 'Recreation', team: "5/6 Boys", email: "mmclenahan@hotmail.com", phone: "(703) 303-9848", bgCheckStatus: 'Not Started', bgCheckDate: null },
];

export function useStaff() {
  return useSupabaseTable('staff', INITIAL_STAFF);
}

export function usePlayers() {
  return useSupabaseTable('players', INITIAL_PLAYERS);
}

export function useGames() {
  return useSupabaseTable('games', INITIAL_GAMES);
}

export function usePractices() {
  return useSupabaseTable('practices', INITIAL_PRACTICES);
}

export function useMessages() {
  return useSupabaseTable('messages', INITIAL_MESSAGES);
}

export function usePayments() {
  return useSupabaseTable('payments', []);
}

export function useAttendance() {
  return useSupabaseTable('attendance', []);
}

export function useOfficials() {
  return useSupabaseTable('officials', []);
}

// Summer 2026 gym permits — from NCS permit system
const INITIAL_GYM_PERMITS = [
  {
    id: 'gp-4686422',
    gym_name: 'Providence ES',
    season: 'summer',
    year: 2026,
    days: ['Mon', 'Wed', 'Fri'],
    start_time: '18:00',
    end_time: '21:00',
    start_date: '2026-06-15',
    end_date: '2026-07-31',
    sport: 'basketball',
    notes: 'Permit #4686422 — FPYC Summer Basketball',
  },
  {
    id: 'gp-4698157',
    gym_name: 'KJMS #1',
    season: 'summer',
    year: 2026,
    days: ['Mon', 'Wed', 'Fri'],
    start_time: '18:00',
    end_time: '21:00',
    start_date: '2026-06-22',
    end_date: '2026-08-07',
    sport: 'basketball',
    notes: 'Permit #4698157 — Summer Basketball FPYC (Johnson MS Gym #1)',
  },
  {
    id: 'gp-4698157-2',
    gym_name: 'KJMS #2',
    season: 'summer',
    year: 2026,
    days: ['Mon', 'Wed', 'Fri'],
    start_time: '18:00',
    end_time: '21:00',
    start_date: '2026-06-22',
    end_date: '2026-08-07',
    sport: 'basketball',
    notes: 'Permit #4698157 — Summer Basketball FPYC (Johnson MS Gym #2)',
  },
  {
    id: 'gp-4700223',
    gym_name: 'Fairfax HS',
    season: 'summer',
    year: 2026,
    days: ['Mon', 'Wed', 'Fri'],
    start_time: '18:00',
    end_time: '21:00',
    start_date: '2026-06-15',
    end_date: '2026-07-27',
    sport: 'basketball',
    notes: 'Permit #4700223 — Summer Basketball FPYC FH 6pm-9pm',
  },

  // ── Fall 2026 · FPYC M-F Fall 2026 permit (issued Jul 7, 2026) ─────────────
  // Mon–Fri 6–9 PM at all four gyms, Sep 8 – Nov 24.
  {
    id: 'gp-fall26-prov',
    gym_name: 'Providence ES',
    season: 'fall',
    year: 2026,
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    start_time: '18:00',
    end_time: '21:00',
    start_date: '2026-09-08',
    end_date: '2026-11-24',
    sport: 'basketball',
    notes: 'ProvGymFPYCM-FFall2026 — no Mon Sep 21',
  },
  {
    id: 'gp-fall26-danrun',
    gym_name: 'Daniels Run ES',
    season: 'fall',
    year: 2026,
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    start_time: '18:00',
    end_time: '21:00',
    start_date: '2026-09-08',
    end_date: '2026-11-24',
    sport: 'basketball',
    notes: 'DanRunGymFPYCM-FFall2026',
  },
  {
    id: 'gp-fall26-kjms1',
    gym_name: 'KJMS #1',
    season: 'fall',
    year: 2026,
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    start_time: '18:00',
    end_time: '21:00',
    start_date: '2026-09-08',
    end_date: '2026-11-24',
    sport: 'basketball',
    notes: 'KJMSGymFPYCM-FFall2026 (Johnson MS Gym #1) — no Mon Sep 21 · Wednesdays Sep 16-Nov 18 held for volleyball',
  },
  {
    id: 'gp-fall26-kjms2',
    gym_name: 'KJMS #2',
    season: 'fall',
    year: 2026,
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    start_time: '18:00',
    end_time: '21:00',
    start_date: '2026-09-08',
    end_date: '2026-11-24',
    sport: 'basketball',
    notes: 'KJMSGymFPYCM-FFall2026 (Johnson MS Gym #2) — no Mon Sep 21 · Wednesdays Sep 16-Nov 18 held for volleyball',
  },

  // ── Winter 2026-27 · Select weekend space (preview, City of Fairfax) ───────
  // Not finalized — confirm before 11/9 or FPYC is charged for unused time.
  {
    id: 'gp-winter26-daniels-sat',
    gym_name: 'Daniels Run ES',
    season: 'winter',
    year: 2026,
    days: ['Sat'],
    start_time: '08:00',
    end_time: '19:00',
    start_date: '2026-12-05',
    end_date: '2027-03-20',
    sport: 'basketball',
    notes: 'Preview — Select weekend space, confirm with City of Fairfax by 11/9',
  },
  {
    id: 'gp-winter26-daniels-sun',
    gym_name: 'Daniels Run ES',
    season: 'winter',
    year: 2026,
    days: ['Sun'],
    start_time: '11:45',
    end_time: '19:00',
    start_date: '2026-12-06',
    end_date: '2027-03-21',
    sport: 'basketball',
    notes: 'Preview — Select weekend space, confirm with City of Fairfax by 11/9',
  },
  {
    id: 'gp-winter26-prov-sat',
    gym_name: 'Providence ES',
    season: 'winter',
    year: 2026,
    days: ['Sat'],
    start_time: '08:00',
    end_time: '19:00',
    start_date: '2026-12-05',
    end_date: '2027-03-20',
    sport: 'basketball',
    notes: 'Preview — Select weekend space, confirm with City of Fairfax by 11/9 · no Sundays',
  },
  {
    id: 'gp-winter26-kjms1-sat',
    gym_name: 'KJMS #1',
    season: 'winter',
    year: 2026,
    days: ['Sat'],
    start_time: '08:00',
    end_time: '21:00',
    start_date: '2026-12-05',
    end_date: '2027-03-20',
    sport: 'basketball',
    notes: 'Select weekend space · Sat 12/12 starts at 1:00 PM instead of 8:00 AM',
  },
  {
    id: 'gp-winter26-kjms2-sat',
    gym_name: 'KJMS #2',
    season: 'winter',
    year: 2026,
    days: ['Sat'],
    start_time: '08:00',
    end_time: '21:00',
    start_date: '2026-12-05',
    end_date: '2027-03-20',
    sport: 'basketball',
    notes: 'Select weekend space · Sat 12/12 starts at 1:00 PM instead of 8:00 AM',
  },
  {
    id: 'gp-winter26-kjms1-sun',
    gym_name: 'KJMS #1',
    season: 'winter',
    year: 2026,
    days: ['Sun'],
    start_time: '11:45',
    end_time: '19:00',
    start_date: '2026-12-06',
    end_date: '2027-03-21',
    sport: 'basketball',
    notes: 'Preview — Select weekend space, confirm with City of Fairfax by 11/9',
  },
  {
    id: 'gp-winter26-kjms2-sun',
    gym_name: 'KJMS #2',
    season: 'winter',
    year: 2026,
    days: ['Sun'],
    start_time: '11:45',
    end_time: '19:00',
    start_date: '2026-12-06',
    end_date: '2027-03-21',
    sport: 'basketball',
    notes: 'Preview — Select weekend space, confirm with City of Fairfax by 11/9',
  },
  {
    id: 'gp-winter26-fhs-sun',
    gym_name: 'Fairfax HS',
    season: 'winter',
    year: 2026,
    days: ['Sun'],
    start_time: '11:45',
    end_time: '19:00',
    start_date: '2026-12-06',
    end_date: '2027-03-14',
    sport: 'basketball',
    notes: 'Preview — Select weekend space (FHS Main Gym), confirm with City of Fairfax by 11/9',
  },
];

export function useGymPermits() {
  return useSupabaseTable('gym_permits', INITIAL_GYM_PERMITS);
}

// Public sign-up submissions from the website (staff-read via RLS).
export function useRefSignups() {
  return useSupabaseTable('ref_signups', []);
}

export function useVolunteerSignups() {
  return useSupabaseTable('volunteer_signups', []);
}

export function useBlackoutDates() {
  return useSupabaseTable('blackout_dates', []);
}

// Player evaluations (house league / rec), scoped by sport. Stored as one row
// per player with skills as jsonb, so coaches' entries sync across devices
// instead of living only in that browser's localStorage.
export function useEvaluations(sport) {
  const [rows, setRows] = useSupabaseTable('evaluations', []);
  const scoped = rows.filter(r => r.sport === sport);

  const evals = Object.fromEntries(scoped.map(r => [r.player_id, r.skills || {}]));
  const notes = Object.fromEntries(scoped.map(r => [r.player_id, r.notes || '']));

  const setEvals = useCallback(updaterOrValue => {
    setRows(prev => {
      const prevEvals = Object.fromEntries(
        prev.filter(r => r.sport === sport).map(r => [r.player_id, r.skills || {}])
      );
      const nextEvals = typeof updaterOrValue === 'function' ? updaterOrValue(prevEvals) : updaterOrValue;
      const others = prev.filter(r => r.sport !== sport);
      const scopedRows = prev.filter(r => r.sport === sport);
      const byPlayer = new Map(scopedRows.map(r => [r.player_id, r]));
      const nextScoped = Object.entries(nextEvals).map(([playerId, skills]) => ({
        id: `${sport}_${playerId}`,
        player_id: playerId,
        sport,
        skills,
        notes: byPlayer.get(playerId)?.notes || '',
      }));
      return [...others, ...nextScoped];
    });
  }, [sport, setRows]);

  const setNotes = useCallback(updaterOrValue => {
    setRows(prev => {
      const prevNotes = Object.fromEntries(
        prev.filter(r => r.sport === sport).map(r => [r.player_id, r.notes || ''])
      );
      const nextNotes = typeof updaterOrValue === 'function' ? updaterOrValue(prevNotes) : updaterOrValue;
      const others = prev.filter(r => r.sport !== sport);
      const scopedRows = prev.filter(r => r.sport === sport);
      const byPlayer = new Map(scopedRows.map(r => [r.player_id, r]));
      const nextScoped = Object.entries(nextNotes).map(([playerId, noteText]) => ({
        id: `${sport}_${playerId}`,
        player_id: playerId,
        sport,
        skills: byPlayer.get(playerId)?.skills || {},
        notes: noteText,
      }));
      return [...others, ...nextScoped];
    });
  }, [sport, setRows]);

  return [evals, setEvals, notes, setNotes];
}

// Draft board sessions -- stored one per row as a jsonb blob (teams, roster,
// pick log, etc. don't map cleanly to columns) so they sync across devices
// and League Directors instead of living in one browser's localStorage.
export function useDrafts() {
  return useSupabaseJsonList('drafts', []);
}

// ─── Draft Board ──────────────────────────────────────────────────────────────

export function buildSnakeOrder(teamIds, rounds) {
  const order = [];
  for (let r = 0; r < rounds; r++) {
    const round = r % 2 === 0 ? [...teamIds] : [...teamIds].reverse();
    order.push(...round);
  }
  return order;
}

// ─── Playoff Bracket ──────────────────────────────────────────────────────────
// 4-team single-elimination. Seeds are indices into the seeds array.

const DIVISION_SEEDS = {
  'Boys 5–6 House': [
    { seed: 1, name: 'Centreville Eagles', record: '8–1', fpyc: false },
    { seed: 2, name: 'Fairfax Hawks',       record: '6–3', fpyc: true  },
    { seed: 3, name: 'Vienna Storm',        record: '5–4', fpyc: false },
    { seed: 4, name: 'Reston Wolves',       record: '5–4', fpyc: false },
  ],
  'Girls 5–6 House': [
    { seed: 1, name: 'Arlington Stars',  record: '7–2', fpyc: false },
    { seed: 2, name: 'McLean Cardinals', record: '6–3', fpyc: false },
    { seed: 3, name: 'Vienna Rockets',   record: '5–4', fpyc: false },
    { seed: 4, name: 'Fairfax Wolves',   record: '4–5', fpyc: true  },
  ],
  'Boys 7–8 Select': [
    { seed: 1, name: 'Fairfax Eagles', record: '8–1', fpyc: true  },
    { seed: 2, name: 'McLean Select',  record: '7–2', fpyc: false },
    { seed: 3, name: 'Reston Select',  record: '5–4', fpyc: false },
    { seed: 4, name: 'Arlington Gold', record: '4–5', fpyc: false },
  ],
  'Girls 3–4 House': [
    { seed: 1, name: 'Arlington Aces',  record: '7–2', fpyc: false },
    { seed: 2, name: 'Reston Stars',    record: '6–3', fpyc: false },
    { seed: 3, name: 'Vienna Flames',   record: '5–4', fpyc: false },
    { seed: 4, name: 'Fairfax Cougars', record: '3–6', fpyc: true  },
  ],
};

function makeBracket(division) {
  return {
    status: 'setup',
    division,
    season: '2025–26',
    seeds: DIVISION_SEEDS[division],
    semis: [
      { id: 's1', top: 0, bottom: 3, scoreTop: null, scoreBottom: null, winner: null, date: 'Sat, Jan 11', time: '10:00 AM', location: 'Robinson Secondary · Gym B' },
      { id: 's2', top: 1, bottom: 2, scoreTop: null, scoreBottom: null, winner: null, date: 'Sat, Jan 11', time: '11:30 AM', location: 'Robinson Secondary · Gym B' },
    ],
    final: { top: null, bottom: null, scoreTop: null, scoreBottom: null, winner: null, date: 'Sat, Jan 18', time: '10:00 AM', location: 'Robinson Secondary · Gym A' },
    champion: null,
  };
}

export const INITIAL_BRACKETS = {
  'Boys 5–6 House':  makeBracket('Boys 5–6 House'),
  'Girls 5–6 House': makeBracket('Girls 5–6 House'),
  'Boys 7–8 Select': makeBracket('Boys 7–8 Select'),
  'Girls 3–4 House': makeBracket('Girls 3–4 House'),
};

export function useBrackets() {
  return useLocalStorage('fpyc-brackets', INITIAL_BRACKETS);
}

// Legacy single-bracket shim (Boys 5–6 House) — used by SeasonRecap
export const INITIAL_BRACKET = INITIAL_BRACKETS['Boys 5–6 House'];
export function useBracket() {
  return useLocalStorage('fpyc-bracket', INITIAL_BRACKET);
}

// ─── Standings ────────────────────────────────────────────────────────────────

export const PLAYOFF_SPOTS = 4;

export const INITIAL_STANDINGS = {
  'Boys 5–6 House': [
    { rank: 1, team: 'Centreville Eagles', fpyc: false, w: 8, l: 1, pf: 524, pa: 398, streak: 'W3' },
    { rank: 2, team: 'Fairfax Hawks',       fpyc: true,  w: 6, l: 3, pf: 487, pa: 423, streak: 'W2' },
    { rank: 3, team: 'Vienna Storm',        fpyc: false, w: 5, l: 4, pf: 461, pa: 448, streak: 'L1' },
    { rank: 4, team: 'Reston Wolves',       fpyc: false, w: 5, l: 4, pf: 439, pa: 441, streak: 'W1' },
    { rank: 5, team: 'Oakton Patriots',     fpyc: false, w: 4, l: 5, pf: 412, pa: 459, streak: 'L2' },
    { rank: 6, team: 'McLean Mustangs',     fpyc: false, w: 3, l: 6, pf: 398, pa: 467, streak: 'L3' },
    { rank: 7, team: 'Burke Lakers',        fpyc: false, w: 2, l: 7, pf: 374, pa: 492, streak: 'L4' },
    { rank: 8, team: 'Springfield Bulls',   fpyc: false, w: 1, l: 8, pf: 352, pa: 520, streak: 'L5' },
  ],
  'Girls 5–6 House': [
    { rank: 1, team: 'Arlington Stars',     fpyc: false, w: 7, l: 2, pf: 498, pa: 412, streak: 'W4' },
    { rank: 2, team: 'McLean Cardinals',    fpyc: false, w: 6, l: 3, pf: 471, pa: 438, streak: 'W1' },
    { rank: 3, team: 'Vienna Rockets',      fpyc: false, w: 5, l: 4, pf: 449, pa: 441, streak: 'W2' },
    { rank: 4, team: 'Reston Blaze',        fpyc: false, w: 4, l: 5, pf: 422, pa: 449, streak: 'L1' },
    { rank: 5, team: 'Fairfax Wolves',      fpyc: true,  w: 4, l: 5, pf: 418, pa: 461, streak: 'L2' },
    { rank: 6, team: 'Herndon Thunder',     fpyc: false, w: 2, l: 7, pf: 378, pa: 501, streak: 'L3' },
  ],
  'Boys 7–8 Select': [
    { rank: 1, team: 'Fairfax Eagles',      fpyc: true,  w: 8, l: 1, pf: 612, pa: 489, streak: 'W5' },
    { rank: 2, team: 'McLean Select',       fpyc: false, w: 7, l: 2, pf: 588, pa: 511, streak: 'W2' },
    { rank: 3, team: 'Reston Select',       fpyc: false, w: 5, l: 4, pf: 562, pa: 534, streak: 'L1' },
    { rank: 4, team: 'Arlington Gold',      fpyc: false, w: 4, l: 5, pf: 531, pa: 558, streak: 'W1' },
    { rank: 5, team: 'Vienna Elite',        fpyc: false, w: 3, l: 6, pf: 501, pa: 587, streak: 'L4' },
    { rank: 6, team: 'Chantilly Force',     fpyc: false, w: 1, l: 8, pf: 467, pa: 612, streak: 'L5' },
  ],
  'Girls 3–4 House': [
    { rank: 1, team: 'Arlington Aces',      fpyc: false, w: 7, l: 2, pf: 312, pa: 278, streak: 'W3' },
    { rank: 2, team: 'Reston Stars',        fpyc: false, w: 6, l: 3, pf: 301, pa: 289, streak: 'L1' },
    { rank: 3, team: 'Vienna Flames',       fpyc: false, w: 5, l: 4, pf: 290, pa: 298, streak: 'W2' },
    { rank: 4, team: 'McLean Gems',         fpyc: false, w: 4, l: 5, pf: 276, pa: 309, streak: 'L2' },
    { rank: 5, team: 'Fairfax Cougars',     fpyc: true,  w: 3, l: 6, pf: 261, pa: 324, streak: 'L3' },
    { rank: 6, team: 'Herndon Comets',      fpyc: false, w: 1, l: 8, pf: 234, pa: 342, streak: 'L4' },
  ],
  'PowerRec U9-U10': [
    { rank: 1, team: 'Reston Rovers',     fpyc: false, w: 3, l: 1, pf: 9, pa: 6, streak: 'W1' },
    { rank: 2, team: 'U9 Fairfax FC',     fpyc: true,  w: 2, l: 1, pf: 8, pa: 3, streak: 'W1' },
    { rank: 3, team: 'Oakton United',     fpyc: false, w: 1, l: 2, pf: 5, pa: 6, streak: 'L1' },
    { rank: 4, team: 'Vienna Youth SC',   fpyc: false, w: 1, l: 2, pf: 4, pa: 7, streak: 'L2' },
    { rank: 5, team: 'Centreville SC',    fpyc: false, w: 1, l: 2, pf: 4, pa: 8, streak: 'L1' },
  ],
  'NCSL Rec U11-U19': [
    { rank: 1, team: 'U12 Fairfax FC',    fpyc: true,  w: 2, l: 1, pf: 7, pa: 4, streak: 'W1' },
    { rank: 2, team: 'Springfield FC',    fpyc: false, w: 2, l: 1, pf: 6, pa: 6, streak: 'L1' },
    { rank: 3, team: 'Annandale SC',      fpyc: false, w: 1, l: 1, pf: 3, pa: 3, streak: 'L1' },
    { rank: 4, team: 'Burke United',      fpyc: false, w: 1, l: 1, pf: 3, pa: 2, streak: 'W1' },
    { rank: 5, team: 'Vienna Youth SC',   fpyc: false, w: 0, l: 2, pf: 2, pa: 6, streak: 'L2' },
  ],
};

export function useStandings() {
  return useLocalStorage('fpyc-standings', INITIAL_STANDINGS);
}

// ─── Player Stats ─────────────────────────────────────────────────────────────
// { [gameId]: { [playerId]: { pts, ast, reb, fls } } }

export const INITIAL_STATS = {
  g4: { // W 48–39 vs Oakton Patriots
    p1: { pts: 14, ast: 3, reb: 5, fls: 2 },
    p2: { pts:  8, ast: 4, reb: 3, fls: 1 },
    p3: { pts:  6, ast: 1, reb: 8, fls: 3 },
    p4: { pts:  4, ast: 2, reb: 6, fls: 2 },
    p5: { pts:  8, ast: 0, reb: 9, fls: 4 },
    p6: { pts:  4, ast: 5, reb: 2, fls: 1 },
    p7: { pts:  2, ast: 2, reb: 3, fls: 2 },
    p8: { pts:  2, ast: 1, reb: 4, fls: 1 },
  },
  g5: { // L 42–47 vs McLean Mustangs
    p1: { pts: 12, ast: 2, reb: 4, fls: 3 },
    p2: { pts:  6, ast: 3, reb: 2, fls: 1 },
    p3: { pts:  8, ast: 1, reb: 7, fls: 4 },
    p4: { pts:  4, ast: 2, reb: 5, fls: 2 },
    p5: { pts:  6, ast: 0, reb: 8, fls: 4 },
    p6: { pts:  3, ast: 4, reb: 2, fls: 1 },
    p7: { pts:  2, ast: 2, reb: 3, fls: 2 },
    p8: { pts:  1, ast: 1, reb: 3, fls: 1 },
  },
  g6: { // W 55–50 vs Centreville Eagles
    p1: { pts: 18, ast: 4, reb:  6, fls: 2 },
    p2: { pts:  8, ast: 5, reb:  3, fls: 1 },
    p3: { pts: 10, ast: 2, reb:  9, fls: 3 },
    p4: { pts:  6, ast: 2, reb:  7, fls: 2 },
    p5: { pts:  5, ast: 0, reb: 10, fls: 4 },
    p6: { pts:  4, ast: 6, reb:  2, fls: 1 },
    p7: { pts:  2, ast: 2, reb:  3, fls: 2 },
    p8: { pts:  2, ast: 1, reb:  5, fls: 1 },
  },
  // Fairfax Wolves — Girls 5–6 House (p12, p15, p16)
  gw3: { // W 38–35 vs McLean Cardinals
    p12: { pts:  9, ast: 2, reb: 4, fls: 1 },
    p15: { pts: 11, ast: 3, reb: 5, fls: 2 },
    p16: { pts:  8, ast: 1, reb: 7, fls: 3 },
  },
  gw4: { // W 42–28 vs Herndon Thunder
    p12: { pts:  6, ast: 3, reb: 3, fls: 2 },
    p15: { pts: 14, ast: 2, reb: 6, fls: 1 },
    p16: { pts: 10, ast: 1, reb: 8, fls: 2 },
  },
  gw5: { // L 31–44 vs Arlington Stars
    p12: { pts:  4, ast: 1, reb: 2, fls: 3 },
    p15: { pts:  9, ast: 4, reb: 4, fls: 2 },
    p16: { pts:  8, ast: 0, reb: 9, fls: 4 },
  },
  gw6: { // L 29–36 vs Reston Blaze
    p12: { pts:  3, ast: 2, reb: 3, fls: 2 },
    p15: { pts:  7, ast: 3, reb: 3, fls: 3 },
    p16: { pts:  6, ast: 1, reb: 6, fls: 2 },
  },
  // Fairfax Eagles — Boys 7–8 Select (p13, p14)
  ge3: { // W 62–48 vs McLean Select
    p13: { pts: 22, ast: 4, reb:  8, fls: 2 },
    p14: { pts: 18, ast: 7, reb:  5, fls: 1 },
  },
  ge4: { // W 57–41 vs Arlington Gold
    p13: { pts: 19, ast: 5, reb: 10, fls: 3 },
    p14: { pts: 16, ast: 6, reb:  4, fls: 2 },
  },
  ge5: { // W 54–39 vs Reston Select
    p13: { pts: 16, ast: 3, reb:  7, fls: 2 },
    p14: { pts: 14, ast: 8, reb:  3, fls: 1 },
  },
  ge6: { // L 44–51 vs Vienna Elite
    p13: { pts: 14, ast: 2, reb:  6, fls: 4 },
    p14: { pts: 12, ast: 5, reb:  4, fls: 3 },
  },
  // Fairfax Cougars — Girls 3–4 House (p17, p18)
  gc3: { // L 24–31 vs Reston Stars
    p17: { pts:  8, ast: 2, reb: 4, fls: 2 },
    p18: { pts:  6, ast: 0, reb: 7, fls: 3 },
  },
  gc4: { // W 29–18 vs Herndon Comets
    p17: { pts: 10, ast: 3, reb: 5, fls: 1 },
    p18: { pts:  9, ast: 1, reb: 8, fls: 2 },
  },
  gc5: { // W 26–22 vs McLean Gems
    p17: { pts:  7, ast: 4, reb: 3, fls: 2 },
    p18: { pts:  8, ast: 0, reb: 9, fls: 1 },
  },
  gc6: { // L 17–35 vs Arlington Aces
    p17: { pts:  4, ast: 1, reb: 3, fls: 3 },
    p18: { pts:  2, ast: 0, reb: 5, fls: 2 },
  },
  // U9 Fairfax FC — Soccer (sp1-sp5)
  sg1: { // W 4-1 vs Vienna Youth SC
    sp2: { gls: 2, ast: 1, yc: 0, rc: 0 },
    sp4: { gls: 2, ast: 0, yc: 0, rc: 0 },
    sp5: { gls: 0, ast: 2, yc: 0, rc: 0 },
    sp1: { gls: 0, ast: 0, yc: 1, rc: 0 },
    sp3: { gls: 0, ast: 0, yc: 0, rc: 0 },
  },
  sg2: { // L 1-2 @ Reston Rovers
    sp2: { gls: 1, ast: 0, yc: 0, rc: 0 },
    sp4: { gls: 0, ast: 1, yc: 0, rc: 0 },
    sp5: { gls: 0, ast: 0, yc: 1, rc: 0 },
    sp1: { gls: 0, ast: 0, yc: 0, rc: 0 },
    sp3: { gls: 0, ast: 0, yc: 0, rc: 0 },
  },
  sg3: { // W 3-0 vs Oakton United
    sp4: { gls: 1, ast: 1, yc: 0, rc: 0 },
    sp2: { gls: 1, ast: 1, yc: 0, rc: 0 },
    sp5: { gls: 1, ast: 0, yc: 0, rc: 0 },
    sp1: { gls: 0, ast: 0, yc: 0, rc: 0 },
    sp3: { gls: 0, ast: 0, yc: 0, rc: 0 },
  },
  // U12 Fairfax FC — Soccer (sp11-sp14)
  sg11: { // W 2-1 vs Annandale SC
    sp13: { gls: 1, ast: 1, yc: 0, rc: 0 },
    sp12: { gls: 1, ast: 0, yc: 1, rc: 0 },
    sp11: { gls: 0, ast: 0, yc: 0, rc: 0 },
    sp14: { gls: 0, ast: 0, yc: 0, rc: 0 },
  },
  sg12: { // L 0-3 @ Burke United
    sp13: { gls: 0, ast: 0, yc: 0, rc: 0 },
    sp12: { gls: 0, ast: 0, yc: 1, rc: 0 },
    sp11: { gls: 0, ast: 0, yc: 0, rc: 1 },
    sp14: { gls: 0, ast: 0, yc: 0, rc: 0 },
  },
  sg13: { // W 5-2 vs Springfield FC
    sp13: { gls: 3, ast: 1, yc: 0, rc: 0 },
    sp12: { gls: 1, ast: 2, yc: 0, rc: 0 },
    sp11: { gls: 1, ast: 0, yc: 0, rc: 0 },
    sp14: { gls: 0, ast: 0, yc: 0, rc: 0 },
  },
};

export function useStats() {
  return useLocalStorage('fpyc-stats', INITIAL_STATS);
}

// ─── Announcements ────────────────────────────────────────────────────────────

// No seed announcements — real ones are posted from the admin console.
// (Anything listed here is re-inserted by useSupabaseTable after you delete it.)
export const INITIAL_ANNOUNCEMENTS = [];

export function useAnnouncements() {
  return useSupabaseTable('announcements', INITIAL_ANNOUNCEMENTS);
}

// ─── Official Assignments ─────────────────────────────────────────────────────
// Shape: { [gameId]: { refs: string[], status: 'confirmed'|'partial'|'unassigned' } }

export const INITIAL_OFFICIAL_ASSIGNMENTS = {};

export function useOfficialAssignments() {
  return useSupabaseAssignments();
}

// Derive family-facing event list from admin games + practices
export function deriveEvents(games, practices) {
  const gameEvents = games.map(g => ({
    id: g.id,
    type: 'game',
    date: g.day,
    time: g.time,
    label: g.opponent.includes(' vs ') ? g.opponent : (g.home ? `vs. ${g.opponent}` : `@ ${g.opponent}`),
    opponent: g.opponent,
    location: g.location,
    home: g.home,
    status: g.status === 'final' ? 'final' : g.status === 'live' ? 'live' : 'upcoming',
    us: g.us,
    them: g.them,
    quarter: g.quarter,
    note: g.note || '',
    confirmed: g.confirmed || 0,
    month: g.month,
    dayNum: g.date,
    team: g.team || 'Fairfax Hawks',
  }));

  const practiceEvents = practices.map(p => ({
    id: p.id,
    type: 'practice',
    date: p.date,
    time: p.time.split(/[–-]/)[0].trim(),
    timeRange: p.time,
    label: p.type === 'Scrimmage' ? 'Scrimmage' : 'Practice',
    practiceType: p.type,
    location: p.gym,
    home: true,
    status: 'upcoming',
    notes: p.notes || '',
    team: p.team || 'Fairfax Hawks',
  }));

  return [...gameEvents, ...practiceEvents];
}

// Resolve a game's calendar date from its month/date fields.
const MONTH_IDX = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
export function gameDateOf(g) {
  if (!g?.month || !g?.date || !(g.month in MONTH_IDX)) return null;
  const now = new Date();
  let d = new Date(now.getFullYear(), MONTH_IDX[g.month], g.date);
  // Handle season wrap (e.g. a Jan game viewed in Dec)
  if (d - now < -1000 * 60 * 60 * 24 * 180) d.setFullYear(d.getFullYear() + 1);
  return d;
}

// The next upcoming game event from deriveEvents() output that hasn't passed yet.
export function nextUpcomingGameEvent(events) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = events
    .filter(e => e.type === 'game' && e.status === 'upcoming')
    .map(e => ({ e, d: gameDateOf({ month: e.month, date: e.dayNum }) }))
    .filter(x => x.d && x.d >= today)
    .sort((a, b) => a.d - b.d);
  return upcoming[0]?.e ?? events.find(e => e.type === 'game' && e.status === 'upcoming') ?? null;
}

// Final games sorted most-recent first.
export function recentFinalGames(games) {
  return games
    .filter(g => g.status === 'final')
    .sort((a, b) => (gameDateOf(b) ?? 0) - (gameDateOf(a) ?? 0));
}

// The next scheduled game that hasn't passed yet (falls back to first scheduled).
export function nextScheduledGame(games) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = games
    .filter(g => g.status === 'scheduled')
    .map(g => ({ g, d: gameDateOf(g) }))
    .filter(x => x.d && x.d >= today)
    .sort((a, b) => a.d - b.d);
  return upcoming[0]?.g ?? games.find(g => g.status === 'scheduled') ?? null;
}

// ─── Registrations ───────────────────────────────────────────────────────────

export function useRegistrations() {
  return useSupabaseTable('registrations', []);
}

// ─── RSVPs ────────────────────────────────────────────────────────────────────
// { [gameId]: { [familyKey]: 'yes' | 'no' } }
// e.g. { g1: { reeves: 'yes', chen: 'no' } }

export function useRsvps() {
  return useLocalStorage('fpyc-rsvps', {});
}

export const DEFAULT_FEE_SETTINGS = {
  programs: [
    { id: 'rec',        label: 'Recreation',  fee: 195 },
    { id: 'select',     label: 'Select',       fee: 240 },
    { id: 'training',   label: 'Training',     fee: 200 },
    { id: 'scholarship',label: 'Scholarship',  fee: 75  },
    { id: 'waived',     label: 'Fee Waived',   fee: 0   },
  ],
};

export function useFeeSettings() {
  return useLocalStorage('fpyc-fee-settings', DEFAULT_FEE_SETTINGS);
}

export const DEFAULT_DISCOUNT_CODES = [
  { id: 'dc_sibling',  code: 'SIBLING',  label: 'Sibling Discount',  type: 'fixed',   amount: 25,  maxUses: null, usedCount: 0, active: true, note: 'Each additional sibling' },
  { id: 'dc_half',     code: 'HALF',     label: '50% Discount',      type: 'percent', amount: 50,  maxUses: null, usedCount: 0, active: true, note: '' },
  { id: 'dc_coach',    code: 'COACH',    label: 'Coach Discount',     type: 'percent', amount: 100, maxUses: null, usedCount: 0, active: true, note: "Free registration for coach's child" },
];

export function useDiscountCodes() {
  return useLocalStorage('fpyc-discount-codes', DEFAULT_DISCOUNT_CODES);
}

export function applyDiscount(baseAmount, code) {
  if (!code) return baseAmount;
  if (code.type === 'fixed') return Math.max(0, baseAmount - code.amount);
  if (code.type === 'percent') return Math.max(0, baseAmount * (1 - code.amount / 100));
  return baseAmount;
}

export function countRsvps(rsvps, gameId) {
  const game = rsvps[gameId] || {};
  return Object.values(game).filter(v => v === 'yes').length;
}

// ── Budget ────────────────────────────────────────────────────────────────────

export const INITIAL_BUDGET = {
  id: 'budget-2627',
  year: '2026-27',
  projectedPlayers: 930,
  registrationsBudget: 155750,
  feeTypes: [
    { id: 'ft1', label: 'Rec Winter Regular',    players: 500, fee: 195 },
    { id: 'ft2', label: 'Scholarship',           players: 50,  fee: 75  },
    { id: 'ft3', label: 'Late Fee',              players: 50,  fee: 45  },
    { id: 'ft4', label: 'Select Winter',         players: 100, fee: 240 },
    { id: 'ft5', label: 'Select Summer',         players: 100, fee: 225 },
    { id: 'ft6', label: 'REC Summer',            players: 50,  fee: 125 },
    { id: 'ft7', label: 'Skills Clinic Fall',    players: 50,  fee: 200 },
    { id: 'ft8', label: 'Skills Clinic Spring',  players: 40,  fee: 200 },
    { id: 'ft9', label: 'Skills Clinic Summer',  players: 40,  fee: 200 },
  ],
  revenueOther: [
    { id: 'ro1', account: '1027-08', label: 'Donations', budgeted: 0, actual: 0, priorActual: 2245 },
  ],
  priorYear: {
    label: '2025-26',
    registrations: 152667.5,
    lateFees: 2720,
  },
  expenses: [
    { id: 'e1',  account: '5050-08', label: 'Admin Contributions',    perPlayer: 12.50, budget: null,  actual: 0, priorActual: 8650,    notes: 'Basketball share toward FPYC expense' },
    { id: 'e3',  account: '5058-08', label: 'Capital Improvement',    perPlayer: 7.41,  budget: null,  actual: 0, priorActual: 5127.72, notes: 'Building/fields expenses' },
    { id: 'e5',  account: '5060-08', label: 'Database',               perPlayer: 1.00,  budget: null,  actual: 0, priorActual: 692,     notes: 'Demosphere + TeamSnap' },
    { id: 'e7',  account: '5068-08', label: 'Ins / Clubhouse',        perPlayer: 0.60,  budget: null,  actual: 0, priorActual: 415.2,   notes: '' },
    { id: 'e8',  account: '5070-08', label: 'Ins / L&A',             perPlayer: 15.35, budget: null,  actual: 0, priorActual: 10622.2, notes: '' },
    { id: 'e9',  account: '5071-08', label: 'Ins / D&O',             perPlayer: 0.39,  budget: null,  actual: 0, priorActual: 269.88,  notes: '' },
    { id: 'e2',  account: '5051-08', label: 'Annual Reception',       perPlayer: null,  budget: 500,   actual: 0, priorActual: 470,     notes: 'End of year food/bar tab for coaches' },
    { id: 'e4',  account: '5059-08', label: 'County / City Fees',     perPlayer: null,  budget: 15000, actual: 0, priorActual: 10934,   notes: 'Gym fees' },
    { id: 'e6',  account: '5062-08', label: 'Equipment',              perPlayer: null,  budget: 5000,  actual: 0, priorActual: 4344.21, notes: 'Basketballs and other equipment' },
    { id: 'e10', account: '5074-08', label: 'Miscellaneous',          perPlayer: null,  budget: 8000,  actual: 0, priorActual: 8318,    notes: 'Travel league FCYBL fees' },
    { id: 'e18', account: '5075-08', label: 'Publicity',              perPlayer: null,  budget: null,  actual: 675, priorActual: 0,     notes: 'Yard signs, banners, promotional materials' },
    { id: 'e11', account: '5084-08', label: 'Referees / Umpires',     perPlayer: null,  budget: 28000, actual: 0, priorActual: 25097.5, notes: 'Refs' },
    { id: 'e12', account: '5086-08', label: 'Refunds',                perPlayer: null,  budget: 600,   actual: 0, priorActual: 523.33,  notes: 'Post-season refunds' },
    { id: 'e13', account: '5088-08', label: 'Registrations (Expense)',perPlayer: null,  budget: 8600,  actual: 0, priorActual: 8100,    notes: '' },
    { id: 'e14', account: '5093-08', label: 'Spirit Wear / Coaches',  perPlayer: null,  budget: 5000,  actual: 3930, priorActual: 5952,    notes: 'Coaches gear 2027' },
    { id: 'e15', account: '5096-08', label: 'Training',               perPlayer: null,  budget: 35000, actual: 0, priorActual: 14050,   notes: 'Shaun / TYS / Evolution' },
    { id: 'e16', account: '5098-08', label: 'Trophies / Plaques',     perPlayer: null,  budget: 2000,  actual: 0, priorActual: 1836.76, notes: 'Awards' },
    { id: 'e17', account: '5099-08', label: 'Uniforms',               perPlayer: null,  budget: 15000, actual: 14617, priorActual: 16410.5, notes: 'Uniforms' },
  ],
};

export function useBudget() {
  const [budget, setBudgetState] = useState(INITIAL_BUDGET);

  useEffect(() => {
    supabase.from('budget').select('data').eq('id', 'budget-2627').single().then(({ data, error }) => {
      if (!error && data?.data) setBudgetState(data.data);
    });
  }, []);

  async function saveBudget(newBudget) {
    setBudgetState(newBudget);
    await supabase.from('budget').upsert({ id: 'budget-2627', data: newBudget, updated_at: new Date().toISOString() });
  }

  return [budget, saveBudget];
}

// ── Invoices ──────────────────────────────────────────────────────────────────
// Same access as Budget (admin / ops director only, enforced by RLS on the
// `invoices` table and by the console only routing to this view for those roles).

export const INITIAL_INVOICES = [
  { id: 'inv-4041', vendor: '4 Leaf Graphics', invoice_no: '4041', invoice_date: '2026-09-15', amount: 14617, account: '5099-08', line_item: 'Uniforms', notes: '622 house jerseys — blank + screen print' },
  { id: 'inv-17936', vendor: 'Concept Marketing, Inc.', invoice_no: '17936', invoice_date: '2026-09-17', amount: 675, account: '5075-08', line_item: 'Publicity', notes: '100 FPYC 2026/2027 Basketball Sign Up yard signs, printed 2 sides + metal H-stakes' },
  { id: 'inv-4045', vendor: '4 Leaf Graphics', invoice_no: '4045', invoice_date: '2026-09-28', amount: 3930, account: '5093-08', line_item: 'Spirit Wear / Coaches', notes: '131 navy Gildan Heavy Blend hoodies (20 S, 26 M, 48 L, 32 XL, 5 XXL) — FPYC logo front, @FPYCHOOPS back' },
];

export function useInvoices() {
  return useSupabaseTable('invoices', INITIAL_INVOICES);
}

// ── Inventory ─────────────────────────────────────────────────────────────────

const INITIAL_INVENTORY = {
  jerseys:     {},
  hoodies:     {
    Small:  { owned: 20, checkedOut: 0 },
    Medium: { owned: 26, checkedOut: 0 },
    Large:  { owned: 48, checkedOut: 0 },
    XL:     { owned: 32, checkedOut: 0 },
    XXL:    { owned: 5,  checkedOut: 0 },
  },
  basketballs: {},
  clocks:      { owned: 0, checkedOut: 0 },
  scorebooks:  { owned: 0, checkedOut: 0 },
  firstAid:    { owned: 0, checkedOut: 0 },
  icePacks:    { owned: 0, checkedOut: 0 },
  training:    { items: [] },
};

export function useInventory() {
  const [inventory, setInventoryState] = useState(INITIAL_INVENTORY);

  useEffect(() => {
    supabase.from('budget').select('data').eq('id', 'inventory-2627').single().then(({ data, error }) => {
      if (!error && data?.data) setInventoryState(data.data);
    });
  }, []);

  async function saveInventory(newInv) {
    setInventoryState(newInv);
    await supabase.from('budget').upsert({ id: 'inventory-2627', data: newInv, updated_at: new Date().toISOString() });
  }

  return [inventory, saveInventory];
}
