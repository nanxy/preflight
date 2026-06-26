// data/defaults.js

export const DEFAULT_CATEGORIES = [
  { id: 'cat_career',    label: 'career',    color: 'blue',  isArchived: false, isDefault: true, sortOrder: 0, priorityBonus: 5 },
  { id: 'cat_joy',       label: 'joy',       color: 'pink',  isArchived: false, isDefault: true, sortOrder: 1, priorityBonus: 0 },
  { id: 'cat_social',    label: 'social',    color: 'coral', isArchived: false, isDefault: true, sortOrder: 2, priorityBonus: 0 },
  { id: 'cat_chores',    label: 'chores',    color: 'amber', isArchived: false, isDefault: true, sortOrder: 3, priorityBonus: 0 },
  { id: 'cat_health',    label: 'health',    color: 'green', isArchived: false, isDefault: true, sortOrder: 4, priorityBonus: 0 },
  { id: 'cat_self_care', label: 'self-care', color: 'teal',  isArchived: false, isDefault: true, sortOrder: 5, priorityBonus: 0 },
];

export const DEFAULT_PREFERENCES = {
  plusButtonCorner: 'bottom-right',
  weeklyTargets: {},
  lastSort: { field: 'priority', direction: 'desc' },
  todayQueue: [],
};

export const TIME_BUCKETS = [
  { id: 'lt15',   label: '< 15 min',    short: '<15m',   minutes: 15,  cardScale: 0 },
  { id: '15_45',  label: '15 – 45 min', short: '15–45m', minutes: 30,  cardScale: 1 },
  { id: '45_2h',  label: '45m – 2h',    short: '45m–2h', minutes: 75,  cardScale: 2 },
  { id: '2hplus', label: '2h+',         short: '2h+',    minutes: 150, cardScale: 3 },
];

export const CARD_PADDING_BY_SCALE = ['py-2.5', 'py-3.5', 'py-5', 'py-7'];

export const SLIDER_SYMBOLS = {
  enjoyment: { low: '😩', high: '🤩', lowLabel: 'dread', highLabel: 'love' },
  friction:  { low: '🌱', high: '🏔️', lowLabel: 'easy',  highLabel: 'hard' },
};

export const AVAILABLE_COLORS = ['blue', 'pink', 'coral', 'amber', 'green', 'teal', 'purple', 'gray'];

// CSS-variable references for category colors. Components that style themed
// elements via inline styles use these and get automatic dark-mode swapping
// because the actual color values live in src/styles/colors.css.
export const CATEGORY_COLOR_STOPS = {
  blue:   { 50: 'var(--cat-blue-bg)',   100: 'var(--cat-blue-tint)',   400: 'var(--cat-blue-accent)',   600: 'var(--cat-blue-solid)',   800: 'var(--cat-blue-ink)' },
  pink:   { 50: 'var(--cat-pink-bg)',   100: 'var(--cat-pink-tint)',   400: 'var(--cat-pink-accent)',   600: 'var(--cat-pink-solid)',   800: 'var(--cat-pink-ink)' },
  coral:  { 50: 'var(--cat-coral-bg)',  100: 'var(--cat-coral-tint)',  400: 'var(--cat-coral-accent)',  600: 'var(--cat-coral-solid)',  800: 'var(--cat-coral-ink)' },
  amber:  { 50: 'var(--cat-amber-bg)',  100: 'var(--cat-amber-tint)',  400: 'var(--cat-amber-accent)',  600: 'var(--cat-amber-solid)',  800: 'var(--cat-amber-ink)' },
  green:  { 50: 'var(--cat-green-bg)',  100: 'var(--cat-green-tint)',  400: 'var(--cat-green-accent)',  600: 'var(--cat-green-solid)',  800: 'var(--cat-green-ink)' },
  teal:   { 50: 'var(--cat-teal-bg)',   100: 'var(--cat-teal-tint)',   400: 'var(--cat-teal-accent)',   600: 'var(--cat-teal-solid)',   800: 'var(--cat-teal-ink)' },
  purple: { 50: 'var(--cat-purple-bg)', 100: 'var(--cat-purple-tint)', 400: 'var(--cat-purple-accent)', 600: 'var(--cat-purple-solid)', 800: 'var(--cat-purple-ink)' },
  gray:   { 50: 'var(--cat-gray-bg)',   100: 'var(--cat-gray-tint)',   400: 'var(--cat-gray-accent)',   600: 'var(--cat-gray-solid)',   800: 'var(--cat-gray-ink)' },
};

// Hex values mirrored from colors.css. Used only by places that need a literal
// hex (color picker swatches, canvas/SVG). Keep these in sync with colors.css.
export const CATEGORY_HEX = {
  blue:   { 50: '#EAF3FC', 100: '#B5D4F4', 400: '#3E84CC', 600: '#185FA5', 800: '#0C447C' },
  pink:   { 50: '#FBEEF3', 100: '#F4C0D1', 400: '#D86B8E', 600: '#993556', 800: '#72243E' },
  coral:  { 50: '#FBEFE8', 100: '#F5C4B3', 400: '#DD7656', 600: '#993C1D', 800: '#712B13' },
  amber:  { 50: '#FDF3DD', 100: '#FAC775', 400: '#CD8D1F', 600: '#854F0B', 800: '#633806' },
  green:  { 50: '#F0F7E3', 100: '#C0DD97', 400: '#6FA533', 600: '#3B6D11', 800: '#27500A' },
  teal:   { 50: '#E3F6EE', 100: '#9FE1CB', 400: '#3DA889', 600: '#0F6E56', 800: '#085041' },
  purple: { 50: '#EEEDFE', 100: '#CECBF6', 400: '#7F77DD', 600: '#534AB7', 800: '#3C3489' },
  gray:   { 50: '#F0EFEB', 100: '#D3D1C7', 400: '#8A8884', 600: '#5F5E5A', 800: '#444441' },
};

