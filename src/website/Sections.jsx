import { useState } from 'react';
import Icon from '../shared/Icon.jsx';
import { SectionHead } from './Programs.jsx';
import { useIsMobile } from '../shared/useIsMobile.js';
import { useGames, useAnnouncements } from '../shared/store.js';

const TYPE_ICON = { urgent: 'alert-circle', info: 'info', general: 'megaphone' };
const TYPE_COLOR = { urgent: 'var(--foul-red)', info: 'var(--court-navy)', general: 'var(--basketball-orange)' };

export function Announcements() {
  const [announcements] = useAnnouncements();
  const [idx, setIdx] = useState(0);

  const visible = announcements.filter(a => a.target === 'All families');
  if (!visible.length) return null;

  const sorted = [...visible].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const current = sorted[idx % sorted.length];
  const color = TYPE_COLOR[current.type] || TYPE_COLOR.info;

  return (
    <section style={{ background: 'var(--bone)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: `${color}18`, flexShrink: 0 }}>
          <Icon name={TYPE_ICON[current.type] || 'megaphone'} size={12} color={color} />
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color, fontFamily: 'var(--font-body)' }}>
            {current.type === 'urgent' ? 'Urgent' : current.type === 'info' ? 'Info' : 'News'}
          </span>
        </div>
        <div style={{ fontSize: 14, color: 'var(--fg)', fontWeight: 500, flex: 1, minWidth: 200 }}>
          <strong>{current.title}.</strong> {current.body.length > 120 ? current.body.slice(0, 117) + '…' : current.body}
        </div>
        {sorted.length > 1 && (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
            <button onClick={() => setIdx(i => (i - 1 + sorted.length) % sorted.length)} style={{ all: 'unset', cursor: 'pointer', padding: '4px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.06)', fontSize: 14, lineHeight: 1 }}>‹</button>
            <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 600 }}>{(idx % sorted.length) + 1}/{sorted.length}</span>
            <button onClick={() => setIdx(i => (i + 1) % sorted.length)} style={{ all: 'unset', cursor: 'pointer', padding: '4px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.06)', fontSize: 14, lineHeight: 1 }}>›</button>
          </div>
        )}
      </div>
    </section>
  );
}

export function Schedule() {
  const [allGames] = useGames();
  const scheduled = allGames.filter(g => g.status === 'scheduled');
  const finals    = allGames.filter(g => g.status === 'final').slice(-2).reverse();
  const display   = [
    ...scheduled.map(g => ({
      day: g.weekday, date: String(g.date).padStart(2, '0'), month: g.month.toUpperCase(),
      time: g.time, team: 'Hawks · Boys 5–6 House',
      opp: (g.home ? 'vs. ' : '@ ') + g.opponent,
      loc: g.location, home: g.home,
      us: g.us, them: g.them, final: false,
    })),
    ...finals.map(g => ({
      day: g.weekday, date: String(g.date).padStart(2, '0'), month: g.month.toUpperCase(),
      time: g.time, team: 'Hawks · Boys 5–6 House',
      opp: (g.home ? 'vs. ' : '@ ') + g.opponent,
      loc: g.location, home: g.home,
      us: g.us, them: g.them, final: true,
    })),
  ].slice(0, 5);

  return (
    <section id="schedule" style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <SectionHead eyebrow="Hawks schedule" title="Upcoming & recent" />
        <a href="/family" style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, padding: '10px 14px', borderRadius: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--varsity-gold)', color: 'var(--court-navy)', textDecoration: 'none' }}>
          Full schedule <Icon name="arrow-right" size={14} />
        </a>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 }}>
        {display.map((g, i) => <GameRow key={i} g={g} />)}
      </div>
    </section>
  );
}

