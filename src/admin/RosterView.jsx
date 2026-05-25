import { useState } from 'react';
import { Card, Pill, Button, Icon, Jersey } from '../shared/index.js';

const inputStyle = { padding: '9px 12px', borderRadius: 7, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none', width: '100%', boxSizing: 'border-box', color: 'var(--fg)' };

export default function RosterView({ team, players }) {
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const filtered = filter === 'all' ? players : players.filter(p => p.status === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 4, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
          {[
            { id: 'all',      label: `All · ${players.length}` },
            { id: 'active',   label: 'Active' },
            { id: 'inactive', label: 'Inactive' },
            { id: 'pending',  label: 'Pending' },
          ].map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              padding: '8px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: filter === t.id ? 'var(--court-navy)' : 'transparent',
              color: filter === t.id ? '#fff' : 'var(--fg-soft)',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button kind="ghost" icon="download" size="sm">Export CSV</Button>
          <Button kind="gold" icon="user-plus" onClick={() => setShowAdd(true)}>Add player</Button>
        </div>
      </div>

      <Card padding={0}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px 1.2fr 0.7fr 0.7fr 1fr 0.6fr 0.6fr 0.4fr',
          padding: '12px 18px',
          background: 'var(--bone)',
          borderBottom: '1px solid var(--border)',
          fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', fontWeight: 700,
        }}>
          <div>#</div><div>Player</div><div>Grade</div><div>School</div>
          <div>Guardian</div><div>Waiver</div><div>Status</div><div />
        </div>
        {filtered.map((p, i) => (
          <div key={p.id} style={{
            display: 'grid',
            gridTemplateColumns: '60px 1.2fr 0.7fr 0.7fr 1fr 0.6fr 0.6fr 0.4fr',
            padding: '12px 18px',
            alignItems: 'center',
            borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
            gap: 4,
          }}>
            <Jersey number={p.number} size={32} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{p.position}</div>
            </div>
            <div style={{ fontSize: 14 }}>{p.grade}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-soft)' }}>{p.school}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-soft)' }}>
              <div>{p.guardian}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{p.phone}</div>
            </div>
            <div>
              {p.waiver
                ? <span style={{ color: 'var(--status-win)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700 }}><Icon name="check-circle-2" size={14} />On file</span>
                : <span style={{ color: 'var(--foul-red)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700 }}><Icon name="alert-circle" size={14} />Missing</span>
              }
            </div>
            <div>
              <Pill kind={p.status === 'active' ? 'navy' : p.status === 'pending' ? 'warn' : 'neutral'}>
                {p.status}
              </Pill>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Icon name="more-horizontal" size={18} color="var(--fg-muted)" />
            </div>
          </div>
        ))}
      </Card>

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 560, boxShadow: 'var(--shadow-3)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--court-navy)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Add player</div>
              <button onClick={() => setShowAdd(false)} style={{ all: 'unset', cursor: 'pointer' }}><Icon name="x" size={20} color="var(--fg-muted)" /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'First name', placeholder: 'First name' },
                { label: 'Last name',  placeholder: 'Last name' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input placeholder={f.placeholder} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Jersey #</label>
                <input type="number" placeholder="e.g. 23" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Grade</label>
                <select style={inputStyle}>
                  <option>5th</option><option>6th</option><option>7th</option><option>8th</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Position</label>
                <select style={inputStyle}>
                  <option>Guard</option><option>Forward</option><option>Center</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>School</label>
                <input placeholder="e.g. Daniels Run ES" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Guardian name</label>
                <input placeholder="e.g. A. Reeves" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Guardian phone</label>
                <input placeholder="(703) 555-0000" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
              <Button kind="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button kind="gold" icon="user-plus" onClick={() => setShowAdd(false)}>Add to roster</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
