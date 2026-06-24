// components/TaskForm.jsx
// Shared form used for both creating a new task and editing an existing one.
// Lives inside TaskEntry (create) and EditModal (edit). Reused to keep one
// source of truth for field layout.

import { useState } from 'react';
import { TIME_BUCKETS } from '../data/defaults.js';

export default function TaskForm({
  initial = {},
  bucket: initialBucket,
  categories,
  submitLabel = 'add task',
  onSubmit,
  onCancel,
  extraActions = null,  // e.g. archive/delete buttons in edit mode
}) {
  const [title, setTitle]         = useState(initial.title ?? '');
  const [categoryId, setCategory] = useState(initial.categoryId ?? categories[0]?.id ?? null);
  const [enjoyment, setEnjoyment] = useState(initial.enjoyment ?? 3);
  const [friction, setFriction]   = useState(initial.friction ?? 3);
  const [timeBucket, setBucket]   = useState(initialBucket ?? initial.timeBucket ?? '15_45');
  const [dueDate, setDueDate]     = useState(initial.dueDate ?? '');
  const [flow, setFlow]           = useState(initial.flow ?? 0);
  const [isRoutine, setIsRoutine] = useState(initial.isRoutine ?? false);

  const canSubmit = title.trim().length > 0 && categoryId;

  function submit() {
    if (!canSubmit) return;
    onSubmit({
      title: title.trim(),
      categoryId, enjoyment, friction, timeBucket,
      dueDate: dueDate || null,
      flow, isRoutine,
    });
  }

  return (
    <div className="w-full">
      {/* title */}
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && canSubmit) submit(); }}
        placeholder="what is it?"
        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-priority-400 mb-4"
      />

      {/* category */}
      <Label>category</Label>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={[
              'text-xs px-3 py-1.5 rounded-full font-medium border transition-all',
              c.id === categoryId
                ? 'border-priority-600 ring-2 ring-priority-200 bg-priority-50'
                : 'border-gray-200 hover:border-gray-400',
            ].join(' ')}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* time bucket */}
      <Label>how long?</Label>
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {TIME_BUCKETS.map(b => (
          <button
            key={b.id}
            onClick={() => setBucket(b.id)}
            className={[
              'text-xs px-2 py-2 rounded-lg font-medium border transition-all',
              timeBucket === b.id
                ? 'border-priority-600 ring-2 ring-priority-200 bg-priority-50'
                : 'border-gray-200 hover:border-gray-400',
            ].join(' ')}
          >
            {b.short}
          </button>
        ))}
      </div>

      {/* enjoyment + friction */}
      <Label>how does it feel?</Label>
      <div className="space-y-2 mb-4">
        <SliderRow label="enjoyment" value={enjoyment} onChange={setEnjoyment} />
        <SliderRow label="friction"  value={friction}  onChange={setFriction}  />
      </div>

      {/* optional */}
      <Label>optional</Label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm"
        />
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {[
            { v: 0, label: 'no flow' },
            { v: 1, label: '>' },
            { v: 2, label: '>>' },
          ].map(o => (
            <button
              key={o.v}
              onClick={() => setFlow(o.v)}
              className={[
                'flex-1 text-sm py-2 transition-colors',
                flow === o.v ? 'bg-priority-100 text-priority-800 font-semibold' : 'hover:bg-gray-50 dark:hover:bg-gray-800',
              ].join(' ')}
            >
              {o.label}
            </button>
          ))}
        </div>
        <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">
          <input
            type="checkbox"
            checked={isRoutine}
            onChange={(e) => setIsRoutine(e.target.checked)}
            className="accent-priority-600"
          />
          routine
        </label>
      </div>

      {/* actions */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex gap-1.5">{extraActions}</div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            cancel
          </button>
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-priority-600 text-white hover:bg-priority-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Label({ children }) {
  return <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">{children}</label>;
}

function SliderRow({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 w-20">{label}</span>
      <input
        type="range" min={1} max={5} step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-priority-600"
      />
      <span className="text-sm tabular-nums w-8 text-right text-gray-600 dark:text-gray-400">
        {value}<span className="text-gray-300">/5</span>
      </span>
    </div>
  );
}
