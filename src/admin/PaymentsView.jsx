import { useState, useMemo } from 'react';
import { Card, Button, Icon, Display } from '../shared/index.js';
import { TEAMS_INFO } from '../shared/store.js';

const STATUSES = [
  { id: 'paid',        label: 'Paid',        color: '#22C55E' },
  { id: 'partial',     label: 'Partial',     color: '#F59E0B' },
  { id: 'unpaid',      label: 'Unpaid',      color: '#EF4444' },
  { id: 'scholarship', label: 'Scholarship', color: '#8B5CF6' },
  { id: 'waived',      label: 'Waived',      color: '#6B7280' },
];

function statusMeta(id) {
  return STATUSES.find(s => s.id === id) || STATUSES[2];
}

function StatusPill({ status, onChange }) {
  const [open, setOpen] = useState(false);
  const meta = statusMeta(status);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '3px 10px', borderRadius: 999, border: `1.5px solid ${meta.color}`,
          background: meta.color + '18', color: meta.color,
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11,
          cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4,
        }}
      >
        {meta.label}
        <Icon name="chevron-down" size={10} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: 4,
          background: '#fff', border: '1px solid var(--border)', borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 50, minWidth: 130, overflow: 'hidden',
        }}>
          {STATUSES.map(s => (
            <button
              key={s.id}
              onClick={() => { onChange(s.id); setOpen(false); }}
              style={{
                width: '100%', padding: '8px 14px', border: 'none',
                background: s.id === status ? s.color + '12' : '#fff',
                color: s.color, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
                textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 999, background: s.color, flexShrink: 0 }} />
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AmountCell({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState('');
  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        min={0}
        value={local}
        onChange={e => setLocal(e.target.value)}
        onBlur={() => { onChange(parseFloat(local) || 0); setEditing(false); }}
        onKeyDown={e => { if (e.key === 'Enter') { onChange(parseFloat(local) || 0); setEditing(false); } if (e.key === 'Escape') setEditing(false); }}
        style={{ width: 80, padding: '4px 8px', border: '1.5px solid var(--varsity-gold)', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, outline: 'none' }}
      />
    );
  }
  return (
    <span
      onClick={() => { setLocal(String(value || 0)); setEditing(true); }}
      style={{ cursor: 'pointer', fontWeight: 700, fontSize: 13, color: value > 0 ? 'var(--court-navy)' : 'var(--fg-muted)', padding: '4px 2px', display: 'inline-block' }}
      title="Click to edit"
    >
      ${(value || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
    </span>
  );
}

function NotesCell({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState('');
  if (editing) {
    return (
      <input
        autoFocus
        type="text"
        value={local}
        onChange={e => setLocal(e.target.value)}
        onBlur={() => { onChange(local.trim()); setEditing(false); }}
        onKeyDown={e => { if (e.key === 'Enter') { onChange(local.trim()); setEditing(false); } if (e.key === 'Escape') setEditing(false); }}
        style={{ width: '100%', minWidth: 140, padding: '4px 8px', border: '1.5px solid var(--varsity-gold)', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 12, outline: 'none' }}
      />
    );
  }
  return (
    <span
      onClick={() => { setLocal(value || ''); setEditing(true); }}
      style={{ cursor: 'pointer', fontSize: 12, color: value ? 'var(--fg)' : 'var(--fg-muted)', fontStyle: value ? 'normal' : 'italic', padding: '4px 2px' }}
      title="Click to edit"
    >
      {value || 'Add note…'}
    </span>
  );
}

export default function PaymentsView({ players, setPlayers }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTeam, setFilterTeam] = useState('all');
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState('name');
  const [sortDir, setSortDir] = useState(1);

  function updatePayment(id, field, val) {
    setPlayers(ps => ps.map(p => p.id === id ? { ...p, [field]: val } : p));
  }

  const teams = useMemo(() => {
    const seen = new Set();
    players.forEach(p => p.team && seen.add(p.team));
    return [...seen].sort();
  }, [players]);

  const filtered = useMemo(() => {
    let list = players.filter(p => p.status !== 'inactive');
    if (filterStatus !== 'all') list = list.filter(p => (p.paymentStatus || 'unpaid') === filterStatus);
    if (filterTeam !== 'all') list = list.filter(p => p.team === filterTeam);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name?.toLowerCase().includes(q) || p.guardian?.toLowerCase().includes(q) || p.team?.toLowerCase().includes(q));
    }
    list = [...list].sort((a, b) => {
      let av, bv;
      if (sortCol === 'name') { av = a.name || ''; bv = b.name || ''; }
      else if (sortCol === 'team') { av = a.team || ''; bv = b.team || ''; }
      else if (sortCol === 'status') { av = a.paymentStatus || 'unpaid'; bv = b.paymentStatus || 'unpaid'; }
      else if (sortCol === 'paid') { av = a.amountPaid || 0; bv = b.amountPaid || 0; }
      else if (sortCol === 'owed') { av = a.amountOwed || 0; bv = b.amountOwed || 0; }
      else { av = ''; bv = ''; }
      if (typeof av === 'string') return sortDir * av.localeCompare(bv);
      return sortDir * (av - bv);
    });
    return list;
  }, [players, filterStatus, filterTeam, search, sortCol, sortDir]);

  function toggleSort(col) {
    if (sortCol === col) setSortDir(d => -d);
    else { setSortCol(col); setSortDir(1); }
  }

  // Summary stats
  const active = players.filter(p => p.status !== 'inactive');
  const totalOwed = active.reduce((s, p) => s + (p.amountOwed || 0), 0);
  const totalPaid = active.reduce((s, p) => s + (p.amountPaid || 0), 0);
  const outstanding = totalOwed - totalPaid;
  const byStatus = STATUSES.map(s => ({ ...s, count: active.filter(p => (p.paymentStatus || 'unpaid') === s.id).length }));

  const SortTh = ({ col, children, style = {} }) => (
    <th
      onClick={() => toggleSort(col)}
      style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap', ...style }}
    >
      {children} {sortCol === col ? (sortDir === 1 ? '↑' : '↓') : ''}
    </th>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Collected</div>
          <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', color: '#22C55E', marginTop: 4 }}>${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Outstanding</div>
          <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', color: outstanding > 0 ? '#EF4444' : '#22C55E', marginTop: 4 }}>${Math.max(0, outstanding).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Billed</div>
          <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--court-navy)', marginTop: 4 }}>${totalOwed.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
        </Card>
        {byStatus.map(s => (
          <Card key={s.id}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', color: s.color, marginTop: 4 }}>{s.count}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search player or guardian…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', minWidth: 220 }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[{ id: 'all', label: 'All', color: 'var(--court-navy)' }, ...STATUSES].map(s => (
            <button key={s.id} onClick={() => setFilterStatus(s.id)} style={{
              padding: '5px 14px', borderRadius: 999, border: `1.5px solid ${filterStatus === s.id ? s.color : 'var(--border)'}`,
              background: filterStatus === s.id ? s.color + '15' : 'transparent',
              color: filterStatus === s.id ? s.color : 'var(--fg-muted)',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, cursor: 'pointer',
            }}>{s.label}</button>
          ))}
        </div>
        <select
          value={filterTeam}
          onChange={e => setFilterTeam(e.target.value)}
          style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', background: '#fff', color: 'var(--fg)' }}
        >
          <option value="all">All teams</option>
          {teams.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <Card padding={0}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr style={{ background: 'var(--bone)' }}>
                <SortTh col="name">Player</SortTh>
                <SortTh col="team">Team</SortTh>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Program</th>
                <SortTh col="status">Status</SortTh>
                <SortTh col="owed" style={{ textAlign: 'right' }}>Amount Owed</SortTh>
                <SortTh col="paid" style={{ textAlign: 'right' }}>Amount Paid</SortTh>
                <th style={{ padding: '8px 14px', textAlign: 'right', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Balance</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>No players match your filters.</td></tr>
              )}
              {filtered.map((p, i) => {
                const owed = p.amountOwed || 0;
                const paid = p.amountPaid || 0;
                const balance = owed - paid;
                const status = p.paymentStatus || 'unpaid';
                const teamColor = TEAMS_INFO[p.team]?.color || 'var(--court-navy)';
                return (
                  <tr key={p.id} style={{ background: i % 2 === 0 ? '#fff' : 'var(--bone)' }}>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.guardian}</div>
                    </td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: teamColor }}>{p.team || '—'}</span>
                    </td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--fg-muted)' }}>
                      {p.program || '—'}
                    </td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
                      <StatusPill status={status} onChange={v => updatePayment(p.id, 'paymentStatus', v)} />
                    </td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>
                      <AmountCell value={owed} onChange={v => updatePayment(p.id, 'amountOwed', v)} />
                    </td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>
                      <AmountCell value={paid} onChange={v => updatePayment(p.id, 'amountPaid', v)} />
                    </td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: balance <= 0 ? '#22C55E' : '#EF4444' }}>
                        {balance <= 0 ? '✓' : `$${balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', maxWidth: 200 }}>
                      <NotesCell value={p.paymentNotes} onChange={v => updatePayment(p.id, 'paymentNotes', v)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--fg-muted)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Showing {filtered.length} of {active.length} players</span>
          <span style={{ fontSize: 11, fontStyle: 'italic' }}>Click any amount or note to edit · Click status pill to change</span>
        </div>
      </Card>
    </div>
  );
}
