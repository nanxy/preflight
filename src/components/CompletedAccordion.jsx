// components/CompletedAccordion.jsx
// Droppable: drop any active task here to mark it completed. Items inside
// are full draggable cards (desaturated) so they can be restored by dragging
// back into Today or Queue, or via the "restore" action button.

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import DraggableTaskCard from './DraggableTaskCard.jsx';

function groupKey(date, now = new Date()) {
  const d = new Date(date);
  const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayMid = new Date(todayMid); yesterdayMid.setDate(yesterdayMid.getDate() - 1);
  const dMid = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (dMid.getTime() === todayMid.getTime()) return 'Today';
  if (dMid.getTime() === yesterdayMid.getTime()) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

export default function CompletedAccordion({ tasks, categoriesById, onRestore, onArchive, onEdit }) {
  const [open, setOpen] = useState(false);
  const count = tasks.length;
  const { setNodeRef, isOver } = useDroppable({ id: 'zone-completed' });

  // group by day, newest first
  const sorted = [...tasks].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  const groups = {};
  for (const t of sorted) {
    const k = groupKey(t.completedAt);
    (groups[k] ||= []).push(t);
  }

  return (
    <section
      ref={setNodeRef}
      className={[
        'mt-6 rounded-xl transition-all',
        isOver ? 'ring-2 ring-green-400 bg-green-50/40 dark:bg-green-900/10 p-2' : '',
      ].join(' ')}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-2 text-left text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors border-t border-gray-200/60 dark:border-gray-700/60 pt-3"
      >
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-wider text-xs">completed</span>
          <span className="text-xs tabular-nums text-gray-400">{count}</span>
          {isOver && <span className="text-xs text-green-600 font-medium">drop to complete</span>}
        </div>
        <span className="text-gray-400 text-xs">{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {count === 0 ? (
            <p className="text-xs text-gray-400 py-2">nothing yet — keep going</p>
          ) : (
            Object.entries(groups).map(([day, items]) => (
              <div key={day}>
                <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 px-1">{day}</div>
                <ul className="space-y-2">
                  {items.map(t => (
                    <li key={t.id}>
                      <DraggableTaskCard
                        task={t}
                        category={categoriesById[t.categoryId]}
                        source="completed"
                        onRestore={onRestore}
                        onArchive={onArchive}
                        onEdit={onEdit}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
