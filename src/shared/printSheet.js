const BASE = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, Helvetica, sans-serif; color: #111; background: #fff; padding: 24px 28px; font-size: 13px; }
  @page { size: letter portrait; margin: 0.6in; }
  @media print { body { padding: 0; } }

  .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #0A1F3D; padding-bottom: 10px; margin-bottom: 16px; }
  .header-left .team { font-size: 22px; font-weight: 900; color: #0A1F3D; text-transform: uppercase; letter-spacing: 0.03em; line-height: 1.1; }
  .header-left .sub  { font-size: 12px; color: #6b7280; margin-top: 3px; }
  .header-right      { text-align: right; font-size: 11px; color: #9ca3af; line-height: 1.6; }

  table { width: 100%; border-collapse: collapse; }
  thead tr { background: #0A1F3D; }
  thead th { color: #fff; padding: 7px 10px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.07em; white-space: nowrap; }
  tbody tr:nth-child(even) td { background: #f9fafb; }
  tbody tr:last-child td { border-bottom: none; }
  td { padding: 7px 10px; border-bottom: 1px solid #e5e7eb; vertical-align: middle; }

  .num  { font-weight: 900; font-size: 17px; color: #0A1F3D; text-align: center; }
  .name { font-weight: 700; }
  .muted{ color: #6b7280; }
  .badge{ display: inline-block; padding: 1px 6px; border-radius: 999px; font-size: 10px; font-weight: 700; }
  .win  { background: rgba(5,150,105,0.12); color: #059669; }
  .loss { background: rgba(220,38,38,0.10); color: #dc2626; }
  .pill { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
  .pill-home { background: rgba(10,31,61,0.09); color: #0A1F3D; }
  .pill-away { background: rgba(232,119,34,0.12); color: #c05621; }
  .section   { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.10em; color: #9ca3af; margin: 18px 0 8px; }
  .check-row { display: flex; align-items: center; gap: 10px; padding: 5px 0; border-bottom: 1px solid #f3f4f6; }
  .box       { width: 14px; height: 14px; border: 1.5px solid #d1d5db; border-radius: 3px; flex-shrink: 0; }
  .footer    { margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 8px; font-size: 10px; color: #9ca3af; display: flex; justify-content: space-between; }
  .game-card { border: 2px solid #0A1F3D; border-radius: 8px; overflow: hidden; margin-bottom: 16px; }
  .game-card .gc-head { background: #0A1F3D; color: #fff; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; }
  .game-card .gc-title{ font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.02em; }
  .game-card .gc-date { font-size: 13px; color: rgba(255,255,255,0.65); margin-top: 2px; }
  .game-card .gc-score{ font-size: 32px; font-weight: 900; color: #FFC72C; letter-spacing: -0.02em; line-height: 1; }
  .game-card .gc-body { padding: 14px 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .game-card .gc-field { }
  .game-card .gc-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 2px; }
  .game-card .gc-value { font-weight: 700; font-size: 13px; }
  .notes { border: 1.5px dashed #d1d5db; border-radius: 6px; padding: 10px 12px; min-height: 60px; margin-top: 4px; }
  .notes-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 6px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 0 20px; }
`;

function openPrint(title, body) {
  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title><style>${BASE}</style></head><body>${body}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 400);
}

function nowStamp() {
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ── Roster contact sheet ────────────────────────────────────────────────────
export function printRoster(players, team, sport = 'basketball') {
  const isSoccer = sport === 'soccer';
  const active = players.filter(p => p.status !== 'inactive');
  const rows = active.map(p => `
    <tr>
      <td class="num">${p.number}</td>
      <td class="name">${p.name}</td>
      <td>${p.grade}</td>
      <td>${p.position}</td>
      <td class="muted">${p.school || '—'}</td>
      <td>${p.guardian || '—'}</td>
      <td class="muted">${p.phone || '—'}</td>
      <td><span class="badge ${p.waiver ? 'win' : 'loss'}">${p.waiver ? 'Yes' : 'No'}</span></td>
    </tr>`).join('');

  openPrint(`${team.name} — Roster`, `
    <div class="header">
      <div class="header-left">
        <div class="team">${team.name}</div>
        <div class="sub">${team.division} · Season 2025–26 · ${team.coach}</div>
      </div>
      <div class="header-right">
        Printed ${nowStamp()}<br>
        ${active.length} active players<br>
        FPYC ${isSoccer ? 'Soccer' : 'Basketball'}
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>#</th><th>Player</th><th>Grade</th><th>Position</th>
          <th>School</th><th>Guardian</th><th>Phone</th><th>Waiver</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="footer">
      <span>${team.name} · ${team.division}</span>
      <span>FPYC ${isSoccer ? 'Soccer' : 'Basketball'} · fpycsports.org</span>
    </div>
  `);
}

// ── Game day card ───────────────────────────────────────────────────────────
export function printGameDay(game, players, team, sport = 'basketball') {
  const isSoccer = sport === 'soccer';
  const available = players.filter(p => p.status === 'active');
  const byPos = pos => available.filter(p => p.position === pos);
  const posGroups = (isSoccer
    ? [
        { label: 'Goalkeepers', players: byPos('Goalkeeper') },
        { label: 'Defenders',   players: byPos('Defender')   },
        { label: 'Midfielders', players: byPos('Midfielder') },
        { label: 'Forwards',    players: byPos('Forward')    },
      ]
    : [
        { label: 'Guards',   players: byPos('Guard')   },
        { label: 'Forwards', players: byPos('Forward') },
        { label: 'Centers',  players: byPos('Center')  },
      ]
  ).filter(g => g.players.length > 0);

  const checkRows = posGroups.map(g => `
    <div class="section">${g.label}</div>
    <div class="two-col">
      ${g.players.map(p => `
        <div class="check-row">
          <div class="box"></div>
          <span style="font-weight:700">#${p.number}</span>
          <span>${p.name}</span>
        </div>`).join('')}
    </div>`).join('');

  const isFinal = game.status === 'final';
  const win = isFinal && game.us > game.them;
  const scoreHtml = isFinal
    ? `<div class="gc-score">${game.us}–${game.them}</div>`
    : `<div style="font-size:13px;color:rgba(255,255,255,0.65);text-align:right">Scheduled</div>`;

  openPrint(`Game Day — ${game.opponent}`, `
    <div class="header">
      <div class="header-left">
        <div class="team">${team.name}</div>
        <div class="sub">Game day sheet · ${team.division}</div>
      </div>
      <div class="header-right">Printed ${nowStamp()}<br>FPYC ${isSoccer ? 'Soccer' : 'Basketball'}</div>
    </div>

    <div class="game-card">
      <div class="gc-head">
        <div>
          <div class="gc-title">${game.home ? 'vs.' : '@'} ${game.opponent}</div>
          <div class="gc-date">${game.day} · ${game.time}</div>
        </div>
        ${scoreHtml}
      </div>
      <div class="gc-body">
        <div class="gc-field">
          <div class="gc-label">Location</div>
          <div class="gc-value">${game.location}</div>
        </div>
        <div class="gc-field">
          <div class="gc-label">Jersey</div>
          <div class="gc-value">${game.home ? 'Navy (home)' : 'White (away)'}</div>
        </div>
        <div class="gc-field">
          <div class="gc-label">Type</div>
          <div class="gc-value"><span class="pill ${game.home ? 'pill-home' : 'pill-away'}">${game.home ? 'Home' : 'Away'}</span></div>
        </div>
        <div class="gc-field">
          <div class="gc-label">Refs</div>
          <div class="gc-value">${game.refs || 'TBD'}</div>
        </div>
      </div>
    </div>

    <div class="section">Player checklist — ${available.length} active</div>
    ${checkRows}

    <div style="margin-top:16px">
      <div class="notes-label">Coach notes</div>
      <div class="notes">${game.note || ''}</div>
    </div>

    <div class="footer">
      <span>${team.name} · ${game.day}</span>
      <span>FPYC ${isSoccer ? 'Soccer' : 'Basketball'} · fpycsports.org</span>
    </div>
  `);
}

// ── Lineup card ─────────────────────────────────────────────────────────────
export function printLineup(game, starters, posMap, bench, team, sport = 'basketball') {
  const isSoccer = sport === 'soccer';
  const starterRows = starters.map(p => `
    <tr>
      <td class="num">${p.number}</td>
      <td class="name">${p.name}</td>
      <td style="text-align:center"><span class="pill pill-home">${posMap[p.id] || '—'}</span></td>
      <td class="muted">${p.grade} · ${p.position}</td>
    </tr>`).join('');

  const benchRows = bench.map((p, i) => `
    <tr>
      <td style="text-align:center;color:#9ca3af;font-weight:700">${i + 1}</td>
      <td class="num">${p.number}</td>
      <td class="name">${p.name}</td>
      <td class="muted">${p.position}</td>
    </tr>`).join('');

  openPrint(`Lineup — ${game.opponent}`, `
    <div class="header">
      <div class="header-left">
        <div class="team">${team.name}</div>
        <div class="sub">Starting lineup · ${game.day}</div>
      </div>
      <div class="header-right">
        ${game.home ? 'vs.' : '@'} ${game.opponent}<br>
        ${game.time} · ${game.location}<br>
        Jersey: ${game.home ? 'Navy (home)' : 'White (away)'}
      </div>
    </div>

    <div class="section">${isSoccer ? 'Starting lineup' : 'Starting five'}</div>
    <table>
      <thead><tr><th>#</th><th>Player</th><th style="text-align:center">Pos</th><th>Grade · Natural pos</th></tr></thead>
      <tbody>${starterRows}</tbody>
    </table>

    <div class="section">Bench rotation</div>
    <table>
      <thead><tr><th>Sub#</th><th>#</th><th>Player</th><th>Position</th></tr></thead>
      <tbody>${benchRows}</tbody>
    </table>

    <div style="margin-top:16px">
      <div class="notes-label">Coach notes</div>
      <div class="notes">${game.note || ''}</div>
    </div>

    <div class="footer">
      <span>${team.name} · ${game.day}</span>
      <span>FPYC ${isSoccer ? 'Soccer' : 'Basketball'} · fpycsports.org</span>
    </div>
  `);
}

// ── Practice sheet ──────────────────────────────────────────────────────────
export function printPractice(practice, players, team, sport = 'basketball') {
  const isSoccer = sport === 'soccer';
  const active = players.filter(p => p.status === 'active');
  const rows = active.map((p, i) => `
    <div class="check-row" style="${i % 2 === 0 ? '' : 'background:#f9fafb;'}">
      <div class="box"></div>
      <span style="font-weight:900;font-size:15px;color:#0A1F3D;width:28px;text-align:center">${p.number}</span>
      <span style="font-weight:700;flex:1">${p.name}</span>
      <span class="muted" style="font-size:11px">${p.position} · ${p.grade}</span>
    </div>`).join('');

  openPrint(`Practice — ${practice.date}`, `
    <div class="header">
      <div class="header-left">
        <div class="team">${team.name}</div>
        <div class="sub">Practice sheet · ${practice.type}</div>
      </div>
      <div class="header-right">Printed ${nowStamp()}<br>FPYC ${isSoccer ? 'Soccer' : 'Basketball'}</div>
    </div>

    <div class="game-card">
      <div class="gc-head">
        <div>
          <div class="gc-title">${practice.type === 'Scrimmage' ? 'Scrimmage' : 'Practice'}</div>
          <div class="gc-date">${practice.date} · ${practice.time}</div>
        </div>
      </div>
      <div class="gc-body">
        <div class="gc-field">
          <div class="gc-label">Location</div>
          <div class="gc-value">${practice.gym}</div>
        </div>
        <div class="gc-field">
          <div class="gc-label">Type</div>
          <div class="gc-value">${practice.type}</div>
        </div>
      </div>
    </div>

    <div class="section">Attendance — ${active.length} players</div>
    ${rows}

    ${practice.notes ? `
    <div style="margin-top:16px">
      <div class="notes-label">Focus / Notes</div>
      <div class="notes">${practice.notes}</div>
    </div>` : ''}

    <div class="footer">
      <span>${team.name} · ${practice.date}</span>
      <span>FPYC ${isSoccer ? 'Soccer' : 'Basketball'} · fpycsports.org</span>
    </div>
  `);
}
