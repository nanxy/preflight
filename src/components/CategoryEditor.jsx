// components/CategoryEditor.jsx
// Active list with rename / recolor / archive. Archived ones live in a
// collapsible section with a restore button. Add-new at the top.

import { useState } from 'react';
import { AVAILABLE_COLORS, CATEGORY_COLOR_STOPS } from '../data/defaults.js';
import { categories as catsStore } from '../lib/storage.js';
import { PlusIcon } from './Icons.jsx';

export default function CategoryEditor({ categories, onChanged }) {
  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState('purple');
  const [editingId, setEditingId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  const active   = categories.filter(c => !c.isArchived);
  const archived = categories.filter(c => c.isArchived);

  function addCategory() {
    const label = newLabel.trim();
    if (!label) return;
    catsStore.create({ label, color: newColor });
    setNewLabel('');
    onChanged?.();
  }

  function rename(id, label) {
    const trimmed = (label ?? '').trim();
    if (!trimmed) return;
    catsStore.update(id, { label: trimmed });
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

  function unarchive(id) {
    catsStore.unarchive(id);
    onChanged?.();
  }

  return (
    <div>
      {/* add new */}
      <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-3 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addCategory(); }}
            placeholder="new category"
            className="flex-1 px-2 py-1.5 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-priority-400"
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

      {/* active list */}
      <ul className="space-y-1.5">
        {active.map(cat => {
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
                  onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setEditingId(null); }}
                  className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
              ) : (
                <button
                  onClick={() => setEditingId(cat.id)}
                  className="flex-1 text-left px-2 py-1 text-sm font-medium"
                  style={{ color: stops[800] }}
                  title="rename"
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
                className="text-xs text-gray-500 hover:text-gray-800 px-2 hover:bg-white/60 rounded transition-colors"
                title="archive category"
              >×</button>
            </li>
          );
        })}
      </ul>

      {/* archived collapsible */}
      {archived.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowArchived(v => !v)}
            className="w-full flex items-center justify-between text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 uppercase tracking-wider"
          >
            <span>archived ({archived.length})</span>
            <span>{showArchived ? '▴' : '▾'}</span>
          </button>
          {showArchived && (
            <ul className="space-y-1.5 mt-2">
              {archived.map(cat => {
                const stops = CATEGORY_COLOR_STOPS[cat.color] ?? CATEGORY_COLOR_STOPS.gray;
                return (
                  <li
                    key={cat.id}
                    className="rounded-lg p-2 flex items-center gap-2 opacity-60"
                    style={{ background: stops[50] }}
                  >
                    <span className="flex-1 text-sm" style={{ color: stops[800] }}>{cat.label}</span>
                    <button
                      onClick={() => unarchive(cat.id)}
                      className="text-xs px-2 py-1 rounded bg-white/80 hover:bg-white text-gray-700"
                    >restore</button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
