// lib/theme.js
// Theme override that beats prefers-color-scheme. Stored in its own key so
// it's available before the rest of the app boots — applied in main.jsx
// before React renders to prevent FOUC.

const KEY = 'preflight.theme.v1';
export const THEMES = ['system', 'light', 'dark'];

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
  if (theme === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }
}
