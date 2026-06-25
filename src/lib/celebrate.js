// lib/celebrate.js
// Small confetti burst on task completion. Subtle by default — pulled from
// the task's category color so the celebration feels keyed to what was done.

import confetti from 'canvas-confetti';
import { CATEGORY_COLOR_STOPS } from '../data/defaults.js';

export function celebrate(category) {
  const stops = CATEGORY_COLOR_STOPS[category?.color ?? 'purple'];
  try {
    confetti({
      particleCount: 36,
      spread: 60,
      startVelocity: 28,
      decay: 0.93,
      gravity: 1.1,
      ticks: 120,
      colors: [stops[400], stops[600], stops[100]],
      origin: { y: 0.7 },
      disableForReducedMotion: true,
    });
  } catch { /* ignore — confetti requires document */ }
}
