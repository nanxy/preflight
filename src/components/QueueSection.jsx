// components/QueueSection.jsx
// Up next, with list <-> block view toggle. Swipes wired: right=complete,
// left=archive, up=enqueue.

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import DraggableTaskCard from './DraggableTaskCard.jsx';
import CategoryGroup from './CategoryGroup.jsx';
import ViewToggle from './ViewToggle.jsx';

export default function QueueSection({
  tasks, grouped, categoriesById, activeSort,
  onEnqueue, onComplete, onEdit, onArchive,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: 'zone-queue' });
  const [view, setView] = useState('list');
  const empty = tasks.length === 0;

  function cardProps(task) {
    return {
      key: task.id,
      task,
      category: categoriesById[task.categoryId],
      source: 'queue',
      activeSort,
      onEnqueue, onComplete, onEdit, onArchive,
      onSwipeRight: () => onComplete?.(task.id),
      onSwipeLeft:  () => onArchive?.(task.id),
      onSwipeUp:    () => onEnqueue?.(task.id),
    };
  }

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
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {empty ? '' : `${tasks.length} task${tasks.length === 1 ? '' : 's'}`}
          </span>
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      {empty ? (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 py-10 text-center text-sm text-gray-400">
          nothing waiting, tap + to add
        </div>
      ) : view === 'block' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-1">
          {tasks.map(task => (
            <DraggableTaskCard {...cardProps(task)} compact />
          ))}
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
              <DraggableTaskCard {...cardProps(task)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
