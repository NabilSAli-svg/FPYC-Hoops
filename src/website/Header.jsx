import { useState } from 'react';
import Icon from '../shared/Icon.jsx';
import { useGames } from '../shared/store.js';

const NAV_ITEMS = [
  { id: 'programs',  label: 'Programs' },
  { id: 'standings', label: 'Standings' },
  { id: 'schedule',  label: 'Schedule' },
  { id: 'news',      label: 'News' },
  { id: 'board',     label: 'Board & Coaches', href: '/board' },
  { id: 'volunteer', label: 'Volunteer' },
  { id: 'contact',   label: 'Contact' },
];

export default function Header({ onJump }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [games] = useGames();
  const isLive = games.some(g => g.status === 'live');

  const closeMenu = () => setMenuOpen(false);

  return (
    <header style={{
      background: 'rgba(10,31,61,0.94)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      color: '#fff',
      position: 'sticky', top: 0, zIndex: 50,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 84, display: 'flex', alignItems: 'center', gap: 24 }}>
        <a href="#top" onClick={(e) => { e.preventDefault(); onJump('top'); closeMenu(); }} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', textDecoration: 'none', flexShrink: 0 }}>
          <img src="/assets/logo-fpyc-basketball-v3.png" alt="FPYC" style={{ height: 140, objectFit: 'contain', marginTop: -28, marginBottom: -56, position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.35))' }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.04em', textTransform: 'uppercase' }}>FPYC Basketball</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.62)', marginTop: 4 }}>Fairfax Police Youth Club</span>
          </div>
        </a>

        <nav className="desk-hide" style={{ display: 'flex', gap: 4, marginLeft: 24 }}>
          {NAV_ITEMS.map(it => (
            <a key={it.id} href={it.href || `#${it.id}`} onClick={it.href ? undefined : (e) => { e.preventDefault(); onJump(it.id); }} style={{
              color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
              fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14,
              padding: '8px 12px', borderRadius: 6,
            }}>{it.label}</a>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <a href="/scoreboard" className="desk-hide" style={{
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: isLive ? '#fff' : 'rgba(255,255,255,0.75)',
          textDecoration: 'none', padding: '8px 12px', whiteSpace: 'nowrap',
          display: 'inline-flex', alignItems: 'center', gap: 7,
        }}>
          {isLive && <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#DC2626', display: 'inline-block', flexShrink: 0 }} />}
          {isLive ? 'Live now' : 'Scoreboard'}
        </a>

        <a href="/family" className="desk-hide" style={{
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.75)',
          textDecoration: 'none', padding: '8px 12px', whiteSpace: 'nowrap',
        }}>Family portal</a>

        <a href="/admin" className="desk-hide" style={{
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: '#fff',
          textDecoration: 'none', padding: '8px 12px', whiteSpace: 'nowrap',
        }}>Coach login</a>

        <a href="/register" className="mob-hide" style={{
          background: 'var(--varsity-gold)', color: 'var(--court-navy)',
          padding: '10px 16px', borderRadius: 8, textDecoration: 'none',
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>Register <Icon name="arrow-right" size={14} /></a>

        <button
          className="mob-show"
          onClick={() => setMenuOpen(o => !o)}
          style={{
            all: 'unset', cursor: 'pointer', color: '#fff',
            display: 'none', alignItems: 'center', justifyContent: 'center',
            width: 40, height: 40, borderRadius: 8,
            background: menuOpen ? 'rgba(255,255,255,0.12)' : 'transparent',
          }}
          aria-label="Toggle menu"
        >
          <Icon name={menuOpen ? 'x' : 'menu'} size={22} />
        </button>
      </div>

      {menuOpen && (
        <div style={{
          position: 'absolute', top: 84, left: 0, right: 0, zIndex: 49,
          background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column',
        }}>
          {NAV_ITEMS.map(it => (
            <a key={it.id} href={it.href || `#${it.id}`} onClick={it.href ? closeMenu : (e) => { e.preventDefault(); onJump(it.id); closeMenu(); }} style={{
              color: 'var(--court-navy)', textDecoration: 'none',
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15,
              padding: '16px 24px', borderBottom: '1px solid var(--border)',
            }}>{it.label}</a>
          ))}
          <a href="/scoreboard" onClick={closeMenu} style={{
            color: 'var(--court-navy)', textDecoration: 'none',
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15,
            padding: '16px 24px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {isLive && <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#DC2626', display: 'inline-block', flexShrink: 0 }} />}
            {isLive ? 'Live now · Scoreboard' : 'Scoreboard'}
          </a>
          <a href="/family" onClick={closeMenu} style={{
            color: 'var(--court-navy)', textDecoration: 'none',
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15,
            padding: '16px 24px', borderBottom: '1px solid var(--border)',
          }}>Family portal</a>
          <a href="/admin" onClick={closeMenu} style={{
            color: 'var(--court-navy)', textDecoration: 'none',
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15,
            padding: '16px 24px', borderBottom: '1px solid var(--border)',
          }}>Coach login</a>
          <div style={{ padding: '16px 24px' }}>
            <a href="/register" onClick={closeMenu} style={{
              background: 'var(--varsity-gold)', color: 'var(--court-navy)',
              padding: '12px 20px', borderRadius: 8, textDecoration: 'none',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>Register <Icon name="arrow-right" size={15} /></a>
          </div>
        </div>
      )}
    </header>
  );
}
