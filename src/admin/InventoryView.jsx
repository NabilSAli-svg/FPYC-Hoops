import { useState, useCallback } from 'react';
import { Card, Button, Icon, Display } from '../shared/index.js';
import { useInventory } from '../shared/store.js';

const CATEGORIES = [
  {
    id: 'jerseys',
    label: 'Jerseys',
    icon: 'shirt',
    color: '#1D4ED8',
    sizes: ['Youth S', 'Youth M', 'Youth L', 'Youth XL', 'Adult S', 'Adult M', 'Adult L', 'Adult XL', 'Adult XXL'],
    unit: 'jersey',
  },
  {
    id: 'pullovers',
    label: 'Coach Pullovers',
    icon: 'shirt',
    color: '#7C3AED',
    sizes: ['Adult S', 'Adult M', 'Adult L'],
    unit: 'pullover',
  },
  {
    id: 'basketballs',
    label: 'Basketballs',
    icon: 'circle',
    color: '#EA580C',
    sizes: ['Size 5', 'Size 6', 'Size 7'],
    unit: 'ball',
  },
  {
    id: 'clocks',
    label: 'Game Clocks',
    icon: 'timer',
    color: '#0F766E',
    sizes: null,
    unit: 'clock',
  },
  {
    id: 'training',
    label: 'Training Equipment',
    icon: 'dumbbell',
    color: '#B45309',
    sizes: null,
    unit: 'item',
    items: true,
  },
];

function SpinnerCell({ value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        style={{ width: 26, height: 26, border: '1px solid var(--border)', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--fg-muted)', flexShrink: 0 }}
      >−</button>
      <input
        type="number"
        min={0}
        value={value}
        onChange={e => onChange(Math.max(0, parseInt(e.target.value) || 0))}
        style={{ width: 52, textAlign: 'center', padding: '4px 6px', border: '1px solid var(--border)', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700 }}
      />
      <button
        onClick={() => onChange(value + 1)}
        style={{ width: 26, height: 26, border: '1px solid var(--border)', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--fg-muted)', flexShrink: 0 }}
      >+</button>
    </div>
  );
}

function StatusBadge({ total, checkedOut }) {
  const available = total - checkedOut;
  const color = available <= 0 ? '#EF4444' : available < total * 0.2 ? '#F59E0B' : '#22C55E';
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: color + '18', color, border: `1px solid ${color}55` }}>
      {available <= 0 ? 'Out of stock' : `${available} available`}
    </span>
  );
}

