// lib/priority.js
// Priority score, EXP, and due framing.
// Routine modifier disabled per Jun 25 (schema field kept for future use).

const TIME_BOOST = { lt15: 15, '15_45': 10, '45_2h': 5, '2hplus': 0 };
const TIME_XP    = { lt15: 10, '15_45': 25, '45_2h': 50, '2hplus': 100 };

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
 * Breakdown of all priority components. Optional `category` adds the
 * category-level priorityBonus (e.g. career = +5) when supplied.
 */
export function priorityBreakdown(task, now = new Date(), category = null) {
  const enjoyment = task.enjoyment ?? 3;
  const friction  = task.friction  ?? 3;
  const startability = (enjoyment * 4) + ((6 - friction) * 4);
  const timeBoost    = TIME_BOOST[task.timeBucket] ?? 0;
  const urgency      = urgencyScore(task.dueDate, now);
  // routine modifier disabled. const routineAdj = task.isRoutine ? -5 : 0;
  const routineAdj   = 0;
  const categoryBonus = category?.priorityBonus ?? 0;
  const total = Math.max(0, Math.min(100, Math.round(
    startability + timeBoost + urgency + routineAdj + categoryBonus
  )));
  return { startability, timeBoost, urgency, routineAdj, categoryBonus, total };
}

export function priorityScore(task, now = new Date(), category = null) {
  return priorityBreakdown(task, now, category).total;
}

export function exp(task) {
  const friction = task.friction ?? 3;
  const timeXP   = TIME_XP[task.timeBucket] ?? 0;
  return Math.max(5, friction * 8 + timeXP);
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
      lo = stops[i]; hi = stops[i + 1]; break;
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

export function dueFraming(dueDate, now = new Date()) {
  if (!dueDate) return { bucket: null, exact: null, urgency: 'none' };
  const d = daysUntil(dueDate, now);
  let bucket, urgency;
  if (d < 0)        { bucket = 'overdue';    urgency = 'high';   }
  else if (d === 0) { bucket = 'today';      urgency = 'high';   }
  else if (d === 1) { bucket = 'tomorrow';   urgency = 'high';   }
  else if (d <= 6)  { bucket = 'this week';  urgency = 'medium'; }
  else if (d <= 13) { bucket = 'next week';  urgency = 'low';    }
  else if (d <= 30) { bucket = 'this month'; urgency = 'low';    }
  else              { bucket = 'later';      urgency = 'none';   }

  let exact;
  if (d < 0)        exact = `${Math.abs(d)} d overdue`;
  else if (d <= 14) exact = `${d} d`;
  else              exact = new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return { bucket, exact, urgency };
}
