// data/defaults.js

export const DEFAULT_CATEGORIES = [
  { id: 'cat_career',    label: 'career',    color: 'blue',  isArchived: false, isDefault: true, sortOrder: 0 },
  { id: 'cat_joy',       label: 'joy',       color: 'pink',  isArchived: false, isDefault: true, sortOrder: 1 },
  { id: 'cat_social',    label: 'social',    color: 'coral', isArchived: false, isDefault: true, sortOrder: 2 },
  { id: 'cat_chores',    label: 'chores',    color: 'amber', isArchived: false, isDefault: true, sortOrder: 3 },
  { id: 'cat_health',    label: 'health',    color: 'green', isArchived: false, isDefault: true, sortOrder: 4 },
  { id: 'cat_self_care', label: 'self-care', color: 'teal',  isArchived: false, isDefault: true, sortOrder: 5 },
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

// Card vertical padding scales with task length. Longer task = visually heavier.
export const CARD_PADDING_BY_SCALE = ['py-2.5', 'py-3.5', 'py-5', 'py-7'];

// Slider symbol bounds for enjoyment & friction. Middle = neutral, no symbol.
export const SLIDER_SYMBOLS = {
  enjoyment: { low: '😩', high: '🤩', lowLabel: 'dread', highLabel: 'love' },
  friction:  { low: '🪶', high: '🧱', lowLabel: 'easy',  highLabel: 'hard' },
};

// Color palette available to user-created categories.
export const AVAILABLE_COLORS = ['blue', 'pink', 'coral', 'amber', 'green', 'teal', 'purple', 'gray'];

export const CATEGORY_COLOR_STOPS = {
  blue:   { 50: '#EAF3FC', 100: '#B5D4F4', 400: '#3E84CC', 600: '#185FA5', 800: '#0C447C' },
  pink:   { 50: '#FBEEF3', 100: '#F4C0D1', 400: '#D86B8E', 600: '#993556', 800: '#72243E' },
  coral:  { 50: '#FBEFE8', 100: '#F5C4B3', 400: '#DD7656', 600: '#993C1D', 800: '#712B13' },
  amber:  { 50: '#FDF3DD', 100: '#FAC775', 400: '#CD8D1F', 600: '#854F0B', 800: '#633806' },
  green:  { 50: '#F0F7E3', 100: '#C0DD97', 400: '#6FA533', 600: '#3B6D11', 800: '#27500A' },
  teal:   { 50: '#E3F6EE', 100: '#9FE1CB', 400: '#3DA889', 600: '#0F6E56', 800: '#085041' },
  purple: { 50: '#EEEDFE', 100: '#CECBF6', 400: '#7F77DD', 600: '#534AB7', 800: '#3C3489' },
  gray:   { 50: '#F0EFEB', 100: '#D3D1C7', 400: '#8A8884', 600: '#5F5E5A', 800: '#444441' },
};
