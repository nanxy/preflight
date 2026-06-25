// components/QueueSection.jsx
// "UP NEXT — sorted for you" framing, courtesy of the Mixtape exploration.

import { useDroppable } from '@dnd-kit/core';
import DraggableTaskCard from './DraggableTaskCard.jsx';
import CategoryGroup from './CategoryGroup.jsx';

export default function QueueSection({
  tasks, grouped, categoriesById, activeSort,
  onEnqueue, onComplete, onEdit, onArchive,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: 'zone-queue' });
  const empty = tasks.length === 0;

  return (
    <section
      ref={setNodeRef}
      className={[
        'rounded-2xl transition-colors p-1',
        isOver ? 'bg-priority-50/30 ring-2 ring-priority-200' : '',
      ].join(' ')}
    >
      <div className="flex items-baseline justify-between mb-3 px-2">
        <div>
          <h2 className="font-display text-lg leading-tight">Up next</h2>
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">sorted for you</p>
        </div>
        <span className="text-xs text-gray-500">
          {empty ? '' : `${tasks.length} task${tasks.length === 1 ? '' : 's'}`}
        </span>
      </div>

      {empty ? (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 py-10 text-center text-sm text-gray-400">
          nothing waiting — tap + to add
        </div>
      ) : grouped ? (
        <div className="space-y-4">
          {grouped.map(({ categoryId, tasks: groupTasks }) => (
            <CategoryGroup
              key={categoryId ?? 'none'}
              category={categoriesById[categoryId]}
              tasks={groupTasks}
              categoriesById={categoriesById}
              activeSort={activeSort}
              onEnqueue={onEnqueue}
              onComplete={onComplete}
              onEdit={onEdit}
              onArchive={onArchive}
            />
          ))}
        </div>
      ) : (
        <ul className="space-y-2 px-1">
          {tasks.map(task => (
            <li key={task.id}>
              <DraggableTaskCard
                task={task}
                category={categoriesById[task.categoryId]}
                source="queue"
                activeSort={activeSort}
                onEnqueue={onEnqueue}
                onComplete={onComplete}
                onEdit={onEdit}
                onArchive={onArchive}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
