// lib/priority.test.js
// Run with: npm test  (or: node --test src/lib/priority.test.js)

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priorityScore, daysUntil } from './priority.js';

const FIXED_NOW = new Date('2026-06-22T12:00:00Z');

test('the walk beats taxes when taxes are 5 days out', () => {
  const walk  = { enjoyment: 4, friction: 3, timeBucket: '15_45', dueDate: null,         isRoutine: false };
  const taxes = { enjoyment: 1, friction: 5, timeBucket: '2hplus', dueDate: '2026-06-27', isRoutine: false };
  assert.equal(priorityScore(walk,  FIXED_NOW), 38);
  assert.equal(priorityScore(taxes, FIXED_NOW), 33);
});

test('taxes take over when 1-2 days out', () => {
  const taxes = { enjoyment: 1, friction: 5, timeBucket: '2hplus', dueDate: '2026-06-24', isRoutine: false };
  assert.equal(priorityScore(taxes, FIXED_NOW), 43);
});

test('overdue gets max urgency', () => {
  const overdue = { enjoyment: 3, friction: 3, timeBucket: '15_45', dueDate: '2026-06-20', isRoutine: false };
  assert.equal(priorityScore(overdue, FIXED_NOW), 79);
});

test('routine nudges down', () => {
  const t = { enjoyment: 3, friction: 3, timeBucket: 'lt15', dueDate: null, isRoutine: true };
  assert.equal(priorityScore(t, FIXED_NOW), 34);
});

test('defaults handle a barely-filled task', () => {
  const minimal = { timeBucket: '15_45' };
  assert.equal(priorityScore(minimal, FIXED_NOW), 34);
});

test('clamped to 0-100', () => {
  const max = { enjoyment: 5, friction: 1, timeBucket: 'lt15',  dueDate: '2026-06-01', isRoutine: false };
  assert.equal(priorityScore(max, FIXED_NOW), 100);
  const min = { enjoyment: 1, friction: 5, timeBucket: '2hplus', dueDate: null,         isRoutine: true };
  assert.equal(priorityScore(min, FIXED_NOW), 3);
});

test('daysUntil handles edge cases', () => {
  assert.equal(daysUntil(null), null);
  assert.equal(daysUntil('2026-06-22', FIXED_NOW), 0);
  assert.equal(daysUntil('2026-06-23', FIXED_NOW), 1);
  assert.equal(daysUntil('2026-06-20', FIXED_NOW), -2);
});
