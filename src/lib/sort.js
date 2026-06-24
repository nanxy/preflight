// lib/sort.js
// Sort by any scoring input plus a couple of derived fields. When the field
// is 'category', the UI renders Queue as buckets rather than a flat list.

import { priorityScore } from './priority.js';
import { tasks as tasksStore } from './storage.js';

const TIME_BUCKET_ORDER = { lt15: 0, '15_45': 1, '45_2h': 2, '2hplus': 3 };

export const SORT_FIELDS = [
  { id: 'priority',   label: 'priority',   direction: 'desc' },
  { id: 'category',   label: 'category',   direction: 'asc',  groups: true },
  { id: 'enjoyment',  label: 'enjoyment',  direction: 'desc' },
  { id: 'friction',   label: 'friction',   direction: 'asc'  },
  { id: 'time',       label: 'time',       direction: 'asc'  },
  { id: 'dueDate',    label: 'due date',   direction: 'asc'  },
  { id: 'flow',       label: 'flow',       direction: 'desc' },
  { id: 'routine',    label: 'routine',    direction: 'desc' },
];

function get(task, field, now) {
  switch (field) {
    case 'priority':  return priorityScore(task, now);
    case 'enjoyment': return task.enjoyment ?? 3;
    case 'friction':  return task.friction ?? 3;
    case 'time':      return TIME_BUCKET_ORDER[task.timeBucket] ?? 99;
    case 'dueDate':   return task.dueDate ? new Date(task.dueDate).getTime() : Infinity;
    case 'flow':      return task.flow ?? 0;
    case 'category':  return task.categoryId ?? '';
    case 'routine':   return task.isRoutine ? 1 : 0;
    case 'elapsed':   return tasksStore.elapsedSeconds(task, now) ?? -1;
    default:          return 0;
  }
}

export function sortTasks(list, field = 'priority', direction = 'desc', now = new Date()) {
  const decorated = list.map((task, i) => ({ task, i, key: get(task, field, now) }));
  decorated.sort((a, b) => {
    if (a.key < b.key) return direction === 'asc' ? -1 : 1;
    if (a.key > b.key) return direction === 'asc' ? 1 : -1;
    return a.i - b.i;
  });
  return decorated.map(d => d.task);
}

/**
 * Group sorted tasks by categoryId. Returns [{ categoryId, tasks: [] }] in the
 * order the categories first appear in `sortedList`. Within each group, tasks
 * keep their existing sort order — useful for sub-sorting (e.g. group by
 * category, sort within by priority).
 */
export function groupByCategory(sortedList, subSortField = 'priority', subSortDir = 'desc', now = new Date()) {
  const groups = new Map();
  for (const task of sortedList) {
    const id = task.categoryId ?? '__none__';
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(task);
  }
  const result = [];
  for (const [categoryId, items] of groups) {
    result.push({
      categoryId: categoryId === '__none__' ? null : categoryId,
      tasks: sortTasks(items, subSortField, subSortDir, now),
    });
  }
  return result;
}
