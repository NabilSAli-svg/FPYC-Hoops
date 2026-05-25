import { useState } from 'react';
import { Card, Pill, Button, Icon, Jersey } from '../shared/index.js';

export default function RosterView({ team, players, onAdd }) {
  const [filter, setFilter] = useState('all');
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
          <Button kind="gold" icon="user-plus" onClick={onAdd}>Add player</Button>
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
    </div>
  );
}
