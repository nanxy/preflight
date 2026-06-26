// components/TaskForm.jsx
// "Optional" relabeled to "due date" and split into its own row. Flow gets
// its own label. Routine section commented out per Jun 25 (kept for future).

import { useState } from 'react';
import {
  TIME_BUCKETS, SLIDER_SYMBOLS, AVAILABLE_COLORS, CATEGORY_COLOR_STOPS, CATEGORY_HEX,
} from '../data/defaults.js';
import { categories as catsStore } from '../lib/storage.js';
import { PlusIcon } from './Icons.jsx';
import BubbleSlider from './BubbleSlider.jsx';

export default function TaskForm({
  initial = {}, bucket: initialBucket, categories,
  submitLabel = 'add task', onSubmit, onCancel,
  extraActions = null, onCategoriesChanged,
}) {
  const [title, setTitle]         = useState(initial.title ?? '');
  const [categoryId, setCategory] = useState(initial.categoryId ?? categories[0]?.id ?? null);
  const [enjoyment, setEnjoyment] = useState(initial.enjoyment ?? 3);
  const [friction, setFriction]   = useState(initial.friction ?? 3);
  const [timeBucket, setBucket]   = useState(initialBucket ?? initial.timeBucket ?? '15_45');
  const [dueDate, setDueDate]     = useState(initial.dueDate ?? '');
  const [flow, setFlow]           = useState(initial.flow ?? 0);
  // routine UI hidden per Jun 25; default false so we don't accidentally flag tasks
  const isRoutine = false;

  const [showNewCat, setShowNewCat]   = useState(false);
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatColor, setNewCatColor] = useState('purple');

  const canSubmit = title.trim().length > 0 && categoryId;
  const selectedCat = categories.find(c => c.id === categoryId);
  const selectedStops = CATEGORY_COLOR_STOPS[selectedCat?.color ?? 'purple'];

  function submit() {
    if (!canSubmit) return;
    onSubmit({
      title: title.trim(), categoryId, enjoyment, friction, timeBucket,
      dueDate: dueDate || null, flow, isRoutine,
    });
  }

  function createCategory() {
    const label = newCatLabel.trim();
    if (!label) return;
    const cat = catsStore.create({ label, color: newCatColor });
    setCategory(cat.id);
    setShowNewCat(false);
    setNewCatLabel('');
    onCategoriesChanged?.();
  }

  return (
    <div className="w-full">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && canSubmit) submit(); }}
        placeholder="what is it?"
        className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-priority-400 mb-4"
      />

      <Label>category</Label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {categories.map(c => {
          const stops = CATEGORY_COLOR_STOPS[c.color] ?? CATEGORY_COLOR_STOPS.gray;
          const selected = c.id === categoryId;
          return (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={[
                'text-xs px-3 py-1.5 rounded-full font-medium border-2 transition-all inline-flex items-center gap-1.5',
                selected
                  ? 'text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-400',
              ].join(' ')}
              style={selected ? { background: stops[600], borderColor: stops[600] } : undefined}
            >
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ background: selected ? 'rgba(255,255,255,0.7)' : stops[400] }}
              />
              {c.label}
            </button>
          );
        })}
        <button
          onClick={() => setShowNewCat(v => !v)}
          className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <PlusIcon /> new
        </button>
      </div>

      {showNewCat && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 mb-4 space-y-2">
          <input
            autoFocus
            value={newCatLabel}
            onChange={(e) => setNewCatLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') createCategory(); }}
            placeholder="category name"
            className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-priority-400"
          />
          <div className="flex items-center gap-1.5 flex-wrap">
            {AVAILABLE_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setNewCatColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${newCatColor === c ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
                style={{ background: CATEGORY_HEX[c][400] }}
                aria-label={c}
              />
            ))}
            <div className="ml-auto flex gap-1.5">
              <button onClick={() => setShowNewCat(false)} className="text-xs px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">cancel</button>
              <button onClick={createCategory} disabled={!newCatLabel.trim()} className="text-xs px-3 py-1 rounded bg-priority-600 text-white disabled:opacity-40">add</button>
            </div>
          </div>
        </div>
      )}

      <Label>how long?</Label>
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {TIME_BUCKETS.map(b => {
          const selected = timeBucket === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setBucket(b.id)}
              className={[
                'text-xs px-2 py-2.5 rounded-lg font-medium border-2 transition-all',
                selected
                  ? 'border-priority-600 bg-priority-600 text-white shadow-sm'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-priority-400 text-gray-800 dark:text-gray-100',
              ].join(' ')}
            >
              {b.short}
            </button>
          );
        })}
      </div>

      <Label>how does it feel?</Label>
      <div className="space-y-4 mb-5">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">enjoyment</span>
            <span className="text-xs text-gray-400 tabular-nums">{enjoyment} / 5</span>
          </div>
          <BubbleSlider
            value={enjoyment}
            onChange={setEnjoyment}
            color={selectedStops[600]}
            lowSymbol={SLIDER_SYMBOLS.enjoyment.low}
            highSymbol={SLIDER_SYMBOLS.enjoyment.high}
            lowLabel={SLIDER_SYMBOLS.enjoyment.lowLabel}
            highLabel={SLIDER_SYMBOLS.enjoyment.highLabel}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">friction</span>
            <span className="text-xs text-gray-400 tabular-nums">{friction} / 5</span>
          </div>
          <BubbleSlider
            value={friction}
            onChange={setFriction}
            color={selectedStops[600]}
            lowSymbol={SLIDER_SYMBOLS.friction.low}
            highSymbol={SLIDER_SYMBOLS.friction.high}
            lowLabel={SLIDER_SYMBOLS.friction.lowLabel}
            highLabel={SLIDER_SYMBOLS.friction.highLabel}
          />
        </div>
      </div>

      <Label>due date</Label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 mb-4"
        />

      <Label>flow</Label>
      <div className="flex rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden mb-5">
          {[
            { v: 0, label: 'no flow' },
            { v: 1, label: '→' },
            { v: 2, label: '⇉' },
          ].map(o => (
            <button
              key={o.v}
              onClick={() => setFlow(o.v)}
              className={[
                'flex-1 text-sm py-2 transition-colors',
                flow === o.v
                  ? 'bg-priority-600 text-white font-semibold'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100',
              ].join(' ')}
            >
              {o.label}
            </button>
          ))}
        </div>

      {/*
        Routine section disabled Jun 25. Schema field stays for compat.
        <Label>routine</Label>
        <label className="flex items-center gap-2 ...">
          <input type="checkbox" checked={isRoutine} onChange={...} />
          this repeats regularly
        </label>
      */}

      <div className="flex justify-between items-center gap-2">
        <div className="flex gap-1.5">{extraActions}</div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
          >cancel</button>
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-priority-600 text-white hover:bg-priority-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}

function Label({ children }) {
  return <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 font-semibold">{children}</label>;
}
