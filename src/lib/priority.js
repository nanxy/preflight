// lib/priority.js
// Priority score formula + visual helpers. Bias: what Pauline will actually
// START, not what is objectively most urgent.

const TIME_BOOST = {
  lt15:    15,
  '15_45': 10,
  '45_2h': 5,
  '2hplus': 0,
};

export function daysUntil(dueDate, now = new Date()) {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  const dueMid = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const nowMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((dueMid - nowMid) / 86_400_000);
}

function urgencyScore(dueDate, now) {
  const d = daysUntil(dueDate, now);
  if (d === null) return 0;
  if (d <= 0)  return 45;
  if (d <= 2)  return 35;
  if (d <= 7)  return 25;
  if (d <= 14) return 15;
  return 5;
}

/**
 * Returns the raw components that make up the score. The UI uses this for
 * the always-visible segmented breakdown and the per-component readouts.
 */
export function priorityBreakdown(task, now = new Date()) {
  const enjoyment = task.enjoyment ?? 3;
  const friction  = task.friction  ?? 3;
  const startability = (enjoyment * 4) + ((6 - friction) * 4);
  const timeBoost    = TIME_BOOST[task.timeBucket] ?? 0;
  const urgency      = urgencyScore(task.dueDate, now);
  const routineAdj   = task.isRoutine ? -5 : 0;
  const total        = Math.max(0, Math.min(100, Math.round(
    startability + timeBoost + urgency + routineAdj
  )));
  return { startability, timeBoost, urgency, routineAdj, total };
}

export function priorityScore(task, now = new Date()) {
  return priorityBreakdown(task, now).total;
}

export function saturationFor(score) {
  const t = Math.max(0, Math.min(100, score)) / 100;
  return t * t;
}

export function priorityColor(score) {
  const stops = [
    { at: 0,   hex: '#CECBF6' },
    { at: 50,  hex: '#7F77DD' },
    { at: 80,  hex: '#534AB7' },
    { at: 100, hex: '#3C3489' },
  ];
  const s = Math.max(0, Math.min(100, score));
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (s >= stops[i].at && s <= stops[i + 1].at) {
      lo = stops[i];
      hi = stops[i + 1];
      break;
    }
  }
  const span = hi.at - lo.at || 1;
  const t = (s - lo.at) / span;
  return mixHex(lo.hex, hi.hex, t);
}

function mixHex(a, b, t) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ar = (pa >> 16) & 0xff, ag = (pa >> 8) & 0xff, ab = pa & 0xff;
  const br = (pb >> 16) & 0xff, bg = (pb >> 8) & 0xff, bb = pb & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return '#' + [r, g, bl].map(x => x.toString(16).padStart(2, '0')).join('');
}