function GameRow({ g }) {
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();
  const win = g.final && g.us > g.them;
  return (
    <div style={{ background: '#fff', border: `1px solid ${g.final ? 'var(--border)' : 'var(--court-navy)'}`, borderRadius: 8, overflow: 'hidden', opacity: g.final ? 0.80 : 1 }}>
      {isMobile ? (
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', color: 'var(--fg-muted)', textTransform: 'uppercase' }}>{g.day} · {g.month} {g.date}</span>
            <span style={{ fontSize: 11, color: 'var(--fg-soft)', fontWeight: 500 }}>{g.time}</span>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{g.team}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--court-navy)', lineHeight: 1.1, marginTop: 4 }}>{g.opp}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-soft)', marginTop: 4, display: 'inline-flex', gap: 4, alignItems: 'center' }}>
              <Icon name="map-pin" size={12} />{g.loc}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {g.final ? (
              <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: win ? 'rgba(31,138,91,0.10)' : 'rgba(200,16,46,0.08)', color: win ? '#059669' : '#DC2626' }}>
                {win ? 'W' : 'L'} {g.us}–{g.them} · Final
              </span>
            ) : (
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase',
                padding: '4px 10px', borderRadius: 999,
                background: g.home ? 'var(--court-navy)' : '#fff',
                color: g.home ? '#fff' : 'var(--court-navy)',
                border: g.home ? 'none' : '1px solid var(--border)',
              }}>{g.home ? 'Home' : 'Away'}</span>
            )}
            <button onClick={() => setExpanded(o => !o)} style={{
              all: 'unset', cursor: 'pointer', color: 'var(--court-navy)', fontSize: 13, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              Details <Icon name={expanded ? 'minus' : 'arrow-right'} size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid', gridTemplateColumns: '88px 1fr auto auto', alignItems: 'center', gap: 18, padding: '14px 18px',
        }}>
          <div style={{ textAlign: 'center', borderRight: '1px solid var(--border)', paddingRight: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', color: 'var(--fg-muted)' }}>{g.day} · {g.month}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--court-navy)', lineHeight: 1, margin: '2px 0' }}>{g.date}</div>
            <div style={{ fontSize: 11, color: 'var(--fg-soft)', fontWeight: 500 }}>{g.time}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{g.team}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--court-navy)', lineHeight: 1.1, marginTop: 4 }}>{g.opp}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-soft)', marginTop: 4, display: 'inline-flex', gap: 4, alignItems: 'center' }}>
              <Icon name="map-pin" size={12} />{g.loc}
            </div>
          </div>
          {g.final ? (
            <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: win ? 'rgba(31,138,91,0.10)' : 'rgba(200,16,46,0.08)', color: win ? '#059669' : '#DC2626' }}>
              {win ? 'W' : 'L'} {g.us}–{g.them} · Final
            </span>
          ) : (
            <span style={{
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase',
              padding: '4px 10px', borderRadius: 999,
              background: g.home ? 'var(--court-navy)' : '#fff',
              color: g.home ? '#fff' : 'var(--court-navy)',
              border: g.home ? 'none' : '1px solid var(--border)',
            }}>{g.home ? 'Home' : 'Away'}</span>
          )}
          <button onClick={() => setExpanded(o => !o)} style={{
            all: 'unset', cursor: 'pointer', color: 'var(--court-navy)', fontSize: 13, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            Details <Icon name={expanded ? 'minus' : 'arrow-right'} size={14} />
          </button>
        </div>
      )}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '12px 18px 14px', background: 'var(--bone)', display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 13, color: 'var(--fg)' }}>
          <span><strong>Location:</strong> {g.loc}</span>
          <span><strong>Tip-off:</strong> {g.time}</span>
          <span><strong>Type:</strong> {g.home ? 'Home game' : 'Away game'}</span>
        </div>
      )}
    </div>
  );
}

