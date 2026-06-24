// components/SettingsPanel.jsx
// Modal-style settings drawer. Theme toggle (system/light/dark with persistence,
// fixes the OS flicker complaint) + category management.

import Modal from './Modal.jsx';
import CategoryEditor from './CategoryEditor.jsx';
import { THEMES, getStoredTheme, setStoredTheme } from '../lib/theme.js';
import { SunIcon, MoonIcon, SystemIcon } from './Icons.jsx';
import { useState } from 'react';

const THEME_ICON = { system: SystemIcon, light: SunIcon, dark: MoonIcon };

export default function SettingsPanel({ open, onClose, categories, onCategoriesChanged }) {
  const [theme, setTheme] = useState(getStoredTheme());

  function pickTheme(t) {
    setTheme(t);
    setStoredTheme(t);
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-semibold mb-4">Settings</h3>

      <section className="mb-6">
        <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-2">appearance</h4>
        <div className="flex gap-2">
          {THEMES.map(t => {
            const Icon = THEME_ICON[t];
            const active = theme === t;
            return (
              <button
                key={t}
                onClick={() => pickTheme(t)}
                className={[
                  'flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg border-2 transition-all',
                  active
                    ? 'border-priority-600 bg-priority-50 text-priority-800 dark:bg-priority-900/30 dark:text-priority-100'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 text-gray-700 dark:text-gray-300',
                ].join(' ')}
              >
                <Icon />
                <span className="text-xs capitalize">{t}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          System follows your OS. Pick light or dark to override (fixes auto-switching).
        </p>
      </section>

      <section className="mb-2">
        <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-2">categories</h4>
        <CategoryEditor categories={categories} onChanged={onCategoriesChanged} />
      </section>

      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >done</button>
      </div>
    </Modal>
  );
}
