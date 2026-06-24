// components/CategoryChip.jsx
import { CATEGORY_COLOR_STOPS } from '../data/defaults.js';

export default function CategoryChip({ category, size = 'sm' }) {
  if (!category) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500">
        uncategorized
      </span>
    );
  }
  const stops = CATEGORY_COLOR_STOPS[category.color] ?? CATEGORY_COLOR_STOPS.gray;
  const cls = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${cls}`}
      style={{ background: stops[100], color: stops[800] }}
    >
      {category.label}
    </span>
  );
}
