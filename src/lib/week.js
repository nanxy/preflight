// lib/week.js
// Week-bound helpers for the weekly quota feature (Friday's work).

export function startOfWeek(now = new Date()) {
  const d = new Date(now);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfWeek(now = new Date()) {
  const start = startOfWeek(now);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function completedThisWeek(tasks, now = new Date()) {
  const start = startOfWeek(now);
  const end   = endOfWeek(now);
  const counts = {};
  for (const t of tasks) {
    if (t.status !== 'completed' || !t.completedAt) continue;
    const c = new Date(t.completedAt);
    if (c >= start && c <= end) {
      counts[t.categoryId] = (counts[t.categoryId] ?? 0) + 1;
    }
  }
  return counts;
}
