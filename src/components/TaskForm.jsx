// components/TaskForm.jsx
// Shared form. Themed selection states use the actual category's color
// instead of a generic priority blue. Sliders show symbol bounds. Time
// bucket buttons are stronger contrast when selected. "+ new" chip at end
// of the category row opens an inline mini-form.

import { useState } from 'react';
import { TIME_BUCKETS, SLIDER_SYMBOLS, AVAILABLE_COLORS, CATEGORY_COLOR_STOPS } from '../data/defaults.js';
import { categories as catsStore } from '../lib/storage.js';
import { PlusIcon } from './Icons.jsx';

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
  const [isRoutine, setIsRoutine] = useState(initial.isRoutine ?? false);

  const [showNewCat, setShowNewCat]   = useState(false);
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatColor, setNewCatColor] = useState('purple');

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
        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-priority-400 mb-4"
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
              className="text-xs px-3 py-1.5 rounded-full font-medium border-2 transition-all"
              style={selected
                ? { background: stops[100], color: stops[800], borderColor: stops[600] }
                : { background: 'transparent', color: stops[800], borderColor: stops[100] }}
            >
              {c.label}
            </button>
          );
        })}
        <button
          onClick={() => setShowNewCat(v => !v)}
          className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-500 hover:text-gray-700 transition-colors"
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
            className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-priority-400"
          />
          <div className="flex items-center gap-1.5 flex-wrap">
            {AVAILABLE_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setNewCatColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${newCatColor === c ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
                style={{ background: CATEGORY_COLOR_STOPS[c][400] }}
                aria-label={c}
              />
            ))}
            <div className="ml-auto flex gap-1.5">
              <button onClick={() => setShowNewCat(false)} className="text-xs px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">cancel</button>
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
                'text-xs px-2 py-2 rounded-lg font-medium border-2 transition-all',
                selected
                  ? 'border-priority-600 bg-priority-600 text-white'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300',
              ].join(' ')}
            >
              {b.short}
            </button>
          );
        })}
      </div>

      <Label>how does it feel?</Label>
      <div className="space-y-3 mb-4">
        <SliderRow label="enjoyment" value={enjoyment} onChange={setEnjoyment} symbols={SLIDER_SYMBOLS.enjoyment} />
        <SliderRow label="friction"  value={friction}  onChange={setFriction}  symbols={SLIDER_SYMBOLS.friction} />
      </div>

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
            { v: 1, label: '→' },
            { v: 2, label: '⇉' },
          ].map(o => (
            <button
              key={o.v}
              onClick={() => setFlow(o.v)}
              className={[
                'flex-1 text-sm py-2 transition-colors',
                flow === o.v ? 'bg-priority-600 text-white font-semibold' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
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

      <div className="flex justify-between items-center gap-2">
        <div className="flex gap-1.5">{extraActions}</div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
  return <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">{children}</label>;
}

function SliderRow({ label, value, onChange, symbols }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-xs text-gray-400 tabular-nums">{value} / 5</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg" title={symbols.lowLabel}>{symbols.low}</span>
        <input
          type="range" min={1} max={5} step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-priority-600"
        />
        <span className="text-lg" title={symbols.highLabel}>{symbols.high}</span>
      </div>
    </div>
  );
}
