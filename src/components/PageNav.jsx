// components/PageNav.jsx
// Header navigation: shows three page labels with the current one large.
// Tap a label to jump. Drag the row horizontally to swipe between pages.

import { motion } from 'motion/react';
import { SettingsIcon } from './Icons.jsx';

const PAGES = ['archive', 'home', 'tbd'];
const LABELS = { archive: 'Archive', home: 'Home', tbd: 'Coming soon' };

export default function PageNav({ currentPage, onPageChange, onOpenSettings, dayLabel }) {
  const idx = PAGES.indexOf(currentPage);

  function go(delta) {
    const next = idx + delta;
    if (next >= 0 && next < PAGES.length) onPageChange(PAGES[next]);
  }

  function handleDragEnd(_, info) {
    const threshold = 60;
    if (info.offset.x < -threshold) go(1);
    else if (info.offset.x > threshold) go(-1);
  }

  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-[var(--bg)]/85 border-b border-gray-200/60 dark:border-gray-700/60">
      <div className="mx-auto max-w-3xl px-3 py-2 flex items-center justify-between gap-2">
        <motion.div
          className="flex-1 flex items-center justify-around gap-1 cursor-grab active:cursor-grabbing select-none touch-pan-y"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={handleDragEnd}
          style={{ touchAction: 'pan-y' }}
        >
          {PAGES.map((p, i) => {
            const active = p === currentPage;
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={[
                  'font-display transition-all',
                  active
                    ? 'text-base text-gray-900 dark:text-gray-100'
                    : 'text-xs text-gray-400 dark:text-gray-500',
                ].join(' ')}
              >
                {LABELS[p]}
              </button>
            );
          })}
        </motion.div>
        {currentPage === 'home' && dayLabel && (
          <p className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:block">{dayLabel}</p>
        )}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 shrink-0"
          aria-label="Settings"
        >
          <SettingsIcon />
        </button>
      </div>
    </header>
  );
}
