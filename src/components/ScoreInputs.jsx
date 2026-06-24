// components/ScoreInputs.jsx
// Always-visible readout of every priority component on a card.

import { TIME_BUCKETS } from '../data/defaults.js';
import { daysUntil } from '../lib/priority.js';
import { FlowOne, FlowTwo } from './Icons.jsx';

const TIME_SHORT = Object.fromEntries(TIME_BUCKETS.map(b => [b.id, b.short]));

function dueLabel(dueDate) {
  if (!dueDate) return null;
  const d = daysUntil(dueDate);
  if (d < 0)  return `${Math.abs(d)}d over`;
  if (d === 0) return 'today';
  if (d === 1) return 'tmrw';
  if (d <= 14) return `${d}d`;
  return new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function dueClass(dueDate) {
  if (!dueDate) return 'text-gray-400';
  const d = daysUntil(dueDate);
  if (d <= 0) return 'text-red-600 font-semibold';
  if (d <= 2) return 'text-amber-600 font-semibold';
  return 'text-gray-500';
}

export default function ScoreInputs({ task }) {
  const due = dueLabel(task.dueDate);
  return (
    <div className="flex items-center gap-2.5 text-[11px] text-gray-500 dark:text-gray-400 flex-wrap">
      <Item label="enjoy" value={`${task.enjoyment ?? 3}/5`} />
      <Dot />
      <Item label="friction" value={`${task.friction ?? 3}/5`} />
      <Dot />
      <Item label="time" value={TIME_SHORT[task.timeBucket] ?? '?'} />
      {due && (<><Dot /><Item label="due" value={due} valueCls={dueClass(task.dueDate)} /></>)}
      {task.flow > 0 && (
        <>
          <Dot />
          <span className="text-priority-600" title={task.flow === 2 ? 'unlocks a lot' : 'unlocks something'}>
            {task.flow === 2 ? <FlowTwo /> : <FlowOne />}
          </span>
        </>
      )}
      {task.isRoutine && (<><Dot /><span title="routine" className="text-gray-400">↻</span></>)}
    </div>
  );
}

const Dot = () => <span className="text-gray-300">·</span>;

function Item({ label, value, valueCls = '' }) {
  return (
    <span className="inline-flex items-baseline gap-1">
      <span className="text-gray-400">{label}</span>
      <span className={`tabular-nums font-medium ${valueCls || 'text-gray-700 dark:text-gray-300'}`}>{value}</span>
    </span>
  );
}
