import { useState, useEffect } from 'react';
import Icon from '../shared/Icon.jsx';
import Skeleton from '../shared/Skeleton.jsx';
import { TEAM, EVENTS, MESSAGES } from './data.js';

export default function HomeTab({ family, onTabChange }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <HomeSkeleton />;

  const { child } = family;
  const nextGame = EVENTS.find(e => e.type === 'game' && e.status === 'upcoming');
  const nextPractice = EVENTS.find(e => e.type === 'practice' && e.status === 'upcoming');
  const lastGame = EVENTS.find(e => e.type === 'game' && e.status === 'final');
  const lastWin = lastGame && lastGame.us > lastGame.them;
  const unread = MESSAGES.filter(m => m.unread).length;

  return (
    <div className="skel-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Welcome + child card */}
      <div style={{
        background: 'var(--court-navy)',
        backgroundImage: 'radial-gradient(circle at 90% 20%, rgba(255,199,44,0.14), transparent 50%)',
        borderRadius: 16, padding: '20px 22px', color: '#fff',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: 12, flexShrink: 0,
          background: 'var(--varsity-gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--court-navy)', lineHeight: 1,
        }}>
          {child.number}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Hi, {family.firstName} 👋
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', lineHeight: 1, marginTop: 3 }}>{child.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>
            #{child.number} · {child.position} · {child.grade} · {TEAM.name}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--varsity-gold)', lineHeight: 1 }}>{TEAM.record}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>{TEAM.seed} in division</div>
        </div>
      </div>

      {/* Unread messages alert */}
      {unread > 0 && (
        <button onClick={() => onTabChange('messages')} style={{
          all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
          background: 'rgba(255,199,44,0.10)', border: '1.5px solid rgba(255,199,44,0.35)',
          borderRadius: 12, padding: '13px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--varsity-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="message-square" size={18} color="var(--court-navy)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--court-navy)' }}>
              {unread} new message{unread > 1 ? 's' : ''} from Coach Davis
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>Game day info · Practice update</div>
          </div>
          <Icon name="arrow-right" size={16} color="var(--court-navy)" />
        </button>
      )}

      {/* Next game */}
      {nextGame && (
        <Section title="Next game" action={{ label: 'Full schedule', onClick: () => onTabChange('schedule') }}>
          <div style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ background: 'var(--court-navy)', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{nextGame.date}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff', textTransform: 'uppercase', lineHeight: 1, marginTop: 4 }}>{nextGame.label}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--varsity-gold)', lineHeight: 1 }}>4</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>days away</div>
              </div>
            </div>
            <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <InfoRow icon="clock" text={nextGame.time} />
              <InfoRow icon="map-pin" text={nextGame.location} />
              <InfoRow icon="shirt" text="Wear navy jerseys — home game" color="var(--court-navy)" />
            </div>
            <div style={{ padding: '12px 18px', background: '#F9FAFB', borderTop: '1px solid #E2E5EA', display: 'flex', gap: 10 }}>
              <RsvpButton current={nextGame.rsvp} />
            </div>
          </div>
        </Section>
      )}

      {/* Quick info strip */}
      <div style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--court-navy)' }}>
          Game day checklist
        </div>
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: 'shirt',       text: 'Navy jersey (home game)',          done: true  },
            { icon: 'droplets',    text: 'Water bottle',                     done: false },
            { icon: 'clock',       text: 'Arrive by 9:30 AM for warm-ups',   done: false },
            { icon: 'map-pin',     text: 'Robinson Secondary · Gym B',       done: false },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: item.done ? 'rgba(5,150,105,0.12)' : '#F4F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={item.done ? 'check' : item.icon} size={12} color={item.done ? '#059669' : '#9CA3AF'} />
              </div>
              <span style={{ color: item.done ? '#059669' : '#374151', fontWeight: item.done ? 600 : 400, textDecoration: item.done ? 'none' : 'none' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next practice */}
      {nextPractice && (
        <Section title="Next practice">
          <div style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(10,31,61,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="dumbbell" size={20} color="var(--court-navy)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--court-navy)' }}>{nextPractice.date}</div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 3 }}>
                {nextPractice.time} · {nextPractice.location}
              </div>
            </div>
            <RsvpChip current={nextPractice.rsvp} />
          </div>
        </Section>
      )}

      {/* Last result */}
      {lastGame && (
        <Section title="Last result">
          <div style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: lastWin ? 'rgba(31,138,91,0.10)' : 'rgba(200,16,46,0.08)' }}>
              <span style={{ fontWeight: 800, fontSize: 18, color: lastWin ? '#059669' : '#DC2626' }}>{lastWin ? 'W' : 'L'}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{lastGame.label}</div>
              <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{lastGame.date}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: lastWin ? 'var(--court-navy)' : '#9CA3AF', lineHeight: 1 }}>
              {lastGame.us}–{lastGame.them}
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, action, children }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#374151' }}>{title}</div>
        {action && (
          <button onClick={action.onClick} style={{ all: 'unset', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: 'var(--court-navy)', display: 'flex', alignItems: 'center', gap: 4 }}>
            {action.label} <Icon name="arrow-right" size={13} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ icon, text, color }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: color || '#6B7280' }}>
      <Icon name={icon} size={14} color={color || '#9CA3AF'} />
      <span style={{ fontWeight: color ? 700 : 400 }}>{text}</span>
    </div>
  );
}

