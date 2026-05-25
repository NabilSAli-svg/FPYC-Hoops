import { Card, Button, Icon, Display, Eyebrow, Pill } from '../shared/index.js';

const STANDINGS = [
  { rank: 1, team: 'Centreville Eagles', w: 8, l: 1, pf: 524, pa: 398, streak: 'W3', home: true },
  { rank: 2, team: 'Fairfax Hawks',      w: 6, l: 3, pf: 487, pa: 423, streak: 'W2', home: true },
  { rank: 3, team: 'Vienna Storm',       w: 5, l: 4, pf: 461, pa: 448, streak: 'L1', home: false },
  { rank: 4, team: 'Reston Wolves',      w: 5, l: 4, pf: 439, pa: 441, streak: 'W1', home: false },
  { rank: 5, team: 'Oakton Patriots',    w: 4, l: 5, pf: 412, pa: 459, streak: 'L2', home: false },
  { rank: 6, team: 'McLean Mustangs',    w: 3, l: 6, pf: 398, pa: 467, streak: 'L3', home: false },
  { rank: 7, team: 'Burke Lakers',       w: 2, l: 7, pf: 374, pa: 492, streak: 'L4', home: false },
  { rank: 8, team: 'Springfield Bulls',  w: 1, l: 8, pf: 352, pa: 520, streak: 'L5', home: false },
];

const LEADERS = [
  { stat: 'Points', leaders: [{ name: 'Jordan Reeves', value: '18.4', team: 'Fairfax Hawks' }, { name: 'Tariq Singh', value: '16.2', team: 'Fairfax Hawks' }, { name: 'Devon Brooks', value: '14.8', team: 'Fairfax Hawks' }] },
  { stat: 'Rebounds', leaders: [{ name: 'Tariq Singh', value: '9.1', team: 'Fairfax Hawks' }, { name: 'Devon Brooks', value: '7.4', team: 'Fairfax Hawks' }, { name: 'Sam Whitaker', value: '6.8', team: 'Fairfax Hawks' }] },
  { stat: 'Assists', leaders: [{ name: 'Maya Chen', value: '6.3', team: 'Fairfax Hawks' }, { name: 'Alex Romero', value: '5.1', team: 'Fairfax Hawks' }, { name: 'Jordan Reeves', value: '4.7', team: 'Fairfax Hawks' }] },
];

export default function SeasonView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Season summary banner */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{
          background: 'var(--court-navy)',
          color: '#fff',
          padding: '20px 28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 0,
          backgroundImage: 'radial-gradient(circle at 90% 20%, rgba(255,199,44,0.12), transparent 45%)',
        }}>
          <div style={{ borderRight: '1px solid rgba(255,255,255,0.10)', paddingRight: 24 }}>
            <Eyebrow color="rgba(255,255,255,0.55)">Season</Eyebrow>
            <Display size={28} color="#fff" style={{ marginTop: 6 }}>2025–26</Display>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>Boys 5–6 House</div>
          </div>
          <StatCell label="Record" value="6–3" sub="2nd in division" gold />
          <StatCell label="Points for" value="487" sub="54.1 per game" />
          <StatCell label="Points against" value="423" sub="47.0 per game" />
          <StatCell label="Games left" value="4" sub="Dec 7 – Jan 11" />
        </div>
        <div style={{ padding: '12px 28px', background: 'var(--bone)', borderTop: '1px solid var(--border)', display: 'flex', gap: 20, fontSize: 13 }}>
          <span><strong>Current streak:</strong> W2</span>
          <span>·</span>
          <span><strong>Home record:</strong> 4–1</span>
          <span>·</span>
          <span><strong>Away record:</strong> 2–2</span>
          <span>·</span>
          <span><strong>Margin of victory:</strong> +7.1 avg</span>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        {/* Standings */}
        <Card padding={0}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Display size={20}>Division standings</Display>
            <Pill kind="navy">Boys 5–6 House</Pill>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bone)' }}>
                {['#', 'Team', 'W', 'L', 'PCT', 'PF', 'PA', 'Str'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: h === 'Team' ? 'left' : 'center', fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STANDINGS.map((row, i) => {
                const isUs = row.team === 'Fairfax Hawks';
                const pct = (row.w / (row.w + row.l)).toFixed(3).replace(/^0/, '');
                return (
                  <tr key={i} style={{ background: isUs ? 'rgba(255,199,44,0.08)' : '#fff', borderBottom: i < STANDINGS.length - 1 ? '1px solid var(--border)' : 'none', fontWeight: isUs ? 700 : 400 }}>
                    <td style={{ padding: '11px 14px', textAlign: 'center', fontSize: 13, color: isUs ? 'var(--court-navy)' : 'var(--fg-muted)', fontWeight: 700 }}>{row.rank}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {isUs && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--varsity-gold)', flexShrink: 0 }} />}
                        <span style={{ color: isUs ? 'var(--court-navy)' : 'var(--fg)' }}>{row.team}</span>
                      </div>
                    </td>
                    {[row.w, row.l, pct, row.pf, row.pa].map((v, j) => (
                      <td key={j} style={{ padding: '11px 14px', textAlign: 'center', fontSize: 13, fontFamily: j >= 2 ? 'var(--font-mono)' : 'inherit', color: 'var(--fg)' }}>{v}</td>
                    ))}
                    <td style={{ padding: '11px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: row.streak.startsWith('W') ? 'rgba(31,138,91,0.12)' : 'rgba(200,16,46,0.10)', color: row.streak.startsWith('W') ? 'var(--status-win)' : 'var(--foul-red)' }}>{row.streak}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Team leaders */}
          <Card padding={0}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <Display size={20}>Team leaders</Display>
            </div>
            {LEADERS.map((cat, ci) => (
              <div key={ci} style={{ padding: '14px 18px', borderBottom: ci < LEADERS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <Eyebrow style={{ marginBottom: 10 }}>{cat.stat}</Eyebrow>
                {cat.leaders.map((l, li) => (
                  <div key={li} style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: li > 0 ? 6 : 0 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: li === 0 ? 'var(--varsity-gold)' : 'var(--bone)', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: li === 0 ? 'var(--court-navy)' : 'var(--fg-muted)', flexShrink: 0 }}>{li + 1}</div>
                    <div style={{ flex: 1, fontSize: 13, fontWeight: li === 0 ? 700 : 400 }}>{l.name}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: li === 0 ? 'var(--court-navy)' : 'var(--fg-muted)' }}>{l.value}</div>
                  </div>
                ))}
              </div>
            ))}
          </Card>

          {/* Playoff picture */}
          <Card banner>
            <Eyebrow color="var(--varsity-gold)">Playoff picture</Eyebrow>
            <Display size={26} color="#fff" style={{ marginTop: 6, marginBottom: 10 }}>Top 4 advance</Display>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.82)' }}>
                <span>Magic number to clinch</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--varsity-gold)' }}>3</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.82)' }}>
                <span>Games behind 1st seed</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--varsity-gold)' }}>2</span>
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '4px 0' }} />
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                Win 2 of remaining 4 games to clinch a playoff spot. Current projected seed: <strong style={{ color: '#fff' }}>2nd</strong>.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCell({ label, value, sub, gold }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', borderRight: '1px solid rgba(255,255,255,0.10)' }}>
      <Eyebrow color="rgba(255,255,255,0.55)">{label}</Eyebrow>
      <Display size={36} color={gold ? 'var(--varsity-gold)' : '#fff'} style={{ marginTop: 4 }}>{value}</Display>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{sub}</div>
    </div>
  );
}
