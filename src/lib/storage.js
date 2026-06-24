// lib/storage.js
// localStorage wrapper. Tasks, categories, preferences, and today's queue
// (a flat list of ordered task IDs persisted in preferences).

import { DEFAULT_CATEGORIES, DEFAULT_PREFERENCES } from '../data/defaults.js';

const KEYS = {
  tasks:       'preflight.tasks.v1',
  categories:  'preflight.categories.v1',
  preferences: 'preflight.preferences.v1',
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch { return fallback; }
}

function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function nowIso() { return new Date().toISOString(); }

// ---------- tasks ----------

export const tasks = {
  list() { return read(KEYS.tasks, []); },

  active() {
    return tasks.list().filter(t => t.status !== 'completed' && t.status !== 'archived');
  },

  /**
   * Tasks the user has dragged into Today, in playlist order.
   * Stale IDs (completed/archived) are filtered out automatically.
   */
  queued() {
    const ids = preferences.get().todayQueue ?? [];
    const byId = new Map(tasks.list().map(t => [t.id, t]));
    return ids
      .map(id => byId.get(id))
      .filter(t => t && t.status !== 'completed' && t.status !== 'archived');
  },

  /** Active tasks NOT in Today — the Queue section. */
  inQueue() {
    const queuedIds = new Set(preferences.get().todayQueue ?? []);
    return tasks.active().filter(t => !queuedIds.has(t.id));
  },

  completed() { return tasks.list().filter(t => t.status === 'completed'); },
  archived()  { return tasks.list().filter(t => t.status === 'archived');  },
  inProgress(){ return tasks.list().filter(t => t.status === 'in_progress'); },
  byId(id)    { return tasks.list().find(t => t.id === id) ?? null; },

  create(input) {
    const task = {
      id: uid('t'),
      title: input.title ?? '',
      categoryId: input.categoryId ?? null,
      enjoyment: input.enjoyment ?? 3,
      friction: input.friction ?? 3,
      timeBucket: input.timeBucket ?? '15_45',
      dueDate: input.dueDate ?? null,
      flow: input.flow ?? 0,
      isRoutine: input.isRoutine ?? false,
      status: 'not_started',
      createdAt: nowIso(),
      startedAt: null,
      completedAt: null,
      tags: input.tags ?? [],
      sessions: [],
      pointsAwarded: null,
      percentComplete: null,
    };
    const all = tasks.list();
    all.push(task);
    write(KEYS.tasks, all);
    return task;
  },

  update(id, patch) {
    const all = tasks.list();
    const i = all.findIndex(t => t.id === id);
    if (i === -1) return null;
    all[i] = { ...all[i], ...patch };
    write(KEYS.tasks, all);
    return all[i];
  },

  start(id)    { return tasks.update(id, { status: 'in_progress', startedAt: nowIso() }); },
  complete(id) { return tasks.update(id, { status: 'completed',   completedAt: nowIso() }); },
  archive(id)  { return tasks.update(id, { status: 'archived' }); },
  remove(id)   {
    const all = tasks.list().filter(t => t.id !== id);
    write(KEYS.tasks, all);
  },

  elapsedSeconds(task, now = new Date()) {
    if (!task?.startedAt) return null;
    return Math.max(0, Math.floor((now - new Date(task.startedAt)) / 1000));
  },

  // PLACEHOLDER: real % complete will be computed from session durations in
  // the During app. For now: not implemented.
  percentOfBucket() { return null; },
};

// ---------- categories ----------

export const categories = {
  list() { return read(KEYS.categories, DEFAULT_CATEGORIES); },
  active() { return categories.list().filter(c => !c.isArchived); },
  byId(id) { return categories.list().find(c => c.id === id) ?? null; },

  create({ label, color }) {
    const all = categories.list();
    const cat = {
      id: uid('cat'),
      label,
      color: color ?? 'gray',
      isArchived: false,
      isDefault: false,
      sortOrder: all.length,
    };
    all.push(cat);
    write(KEYS.categories, all);
    return cat;
  },

  update(id, patch) {
    const all = categories.list();
    const i = all.findIndex(c => c.id === id);
    if (i === -1) return null;
    all[i] = { ...all[i], ...patch };
    write(KEYS.categories, all);
    return all[i];
  },

  archive(id)   { return categories.update(id, { isArchived: true });  },
  unarchive(id) { return categories.update(id, { isArchived: false }); },
};

// ---------- preferences ----------

export const preferences = {
  get() {
    return { ...DEFAULT_PREFERENCES, ...read(KEYS.preferences, {}) };
  },

  set(patch) {
    const next = { ...preferences.get(), ...patch };
    write(KEYS.preferences, next);
    return next;
  },

  setPlusButtonCorner(corner) {
    return preferences.set({ plusButtonCorner: corner });
  },

  setWeeklyTarget(categoryId, count) {
    const targets = { ...preferences.get().weeklyTargets, [categoryId]: count };
    return preferences.set({ weeklyTargets: targets });
  },

  clearWeeklyTarget(categoryId) {
    const targets = { ...preferences.get().weeklyTargets };
    delete targets[categoryId];
    return preferences.set({ weeklyTargets: targets });
  },

  // remember sort across reloads
  setLastSort(field, direction) {
    return preferences.set({ lastSort: { field, direction } });
  },

  // ---------- today's queue ----------

  enqueue(taskId) {
    const q = preferences.get().todayQueue ?? [];
    if (q.includes(taskId)) return preferences.get();
    return preferences.set({ todayQueue: [...q, taskId] });
  },

  dequeue(taskId) {
    const q = (preferences.get().todayQueue ?? []).filter(id => id !== taskId);
    return preferences.set({ todayQueue: q });
  },

  reorderQueue(taskId, newIndex) {
    const q = [...(preferences.get().todayQueue ?? [])];
    const i = q.indexOf(taskId);
    if (i === -1) {
      q.splice(newIndex, 0, taskId);
    } else {
      q.splice(i, 1);
      q.splice(newIndex, 0, taskId);
    }
    return preferences.set({ todayQueue: q });
  },

  setQueue(taskIds) { return preferences.set({ todayQueue: taskIds }); },
};

// ---------- bootstrap ----------

export function bootstrap() {
  if (read(KEYS.categories, null) === null)  write(KEYS.categories, DEFAULT_CATEGORIES);
  if (read(KEYS.preferences, null) === null) write(KEYS.preferences, DEFAULT_PREFERENCES);
  if (read(KEYS.tasks, null) === null)       write(KEYS.tasks, []);
}

export function _resetAll() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}
