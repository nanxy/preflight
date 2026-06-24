// components/PriorityScore.jsx
// Always-visible score: number on top, 4-segment proportional bar below.
// Number color saturates with score value. Hover the bar to see component labels.

import { priorityBreakdown, priorityColor } from '../lib/priority.js';

const SEG = {
  startability: '#7F77DD',
  timeBoost:    '#534AB7',
  urgency:      '#3C3489',
};

export default function PriorityScore({ task, size = 'md' }) {
  const b = priorityBreakdown(task);
  const color = priorityColor(b.total);

  const total = Math.max(1, b.startability + b.timeBoost + b.urgency);
  const wStart = (b.startability / total) * 100;
  const wTime  = (b.timeBoost   / total) * 100;
  const wUrg   = (b.urgency     / total) * 100;

  const numCls = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-xl';
  const barW   = size === 'sm' ? 'w-16' : 'w-20';

  const tip = [
    `startability ${b.startability}`,
    `time +${b.timeBoost}`,
    b.urgency    ? `urgency +${b.urgency}` : null,
    b.routineAdj ? `routine ${b.routineAdj}` : null,
  ].filter(Boolean).join(' · ');

  return (
    <div className="flex flex-col items-end gap-1 cursor-help" title={tip}>
      <span className={`${numCls} font-semibold leading-none tabular-nums`} style={{ color }}>
        {b.total}
      </span>
      <div className="flex items-center gap-1">
        <div className={`flex h-1.5 ${barW} rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700`}>
          {wStart > 0 && <div style={{ width: `${wStart}%`, background: SEG.startability }} />}
          {wTime  > 0 && <div style={{ width: `${wTime}%`,  background: SEG.timeBoost }} />}
          {wUrg   > 0 && <div style={{ width: `${wUrg}%`,   background: SEG.urgency }} />}
        </div>
        {b.routineAdj < 0 && (
          <span className="text-[10px] text-gray-400 font-medium" title={`routine ${b.routineAdj}`}>⌄</span>
        )}
      </div>
    </div>
  );
}
