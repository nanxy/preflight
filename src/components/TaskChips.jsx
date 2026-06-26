// components/TaskChips.jsx
// Row of pills, one per task component. The pill matching the active sort
// field gets highlighted on every card so the user can compare at a glance.
//
// Skips zero/false-y components (no flow pill if flow=0, no routine pill if
// false). Each pill has hover detail (e.g. due date shows precise count).

import { TIME_BUCKETS, SLIDER_SYMBOLS } from '../data/defaults.js';
import { dueFraming, exp as expFor } from '../lib/priority.js';
import { FlowOne, FlowTwo } from './Icons.jsx';

const TIME_SHORT = Object.fromEntries(TIME_BUCKETS.map(b => [b.id, b.short]));

const URGENCY_STYLE = {
  high:   { bg: 'var(--urgent-high-bg)',   fg: 'var(--urgent-high-ink)',   ring: 'var(--urgent-high-ring)' },
  medium: { bg: 'var(--urgent-medium-bg)', fg: 'var(--urgent-medium-ink)', ring: 'var(--urgent-medium-ring)' },
  low:    { bg: 'var(--urgent-low-bg)',    fg: 'var(--urgent-low-ink)',    ring: 'var(--urgent-low-ring)' },
  none:   { bg: 'var(--urgent-none-bg)',   fg: 'var(--urgent-none-ink)',   ring: 'var(--urgent-none-ring)' },
};

export default function TaskChips({ task, category, activeSort = null, compact = false }) {
  const dueInfo = dueFraming(task.dueDate);
  const xp = expFor(task);

  // a chip is "active" when sort field === its id
  const isActive = (id) => activeSort === id;

  const sizeCls = compact ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5';

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {/* category */}
      {category && (
        <Chip
          active={isActive('category')}
          bg={`var(--cat, ${categoryHex(category, 100)})`}
          fg={categoryHex(category, 800)}
          ringColor={categoryHex(category, 600)}
          style={{ '--cat': categoryHex(category, 100) }}
          sizeCls={sizeCls}
        >
          {category.label}
        </Chip>
      )}

      {/* time */}
      <Chip
        active={isActive('time')}
        bg="#EEEDFE"
        fg="#3C3489"
        ringColor="#534AB7"
        sizeCls={sizeCls}
        title={TIME_BUCKETS.find(b => b.id === task.timeBucket)?.label}
      >
        {TIME_SHORT[task.timeBucket] ?? '?'}
      </Chip>

      {/* due — only if set */}
      {dueInfo.bucket && (
        <Chip
          active={isActive('dueDate')}
          bg={URGENCY_STYLE[dueInfo.urgency].bg}
          fg={URGENCY_STYLE[dueInfo.urgency].fg}
          ringColor={URGENCY_STYLE[dueInfo.urgency].ring}
          sizeCls={sizeCls}
          title={dueInfo.exact}
        >
          {dueInfo.bucket}
        </Chip>
      )}

      {/* enjoyment */}
      <Chip
        active={isActive('enjoyment')}
        bg="#FFF7E6"
        fg="#854F0B"
        ringColor="#CD8D1F"
        sizeCls={sizeCls}
        title={`enjoyment ${task.enjoyment ?? 3}/5`}
      >
        <span className="mr-0.5">{symbolFor('enjoyment', task.enjoyment ?? 3)}</span>
        {task.enjoyment ?? 3}
      </Chip>

      {/* friction */}
      <Chip
        active={isActive('friction')}
        bg="#F0F7E3"
        fg="#27500A"
        ringColor="#6FA533"
        sizeCls={sizeCls}
        title={`friction ${task.friction ?? 3}/5`}
      >
        <span className="mr-0.5">{symbolFor('friction', task.friction ?? 3)}</span>
        {task.friction ?? 3}
      </Chip>

      {/* flow — only if > 0 */}
      {task.flow > 0 && (
        <Chip
          active={isActive('flow')}
          bg="#EEEDFE"
          fg="#3C3489"
          ringColor="#7F77DD"
          sizeCls={sizeCls}
          title={task.flow === 2 ? 'unlocks a lot' : 'unlocks something'}
        >
          {task.flow === 2 ? <FlowTwo /> : <FlowOne />}
        </Chip>
      )}

      {/* routine — only if true */}
      {task.isRoutine && (
        <Chip
          active={isActive('routine')}
          bg="#F0EFEB"
          fg="#444441"
          ringColor="#8A8884"
          sizeCls={sizeCls}
          title="routine / maintenance"
        >↻ routine</Chip>
      )}

      {/* EXP — always shown */}
      <Chip
        bg="#FFF1D6"
        fg="#854F0B"
        ringColor="#CD8D1F"
        sizeCls={sizeCls}
        title="XP earned on completion (After app)"
      >
        +{xp} xp
      </Chip>
    </div>
  );
}

function symbolFor(kind, value) {
  // Show low symbol for low values, high for high, neutral for middle.
  const s = SLIDER_SYMBOLS[kind];
  if (!s) return null;
  if (value <= 2) return s.low;
  if (value >= 4) return s.high;
  return '·';
}

const STOPS = {
  blue:   { 100: 'var(--cat-blue-tint)',   600: 'var(--cat-blue-solid)',   800: 'var(--cat-blue-ink)' },
  pink:   { 100: 'var(--cat-pink-tint)',   600: 'var(--cat-pink-solid)',   800: 'var(--cat-pink-ink)' },
  coral:  { 100: 'var(--cat-coral-tint)',  600: 'var(--cat-coral-solid)',  800: 'var(--cat-coral-ink)' },
  amber:  { 100: 'var(--cat-amber-tint)',  600: 'var(--cat-amber-solid)',  800: 'var(--cat-amber-ink)' },
  green:  { 100: 'var(--cat-green-tint)',  600: 'var(--cat-green-solid)',  800: 'var(--cat-green-ink)' },
  teal:   { 100: 'var(--cat-teal-tint)',   600: 'var(--cat-teal-solid)',   800: 'var(--cat-teal-ink)' },
  purple: { 100: 'var(--cat-purple-tint)', 600: 'var(--cat-purple-solid)', 800: 'var(--cat-purple-ink)' },
  gray:   { 100: 'var(--cat-gray-tint)',   600: 'var(--cat-gray-solid)',   800: 'var(--cat-gray-ink)' },
};
function categoryHex(c, stop) {
  return STOPS[c?.color ?? 'gray']?.[stop] ?? STOPS.gray[stop];
}

function Chip({ active, bg, fg, ringColor, sizeCls, children, title, style }) {
  return (
    <span
      title={title}
      style={{
        background: bg,
        color: fg,
        ...(active ? { boxShadow: `0 0 0 2px ${ringColor}`, transform: 'scale(1.06)' } : {}),
        ...style,
      }}
      className={`inline-flex items-center rounded-full font-medium tabular-nums whitespace-nowrap transition-all ${sizeCls}`}
    >
      {children}
    </span>
  );
}
