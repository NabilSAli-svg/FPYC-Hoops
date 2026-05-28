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

const VOLUNTEER_ROLES = [
  { icon: 'whistle',      title: 'Head Coach',       commitment: '2–3 hrs/week', desc: 'Run practices, set lineups, communicate with families. No experience required — just patience and enthusiasm.', spots: 2 },
  { icon: 'clipboard',    title: 'Scorekeeper',       commitment: '2 hrs/game',  desc: 'Track points and fouls at the scorer\'s table. Quick training provided. One game = one volunteer credit.', spots: 8 },
  { icon: 'users',        title: 'Team Parent',       commitment: '1 hr/week',   desc: 'Coordinate carpools, collect snacks, send reminders. The glue that keeps a team together off the court.', spots: 4 },
  { icon: 'megaphone',    title: 'Communications',    commitment: '1–2 hrs/week',desc: 'Help manage the website, send newsletters, run social media. Great for parents with a marketing or tech background.', spots: 1 },
  { icon: 'layout',       title: 'Board Member',      commitment: '4–6 hrs/month',desc: 'Shape FPYC policy, manage budgets, plan the season. Elections held each spring. Open to all FPYC families.', spots: 3 },
  { icon: 'camera',       title: 'Game Photographer', commitment: 'Per game',    desc: 'Capture game-day moments families will treasure. Share photos with teams after each game day.', spots: 'Open' },
];

export function FaqContact() {
  const isMobile = useIsMobile();
  const [volForm, setVolForm] = useState({ name: '', email: '', role: '', note: '' });
  const [volSent, setVolSent] = useState(false);

  function handleVolSubmit(e) {
    e.preventDefault();
    if (!volForm.name.trim() || !volForm.email.trim() || !volForm.role) return;
    setVolSent(true);
  }

  return (
    <>
      {/* Volunteer section */}
      <section id="volunteer" style={{ background: 'var(--court-navy)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--varsity-gold)', marginBottom: 8 }}>Get involved</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 42px)', textTransform: 'uppercase', color: '#fff', lineHeight: 1 }}>Volunteer with us</div>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', marginTop: 10, maxWidth: 540, lineHeight: 1.6 }}>
                FPYC is 100% volunteer-run. Every coach, scorekeeper, and board member is a parent giving time so kids can play.
              </p>
            </div>
          </div>

          {/* Role cards */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 14, marginBottom: 48 }}>
            {VOLUNTEER_ROLES.map(r => (
              <div key={r.title} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, padding: '20px 20px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(255,199,44,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={r.icon} size={18} color="var(--varsity-gold)" />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em' }}>
                    {typeof r.spots === 'number' ? `${r.spots} spots` : r.spots}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>{r.title}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--varsity-gold)', marginBottom: 8, letterSpacing: '0.04em' }}>{r.commitment}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>{r.desc}</div>
              </div>
            ))}
          </div>

          {/* Sign-up form */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 32, alignItems: 'start' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, textTransform: 'uppercase', color: '#fff', lineHeight: 1, marginBottom: 10 }}>Express interest</div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.60)', lineHeight: 1.6, marginBottom: 0 }}>
                Fill out the form and the Commissioner will reach out before the season starts. No commitment yet — just let us know you're interested.
              </p>
            </div>

            {volSent ? (
              <div style={{ background: 'rgba(31,138,91,0.15)', border: '1px solid rgba(31,138,91,0.35)', borderRadius: 12, padding: '28px 24px', textAlign: 'center' }}>
                <Icon name="check-circle" size={36} color="var(--status-win)" />
                <div style={{ fontWeight: 700, fontSize: 18, color: '#fff', marginTop: 12 }}>Thanks, {volForm.name.split(' ')[0]}!</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>We'll be in touch at {volForm.email} before the season kicks off.</div>
                <button onClick={() => { setVolSent(false); setVolForm({ name: '', email: '', role: '', note: '' }); }} style={{ all: 'unset', cursor: 'pointer', marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'underline', fontFamily: 'var(--font-body)' }}>Submit another response</button>
              </div>
            ) : (
              <form onSubmit={handleVolSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { key: 'name',  label: 'Your name',     placeholder: 'Full name',          type: 'text'  },
                  { key: 'email', label: 'Email address', placeholder: 'you@email.com',       type: 'email' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{f.label}</label>
                    <input type={f.type} value={volForm[f.key]} onChange={e => setVolForm(v => ({ ...v, [f.key]: e.target.value }))} placeholder={f.placeholder} required
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px 13px', borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none' }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Role of interest</label>
                  <select value={volForm.role} onChange={e => setVolForm(v => ({ ...v, role: e.target.value }))} required
                    style={{ width: '100%', padding: '10px 13px', borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: volForm.role ? '#fff' : 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'var(--font-body)', cursor: 'pointer', outline: 'none' }}>
                    <option value="" style={{ color: '#111' }}>Select a role…</option>
                    {VOLUNTEER_ROLES.map(r => <option key={r.title} value={r.title} style={{ color: '#111' }}>{r.title} — {r.commitment}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Anything else? <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                  <textarea value={volForm.note} onChange={e => setVolForm(v => ({ ...v, note: e.target.value }))} placeholder="Availability, prior experience, questions…" rows={3}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 13px', borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical' }} />
                </div>
                <button type="submit" style={{ padding: '13px', borderRadius: 8, border: 'none', background: 'var(--varsity-gold)', color: 'var(--court-navy)', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  Submit interest <Icon name="arrow-right" size={15} color="var(--court-navy)" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ + Contact */}
      <section id="contact" style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px 0' }}>
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
                { q: 'What\'s the refund policy?', a: 'Full refund minus a $50 admin fee through November 30. No refunds after December 1 once the season has begun.' },
              ].map((f, i) => <Faq key={i} {...f} />)}
            </div>
          </div>

          <aside style={{ alignSelf: 'start', ...(isMobile ? {} : { position: 'sticky', top: 92 }) }}>
            <div style={{ background: 'var(--court-navy)', borderRadius: 14, padding: 28, marginBottom: 16 }}>
              <div style={{ height: 4, background: 'var(--varsity-gold)', borderRadius: 2, width: 48, marginBottom: 16 }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, lineHeight: 1, textTransform: 'uppercase', color: '#fff', marginBottom: 18 }}>Get in touch</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <ContactItem icon="phone"   label="Commissioner of Basketball" value="(703) 425-7000" />
                <ContactItem icon="mail"    label="Email"                      value="basketball@fpycsports.org" />
                <ContactItem icon="map-pin" label="Office"                     value="3955 Pickett Rd, Fairfax VA 22030" />
                <ContactItem icon="clock"   label="Office hours"               value="Mon–Fri 9am–5pm" />
              </div>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--court-navy)', marginBottom: 6 }}>Mailing address</div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.7 }}>
                FPYC Basketball<br />
                3955 Pickett Road<br />
                Fairfax, VA 22030
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--court-navy)', marginBottom: 6 }}>About FPYC</div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.6 }}>The Fairfax Police Youth Club is a 501(c)(3) nonprofit serving Fairfax County youth since 1951. Basketball registration fees support programs, gym rentals, and equipment.</div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
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
