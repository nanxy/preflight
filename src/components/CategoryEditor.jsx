// components/CategoryEditor.jsx
// Inline list of categories with rename / recolor / archive. Add new at top.

import { useState } from 'react';
import { AVAILABLE_COLORS, CATEGORY_COLOR_STOPS } from '../data/defaults.js';
import { categories as catsStore } from '../lib/storage.js';
import { PlusIcon } from './Icons.jsx';

export default function CategoryEditor({ categories, onChanged }) {
  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState('purple');
  const [editingId, setEditingId] = useState(null);

  function addCategory() {
    const label = newLabel.trim();
    if (!label) return;
    catsStore.create({ label, color: newColor });
    setNewLabel('');
    onChanged?.();
  }

  function rename(id, label) {
    catsStore.update(id, { label });
    onChanged?.();
  }

  function recolor(id, color) {
    catsStore.update(id, { color });
    onChanged?.();
  }

  function archive(id) {
    catsStore.archive(id);
    onChanged?.();
  }

  return (
    <div>
      {/* add new */}
      <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-3 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addCategory(); }}
            placeholder="new category"
            className="flex-1 px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-priority-400"
          />
          <button
            onClick={addCategory}
            disabled={!newLabel.trim()}
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-priority-600 text-white disabled:opacity-40"
          >
            <PlusIcon /> add
          </button>
        </div>
        <div className="flex gap-1 flex-wrap">
          {AVAILABLE_COLORS.map(c => (
            <button
              key={c}
              onClick={() => setNewColor(c)}
              className={`w-5 h-5 rounded-full border-2 transition-all ${newColor === c ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
              style={{ background: CATEGORY_COLOR_STOPS[c][400] }}
              aria-label={c}
            />
          ))}
        </div>
      </div>

      {/* existing */}
      <ul className="space-y-1.5">
        {categories.map(cat => {
          const stops = CATEGORY_COLOR_STOPS[cat.color] ?? CATEGORY_COLOR_STOPS.gray;
          const isEditing = editingId === cat.id;
          return (
            <li
              key={cat.id}
              className="rounded-lg p-2 flex items-center gap-2"
              style={{ background: stops[50] }}
            >
              {isEditing ? (
                <input
                  autoFocus
                  defaultValue={cat.label}
                  onBlur={(e) => { rename(cat.id, e.target.value); setEditingId(null); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                  className="flex-1 px-2 py-1 rounded border border-gray-300 bg-white text-sm"
                />
              ) : (
                <button
                  onClick={() => setEditingId(cat.id)}
                  className="flex-1 text-left px-2 py-1 text-sm font-medium"
                  style={{ color: stops[800] }}
                >
                  {cat.label}
                </button>
              )}
              <div className="flex gap-1">
                {AVAILABLE_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => recolor(cat.id, c)}
                    className={`w-4 h-4 rounded-full border transition-all ${cat.color === c ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    style={{ background: CATEGORY_COLOR_STOPS[c][400] }}
                    aria-label={c}
                  />
                ))}
              </div>
              <button
                onClick={() => archive(cat.id)}
                className="text-xs text-gray-500 hover:text-gray-800 px-2"
                title="archive category"
              >×</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
