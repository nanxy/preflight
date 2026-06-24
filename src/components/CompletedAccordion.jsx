// components/CompletedAccordion.jsx
// Visually muted, deliberately not card-like — these are records, not actions.
// Collapsed: plain header bar with count. Expanded: text rows grouped by date,
// stripped of all the score/breakdown machinery active cards carry.

import { useState } from 'react';

function groupKey(date, now = new Date()) {
  const d = new Date(date);
  const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayMid = new Date(todayMid); yesterdayMid.setDate(yesterdayMid.getDate() - 1);
  const dMid = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (dMid.getTime() === todayMid.getTime()) return 'Today';
  if (dMid.getTime() === yesterdayMid.getTime()) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

function timeOfDay(date) {
  return new Date(date).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export default function CompletedAccordion({ tasks, categoriesById }) {
  const [open, setOpen] = useState(false);
  const count = tasks.length;

  const groups = {};
  const sorted = [...tasks].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  for (const t of sorted) {
    const k = groupKey(t.completedAt);
    (groups[k] ||= []).push(t);
  }

  return (
    <section className="mt-8">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-2 text-left text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors border-t border-gray-200/60 dark:border-gray-700/60 pt-3"
      >
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-wider text-xs">completed</span>
          <span className="text-xs tabular-nums text-gray-400">{count}</span>
        </div>
        <span className="text-gray-400 text-xs">{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div className="pl-1 mt-2">
          {count === 0 ? (
            <p className="text-xs text-gray-400 py-2">nothing yet — keep going</p>
          ) : (
            Object.entries(groups).map(([day, items]) => (
              <div key={day} className="mt-3 first:mt-0">
                <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">{day}</div>
                <ul>
                  {items.map(t => {
                    const cat = categoriesById[t.categoryId];
                    return (
                      <li key={t.id} className="flex items-center gap-2 py-1 text-xs">
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: cat ? `var(--cat-${cat.color}, #9ca3af)` : '#9ca3af' }}
                        />
                        <span className="text-gray-400 w-16 shrink-0">{cat?.label ?? '—'}</span>
                        <span className="flex-1 text-gray-500 dark:text-gray-400 truncate line-through decoration-gray-300">
                          {t.title}
                        </span>
                        <span className="text-gray-400 tabular-nums">{timeOfDay(t.completedAt)}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
