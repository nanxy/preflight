// components/QueueSection.jsx
// The bottom region — was "Backlog." Shows everything not yet committed.
// When sort=category, renders as grouped buckets (CategoryGroup). Otherwise
// renders as a flat list.
//
// Doubles as a drop target: when a card comes in from Today (source='today'),
// drop here = dequeue (drag back out).

import { useState } from 'react';
import TaskCard from './TaskCard.jsx';
import CategoryGroup from './CategoryGroup.jsx';

export default function QueueSection({
  tasks,
  grouped,            // null if flat, or array of { categoryId, tasks }
  categoriesById,
  onEnqueue,
  onComplete,
  onEdit,
  onArchive,
  onDragOutOfToday,   // called when a card from Today is dropped here
}) {
  const [hover, setHover] = useState(false);

  function onDragOver(e) {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data?.source === 'today') setHover(true);
    } catch {
      setHover(true);
    }
  }
  function onDragLeave() { setHover(false); }
  function onDrop(e) {
    e.preventDefault();
    setHover(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data?.source === 'today' && data.taskId) {
        onDragOutOfToday(data.taskId);
      }
    } catch {}
  }

  const empty = tasks.length === 0;

  return (
    <section
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={[
        'rounded-2xl transition-colors',
        hover ? 'bg-priority-50/30 ring-2 ring-priority-200' : '',
        'p-1',
      ].join(' ')}
    >
      <div className="flex items-baseline justify-between mb-3 px-2">
        <h2 className="text-base font-semibold">Queue</h2>
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
              <TaskCard
                task={task}
                category={categoriesById[task.categoryId]}
                source="queue"
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
