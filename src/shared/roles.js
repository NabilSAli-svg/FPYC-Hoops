// FPYC role model — single source of truth for what each role can reach.
//
// Money (Budget, Payments, Inventory) and league-wide Settings are Admin-only,
// except that the Ops Director owns money and facilities. Program directors get
// read access across their own program and nothing financial.

export const ROLES = {
  admin: {
    id: 'admin',
    label: 'Admin',
    blurb: 'Full access, including granting permissions.',
    views: '*',
    canEdit: true,
    teamScope: 'all',
  },
  ops_director: {
    id: 'ops_director',
    label: 'Ops Director',
    blurb: 'Budget, payments, inventory, scheduling and gym permits across all programs.',
    views: ['dashboard', 'schedule', 'scheduler', 'budget', 'payments', 'inventory', 'season', 'stats', 'officials', 'signups'],
    canEdit: true,
    teamScope: 'all',
  },
  community_director: {
    id: 'community_director',
    label: 'Community & Sponsorship Director',
    blurb: 'Announcements and sponsorship outreach. No rosters or financials.',
    views: ['dashboard', 'announcements', 'messages', 'signups'],
    canEdit: true,
    teamScope: 'none',
  },

  // Program directors — read across their program, nothing financial.
  select_director: {
    id: 'select_director',
    label: 'Select Director',
    blurb: 'View all Select teams.',
    views: ['dashboard', 'roster', 'schedule', 'stats', 'evaluations', 'season'],
    canEdit: false,
    teamScope: 'division:Winter Select',
  },
  rec_director: {
    id: 'rec_director',
    label: 'Rec Director',
    blurb: 'View all Rec teams.',
    views: ['dashboard', 'roster', 'schedule', 'stats', 'evaluations', 'season'],
    canEdit: false,
    teamScope: 'division:Winter Rec',
  },
  ref_director: {
    id: 'ref_director',
    label: 'Ref Director',
    blurb: 'View officials and game assignments.',
    views: ['dashboard', 'schedule', 'officials', 'signups'],
    canEdit: false,
    teamScope: 'none',
  },
  training_director: {
    id: 'training_director',
    label: 'Training Director',
    blurb: 'View all clinic and training groups.',
    views: ['dashboard', 'roster', 'schedule', 'attendance'],
    canEdit: false,
    teamScope: 'division:Fall Skills Clinic',
  },

  // Scoped roles — the specific age group / team(s) come from user_scopes.
  league_director: {
    id: 'league_director',
    label: 'League Director',
    blurb: 'One age group, assigned per user.',
    views: ['dashboard', 'roster', 'schedule', 'lineup', 'attendance', 'messages', 'stats', 'evaluations'],
    canEdit: true,
    teamScope: 'scoped',
  },
  coach: {
    id: 'coach',
    label: 'Coach',
    blurb: 'Their assigned team or teams.',
    views: ['dashboard', 'roster', 'schedule', 'lineup', 'attendance', 'messages', 'stats', 'scheduler', 'settings'],
    canEdit: true,
    teamScope: 'scoped',
  },

  // Non-console roles.
  parent: { id: 'parent', label: 'Parent', blurb: "Their child or children's teams.", views: [], canEdit: false, teamScope: 'scoped' },
  ref:    { id: 'ref',    label: 'Referee', blurb: 'Their own game assignments.',      views: [], canEdit: false, teamScope: 'none' },
};

export const CONSOLE_ROLES = Object.values(ROLES).filter(r => r.views === '*' || r.views.length > 0).map(r => r.id);

/** Which sign-up lists a role may review. */
export function signupTabs(role) {
  if (role === 'ref_director') return ['refs'];
  if (role === 'community_director') return ['volunteers'];
  if (role === 'admin' || role === 'ops_director') return ['refs', 'volunteers'];
  return [];
}

export function roleDef(role) {
  return ROLES[role] || null;
}

export function roleLabel(role) {
  return ROLES[role]?.label || 'Member';
}

/** Can this role open the admin console at all? */
export function canUseConsole(role) {
  return CONSOLE_ROLES.includes(role);
}

/** Can this role open a given admin view? */
export function canView(role, view) {
  const def = ROLES[role];
  if (!def) return false;
  if (def.views === '*') return true;
  return def.views.includes(view);
}

/** Can this role change data (vs read-only)? */
export function canEdit(role) {
  return !!ROLES[role]?.canEdit;
}

/** Only Admin and Ops touch money. */
export function canManageOps(role) {
  return role === 'admin' || role === 'ops_director';
}

/**
 * Which team names this role may see.
 * `teamsInfo` is TEAMS_INFO; `scopes` is the user's user_scopes rows.
 */
export function visibleTeams(role, teamsInfo, scopes = [], allTeamNames = []) {
  const def = ROLES[role];
  if (!def) return [];
  if (def.teamScope === 'all') return allTeamNames;
  if (def.teamScope === 'none') return [];
  if (def.teamScope === 'scoped') {
    const teams = scopes.filter(s => s.scope_type === 'team').map(s => s.scope_value);
    const groups = scopes.filter(s => s.scope_type === 'age_group').map(s => s.scope_value);
    const byGroup = allTeamNames.filter(n => groups.some(g => n.toLowerCase().includes(g.toLowerCase())));
    return [...new Set([...teams, ...byGroup])].filter(n => allTeamNames.includes(n));
  }
  if (def.teamScope.startsWith('division:')) {
    const div = def.teamScope.slice('division:'.length);
    return allTeamNames.filter(n => teamsInfo[n]?.division === div);
  }
  return [];
}
