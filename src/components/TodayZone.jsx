// components/TodayZone.jsx
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
        'rounded-2xl border-2 border-dashed transition-colors p-4',
        isOver
          ? 'border-priority-600 bg-priority-50/40'
          : 'border-gray-200 dark:border-gray-700',
      ].join(' ')}
    >
      <div className="flex items-baseline justify-between mb-3 px-1">
        <h2 className="font-display text-lg">Today</h2>
        <span className="text-xs text-gray-500">
          {empty ? 'drag cards here to commit' : `${tasks.length} committed`}
        </span>
      </div>

      {empty ? (
        <div className="py-8 text-center text-sm text-gray-400">
          drop something here to commit to it today
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