export function News() {
  const posts = [
    {
      eyebrow: 'Championship',
      title: 'Hawks Boys 7–8 win back-to-back FPYC titles',
      summary: 'The Hawks defeated the Reston Wolves 54–47 in a thrilling championship final, capping an undefeated home record.',
      date: 'Mar 22',
      read: '3 min',
      img: 'gold',
    },
    {
      eyebrow: 'Volunteer',
      title: 'Scorekeepers needed for Dec 7–8 weekend',
      summary: 'We need volunteers for scorekeeping this weekend. One game equals one volunteer credit toward your next-season fee.',
      date: 'Nov 18',
      read: '1 min',
      img: 'navy',
    },
    {
      eyebrow: 'Season',
      title: '2025–26 Select Travel tryout results now posted',
      summary: 'Coaches have notified all participants. Check your email for placement info. The season kicks off in October.',
      date: 'Sep 12',
      read: '2 min',
      img: 'orange',
    },
  ];

  return (
    <section id="news" style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 24px 0' }}>
      <SectionHead eyebrow="News" title="From around the league" />
      <div className="mob-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 32 }}>
        {posts.map((p, i) => (
          <article key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-1)', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              height: 160,
              background: p.img === 'gold'   ? 'linear-gradient(135deg, #FFC72C 0%, #E5B324 100%)'
                        : p.img === 'orange' ? 'linear-gradient(135deg, #E87722 0%, #B85A12 100%)'
                        : 'var(--court-navy)',
              position: 'relative', overflow: 'hidden',
              display: 'flex', alignItems: 'flex-end', padding: 18,
              color: p.img === 'gold' ? 'var(--court-navy)' : '#fff',
            }}>
              <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.18 }}>
                <img src="/assets/basketball-glyph.svg" alt="" style={{ width: 180 }} />
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 999, background: 'rgba(0,0,0,0.20)', position: 'relative' }}>
                {p.eyebrow}
              </span>
            </div>
            <div style={{ padding: '18px 20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.15, color: 'var(--court-navy)', textTransform: 'uppercase', marginBottom: 8 }}>{p.title}</div>
              <p style={{ fontSize: 13, color: 'var(--fg-soft)', lineHeight: 1.55, margin: '0 0 14px', flex: 1 }}>{p.summary}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--fg-muted)' }}>
                <span>{p.date}</span>
                <span style={{ color: 'var(--court-navy)', fontWeight: 700, cursor: 'pointer' }}>{p.read} read →</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function FaqContact() {
  const isMobile = useIsMobile();
  return (
    <section id="contact" style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 24px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: isMobile ? 32 : 56 }}>
        <div>
          <SectionHead eyebrow="FAQ" title="Common questions" />
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { q: 'When does the season run?', a: 'House League runs December through February, with practices starting in mid-November. Select Travel runs October through March.' },
              { q: 'Are there tryouts?', a: 'House League does NOT have tryouts — every kid is placed on a team. Select / Travel has tryouts in early September.' },
              { q: 'How do scholarships work?', a: 'FPYC offers need-based scholarships for any family that asks. There is no separate application — just check the box during registration and the Commissioner will follow up.' },
              { q: 'Do I have to volunteer?', a: 'No, but FPYC is a 100% volunteer-run nonprofit. Coaches, scorekeepers, and board members are all parents giving time. Volunteer credit reduces next-season fees.' },
              { q: 'Where are practices held?', a: 'At Fairfax County public school gyms — usually Daniels Run, Providence, Lanier, and Robinson. Specific gym is set after teams are formed.' },
            ].map((f, i) => <Faq key={i} {...f} />)}
          </div>
        </div>

        <aside id="volunteer" style={{ background: 'var(--court-navy)', color: '#fff', borderRadius: 14, padding: 32, alignSelf: 'start', ...(isMobile ? {} : { position: 'sticky', top: 92 }) }}>
          <div style={{ height: 4, background: 'var(--varsity-gold)', borderRadius: 2, width: 48, marginBottom: 18 }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, lineHeight: 1, textTransform: 'uppercase', marginBottom: 10 }}>Volunteer with us</div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.78)', lineHeight: 1.55, marginBottom: 22 }}>
            FPYC is completely volunteer-based. Coaches, refs, scorekeepers, and admins — every role is a parent or community member showing up for kids.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
            <ContactItem icon="phone"   label="Commissioner of Basketball" value="(703) 425-7000" />
            <ContactItem icon="mail"    label="Email"                      value="basketball@fpycsports.com" />
            <ContactItem icon="map-pin" label="Office"                     value="3955 Pickett Rd, Fairfax VA" />
          </div>
          <a href="#volunteer" style={{
            background: 'var(--varsity-gold)', color: 'var(--court-navy)',
            padding: '12px 18px', borderRadius: 8, textDecoration: 'none',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>I want to coach <Icon name="arrow-right" size={14} /></a>
        </aside>
      </div>
    </section>
  );
}

function Faq({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: '1px solid var(--border)', padding: '18px 0' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        all: 'unset', cursor: 'pointer', width: '100%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
        fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: 'var(--court-navy)',
      }}>
        <span>{q}</span>
        <Icon name={open ? 'minus' : 'plus'} size={18} color="var(--court-navy)" />
      </button>
      {open && <p style={{ marginTop: 12, fontSize: 14, color: 'var(--fg-soft)', lineHeight: 1.6 }}>{a}</p>}
    </div>
  );
}

function ContactItem({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <Icon name={icon} size={16} color="var(--varsity-gold)" style={{ marginTop: 3 }} />
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>{label}</div>
        <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  );
}

function Btn({ kind, children, onClick }) {
  const styles = {
    ghost: { background: 'transparent', color: 'var(--court-navy)', border: '1px solid var(--court-navy)' },
    gold:  { background: 'var(--varsity-gold)', color: 'var(--court-navy)', border: '1px solid transparent' },
  };
  return (
    <button onClick={onClick} style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, padding: '10px 14px', borderRadius: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, ...styles[kind] }}>
      {children}
    </button>
  );
}
