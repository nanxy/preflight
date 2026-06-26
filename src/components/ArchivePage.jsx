// components/ArchivePage.jsx
// Dedicated history view for archived tasks. Block view by default for a
// fuller browseable layout. Cards remain draggable so user can restore by
// dragging back to Home (when present), or use the restore button.

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import DraggableTaskCard from './DraggableTaskCard.jsx';
import { ListIcon, GridIcon } from './ViewIcons.jsx';

export default function ArchivePage({ tasks, categoriesById, onRestore, onMarkCompleted, onEdit }) {
  const [view, setView] = useState('block');
  const { setNodeRef, isOver } = useDroppable({ id: 'zone-archived' });
  const empty = tasks.length === 0;

  return (
    <main className="mx-auto max-w-3xl px-5 py-5 pb-32">
      <section
        ref={setNodeRef}
        className={[
          'rounded-2xl transition-all',
          isOver ? 'ring-2 ring-amber-400 bg-amber-50/30 dark:bg-amber-900/10 p-3' : '',
        ].join(' ')}
      >
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-2xl">Archive</h2>
          <ViewToggle view={view} onChange={setView} />
        </div>

        {empty ? (
          <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
            nothing archived yet
          </div>
        ) : view === 'block' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tasks.map(t => (
              <DraggableTaskCard
                key={t.id}
                task={t}
                category={categoriesById[t.categoryId]}
                source="archived"
                onRestore={onRestore}
                onMarkCompleted={onMarkCompleted}
                onEdit={onEdit}
                compact
              />
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map(t => (
              <li key={t.id}>
                <DraggableTaskCard
                  task={t}
                  category={categoriesById[t.categoryId]}
                  source="archived"
                  onRestore={onRestore}
                  onMarkCompleted={onMarkCompleted}
                  onEdit={onEdit}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function ViewToggle({ view, onChange }) {
  return (
    <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => onChange('list')}
        className={`p-1.5 transition-colors ${view === 'list' ? 'bg-priority-600 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        aria-label="List view"
      >
        <ListIcon />
      </button>
      <button
        onClick={() => onChange('block')}
        className={`p-1.5 transition-colors ${view === 'block' ? 'bg-priority-600 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        aria-label="Block view"
      >
        <GridIcon />
      </button>
    </div>
  );
}
