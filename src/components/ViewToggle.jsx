// components/ViewToggle.jsx
import { ListIcon, GridIcon } from './ViewIcons.jsx';

export default function ViewToggle({ view, onChange }) {
  return (
    <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => onChange('list')}
        className={`p-1.5 transition-colors ${view === 'list' ? 'bg-priority-600 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        aria-label="List view"
      >
        <ListIcon />
      </button>
      <button
        onClick={() => onChange('block')}
        className={`p-1.5 transition-colors ${view === 'block' ? 'bg-priority-600 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        aria-label="Block view"
      >
        <GridIcon />
      </button>
    </div>
  );
}
