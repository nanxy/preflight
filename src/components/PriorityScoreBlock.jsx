// components/PriorityScoreBlock.jsx
import { priorityBreakdown, priorityColor } from '../lib/priority.js';
import { CATEGORY_COLOR_STOPS } from '../data/defaults.js';

const SEG = {
  startability: '#7F77DD',
  timeBoost:    '#534AB7',
  urgency:      '#3C3489',
};

export default function PriorityScoreBlock({ task, category, highlighted = false, compact = false }) {
  const b = priorityBreakdown(task, new Date(), category);
  const color = priorityColor(b.total);
  const stops = CATEGORY_COLOR_STOPS[category?.color ?? 'purple'];

  const tip = [
    `startability ${b.startability}`,
    `time +${b.timeBoost}`,
    b.urgency       ? `urgency +${b.urgency}` : null,
    b.categoryBonus ? `${category?.label} bonus +${b.categoryBonus}` : null,
  ].filter(Boolean).join(' · ');

  if (compact) {
    return (
      <div
        title={tip}
        className={[
          'rounded-lg w-12 h-12 flex items-center justify-center shrink-0',
          highlighted ? 'ring-2 ring-priority-400 scale-[1.05]' : '',
        ].join(' ')}
        style={{
          background: stops[50],
          border: `1px solid ${stops[100]}`,
          transition: 'all 200ms ease',
        }}
      >
        <span
          className="font-display text-xl font-semibold leading-none tabular-nums"
          style={{ color }}
        >
          {b.total}
        </span>
      </div>
    );
  }

  const total = Math.max(1, b.startability + b.timeBoost + b.urgency);
  const wStart = (b.startability / total) * 100;
  const wTime  = (b.timeBoost   / total) * 100;
  const wUrg   = (b.urgency     / total) * 100;

  return (
    <div
      title={tip}
      className={[
        'flex flex-col items-center justify-between rounded-xl px-2.5 py-2 min-w-[58px] cursor-help shrink-0',
        highlighted ? 'ring-2 ring-priority-400 scale-[1.02]' : '',
      ].join(' ')}
      style={{
        background: stops[50],
        borderRight: `1px solid ${stops[100]}`,
        transition: 'all 200ms ease',
      }}
    >
      <span className="font-display text-3xl font-semibold leading-none tabular-nums" style={{ color }}>
        {b.total}
      </span>
      <div className="w-full mt-2">
        <div className="flex h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
          {wStart > 0 && <div style={{ width: `${wStart}%`, background: SEG.startability }} />}
          {wTime  > 0 && <div style={{ width: `${wTime}%`,  background: SEG.timeBoost }} />}
          {wUrg   > 0 && <div style={{ width: `${wUrg}%`,   background: SEG.urgency }} />}
        </div>
        <div className="text-[9px] uppercase tracking-wider text-center mt-1 font-medium text-gray-500 dark:text-gray-400">
          priority
        </div>
      </div>
    </div>
  );
}
