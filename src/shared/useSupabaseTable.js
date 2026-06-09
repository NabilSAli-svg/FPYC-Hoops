import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabase.js';

/**
 * Drop-in replacement for useLocalStorage for array-of-records tables.
 * Returns [rows, setRows] — same interface as useLocalStorage.
 * setRows accepts a value or an updater function (prev => next).
 * Writes are optimistic locally; diffed and synced to Supabase in the background.
 */
export function useSupabaseTable(tableName, initial = []) {
  const [data, setDataLocal] = useState(initial);
  // Keep a ref so the async setter always has fresh data without re-creating the callback.
  const dataRef = useRef(data);
  useEffect(() => { dataRef.current = data; }, [data]);

  useEffect(() => {
    // Initial fetch
    supabase
      .from(tableName)
      .select('*')
      .then(({ data: rows, error }) => {
        if (error) { console.error(`[supabase] fetch ${tableName}:`, error.message); return; }
        if (rows) setDataLocal(rows);
      });

    // Realtime subscription — channel name must be unique per hook instance,
    // otherwise a second component subscribing to the same table throws
    const channel = supabase
      .channel(`rt-${tableName}-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        ({ eventType, new: newRow, old: oldRow }) => {
          setDataLocal(prev => {
            if (eventType === 'INSERT') return [...prev, newRow];
            if (eventType === 'UPDATE') return prev.map(r => r.id === newRow.id ? newRow : r);
            if (eventType === 'DELETE') return prev.filter(r => r.id !== oldRow.id);
            return prev;
          });
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [tableName]);

  const setData = useCallback(async (updaterOrValue) => {
    const current = dataRef.current;
    const next = typeof updaterOrValue === 'function' ? updaterOrValue(current) : updaterOrValue;

    // Optimistic local update
    setDataLocal(next);

    // Diff: find inserts/updates/deletes
    const prevMap = new Map(current.map(r => [r.id, r]));
    const nextMap = new Map(next.map(r => [r.id, r]));

    const toDelete = current.filter(r => !nextMap.has(r.id)).map(r => r.id);
    const toUpsert = next.filter(r => {
      const prev = prevMap.get(r.id);
      return !prev || JSON.stringify(prev) !== JSON.stringify(r);
    });

    if (toDelete.length > 0) {
      const { error } = await supabase.from(tableName).delete().in('id', toDelete);
      if (error) console.error(`[supabase] delete ${tableName}:`, error.message);
    }
    if (toUpsert.length > 0) {
      const { error } = await supabase.from(tableName).upsert(toUpsert);
      if (error) console.error(`[supabase] upsert ${tableName}:`, error.message);
    }
  }, [tableName]);

  return [data, setData];
}

/**
 * For official_assignments which are stored as rows keyed by game_id
 * but consumed as a plain object { [gameId]: { refs, status } }.
 */
export function useSupabaseAssignments() {
  const [rows, setRowsLocal] = useState([]);
  const rowsRef = useRef(rows);
  useEffect(() => { rowsRef.current = rows; }, [rows]);

  useEffect(() => {
    supabase
      .from('official_assignments')
      .select('*')
      .then(({ data, error }) => {
        if (error) { console.error('[supabase] fetch official_assignments:', error.message); return; }
        if (data) setRowsLocal(data);
      });

    const channel = supabase
      .channel(`rt-official_assignments-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'official_assignments' },
        ({ eventType, new: newRow, old: oldRow }) => {
          setRowsLocal(prev => {
            if (eventType === 'INSERT') return [...prev, newRow];
            if (eventType === 'UPDATE') return prev.map(r => r.game_id === newRow.game_id ? newRow : r);
            if (eventType === 'DELETE') return prev.filter(r => r.game_id !== oldRow.game_id);
            return prev;
          });
        })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // Expose as object map, matching existing useOfficialAssignments() shape
  const assignmentMap = Object.fromEntries(
    rows.map(r => [r.game_id, { refs: r.refs, status: r.status }])
  );

  const setAssignmentMap = useCallback(async (updaterOrValue) => {
    const current = Object.fromEntries(
      rowsRef.current.map(r => [r.game_id, { refs: r.refs, status: r.status }])
    );
    const next = typeof updaterOrValue === 'function' ? updaterOrValue(current) : updaterOrValue;

    const toUpsert = Object.entries(next).map(([game_id, val]) => ({
      game_id, refs: val.refs, status: val.status,
    }));

    const prevIds = new Set(rowsRef.current.map(r => r.game_id));
    const nextIds = new Set(Object.keys(next));
    const toDelete = [...prevIds].filter(id => !nextIds.has(id));

    if (toDelete.length > 0) {
      await supabase.from('official_assignments').delete().in('game_id', toDelete);
    }
    if (toUpsert.length > 0) {
      const { error } = await supabase.from('official_assignments').upsert(toUpsert);
      if (error) console.error('[supabase] upsert official_assignments:', error.message);
    }

    // Optimistic local
    setRowsLocal(toUpsert);
  }, []);

  return [assignmentMap, setAssignmentMap];
}
