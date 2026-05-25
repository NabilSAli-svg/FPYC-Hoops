import { useState } from 'react';
import Icon from '../shared/Icon.jsx';
import { SectionHead } from './Programs.jsx';

export function Announcements() {
  return (
    <section style={{ background: 'var(--bone)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        <div style={{
          background: 'var(--status-warning)', color: 'var(--court-navy)',
          padding: '4px 10px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase',
          display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
        }}>
          <Icon name="megaphone" size={12} /> Heads up
        </div>
        <div style={{ fontSize: 14, color: 'var(--fg)', fontWeight: 500, flex: 1, minWidth: 280 }}>
          <strong>Late fees begin November 15.</strong> Walk-in registration this Saturday at the FPYC office, 10am–12pm.
        </div>
        <a href="/register" style={{ color: 'var(--court-navy)', fontWeight: 700, fontSize: 13, textDecoration: 'underline', textDecorationThickness: 2 }}>
          Register now →
        </a>
      </div>
    </section>
  );
}

export function Schedule() {
  const games = [
    { day: 'SAT', date: '07', month: 'DEC', time: '10:00 AM', team: 'Hawks · Boys 5–6 House',   opp: 'vs. Vienna Storm',      loc: 'Robinson HS · Gym B', home: true },
    { day: 'SAT', date: '07', month: 'DEC', time: '11:30 AM', team: 'Wolves · Girls 5–6 House', opp: '@ McLean Mustangs',     loc: 'Cooper MS · Main',    home: false },
    { day: 'SAT', date: '14', month: 'DEC', time: '10:00 AM', team: 'Eagles · Boys 7–8 Select', opp: '@ Reston Storm',        loc: 'South Lakes HS',      home: false },
    { day: 'SUN', date: '15', month: 'DEC', time: '12:30 PM', team: 'Cougars · Girls 3–4 House',opp: 'vs. Burke Lakers',      loc: 'Lanier MS · Gym A',   home: true },
    { day: 'SAT', date: '21', month: 'DEC', time: '9:00 AM',  team: 'Hawks · Boys 5–6 House',   opp: '@ Centreville Eagles',  loc: 'Cub Run Rec',         home: false },
  ];

  return (
    <section id="schedule" style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <SectionHead eyebrow="This weekend" title="On the schedule" />
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn kind="ghost"><Icon name="filter" size={14} /> All teams</Btn>
          <Btn kind="gold" onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })}>Full schedule <Icon name="arrow-right" size={14} /></Btn>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 }}>
        {games.map((g, i) => <GameRow key={i} g={g} />)}
      </div>
    </section>
  );
}

function GameRow({ g }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
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
        <span style={{
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase',
          padding: '4px 10px', borderRadius: 999,
          background: g.home ? 'var(--court-navy)' : '#fff',
          color: g.home ? '#fff' : 'var(--court-navy)',
          border: g.home ? 'none' : '1px solid var(--border)',
        }}>{g.home ? 'Home' : 'Away'}</span>
        <button onClick={() => setExpanded(o => !o)} style={{
          all: 'unset', cursor: 'pointer', color: 'var(--court-navy)', fontSize: 13, fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          Details <Icon name={expanded ? 'minus' : 'arrow-right'} size={14} />
        </button>
      </div>
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
    { eyebrow: 'Championship', title: 'Boys 7–8 Select wins state',          date: 'Mar 22', read: '3 min', img: 'gold' },
    { eyebrow: 'Volunteer',    title: 'Scorekeepers needed for Dec 7–8',      date: 'Nov 18', read: '1 min', img: 'navy' },
    { eyebrow: 'Tryouts',      title: 'Select 2025–26 tryout results posted', date: 'Sep 12', read: '2 min', img: 'orange' },
  ];

  return (
    <section id="news" style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 24px 0' }}>
      <SectionHead eyebrow="News" title="From around the league" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 32 }}>
        {posts.map((p, i) => (
          <article key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-1)' }}>
            <div style={{
              height: 180,
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
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 999, background: 'rgba(0,0,0,0.18)' }}>
                {p.eyebrow}
              </span>
            </div>
            <div style={{ padding: '18px 20px 22px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1.1, color: 'var(--court-navy)', textTransform: 'uppercase' }}>{p.title}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 12, color: 'var(--fg-muted)' }}>
                <span>{p.date}</span>
                <span>{p.read} read</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function FaqContact() {
  return (
    <section id="contact" style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 24px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 56 }}>
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

        <aside id="volunteer" style={{ background: 'var(--court-navy)', color: '#fff', borderRadius: 14, padding: 32, alignSelf: 'start', position: 'sticky', top: 92 }}>
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
