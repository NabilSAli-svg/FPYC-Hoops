import { useState, useCallback } from 'react';
import { Card, Icon, Display } from '../shared/index.js';
import { useBudget } from '../shared/store.js';

const fmt = n => '$' + Math.round(n).toLocaleString();
const pct = (a, b) => b === 0 ? 0 : Math.min(100, Math.round((a / b) * 100));
const fmtRaw = n => Math.round(n || 0).toString();

function exportCSV(budget, calc) {
  const rows = [];
  const py = budget.priorYear?.label || 'Prior Year';
  const yr = budget.year;

  rows.push([`FPYC Basketball Budget · ${yr}`]);
  rows.push([]);
  rows.push(['REVENUE']);
  rows.push(['Account', 'Line Item', `${py} Actual`, `${yr} Budget`, `${yr} Collected`]);
  rows.push(['1040-08', 'Registrations', fmtRaw(budget.priorYear?.registrations), fmtRaw(calc.regRevenue), fmtRaw(calc.regRevenueActual)]);
  rows.push(['1041-08', 'Late Fees', fmtRaw(budget.priorYear?.lateFees), fmtRaw(calc.lateFeeRevenue), fmtRaw(calc.lateFeeActual)]);
  budget.revenueOther.forEach(r => rows.push([r.account, r.label, fmtRaw(r.priorActual), fmtRaw(r.budgeted), fmtRaw(r.actual)]));
  rows.push(['', 'TOTAL REVENUE', fmtRaw(calc.totalRevPrior), fmtRaw(calc.totalRevBudget), fmtRaw(calc.totalRevActual)]);

  rows.push([]);
  rows.push(['EXPENSES']);
  rows.push(['Account', 'Line Item', 'Type', `${py} Actual`, `${yr} Budget`, `${yr} Actual`, 'Remaining']);
  calc.expenses.forEach(e => {
    const remaining = e.budgetCalc - (e.actual || 0);
    rows.push([e.account, e.label, e.perPlayer != null ? `AUTO $${e.perPlayer}/player` : 'SET', fmtRaw(e.priorActual), fmtRaw(e.budgetCalc), fmtRaw(e.actual), fmtRaw(remaining)]);
  });
  rows.push(['', '', 'TOTAL EXPENSES', fmtRaw(calc.totalExpPrior), fmtRaw(calc.totalExpBudget), fmtRaw(calc.totalExpActual), fmtRaw(calc.totalExpBudget - calc.totalExpActual)]);

  rows.push([]);
  rows.push(['FEE CONFIGURATION']);
  rows.push(['Fee Type', 'Projected #', 'Actual #', 'Fee', 'Projected $', 'Actual $']);
  budget.feeTypes.forEach(ft => {
    const ap = ft.actualPlayers ?? ft.players;
    rows.push([ft.label, ft.players, ap, ft.fee, fmtRaw(ft.players * ft.fee), fmtRaw(ap * ft.fee)]);
  });

  const csv = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `FPYC-Budget-${budget.year}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function exportPDF(budget, calc) {
  const py = budget.priorYear?.label || 'Prior Year';
  const yr = budget.year;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>FPYC Budget ${yr}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 11px; color: #111; margin: 24px; }
  h1 { font-size: 18px; margin-bottom: 4px; }
  h2 { font-size: 13px; margin: 18px 0 6px; border-bottom: 2px solid #0a2240; padding-bottom: 4px; color: #0a2240; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  th { background: #0a2240; color: #fff; padding: 5px 8px; text-align: left; font-size: 10px; }
  td { padding: 4px 8px; border-bottom: 1px solid #e5e7eb; }
  tr:nth-child(even) td { background: #f9fafb; }
  .total td { background: #0a2240 !important; color: #fff; font-weight: bold; }
  .summary { display: flex; gap: 16px; margin-bottom: 16px; }
  .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 14px; flex: 1; }
  .card-label { font-size: 9px; text-transform: uppercase; color: #6b7280; letter-spacing: .05em; }
  .card-value { font-size: 20px; font-weight: bold; margin: 2px 0; }
  .card-sub { font-size: 9px; color: #6b7280; }
  @media print { body { margin: 0; } }
</style></head><body>
<h1>FPYC Basketball Budget · ${yr}</h1>
<p style="color:#6b7280;font-size:10px;margin-bottom:16px">${budget.projectedPlayers} projected players · Exported ${new Date().toLocaleDateString()}</p>

<div class="summary">
  <div class="card"><div class="card-label">Revenue Budget</div><div class="card-value" style="color:#1f8a5b">${fmt(calc.totalRevBudget)}</div><div class="card-sub">${fmt(calc.totalRevActual)} collected</div></div>
  <div class="card"><div class="card-label">Expense Budget</div><div class="card-value" style="color:#c8102e">${fmt(calc.totalExpBudget)}</div><div class="card-sub">${fmt(calc.totalExpActual)} spent</div></div>
  <div class="card"><div class="card-label">Net Income</div><div class="card-value" style="color:${calc.totalRevBudget - calc.totalExpBudget >= 0 ? '#1f8a5b' : '#ef4444'}">${(calc.totalRevBudget - calc.totalExpBudget >= 0 ? '+' : '') + fmt(calc.totalRevBudget - calc.totalExpBudget)}</div><div class="card-sub">Actual: ${(calc.totalRevActual - calc.totalExpActual >= 0 ? '+' : '') + fmt(calc.totalRevActual - calc.totalExpActual)}</div></div>
  <div class="card"><div class="card-label">Spent to Date</div><div class="card-value" style="color:#ea580c">${fmt(calc.totalExpActual)}</div><div class="card-sub">${fmt(calc.totalExpBudget - calc.totalExpActual)} remaining</div></div>
</div>

<h2>Revenue</h2>
<table><thead><tr><th>Account</th><th>Line Item</th><th>${py} Actual</th><th>${yr} Budget</th><th>${yr} Collected</th></tr></thead><tbody>
<tr><td>1040-08</td><td>Registrations</td><td>${fmt(budget.priorYear?.registrations || 0)}</td><td>${fmt(calc.regRevenue)}</td><td>${fmt(calc.regRevenueActual)}</td></tr>
<tr><td>1041-08</td><td>Late Fees</td><td>${fmt(budget.priorYear?.lateFees || 0)}</td><td>${fmt(calc.lateFeeRevenue)}</td><td>${fmt(calc.lateFeeActual)}</td></tr>
${budget.revenueOther.map(r => `<tr><td>${r.account}</td><td>${r.label}</td><td>${fmt(r.priorActual || 0)}</td><td>${fmt(r.budgeted || 0)}</td><td>${fmt(r.actual || 0)}</td></tr>`).join('')}
<tr class="total"><td colspan="2">TOTAL REVENUE</td><td>${fmt(calc.totalRevPrior)}</td><td>${fmt(calc.totalRevBudget)}</td><td>${fmt(calc.totalRevActual)}</td></tr>
</tbody></table>

<h2>Expenses</h2>
<table><thead><tr><th>Account</th><th>Line Item</th><th>${py} Actual</th><th>${yr} Budget</th><th>${yr} Actual</th><th>Remaining</th></tr></thead><tbody>
${calc.expenses.map(e => {
  const rem = e.budgetCalc - (e.actual || 0);
  return `<tr><td>${e.account}</td><td>${e.label}${e.perPlayer != null ? ` <span style="font-size:9px;color:#6b7280">$${e.perPlayer}/player</span>` : ''}</td><td>${fmt(e.priorActual || 0)}</td><td>${fmt(e.budgetCalc)}</td><td>${fmt(e.actual || 0)}</td><td style="color:${rem < 0 ? '#ef4444' : '#111'}">${rem < 0 ? '-' : ''}${fmt(Math.abs(rem))}</td></tr>`;
}).join('')}
<tr class="total"><td colspan="2">TOTAL EXPENSES</td><td>${fmt(calc.totalExpPrior)}</td><td>${fmt(calc.totalExpBudget)}</td><td>${fmt(calc.totalExpActual)}</td><td>${fmt(calc.totalExpBudget - calc.totalExpActual)}</td></tr>
</tbody></table>
</body></html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 500);
}

function calcBudget(budget) {
  const pp = budget.projectedPlayers || 0;
  const regRevenueAuto = budget.feeTypes
    .filter(ft => ft.label !== 'Late Fee')
    .reduce((s, ft) => s + (ft.players || 0) * (ft.fee || 0), 0);
  const regRevenueActual = budget.feeTypes
    .filter(ft => ft.label !== 'Late Fee')
    .reduce((s, ft) => s + (ft.actualPlayers != null ? ft.actualPlayers : ft.players || 0) * (ft.fee || 0), 0);
  const regRevenue = budget.registrationsBudget != null ? budget.registrationsBudget : regRevenueAuto;
  const lateFeeRevenue = budget.feeTypes
    .filter(ft => ft.label === 'Late Fee')
    .reduce((s, ft) => s + (ft.players || 0) * (ft.fee || 0), 0);
  const lateFeeActual = budget.feeTypes
    .filter(ft => ft.label === 'Late Fee')
    .reduce((s, ft) => s + (ft.actualPlayers != null ? ft.actualPlayers : ft.players || 0) * (ft.fee || 0), 0);
  const otherRevBudget = budget.revenueOther.reduce((s, r) => s + (r.budgeted || 0), 0);
  const otherRevActual = budget.revenueOther.reduce((s, r) => s + (r.actual || 0), 0);
  const otherRevPrior  = budget.revenueOther.reduce((s, r) => s + (r.priorActual || 0), 0);
  const totalRevBudget = regRevenue + lateFeeRevenue + otherRevBudget;
  const totalRevActual = regRevenueActual + lateFeeActual + otherRevActual;
  const priorYear = budget.priorYear || {};
  const totalRevPrior = (priorYear.registrations || 0) + (priorYear.lateFees || 0) + otherRevPrior;
  const expenses = budget.expenses.map(e => ({
    ...e,
    budgetCalc: e.perPlayer != null ? e.perPlayer * pp : (e.budget || 0),
  }));
  const totalExpBudget = expenses.reduce((s, e) => s + e.budgetCalc, 0);
  const totalExpActual = expenses.reduce((s, e) => s + (e.actual || 0), 0);
  const totalExpPrior  = expenses.reduce((s, e) => s + (e.priorActual || 0), 0);
  return { regRevenue, regRevenueActual, lateFeeRevenue, lateFeeActual, totalRevBudget, totalRevActual, totalRevPrior, expenses, totalExpBudget, totalExpActual, totalExpPrior };
}

function EditCell({ value, onSave, locked, directorStyle, treasurerStyle, priorStyle, plain }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const display = plain ? Math.round(value || 0).toLocaleString() : fmt(value || 0);
  if (locked || priorStyle) {
    return (
      <span style={{ fontSize: 13, color: priorStyle ? '#6B7280' : 'var(--fg-muted)', background: priorStyle ? '#F9FAFB' : '#F3F4F6', padding: '4px 8px', borderRadius: 5, display: 'inline-block', fontStyle: priorStyle ? 'italic' : 'normal' }}>
        {display}
      </span>
    );
  }
  const bg = directorStyle ? '#EFF6FF' : treasurerStyle ? '#EEF2FF' : '#fff';
  const border = `1px solid ${directorStyle ? '#93C5FD' : treasurerStyle ? '#A5B4FC' : 'var(--border)'}`;
  if (editing) {
    return (
      <input type="number" value={draft} autoFocus onChange={e => setDraft(e.target.value)}
        onBlur={() => { setEditing(false); onSave(parseFloat(draft) || 0); }}
        onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') setEditing(false); }}
        style={{ width: 90, padding: '4px 8px', borderRadius: 5, border, background: bg, fontSize: 13, fontFamily: 'var(--font-body)' }} />
    );
  }
  return (
    <span onClick={() => { setEditing(true); setDraft(String(value || 0)); }} title="Click to edit"
      style={{ fontSize: 13, background: bg, border, padding: '4px 8px', borderRadius: 5, cursor: 'text', display: 'inline-block', minWidth: 70, color: 'var(--fg)' }}>
      {display}
    </span>
  );
}

function ProgressBar({ value, max, danger }) {
  const p = pct(value, max);
  const color = danger ? '#EF4444' : p > 80 ? '#F59E0B' : '#22C55E';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: '#E5E7EB', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${p}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 300ms' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color, minWidth: 34, textAlign: 'right' }}>{p}%</span>
    </div>
  );
}

function SummaryCard({ label, value, accent, sub }) {
  return (
    <Card style={{ flex: 1, minWidth: 160 }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontFamily: 'var(--font-display)', color: accent || 'var(--court-navy)', fontWeight: 700 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 4 }}>{sub}</div>}
    </Card>
  );
}

export default function BudgetView() {
  const [budget, saveBudget] = useBudget();
  const [tab, setTab] = useState('expenses');
  const [saved, setSaved] = useState(false);
  const calc = calcBudget(budget);
  const priorLabel = budget.priorYear?.label || 'Prior Year';

  const save = useCallback(async (nb) => {
    await saveBudget(nb);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [saveBudget]);

  const updateFeeType = (id, field, val) =>
    save({ ...budget, feeTypes: budget.feeTypes.map(ft => ft.id === id ? { ...ft, [field]: val } : ft) });
  const updateProjectedPlayers = val => save({ ...budget, projectedPlayers: val });
  const updateRegistrationsBudget = val => save({ ...budget, registrationsBudget: val });
  const updateRevenueOther = (id, field, val) =>
    save({ ...budget, revenueOther: budget.revenueOther.map(r => r.id === id ? { ...r, [field]: val } : r) });
  const updateExpense = (id, field, val) =>
    save({ ...budget, expenses: budget.expenses.map(e => e.id === id ? { ...e, [field]: val } : e) });

  const netBudget = calc.totalRevBudget - calc.totalExpBudget;
  const netActual = calc.totalRevActual - calc.totalExpActual;

  const tabStyle = id => ({
    padding: '10px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
    borderBottom: `2px solid ${tab === id ? 'var(--varsity-gold)' : 'transparent'}`,
    color: tab === id ? 'var(--court-navy)' : 'var(--fg-muted)',
    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, marginBottom: -1,
  });
  const th = { padding: '10px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)', background: 'var(--bone)', borderBottom: '1px solid var(--border)' };
  const thPrior = { ...th, background: '#F9FAFB', color: '#9CA3AF', fontStyle: 'italic' };
  const td = { padding: '10px 12px', borderBottom: '1px solid var(--border)', fontSize: 13, verticalAlign: 'middle' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <Display size={22}>Budget · {budget.year}</Display>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2 }}>{budget.projectedPlayers} projected players</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {saved && <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="check" size={14} /> Saved</span>}
          <button onClick={() => exportCSV(budget, calc)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1.5px solid var(--border)', borderRadius: 8, background: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, cursor: 'pointer', color: 'var(--fg)' }}>
            <Icon name="download" size={14} /> CSV
          </button>
          <button onClick={() => exportPDF(budget, calc)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1.5px solid var(--border)', borderRadius: 8, background: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, cursor: 'pointer', color: 'var(--fg)' }}>
            <Icon name="printer" size={14} /> PDF
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <SummaryCard label="Revenue Budget" value={fmt(calc.totalRevBudget)} accent="#1F8A5B" sub={`${fmt(calc.totalRevActual)} collected`} />
        <SummaryCard label="Expense Budget" value={fmt(calc.totalExpBudget)} accent="#C8102E" sub={`${fmt(calc.totalExpActual)} spent`} />
        <SummaryCard label="Net Income (Budget)" value={(netBudget >= 0 ? '+' : '') + fmt(netBudget)} accent={netBudget >= 0 ? '#1F8A5B' : '#EF4444'} sub={`Actual net: ${(netActual >= 0 ? '+' : '') + fmt(netActual)}`} />
        <SummaryCard label="Spent to Date" value={fmt(calc.totalExpActual)} accent="var(--basketball-orange)" sub={`${fmt(calc.totalExpBudget - calc.totalExpActual)} remaining`} />
      </div>

      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', marginBottom: 8 }}>OVERALL BUDGET UTILIZATION</div>
        <ProgressBar value={calc.totalExpActual} max={calc.totalExpBudget} />
      </Card>

      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <button style={tabStyle('revenue')} onClick={() => setTab('revenue')}>Revenue</button>
        <button style={tabStyle('expenses')} onClick={() => setTab('expenses')}>Expenses</button>
      </div>

      {tab === 'revenue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card padding={0}>
            <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--court-navy)' }}>Fee Configuration</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>
                Projected players:&nbsp;<EditCell value={budget.projectedPlayers} onSave={updateProjectedPlayers} treasurerStyle plain />
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th style={th}>Fee Type</th>
                <th style={{ ...th, background: '#EFF6FF' }}>🔵 Projected #</th>
                <th style={th}>Actual #</th>
                <th style={{ ...th, background: '#EEF2FF' }}>💜 Fee</th>
                <th style={{ ...th, background: '#F3F4F6' }}>Projected $</th>
                <th style={th}>Actual $</th>
              </tr></thead>
              <tbody>
                {budget.feeTypes.map((ft, i) => {
                  const actualPlayers = ft.actualPlayers ?? ft.players;
                  const diff = actualPlayers - ft.players;
                  return (
                    <tr key={ft.id} style={{ background: i % 2 === 0 ? '#fff' : 'var(--bone)' }}>
                      <td style={td}><span style={{ fontWeight: 600 }}>{ft.label}</span></td>
                      <td style={{ ...td, background: '#EFF6FF' }}><EditCell value={ft.players} onSave={v => updateFeeType(ft.id, 'players', v)} directorStyle plain /></td>
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <EditCell value={actualPlayers} onSave={v => updateFeeType(ft.id, 'actualPlayers', v)} plain />
                          {diff !== 0 && (
                            <span style={{ fontSize: 11, fontWeight: 700, color: diff > 0 ? '#22C55E' : '#EF4444' }}>
                              {diff > 0 ? '+' : ''}{diff}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ ...td, background: '#EEF2FF' }}><EditCell value={ft.fee} onSave={v => updateFeeType(ft.id, 'fee', v)} treasurerStyle /></td>
                      <td style={{ ...td, background: '#F3F4F6' }}><EditCell value={ft.players * ft.fee} onSave={() => {}} locked /></td>
                      <td style={td}><EditCell value={actualPlayers * ft.fee} onSave={() => {}} locked /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          <Card padding={0}>
            <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--court-navy)' }}>Revenue Summary</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th style={th}>Account</th>
                <th style={th}>Line Item</th>
                <th style={thPrior}>{priorLabel} Actual</th>
                <th style={{ ...th, background: '#EEF2FF' }}>💜 {budget.year} Budget</th>
                <th style={th}>{budget.year} Collected</th>
              </tr></thead>
              <tbody>
                <tr>
                  <td style={{ ...td, color: 'var(--fg-muted)', fontSize: 11 }}>1040-08</td>
                  <td style={td}>
                    <div style={{ fontWeight: 600 }}>Registrations</div>
                    {budget.registrationsBudget != null && <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Override (auto: {fmt(budget.feeTypes.filter(ft => ft.label !== 'Late Fee').reduce((s, ft) => s + (ft.players||0)*(ft.fee||0), 0))})</div>}
                  </td>
                  <td style={{ ...td, background: '#F9FAFB' }}><EditCell value={budget.priorYear?.registrations || 0} onSave={() => {}} priorStyle /></td>
                  <td style={{ ...td, background: '#EEF2FF' }}><EditCell value={calc.regRevenue} onSave={updateRegistrationsBudget} treasurerStyle /></td>
                  <td style={td}><EditCell value={calc.regRevenueActual} onSave={() => {}} locked /></td>
                </tr>
                <tr style={{ background: 'var(--bone)' }}>
                  <td style={{ ...td, color: 'var(--fg-muted)', fontSize: 11 }}>1041-08</td>
                  <td style={td}>Late Fees</td>
                  <td style={{ ...td, background: '#F9FAFB' }}><EditCell value={budget.priorYear?.lateFees || 0} onSave={() => {}} priorStyle /></td>
                  <td style={{ ...td, background: '#F3F4F6' }}><EditCell value={calc.lateFeeRevenue} onSave={() => {}} locked /></td>
                  <td style={td}><EditCell value={calc.lateFeeActual} onSave={() => {}} locked /></td>
                </tr>
                {budget.revenueOther.map((r, i) => (
                  <tr key={r.id} style={{ background: i % 2 === 0 ? '#fff' : 'var(--bone)' }}>
                    <td style={{ ...td, color: 'var(--fg-muted)', fontSize: 11 }}>{r.account}</td>
                    <td style={td}>{r.label}</td>
                    <td style={{ ...td, background: '#F9FAFB' }}><EditCell value={r.priorActual || 0} onSave={() => {}} priorStyle /></td>
                    <td style={td}><EditCell value={r.budgeted} onSave={v => updateRevenueOther(r.id, 'budgeted', v)} treasurerStyle /></td>
                    <td style={td}><EditCell value={r.actual} onSave={v => updateRevenueOther(r.id, 'actual', v)} /></td>
                  </tr>
                ))}
                <tr style={{ background: 'var(--court-navy)' }}>
                  <td style={{ ...td, border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 11 }} colSpan={2}><strong style={{ color: '#fff' }}>TOTAL REVENUE</strong></td>
                  <td style={{ ...td, border: 'none', fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.65)', fontStyle: 'italic' }}>{fmt(calc.totalRevPrior)}</td>
                  <td style={{ ...td, border: 'none', fontWeight: 700, fontSize: 14, color: '#fff' }}>{fmt(calc.totalRevBudget)}</td>
                  <td style={{ ...td, border: 'none', fontWeight: 700, fontSize: 14, color: '#fff' }}>{fmt(calc.totalRevActual)}</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {tab === 'expenses' && (
        <Card padding={0}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              <th style={th}>Account</th>
              <th style={th}>Line Item</th>
              <th style={th}>Type</th>
              <th style={thPrior}>{priorLabel} Actual</th>
              <th style={{ ...th, background: '#EEF2FF' }}>💜 {budget.year} Budget</th>
              <th style={th}>{budget.year} Actual</th>
              <th style={th}>Remaining</th>
              <th style={{ ...th, minWidth: 120 }}>% Used</th>
            </tr></thead>
            <tbody>
              {calc.expenses.map((e, i) => {
                const remaining = e.budgetCalc - (e.actual || 0);
                const isAuto = e.perPlayer != null;
                return (
                  <tr key={e.id} style={{ background: i % 2 === 0 ? '#fff' : 'var(--bone)' }}>
                    <td style={{ ...td, color: 'var(--fg-muted)', fontSize: 11 }}>{e.account}</td>
                    <td style={td}>
                      <div style={{ fontWeight: 600 }}>{e.label}</div>
                      {e.notes && <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{e.notes}</div>}
                    </td>
                    <td style={td}>
                      {isAuto
                        ? <><span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: '#F3F4F6', color: 'var(--fg-muted)', border: '1px solid var(--border)' }}>AUTO</span><div style={{ fontSize: 10, color: 'var(--fg-muted)', marginTop: 2 }}>${e.perPlayer}/player</div></>
                        : <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: '#EEF2FF', color: '#6366F1', border: '1px solid #A5B4FC' }}>SET</span>
                      }
                    </td>
                    <td style={{ ...td, background: '#F9FAFB' }}><EditCell value={e.priorActual || 0} onSave={() => {}} priorStyle /></td>
                    <td style={{ ...td, background: isAuto ? '#F3F4F6' : '#EEF2FF' }}>
                      {isAuto
                        ? <EditCell value={e.budgetCalc} onSave={() => {}} locked />
                        : <EditCell value={e.budget || 0} onSave={v => updateExpense(e.id, 'budget', v)} treasurerStyle />
                      }
                    </td>
                    <td style={td}><EditCell value={e.actual || 0} onSave={v => updateExpense(e.id, 'actual', v)} /></td>
                    <td style={{ ...td, fontWeight: 600, color: remaining < 0 ? '#EF4444' : remaining < e.budgetCalc * 0.1 ? '#F59E0B' : 'var(--fg)' }}>
                      {remaining < 0 ? '-' : ''}{fmt(Math.abs(remaining))}
                    </td>
                    <td style={td}><ProgressBar value={e.actual || 0} max={e.budgetCalc} danger={remaining < 0} /></td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--court-navy)' }}>
                <td style={{ ...td, border: 'none', color: 'rgba(255,255,255,0.6)' }} colSpan={3}><strong style={{ color: '#fff' }}>TOTAL EXPENSES</strong></td>
                <td style={{ ...td, border: 'none', fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.65)', fontStyle: 'italic' }}>{fmt(calc.totalExpPrior)}</td>
                <td style={{ ...td, border: 'none', fontWeight: 700, fontSize: 14, color: '#fff' }}>{fmt(calc.totalExpBudget)}</td>
                <td style={{ ...td, border: 'none', fontWeight: 700, fontSize: 14, color: '#fff' }}>{fmt(calc.totalExpActual)}</td>
                <td style={{ ...td, border: 'none', fontWeight: 700, fontSize: 14, color: calc.totalExpBudget - calc.totalExpActual < 0 ? '#FCA5A5' : '#86EFAC' }}>{fmt(calc.totalExpBudget - calc.totalExpActual)}</td>
                <td style={{ ...td, border: 'none' }}><ProgressBar value={calc.totalExpActual} max={calc.totalExpBudget} /></td>
              </tr>
            </tfoot>
          </table>
        </Card>
      )}

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 12, color: 'var(--fg-muted)', padding: '4px 0' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 3, display: 'inline-block' }} />Prior year actual (locked)</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, background: '#EFF6FF', border: '1px solid #93C5FD', borderRadius: 3, display: 'inline-block' }} />Director-editable</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, background: '#EEF2FF', border: '1px solid #A5B4FC', borderRadius: 3, display: 'inline-block' }} />Treasurer-editable</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, background: '#fff', border: '1px solid var(--border)', borderRadius: 3, display: 'inline-block' }} />Editable (actual spend)</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, background: '#F3F4F6', border: '1px solid var(--border)', borderRadius: 3, display: 'inline-block' }} />Auto-calculated (locked)</span>
      </div>
    </div>
  );
}
