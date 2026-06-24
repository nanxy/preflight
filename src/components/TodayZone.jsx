// components/TodayZone.jsx
// The top region. Drop target for cards dragged from Queue. Numbered list.
// First card gets emphasized treatment via TaskCard's isFirstInToday prop.

import { useState } from 'react';
import TaskCard from './TaskCard.jsx';

export default function TodayZone({
  tasks,
  categoriesById,
  onDropTask,
  onDequeue,
  onComplete,
  onEdit,
  onArchive,
  onStart,
}) {
  const [hover, setHover] = useState(false);

  function onDragOver(e) { e.preventDefault(); setHover(true); }
  function onDragLeave()  { setHover(false); }
  function onDrop(e) {
    e.preventDefault();
    setHover(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data?.taskId) onDropTask(data.taskId);
    } catch {}
  }

  const empty = tasks.length === 0;

  return (
    <section
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={[
        'rounded-2xl border-2 border-dashed transition-colors p-4',
        hover ? 'border-priority-600 bg-priority-50/40' : 'border-gray-200 dark:border-gray-700',
      ].join(' ')}
    >
      <div className="flex items-baseline justify-between mb-3 px-1">
        <h2 className="text-base font-semibold">Today</h2>
        <span className="text-xs text-gray-500">
          {empty ? 'drag cards here to commit' : `${tasks.length} committed`}
        </span>
      </div>

      {empty ? (
        <div className="py-8 text-center text-sm text-gray-400">
          drop something here to commit to it today
        </div>
      ) : (
        <ol className="space-y-2">
          {tasks.map((task, i) => (
            <li key={task.id} className="flex items-start gap-3">
              <span className="text-sm font-semibold text-gray-400 w-5 text-center tabular-nums pt-3">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <TaskCard
                  task={task}
                  category={categoriesById[task.categoryId]}
                  source="today"
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
      )}
    </section>
  );
}
