// components/ArchivedAccordion.jsx
// Mirror of CompletedAccordion but shows full cards (so tasks remain editable
// and can be unarchived). Closed by default.

import { useState } from 'react';
import TaskCard from './TaskCard.jsx';

export default function ArchivedAccordion({ tasks, categoriesById, onUnarchive, onEdit }) {
  const [open, setOpen] = useState(false);
  const count = tasks.length;

  return (
    <section className="mt-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-2 text-left text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors border-t border-gray-200/60 dark:border-gray-700/60 pt-3"
      >
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-wider text-xs">archived</span>
          <span className="text-xs tabular-nums text-gray-400">{count}</span>
        </div>
        <span className="text-gray-400 text-xs">{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div className="mt-3">
          {count === 0 ? (
            <p className="text-xs text-gray-400 py-2">nothing archived</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map(t => (
                <li key={t.id}>
                  <TaskCard
                    task={t}
                    category={categoriesById[t.categoryId]}
                    source="archived"
                    onUnarchive={onUnarchive}
                    onEdit={onEdit}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
