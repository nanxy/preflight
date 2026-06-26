// components/TodayZone.jsx
// No more dashed border. Soft gradient bg suggests this is the focus zone.
// Empty state shows a friendly card-styled prompt.

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableTaskCard from './SortableTaskCard.jsx';

export default function TodayZone({
  tasks, categoriesById, activeSort,
  onDequeue, onComplete, onEdit, onArchive, onStart,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: 'zone-today' });
  const empty = tasks.length === 0;
  const ids = tasks.map(t => t.id);

  return (
    <section
      ref={setNodeRef}
      className={[
        'rounded-2xl p-4 transition-all',
        'bg-gradient-to-b from-priority-50/60 via-priority-50/20 to-transparent',
        'dark:from-priority-900/30 dark:via-priority-900/10 dark:to-transparent',
        isOver ? 'ring-2 ring-priority-400' : '',
      ].join(' ')}
    >
      <div className="flex items-baseline justify-between mb-3 px-1">
        <h2 className="font-display text-lg">Today</h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {empty ? '' : `${tasks.length} committed`}
        </span>
      </div>

      {empty ? (
        <div className="rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-priority-100 dark:border-priority-900 px-5 py-7 text-center">
          <p className="font-display text-base text-gray-700 dark:text-gray-200 mb-1">
            Pick what to do today.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Drag a card up from your queue, or tap + to add something new.
          </p>
        </div>
      ) : (
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <ol className="space-y-2">
            {tasks.map((task, i) => (
              <li key={task.id} className="flex items-start gap-3">
                <span className="text-sm font-semibold text-gray-400 w-5 text-center tabular-nums pt-4 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <SortableTaskCard
                    task={task}
                    category={categoriesById[task.categoryId]}
                    source="today"
                    activeSort={activeSort}
                    isFirstInToday={i === 0}
                    onDequeue={onDequeue}
                    onComplete={onComplete}
                    onEdit={onEdit}
                    onArchive={onArchive}
                    onStart={onStart}
                  />
                </div>
              </li>
            ))}
          </ol>
        </SortableContext>
      )}
    </section>
  );
}
