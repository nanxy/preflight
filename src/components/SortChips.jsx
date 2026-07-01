// components/SortChips.jsx
// Row of pills replacing the dropdown sort menu. Tap a chip to sort by that
// field; tap the active chip to flip direction. Selecting "category" tells
// the page to render Queue as grouped buckets.

import { SORT_FIELDS } from '../lib/sort.js';

export default function SortChips({ field, direction, onChange }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mb-1 no-scrollbar">
      <span className="text-xs text-gray-400 mr-1 shrink-0">sort:</span>
      {SORT_FIELDS.map(f => {
        const active = f.id === field;
        const arrow  = active ? (direction === 'asc' ? '↑' : '↓') : null;
        return (
          <button
            key={f.id}
            onClick={() => {
              if (active) onChange(field, direction === 'asc' ? 'desc' : 'asc');
              else onChange(f.id, f.direction ?? 'desc');
            }}
            className={[
              'text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap shrink-0',
              active
                ? 'bg-priority-600 text-white transition-shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors',
            ].join(' ')}
            style={active ? {
              boxShadow: '0 0 0 2px #534AB7, 0 0 10px 2px #7F77DD88',
            } : undefined}
          >
            {f.label}
            {arrow && <span className="ml-1 opacity-80">{arrow}</span>}
          </button>
        );
      })}
    </div>
  );
}
