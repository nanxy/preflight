// lib/theme.js
// Single source of truth for theme. Always sets html[data-theme] to either
// "light" or "dark" so Tailwind's dark: utilities and our CSS overrides
// agree. System mode resolves to whichever the OS currently prefers and
// listens for changes.

const KEY = 'preflight.theme.v1';
export const THEMES = ['system', 'light', 'dark'];

let cleanup = null;

export function getStoredTheme() {
  try { return localStorage.getItem(KEY) ?? 'system'; }
  catch { return 'system'; }
}

export function setStoredTheme(theme) {
  try { localStorage.setItem(KEY, theme); } catch {}
  applyTheme(theme);
}

export function applyTheme(theme = getStoredTheme()) {
  const root = document.documentElement;

  if (cleanup) { cleanup(); cleanup = null; }

  if (theme === 'system') {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => {
      root.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
    };
    sync();
    mq.addEventListener('change', sync);
    cleanup = () => mq.removeEventListener('change', sync);
  } else {
    root.setAttribute('data-theme', theme);
  }
}