function RsvpButton({ current }) {
  const [val, setVal] = useState(current);
  return (
    <div style={{ display: 'flex', gap: 8, flex: 1 }}>
      {[
        { id: 'yes', label: "I'll be there", icon: 'check', color: '#059669', bg: 'rgba(5,150,105,0.10)' },
        { id: 'no', label: "Can't make it", icon: 'x', color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
      ].map(opt => (
        <button key={opt.id} onClick={() => setVal(opt.id)} style={{
          flex: 1, padding: '9px 12px', borderRadius: 8, cursor: 'pointer',
          border: `2px solid ${val === opt.id ? opt.color : '#E2E5EA'}`,
          background: val === opt.id ? opt.bg : '#fff',
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
          color: val === opt.id ? opt.color : '#6B7280',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          transition: 'all 160ms',
        }}>
          <Icon name={opt.icon} size={14} color={val === opt.id ? opt.color : '#9CA3AF'} />
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function RsvpChip({ current }) {
  const [val, setVal] = useState(current);
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[{ id: 'yes', icon: 'check', color: '#059669' }, { id: 'no', icon: 'x', color: '#DC2626' }].map(opt => (
        <button key={opt.id} onClick={() => setVal(opt.id)} style={{
          width: 32, height: 32, borderRadius: 8, cursor: 'pointer', border: 'none',
          background: val === opt.id ? (opt.id === 'yes' ? 'rgba(5,150,105,0.12)' : 'rgba(220,38,38,0.10)') : '#F4F5F7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={opt.icon} size={14} color={val === opt.id ? opt.color : '#9CA3AF'} />
        </button>
      ))}
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Card 1 — Welcome (dark navy bg) */}
      <div style={{
        background: 'var(--court-navy)', borderRadius: 16, padding: '20px 22px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <Skeleton dark width={60} height={60} style={{ borderRadius: 12, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <Skeleton dark width={100} height={11} style={{ marginBottom: 6 }} />
          <Skeleton dark width={180} height={22} />
          <Skeleton dark width={140} height={11} style={{ marginTop: 6 }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <Skeleton dark width={60} height={28} />
          <Skeleton dark width={80} height={11} style={{ marginTop: 4 }} />
        </div>
      </div>

      {/* Card 2 — Next game */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '16px 18px' }}>
        <div style={{ display: 'flex' }}>
          <Skeleton width={100} height={11} />
          <Skeleton width={60} height={11} style={{ marginLeft: 'auto' }} />
        </div>
        <Skeleton width="65%" height={26} style={{ margin: '10px 0 6px' }} />
        <div style={{ display: 'flex', gap: 16 }}>
          <Skeleton width={130} height={13} />
          <Skeleton width={100} height={13} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Skeleton width={80} height={36} style={{ borderRadius: 8 }} />
          <Skeleton width={80} height={36} style={{ borderRadius: 8 }} />
        </div>
      </div>

      {/* Card 3 — Practice */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '16px 18px' }}>
        <div style={{ display: 'flex' }}>
          <Skeleton width={80} height={11} />
          <Skeleton width={60} height={11} style={{ marginLeft: 'auto' }} />
        </div>
        <Skeleton width="55%" height={20} style={{ margin: '10px 0 6px' }} />
        <Skeleton width={140} height={13} />
      </div>
    </div>
  );
}
