// components/CategoryGroup.jsx
// A bucket: header with category color, count, and the tasks inside.

import { CATEGORY_COLOR_STOPS } from '../data/defaults.js';
import TaskCard from './TaskCard.jsx';

export default function CategoryGroup({
  category,
  tasks,
  categoriesById,
  onEnqueue,
  onComplete,
  onEdit,
  onArchive,
}) {
  const stops = CATEGORY_COLOR_STOPS[category?.color ?? 'gray'];

  return (
    <div
      className="rounded-2xl p-3"
      style={{ background: stops[50] + '88' }}  // very soft tint
    >
      <div className="flex items-baseline justify-between mb-2 px-2">
        <h3 className="text-sm font-semibold capitalize" style={{ color: stops[800] }}>
          {category?.label ?? 'uncategorized'}
        </h3>
        <span className="text-xs" style={{ color: stops[600] }}>
          {tasks.length}
        </span>
      </div>
      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id}>
            <TaskCard
              task={task}
              category={category}
              source="queue"
              onEnqueue={onEnqueue}
              onComplete={onComplete}
              onEdit={onEdit}
              onArchive={onArchive}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
