import Icon from '../shared/Icon.jsx';
import { usePlayers, TEAM_INFO } from '../shared/store.js';

const POS_COLOR = {
  Guard:   { bg: 'rgba(10,31,61,0.08)',     text: 'var(--court-navy)' },
  Forward: { bg: 'rgba(232,119,34,0.10)',   text: 'var(--basketball-orange)' },
  Center:  { bg: 'rgba(255,199,44,0.15)',   text: '#92620A' },
};

export default function RosterTab({ family }) {
  const [players] = usePlayers();
  const PLAYERS = players.filter(p => p.status !== 'inactive' && p.team === family.child.team);
  const TEAM = TEAM_INFO;
  const myNumber = family.child.number;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Team header */}
      <div style={{ background: 'var(--court-navy)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <img src="/assets/logo-fpyc-basketball-v3.png" alt="" style={{ height: 48, objectFit: 'contain' }} />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff', textTransform: 'uppercase', lineHeight: 1 }}>{TEAM.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{TEAM.division} · {TEAM.record} · {TEAM.seed} in division</div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[
          { label: 'Players', value: PLAYERS.length },
          { label: 'Guards', value: PLAYERS.filter(p => p.position === 'Guard').length },
          { label: 'Forwards/Centers', value: PLAYERS.filter(p => p.position !== 'Guard').length },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--court-navy)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Roster list */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 10 }}>
          Team roster · {PLAYERS.length} players
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...PLAYERS].sort((a, b) => a.number - b.number).map(p => {
            const isMe = p.number === myNumber;
            const posColors = POS_COLOR[p.position] || POS_COLOR.Guard;
            return (
              <div key={p.number} style={{
                background: isMe ? 'rgba(10,31,61,0.04)' : '#fff',
                border: `1.5px solid ${isMe ? 'var(--court-navy)' : '#E2E5EA'}`,
                borderRadius: 10, padding: '11px 14px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                  background: isMe ? 'var(--court-navy)' : '#F4F5F7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: 18,
                  color: isMe ? 'var(--varsity-gold)' : 'var(--fg-muted)',
                }}>
                  {p.number}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {p.name}
                    {isMe && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: 'var(--varsity-gold)', color: 'var(--court-navy)' }}>Your child</span>}
                  </div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{p.grade} grade</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: posColors.bg, color: posColors.text }}>{p.position}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coach */}
      <div style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--varsity-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--court-navy)' }}>
          MD
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Coach M. Davis</div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Head Coach · Volunteer · Boys 5–6 House</div>
        </div>
        <a href="mailto:coach@fpycsports.org" style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--court-navy)' }}>
          <Icon name="mail" size={15} /> Email
        </a>
      </div>
    </div>
  );
}
