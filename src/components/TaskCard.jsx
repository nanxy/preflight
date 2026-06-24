// components/TaskCard.jsx
// Category-themed card. Always shows: category chip, title, ALL priority
// components (enjoyment, friction, time, due, flow, routine), and the score
// with breakdown bar. Hover/tap expands to reveal action buttons.
//
// Drag behavior: card is HTML-draggable. Source is encoded in dataTransfer:
//   'queue' if the card is currently in Today, 'queue' otherwise.
// Today zone catches 'queue' drops; Queue (backlog) zone catches 'today' drops
// for dragging back out.

import { useState } from 'react';
import { CATEGORY_COLOR_STOPS } from '../data/defaults.js';
import CategoryChip from './CategoryChip.jsx';
import PriorityScore from './PriorityScore.jsx';
import ScoreInputs from './ScoreInputs.jsx';

export default function TaskCard({
  task,
  category,
  source = 'queue', // 'queue' | 'today'
  isFirstInToday = false,
  onEnqueue,
  onDequeue,
  onComplete,
  onEdit,
  onArchive,
  onStart,
}) {
  const [expanded, setExpanded] = useState(false);
  const stops = CATEGORY_COLOR_STOPS[category?.color ?? 'gray'];

  // Soft tinted background + accent border-left for category theming.
  const cardStyle = {
    background: stops[50],
    borderLeftColor: stops[400],
  };

  function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', JSON.stringify({ taskId: task.id, source }));
    e.dataTransfer.effectAllowed = 'move';
  }

  const stopAnd = (fn) => (e) => { e.stopPropagation(); fn?.(task.id); };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => setExpanded(v => !v)}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={cardStyle}
      className={[
        'group rounded-xl border border-l-4 transition-all duration-150 no-select cursor-grab active:cursor-grabbing',
        'border-gray-200/60 dark:border-gray-700',
        'hover:shadow-md hover:-translate-y-0.5',
        isFirstInToday ? 'ring-2 ring-priority-300' : '',
        'px-4 py-3',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <CategoryChip category={category} />
            {isFirstInToday && (
              <span className="text-[10px] uppercase tracking-wider font-semibold text-priority-700">up next</span>
            )}
          </div>
          <div className="text-base font-medium leading-tight" style={{ color: stops[800] }}>
            {task.title}
          </div>
          <div className="mt-2">
            <ScoreInputs task={task} />
          </div>
        </div>
        <PriorityScore task={task} />
      </div>

      {expanded && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200/50">
          {source === 'queue' && onEnqueue && (
            <ActionBtn onClick={stopAnd(onEnqueue)} accent stops={stops}>+ today</ActionBtn>
          )}
          {source === 'today' && isFirstInToday && onStart && (
            <ActionBtn onClick={stopAnd(onStart)} accent stops={stops}>▶ start</ActionBtn>
          )}
          {source === 'today' && onDequeue && (
            <ActionBtn onClick={stopAnd(onDequeue)} stops={stops}>↩ remove</ActionBtn>
          )}
          {onComplete && (
            <ActionBtn onClick={stopAnd(onComplete)} stops={stops}>✓ done</ActionBtn>
          )}
          {onEdit && (
            <ActionBtn onClick={(e) => { e.stopPropagation(); onEdit(task); }} stops={stops}>edit</ActionBtn>
          )}
          {onArchive && (
            <ActionBtn onClick={stopAnd(onArchive)} stops={stops}>archive</ActionBtn>
          )}
        </div>
      )}
    </div>
  );
}

function ActionBtn({ onClick, accent = false, stops, children }) {
  if (accent) {
    return (
      <button
        onClick={onClick}
        className="text-xs px-3 py-1.5 rounded-full font-semibold transition-colors text-white hover:opacity-90"
        style={{ background: stops[600] }}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className="text-xs px-3 py-1.5 rounded-full border bg-white/50 hover:bg-white transition-colors"
      style={{ borderColor: stops[100], color: stops[800] }}
    >
      {children}
    </button>
  );
}
