import { useState, useEffect } from 'react';
import Icon from '../shared/Icon.jsx';
import { supabase } from '../shared/supabase.js';
import { useGames, useOfficials, useOfficialAssignments, gameDateOf } from '../shared/store.js';

/**
 * A referee's own game schedule.
 *
 * The signed-in account is matched to a row in `officials` by email, then to
 * games whose `official_assignments.refs` array contains that official's name.
 */
export default function RefSchedule({ onSignOut }) {
  const [games]       = useGames();
  const [officials]   = useOfficials();
  const [assignments] = useOfficialAssignments();
  const [email, setEmail]   = useState(null);
  const [ready, setReady]   = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data?.user?.email?.toLowerCase() ?? null);
      setReady(true);
    });
  }, []);

  const me = email
    ? officials.find(o => (o.email || '').toLowerCase() === email)
    : null;

  if (!ready) return <Shell><Muted>Loading…</Muted></Shell>;

  if (!me) {
    return (
      <Shell onSignOut={onSignOut} name="Officials Portal">
        <Card>
          <div style={{ textAlign: 'center', padding: '32px 8px' }}>
            <Icon name="user-x" size={30} color="var(--border-strong)" />
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg)', marginTop: 12 }}>
              No officials record for {email || 'this account'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 6, lineHeight: 1.6, maxWidth: 380, margin: '6px auto 0' }}>
              Your sign-in works, but no referee on the roster uses this email address.
              Email <a href="mailto:fpycreferee@gmail.com" style={{ color: 'var(--court-navy)', fontWeight: 700 }}>fpycreferee@gmail.com</a>{' '}
              to have it added to your officials record.
            </div>
          </div>
        </Card>
      </Shell>
    );
  }

  const mine = Object.entries(assignments)
    .filter(([, a]) => (a.refs || []).some(n => n && n.toLowerCase() === me.name.toLowerCase()))
    .map(([gameId, a]) => ({ game: games.find(g => g.id === gameId), assignment: a }))
    .filter(x => x.game);

  const byDate = (a, b) => (gameDateOf(a.game) ?? 0) - (gameDateOf(b.game) ?? 0);
  const upcoming = mine.filter(x => x.game.status !== 'final').sort(byDate);
  const past     = mine.filter(x => x.game.status === 'final').sort((a, b) => byDate(b, a));
  const next     = upcoming[0];

  const partnerOf = (a) => (a.refs || []).filter(n => n && n.toLowerCase() !== me.name.toLowerCase());

  return (
    <Shell onSignOut={onSignOut} name={`${me.name}${me.cert ? ' · ' + me.cert : ''}`}>
      {/* Next assignment */}
      {next ? (
        <div style={{ background: 'var(--court-navy)', borderRadius: 14, padding: '20px 22px', color: '#fff' }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--varsity-gold)' }}>
            Next assignment · {next.game.day}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, textTransform: 'uppercase', lineHeight: 1.1, marginTop: 8 }}>
            {next.game.opponent}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.78)' }}>
            <Meta icon="clock" text={next.game.time} />
            <Meta icon="map-pin" text={next.game.location} />
            {partnerOf(next.assignment).length > 0 && (
              <Meta icon="users" text={`With ${partnerOf(next.assignment).join(', ')}`} />
            )}
          </div>
          {next.assignment.status && (
            <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.12)' }}>
              <Icon name="info" size={12} color="var(--varsity-gold)" />
              {next.assignment.status}
            </div>
          )}
        </div>
      ) : (
        <Card>
          <div style={{ textAlign: 'center', padding: '28px 8px' }}>
            <Icon name="calendar" size={28} color="var(--border-strong)" />
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg)', marginTop: 12 }}>No games assigned yet</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>
              Assignments appear here as soon as the Ref Director schedules you.
            </div>
          </div>
        </Card>
      )}

      {/* Counts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        <Stat label="Upcoming" value={upcoming.length} color="var(--court-navy)" />
        <Stat label="Worked" value={past.length} color="#059669" />
      </div>

      {upcoming.length > 1 && (
        <Section title={`Upcoming · ${upcoming.length - 1} more`}>
          {upcoming.slice(1).map(x => <Row key={x.game.id} x={x} partners={partnerOf(x.assignment)} />)}
        </Section>
      )}

      {past.length > 0 && (
        <Section title={`Games worked · ${past.length}`}>
          {past.map(x => <Row key={x.game.id} x={x} partners={partnerOf(x.assignment)} done />)}
        </Section>
      )}
    </Shell>
  );
}

function Shell({ children, onSignOut, name }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bone)', fontFamily: 'var(--font-body)' }}>
      <header style={{ background: 'var(--court-navy)', borderBottom: '3px solid var(--varsity-gold)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <img src="/assets/logo-fpyc-basketball-v3.png" alt="FPYC" style={{ height: 30, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', lineHeight: 1 }}>
                My Assignments
              </div>
              {name && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{name}</div>}
            </div>
          </div>
          {onSignOut && (
            <button onClick={onSignOut} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
              <Icon name="log-out" size={15} color="rgba(255,255,255,0.55)" /> Sign out
            </button>
          )}
        </div>
      </header>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 20px 64px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {children}
      </div>
    </div>
  );
}

function Row({ x, partners, done }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
      <div style={{
        width: 38, height: 38, borderRadius: 9, flexShrink: 0,
        background: done ? 'rgba(5,150,105,0.10)' : 'rgba(10,31,61,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={done ? 'check' : 'calendar'} size={16} color={done ? '#059669' : 'var(--court-navy)'} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg)' }}>{x.game.opponent}</div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>
          {x.game.day} · {x.game.time} · {x.game.location}
        </div>
        {partners.length > 0 && (
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 3 }}>With {partners.join(', ')}</div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{label}</div>
    </div>
  );
}

const Card = ({ children }) => (
  <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>{children}</div>
);
const Muted = ({ children }) => (
  <div style={{ color: 'var(--fg-muted)', fontSize: 14, textAlign: 'center', padding: 40 }}>{children}</div>
);
function Meta({ icon, text }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Icon name={icon} size={13} color="rgba(255,255,255,0.6)" /> {text}
    </span>
  );
}
