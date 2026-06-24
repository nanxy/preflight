# preflight

Plan & prioritize tasks without burning energy on planning. First app of three (preflight → during → after).

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Test on mobile (same WiFi)

```bash
npm run dev -- --host
```

Vite prints a `http://192.168.x.x:5173` URL. Open that on your phone.

## Run the priority formula tests

```bash
npm test
```

## Structure

```
src/
  components/
    TaskCard.jsx           category-themed card with all priority components visible
    TodayZone.jsx          top zone, drop target for committed tasks
    QueueSection.jsx       bottom zone, source for available tasks; doubles as drop target for drag-out
    CategoryGroup.jsx      wrapper used when sort = category
    SortChips.jsx          visible chip row, replaces the old dropdown
    PriorityScore.jsx      number + segmented breakdown bar
    ScoreInputs.jsx        always-visible row of enjoy/friction/time/due/flow/routine
    CategoryChip.jsx       category pill
    CompletedAccordion.jsx muted, list-style record of finished tasks
    TaskEntry.jsx          floating + button + bucket picker + new-task form
    TaskForm.jsx           shared form (used by entry + edit modal)
    EditModal.jsx          edit-in-place + archive/delete with confirm
    ConfirmModal.jsx       reusable confirmation dialog
    Modal.jsx              backdrop + container

  lib/
    priority.js            score formula + breakdown + saturation/color helpers
    storage.js             localStorage wrapper for tasks, categories, prefs, queue
    sort.js                sort every scoring input; groupByCategory for the buckets view
    week.js                week-bounds helpers (for weekly quota feature, Fri)

  data/
    defaults.js            6 default categories, time buckets, color stops
```

## Progress

- ✅ Steps 1–3 — decisions, data model, wireframes
- ✅ Tue scaffold — Vite/React/Tailwind, priority formula (7 tests passing), storage, sort
- ✅ Wed build — playlist layout, score breakdown, hover/tap affordances, entry, sort chips, completed accordion
- ⏳ Thu — in-progress section + elapsed time, mobile radial fan, more polish
- ⏳ Fri — weekly quota, archived view, edge states
- ⏳ Sat–Sun — polish weekend (animations, micro-interactions, deploy)

See `context.md` (kept separately) for the full plan and decision history.
