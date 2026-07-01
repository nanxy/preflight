// components/TaskCard.jsx
import { useState } from "react";
import {
  CATEGORY_COLOR_STOPS,
  CARD_PADDING_BY_SCALE,
  TIME_BUCKETS,
} from "../data/defaults.js";
import PriorityScoreBlock from "./PriorityScoreBlock.jsx";
import TaskChips from "./TaskChips.jsx";

const SCALE_BY_BUCKET = Object.fromEntries(
  TIME_BUCKETS.map((b) => [b.id, b.cardScale]),
);

export default function TaskCard({
  task,
  category,
  source = "queue", // 'queue' | 'today' | 'completed' | 'archived'
  activeSort = null,
  isFirstInToday = false,
  dragHandleProps = {},
  isDragging = false,
  compact = false,
  onEnqueue,
  onDequeue,
  onComplete,
  onEdit,
  onArchive,
  onUnarchive,
  onStart,
  onRestore,
  onMarkCompleted,
}) {
  const [expanded, setExpanded] = useState(false);
  const stops = CATEGORY_COLOR_STOPS[category?.color ?? "gray"];
  const scale = SCALE_BY_BUCKET[task.timeBucket] ?? 1;
  const padCls = CARD_PADDING_BY_SCALE[scale] ?? CARD_PADDING_BY_SCALE[1];
  const inactive = source === "completed" || source === "archived";

  const cardStyle = {
    background: stops[50],
    borderLeftColor: stops[400],
    ...(inactive ? { filter: "grayscale(0.55) opacity(0.78)" } : {}),
  };

  const stopAnd = (fn) => (e) => {
    e.stopPropagation();
    fn?.(task.id);
  };
  const stopAndPass = (fn) => (e) => {
    e.stopPropagation();
    fn?.(task);
  };

  // Compact layout for block / grid view: square score top-left + title,
  // then pills wrapping full-width below. Card stays clickable for expansion.
  if (compact) {
    return (
      <div
        {...dragHandleProps}
        onClick={() => setExpanded((v) => !v)}
        style={cardStyle}
        className={[
          "dnd-draggable group rounded-xl border border-l-4 transition-all duration-150 no-select cursor-grab active:cursor-grabbing overflow-hidden p-2.5",
          "border-gray-200/60 dark:border-gray-700",
          "hover:shadow-md",
          source !== "today" ? "glass" : "",
          isDragging ? "opacity-40 ring-2 ring-priority-400" : "",
        ].join(" ")}
      >
        <div className="flex items-start gap-2 mb-2">
          <PriorityScoreBlock
            task={task}
            category={category}
            highlighted={activeSort === "priority"}
            compact
          />
          <h3
            className="font-display text-sm font-medium leading-snug line-clamp-2 flex-1 min-w-0"
            style={{ color: stops[800] }}
          >
            {task.title}
          </h3>
        </div>
        <TaskChips
          task={task}
          category={category}
          activeSort={activeSort}
          compact
        />

        {expanded && (
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50 flex-wrap">
            {source === "queue" && onEnqueue && (
              <ActionBtn onClick={stopAnd(onEnqueue)} accent stops={stops}>
                + today
              </ActionBtn>
            )}
            {(source === "completed" || source === "archived") && onRestore && (
              <ActionBtn onClick={stopAnd(onRestore)} accent stops={stops}>
                ↺ restore
              </ActionBtn>
            )}
            {source === "archived" && onMarkCompleted && (
              <ActionBtn onClick={stopAnd(onMarkCompleted)} stops={stops}>
                ✓ complete
              </ActionBtn>
            )}
            {source !== "completed" && source !== "archived" && onComplete && (
              <ActionBtn onClick={stopAnd(onComplete)} stops={stops}>
                ✓ done
              </ActionBtn>
            )}
            {onEdit && (
              <ActionBtn onClick={stopAndPass(onEdit)} stops={stops}>
                edit
              </ActionBtn>
            )}
            {source !== "archived" && onArchive && (
              <ActionBtn onClick={stopAnd(onArchive)} stops={stops}>
                archive
              </ActionBtn>
            )}
          </div>
        )}
      </div>
    );
  }

  // Default (list / carousel) layout.
  return (
    <div
      {...dragHandleProps}
      onClick={() => setExpanded((v) => !v)}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={cardStyle}
      className={[
        "dnd-draggable group rounded-xl border border-l-4 transition-all duration-150 no-select cursor-grab active:cursor-grabbing overflow-hidden",
        "border-gray-200/60 dark:border-gray-700",
        "hover:shadow-md hover:-translate-y-0.5",
        source !== "today" ? "glass" : "",
        isFirstInToday ? "ring-2 ring-priority-300" : "",
        isDragging ? "opacity-40 ring-2 ring-priority-400" : "",
      ].join(" ")}
    >
      {/* Grid: col 0 = score block (auto width), col 1 = title (fills rest).
          Row 1 = score + title. Row 2 = chips spanning both columns so they
          always start at the score block's left edge and wrap freely. 
      <div
        className={`grid ${padCls} px-3`}
        style={{ gridTemplateColumns: 'auto 1fr', columnGap: '10px' }}
      >
        {/* Row 1 col 0: score block, spans both rows so it stays full-height 
        <div style={{ gridColumn: '1', gridRow: '1 / 3', alignSelf: 'start' }}>
          <PriorityScoreBlock
            task={task}
            category={category}
            highlighted={activeSort === 'priority'}
          />
        </div>

        {/* Row 1 col 1: status badge + title 
        <div style={{ gridColumn: '2', gridRow: '1' }} className="min-w-0 flex flex-col justify-center gap-0.5 py-0.5">
          {(isFirstInToday || source === 'completed' || source === 'archived') && (
            <div className="flex items-center gap-2">
              {isFirstInToday && (
                <span className="text-[10px] uppercase tracking-wider font-semibold text-priority-700">up next</span>
              )}
              {source === 'completed' && (
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">done</span>
              )}
              {source === 'archived' && (
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">archived</span>
              )}
            </div>
          )}
          <div
            className={`font-display text-[15px] font-medium leading-tight ${source === 'completed' ? 'line-through decoration-gray-400/60' : ''}`}
            style={{ color: stops[800] }}
          >
            {task.title}
          </div>
        </div> 

        {/* Row 2 col 1: chips span col 1 only, start flush with title 
        <div style={{ gridColumn: '2', gridRow: '2' }} className="pb-1">
          <TaskChips task={task} category={category} activeSort={activeSort} />
        </div>
      </div>
*/}

      <div className={`${padCls} px-3`}>
        <div className="flex items-start gap-[10px]">
          <PriorityScoreBlock
            task={task}
            category={category}
            highlighted={activeSort === "priority"}
          />

          <div className="flex-1 min-w-0">
            {(isFirstInToday ||
              source === "completed" ||
              source === "archived") && (
              <div className="flex items-center gap-2 mb-0.5">
                {isFirstInToday && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-priority-700">
                    up next
                  </span>
                )}
                {source === "completed" && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
                    done
                  </span>
                )}
                {source === "archived" && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
                    archived
                  </span>
                )}
              </div>
            )}

            <div
              className={`font-display text-[15px] font-medium leading-tight mb-1 ${
                source === "completed"
                  ? "line-through decoration-gray-400/60"
                  : ""
              }`}
              style={{ color: stops[800] }}
            >
              {task.title}
            </div>

            <TaskChips
              task={task}
              category={category}
              activeSort={activeSort}
            />
          </div>
        </div>
      </div>
      {expanded && (
        <div className="flex items-center gap-2 px-4 py-2.5 border-t border-gray-200/50 dark:border-gray-700/50 flex-wrap bg-white/40 dark:bg-gray-900/40">
          {source === "queue" && onEnqueue && (
            <ActionBtn onClick={stopAnd(onEnqueue)} accent stops={stops}>
              + today
            </ActionBtn>
          )}
          {source === "today" && isFirstInToday && onStart && (
            <ActionBtn onClick={stopAnd(onStart)} accent stops={stops}>
              ▶ start
            </ActionBtn>
          )}
          {source === "today" && onDequeue && (
            <ActionBtn onClick={stopAnd(onDequeue)} stops={stops}>
              ↩ remove
            </ActionBtn>
          )}
          {(source === "completed" || source === "archived") && onRestore && (
            <ActionBtn onClick={stopAnd(onRestore)} accent stops={stops}>
              ↺ restore
            </ActionBtn>
          )}
          {source === "archived" && onMarkCompleted && (
            <ActionBtn onClick={stopAnd(onMarkCompleted)} stops={stops}>
              ✓ complete
            </ActionBtn>
          )}
          {source !== "completed" && source !== "archived" && onComplete && (
            <ActionBtn onClick={stopAnd(onComplete)} stops={stops}>
              ✓ done
            </ActionBtn>
          )}
          {onEdit && (
            <ActionBtn onClick={stopAndPass(onEdit)} stops={stops}>
              edit
            </ActionBtn>
          )}
          {source !== "archived" && onArchive && (
            <ActionBtn onClick={stopAnd(onArchive)} stops={stops}>
              archive
            </ActionBtn>
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
      className="text-xs px-3 py-1.5 rounded-full border bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition-colors"
      style={{ borderColor: stops[100], color: stops[800] }}
    >
      {children}
    </button>
  );
}