function SizedCategory({ cat, data, onChange }) {
  const totalOwned = cat.sizes.reduce((s, sz) => s + (data[sz]?.owned || 0), 0);
  const totalOut = cat.sizes.reduce((s, sz) => s + (data[sz]?.checkedOut || 0), 0);

  return (
    <Card padding={0}>
      <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: cat.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={cat.icon} size={16} color={cat.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--court-navy)' }}>{cat.label}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 1 }}>{totalOwned} total · {totalOut} checked out · {totalOwned - totalOut} available</div>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--bone)' }}>
            <th style={{ padding: '8px 18px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Size</th>
            <th style={{ padding: '8px 18px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Owned</th>
            <th style={{ padding: '8px 18px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Checked Out</th>
            <th style={{ padding: '8px 18px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {cat.sizes.map((sz, i) => {
            const row = data[sz] || { owned: 0, checkedOut: 0 };
            return (
              <tr key={sz} style={{ background: i % 2 === 0 ? '#fff' : 'var(--bone)' }}>
                <td style={{ padding: '10px 18px', fontSize: 13, fontWeight: 600, borderBottom: '1px solid var(--border)' }}>{sz}</td>
                <td style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)' }}>
                  <SpinnerCell value={row.owned} onChange={v => onChange(sz, 'owned', v)} />
                </td>
                <td style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)' }}>
                  <SpinnerCell value={row.checkedOut} onChange={v => onChange(sz, 'checkedOut', Math.min(v, row.owned))} />
                </td>
                <td style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)' }}>
                  <StatusBadge total={row.owned} checkedOut={row.checkedOut} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

function SimpleCategory({ cat, data, onChange }) {
  const owned = data.owned || 0;
  const checkedOut = data.checkedOut || 0;
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: cat.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={cat.icon} size={16} color={cat.color} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--court-navy)' }}>{cat.label}</div>
          <StatusBadge total={owned} checkedOut={checkedOut} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Owned</div>
          <SpinnerCell value={owned} onChange={v => onChange('owned', v)} />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Checked Out</div>
          <SpinnerCell value={checkedOut} onChange={v => onChange('checkedOut', Math.min(v, owned))} />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Available</div>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', color: owned - checkedOut <= 0 ? '#EF4444' : 'var(--court-navy)', paddingTop: 2 }}>{owned - checkedOut}</div>
        </div>
      </div>
    </Card>
  );
}

function TrainingCategory({ cat, data, onChange }) {
  const [newItem, setNewItem] = useState('');

  const items = data.items || [];

  function addItem() {
    const label = newItem.trim();
    if (!label) return;
    const id = 'ti_' + Date.now();
    onChange('items', [...items, { id, label, owned: 0, checkedOut: 0 }]);
    setNewItem('');
  }

  function updateItem(id, field, val) {
    onChange('items', items.map(it => it.id === id ? { ...it, [field]: field === 'checkedOut' ? Math.min(val, it.owned) : val } : it));
  }

  function removeItem(id) {
    onChange('items', items.filter(it => it.id !== id));
  }

  return (
    <Card padding={0}>
      <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: cat.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={cat.icon} size={16} color={cat.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--court-navy)' }}>{cat.label}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 1 }}>Add items as your inventory grows</div>
        </div>
      </div>
      {items.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bone)' }}>
              <th style={{ padding: '8px 18px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Item</th>
              <th style={{ padding: '8px 18px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Owned</th>
              <th style={{ padding: '8px 18px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Checked Out</th>
              <th style={{ padding: '8px 18px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Status</th>
              <th style={{ padding: '8px 18px', borderBottom: '1px solid var(--border)' }} />
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={it.id} style={{ background: i % 2 === 0 ? '#fff' : 'var(--bone)' }}>
                <td style={{ padding: '10px 18px', fontSize: 13, fontWeight: 600, borderBottom: '1px solid var(--border)' }}>{it.label}</td>
                <td style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)' }}>
                  <SpinnerCell value={it.owned} onChange={v => updateItem(it.id, 'owned', v)} />
                </td>
                <td style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)' }}>
                  <SpinnerCell value={it.checkedOut} onChange={v => updateItem(it.id, 'checkedOut', v)} />
                </td>
                <td style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)' }}>
                  <StatusBadge total={it.owned} checkedOut={it.checkedOut} />
                </td>
                <td style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>
                  <button onClick={() => removeItem(it.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--fg-muted)', padding: 4 }}>
                    <Icon name="trash-2" size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ padding: '12px 18px', display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addItem()}
          placeholder="Add item (e.g. Agility ladder, Cones…)"
          style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none' }}
        />
        <Button kind="primary" icon="plus" onClick={addItem}>Add</Button>
      </div>
    </Card>
  );
}

export default function InventoryView() {
  const [inventory, saveInventory] = useInventory();
  const [saved, setSaved] = useState(false);

  const save = useCallback(async (newInv) => {
    await saveInventory(newInv);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [saveInventory]);

  function updateSized(catId, size, field, val) {
    const catData = inventory[catId] || {};
    const sizeData = catData[size] || { owned: 0, checkedOut: 0 };
    save({ ...inventory, [catId]: { ...catData, [size]: { ...sizeData, [field]: val } } });
  }

  function updateSimple(catId, field, val) {
    const catData = inventory[catId] || { owned: 0, checkedOut: 0 };
    save({ ...inventory, [catId]: { ...catData, [field]: val } });
  }

  function updateTraining(field, val) {
    save({ ...inventory, training: { ...(inventory.training || {}), [field]: val } });
  }

  const totalItems = CATEGORIES.reduce((sum, cat) => {
    if (cat.sizes) return sum + cat.sizes.reduce((s, sz) => s + ((inventory[cat.id]?.[sz]?.owned) || 0), 0);
    if (cat.items) return sum + ((inventory.training?.items || []).reduce((s, it) => s + (it.owned || 0), 0));
    return sum + ((inventory[cat.id]?.owned) || 0);
  }, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <Display size={22}>Inventory</Display>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2 }}>{totalItems} total items tracked</div>
        </div>
        {saved && (
          <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon name="check" size={14} /> Saved
          </span>
        )}
      </div>

      {CATEGORIES.map(cat => {
        if (cat.sizes) {
          return (
            <SizedCategory
              key={cat.id}
              cat={cat}
              data={inventory[cat.id] || {}}
              onChange={(sz, field, val) => updateSized(cat.id, sz, field, val)}
            />
          );
        }
        if (cat.items) {
          return (
            <TrainingCategory
              key={cat.id}
              cat={cat}
              data={inventory.training || {}}
              onChange={updateTraining}
            />
          );
        }
        return (
          <SimpleCategory
            key={cat.id}
            cat={cat}
            data={inventory[cat.id] || { owned: 0, checkedOut: 0 }}
            onChange={(field, val) => updateSimple(cat.id, field, val)}
          />
        );
      })}
    </div>
  );
}
