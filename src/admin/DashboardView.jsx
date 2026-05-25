import { useState } from 'react';
import { Card, Pill, Button, Icon, Eyebrow, Display } from '../shared/index.js';

export default function DashboardView({ team, players, games, onGo }) {
  const next = games.find(g => g.status === 'scheduled');
  const recent = games.filter(g => g.status === 'final').slice(0, 3);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
      {/* Next game hero */}
      <Card padding={0} style={{ overflow: 'hidden', gridColumn: '1 / -1' }}>
        <div style={{
          background: 'var(--court-navy)',
          color: '#fff',
          padding: '22px 26px',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 28,
          alignItems: 'center',
          backgroundImage: 'radial-gradient(circle at 92% 10%, rgba(255,199,44,0.12), transparent 50%), radial-gradient(circle at 8% 90%, rgba(232,119,34,0.10), transparent 55%)',
        }}>
          <div>
            <Eyebrow color="var(--varsity-gold)">Next game · {next.day}</Eyebrow>
            <Display size={40} color="#fff" style={{ marginTop: 6 }}>{next.opponent}</Display>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, fontSize: 13, color: 'rgba(255,255,255,0.78)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name="map-pin" size={14} />{next.location}
              </span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name="clock" size={14} />{next.time}
              </span>
            </div>
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            padding: '0 24px', borderLeft: '1px solid rgba(255,255,255,0.10)', borderRight: '1px solid rgba(255,255,255,0.10)',
          }}>
            <Eyebrow color="rgba(255,255,255,0.5)">Tip-off in</Eyebrow>
            <Display size={56} color="var(--varsity-gold)">{next.countdown}</Display>
            <Eyebrow color="rgba(255,255,255,0.5)">days</Eyebrow>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
            <Pill kind="gold">Home · {team.division}</Pill>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', textAlign: 'right' }}>
              {next.confirmed} of {players.length} players confirmed
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button kind="gold" icon="clipboard-list" onClick={() => onGo('lineup')}>Set lineup</Button>
              <Button kind="onDark" icon="send">Notify team</Button>
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 26px', display: 'flex', gap: 28, alignItems: 'center', background: 'var(--bone)', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="bus" size={16} color="var(--fg-muted)" />
            <span style={{ fontSize: 13 }}>Carpool: <strong>3 families volunteered</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="shirt" size={16} color="var(--fg-muted)" />
            <span style={{ fontSize: 13 }}>Jerseys: <strong>Navy (home)</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="users" size={16} color="var(--fg-muted)" />
            <span style={{ fontSize: 13 }}>Referees: <strong>Confirmed</strong></span>
          </div>
        </div>
      </Card>

      {/* Recent results */}
      <Card>
        <SectionHeader title="Recent results" link="See all" onLink={() => onGo('schedule')} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          {recent.map(g => <ResultRow key={g.id} game={g} />)}
        </div>
      </Card>

      {/* Practice attendance */}
      <Card>
        <SectionHeader title="Practice attendance" subtitle="Last 4 sessions" />
        <div style={{ display: 'flex', gap: 18, marginTop: 14, alignItems: 'flex-end' }}>
          {[
            { label: 'Nov 3', value: 11 },
            { label: 'Nov 5', value: 10 },
            { label: 'Nov 10', value: 12 },
            { label: 'Nov 12', value: 9 },
          ].map((b, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <Display size={28}>{b.value}</Display>
              <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${(b.value / 12) * 100}%`, height: '100%', background: 'var(--varsity-gold)' }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{b.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 13, color: 'var(--fg-soft)' }}>Avg 87% · {players.length} roster</span>
          <Button kind="ghost" size="sm" icon="plus">Log practice</Button>
        </div>
      </Card>

      {/* League announcements */}
      <Card style={{ gridColumn: '1 / -1' }}>
        <SectionHeader title="League announcements" link="Inbox · 2" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 8 }}>
          <Announce
            from="Commissioner Patel" time="2h ago" warn
            title="Late fees begin November 15"
            body="Reminder for all coaches: please confirm your roster by Nov 14. Late registrations after the 15th will incur a $45 fee."
          />
          <Announce
            from="Skills Clinic" time="Yesterday"
            title="Saturday clinic moved to Robinson HS Gym B"
            body="Due to a scheduling conflict at Lanier MS, this Saturday's K–2 skills clinic will be held at Robinson HS Gym B from 9–10:30am."
          />
          <Announce
            from="Director's office" time="Mon"
            title="Volunteers needed — scorekeeping"
            body="We are in need of volunteers for scorekeeping at the Dec 7–8 weekend. One game = one volunteer credit toward next season."
          />
        </div>
      </Card>
    </div>
  );
}

function SectionHeader({ title, subtitle, link, onLink }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, marginBottom: 4 }}>
      <div>
        <Display size={22}>{title}</Display>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4 }}>{subtitle}</div>}
      </div>
      {link && (
        <button onClick={onLink} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--court-navy)', display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>{link} <Icon name="arrow-right" size={14} /></button>
      )}
    </div>
  );
}

function ResultRow({ game }) {
  const win = game.us > game.them;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px', background: 'var(--bone)', border: '1px solid var(--border)', borderRadius: 8 }}>
      <Pill kind={win ? 'win' : 'loss'}>{win ? 'W' : 'L'}</Pill>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>vs. {game.opponent}</div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{game.day} · {game.location}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: win ? 'var(--court-navy)' : 'var(--fg-muted)' }}>
        {game.us}<span style={{ color: 'var(--fg-muted)', margin: '0 6px' }}>–</span>{game.them}
      </div>
    </div>
  );
}

function Announce({ from, time, title, body, warn }) {
  return (
    <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        {warn ? <Pill kind="warn">Action needed</Pill> : <Pill kind="neutral">Notice</Pill>}
        <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{from} · {time}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--fg-soft)', lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}
