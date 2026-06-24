// components/TaskCard.jsx
// Category-themed card. Height scales with time bucket. Always shows all
// priority components. Hover/tap expands to reveal action buttons.
//
// Card is "pure" — receives drag attributes from a wrapper (Sortable in
// Today, Draggable in Queue) so it doesn't depend on dnd-kit directly.

import { useState } from 'react';
import { CATEGORY_COLOR_STOPS, CARD_PADDING_BY_SCALE, TIME_BUCKETS } from '../data/defaults.js';
import CategoryChip from './CategoryChip.jsx';
import PriorityScore from './PriorityScore.jsx';
import ScoreInputs from './ScoreInputs.jsx';

const SCALE_BY_BUCKET = Object.fromEntries(TIME_BUCKETS.map(b => [b.id, b.cardScale]));

export default function TaskCard({
  task,
  category,
  source = 'queue',          // 'queue' | 'today' | 'archived'
  isFirstInToday = false,
  dragHandleProps = {},      // {...attributes, ...listeners} from dnd-kit
  isDragging = false,
  onEnqueue,
  onDequeue,
  onComplete,
  onEdit,
  onArchive,
  onUnarchive,
  onStart,
}) {
  const [expanded, setExpanded] = useState(false);
  const stops = CATEGORY_COLOR_STOPS[category?.color ?? 'gray'];
  const scale = SCALE_BY_BUCKET[task.timeBucket] ?? 1;
  const padCls = CARD_PADDING_BY_SCALE[scale] ?? CARD_PADDING_BY_SCALE[1];

  const cardStyle = {
    background: stops[50],
    borderLeftColor: stops[400],
  };

  const stopAnd = (fn) => (e) => { e.stopPropagation(); fn?.(task.id); };
  const stopAndPass = (fn) => (e) => { e.stopPropagation(); fn?.(task); };

  return (
    <div
      {...dragHandleProps}
      onClick={() => setExpanded(v => !v)}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={cardStyle}
      className={[
        'dnd-draggable group rounded-xl border border-l-4 transition-all duration-150 no-select cursor-grab active:cursor-grabbing px-4',
        padCls,
        'border-gray-200/60 dark:border-gray-700',
        'hover:shadow-md hover:-translate-y-0.5',
        isFirstInToday ? 'ring-2 ring-priority-300' : '',
        isDragging ? 'opacity-40 ring-2 ring-priority-400' : '',
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
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200/50 flex-wrap">
          {source === 'queue' && onEnqueue && (
            <ActionBtn onClick={stopAnd(onEnqueue)} accent stops={stops}>+ today</ActionBtn>
          )}
          {source === 'today' && isFirstInToday && onStart && (
            <ActionBtn onClick={stopAnd(onStart)} accent stops={stops}>▶ start</ActionBtn>
          )}
          {source === 'today' && onDequeue && (
            <ActionBtn onClick={stopAnd(onDequeue)} stops={stops}>↩ remove</ActionBtn>
          )}
          {source === 'archived' && onUnarchive && (
            <ActionBtn onClick={stopAnd(onUnarchive)} accent stops={stops}>↺ restore</ActionBtn>
          )}
          {source !== 'archived' && onComplete && (
            <ActionBtn onClick={stopAnd(onComplete)} stops={stops}>✓ done</ActionBtn>
          )}
          {onEdit && (
            <ActionBtn onClick={stopAndPass(onEdit)} stops={stops}>edit</ActionBtn>
          )}
          {source !== 'archived' && onArchive && (
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
        onPointerDown={(e) => e.stopPropagation()}
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
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onClick}
      className="text-xs px-3 py-1.5 rounded-full border bg-white/60 hover:bg-white transition-colors"
      style={{ borderColor: stops[100], color: stops[800] }}
    >
      {children}
    </button>
  );
}
