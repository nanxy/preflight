// components/ArchivedAccordion.jsx
// Droppable: drop any active task here to archive (routes through confirm
// modal in App). Items inside are restorable.

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import DraggableTaskCard from './DraggableTaskCard.jsx';

export default function ArchivedAccordion({ tasks, categoriesById, onRestore, onEdit }) {
  const [open, setOpen] = useState(false);
  const count = tasks.length;
  const { setNodeRef, isOver } = useDroppable({ id: 'zone-archived' });

  return (
    <section
      ref={setNodeRef}
      className={[
        'mt-3 rounded-xl transition-all',
        isOver ? 'ring-2 ring-amber-400 bg-amber-50/40 dark:bg-amber-900/10 p-2' : '',
      ].join(' ')}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-2 text-left text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors border-t border-gray-200/60 dark:border-gray-700/60 pt-3"
      >
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-wider text-xs">archived</span>
          <span className="text-xs tabular-nums text-gray-400">{count}</span>
          {isOver && <span className="text-xs text-amber-600 font-medium">drop to archive</span>}
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
                  <DraggableTaskCard
                    task={t}
                    category={categoriesById[t.categoryId]}
                    source="archived"
                    onRestore={onRestore}
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
