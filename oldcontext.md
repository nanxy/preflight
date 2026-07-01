# preflight — Project Context

## Project Brief (from user)

Read and organize the entire entry before proceeding with any task. We plan the process and after each step update this context.md so critical information is retained. The user gives all initial thoughts up front; the AI organizes them and refers back when pertinent to the current step. Each piece of information, proposed design, or function is noted and its value assessed for inclusion in the plan. Inquiries or clarifications from the user mid-step should be addressed as asides. The top of context.md holds **axioms** extrapolated from this brief — rules the AI always abides by, updated as needed. Below the axioms sit the **plans**, updated at every step. The AI asks clarifying questions only for the current step. The framing is a small dream team (senior PM, full-stack engineer, product designer, behavioral consultant, visual designer) collaborating with the user.

---

## Axioms (always abide)

1. **Update this file after every step.** Plan section is living; axioms grow as we learn.
2. **One step at a time.** Don't sprint ahead. Ask clarifying questions for the current step only.
3. **Asides are asides.** Answer briefly, return to the step.
4. **Dream team framing.** Surface insights from the relevant role when a decision warrants it.
5. **Pauline is the north star.** Every feature judged against: does it reduce planning paralysis, make starting easier, reinforce completion, or remove friction?
6. **Minimal text entry. Tap and drag.** Title + category required; everything else has neutral defaults.
7. **Smooth, enjoyable UI.** Polish is not optional — portfolio piece.
8. **Responsive web app.** No Swift, no native detours.
9. **Deployable standalone, scalable to the other two apps (During, After).** Data model must forward-compat.
10. **Local-first hosting for proof of concept.** Snapshots for portfolio.
11. **Document the AI-assisted workflow.** Process is portfolio material.
12. **Schedule realism.** ~45 min/day. Timeline updates dynamically.
13. **Communication style: direct, concise.** No filler. Visual diagrams welcome.
14. **Decisions log uses timestamps.**
15. **Categories user-editable.** 6 defaults ship; users can add/rename/recolor/archive. Tags placeholder reserved.
16. **Workflow: Filesystem MCP + VS Code + git.** Claude writes to disk directly. User commits manually after each session. Mobile test via `npm run dev -- --host`. Project at `/Users/nanx/test/preflight/`.
17. **Bracket convention.** When the user wraps an item in `[...]`, it's a deferred idea — log it under "Deferred / parking lot," don't implement this session.
18. **External design tools not available in this workflow.** No claude_design MCP, no Figma access. Working from text descriptions when user references external mockups.
19. **No em dash in writing or code comments.** Use a colon, comma, hyphen, period, or restructure. Per Jun 25 user preference.
20. **Do not change copy, wording, icons, emojis, layouts, or other visual choices unless the user explicitly requests it.** If the user mentions they manually reverted something, do not touch that file area again. Edits should be as surgical as possible.
21. **Do not spend tool calls auditing the user's manual changes.** When they say they reverted X, trust it and steer clear. The user is the source of truth on their files.

---

## The User: Pauline (north star)

30 y/o, extreme executive dysfunction. Wakes daily forgetting what she was working on; planning paralysis; doesn't feel rewarded after completing tasks. No support system. Needs the app to _decide for her_ and reinforce completion.

## The Three App Concepts

- **BEFORE → preflight** (current): plan + prioritize.
- **DURING** (later): timer + check-ins + brain dump + post-task review.
- **AFTER** (later): completion XP → gacha-style rewards.

The Task schema already carries forward-compat fields (`sessions: []`, `pointsAwarded: null`, `percentComplete: null`). EXP is computed on display from `friction + timeBucket - routine` so no schema change needed when After ships.

---

## Locked Decisions

### Data model

- **Task**: `{id, title, categoryId, enjoyment 1-5, friction 1-5, timeBucket, dueDate, flow 0|1|2, isRoutine, status, createdAt, startedAt, completedAt, tags[], sessions[], pointsAwarded, percentComplete}`
- **Category**: `{id, label, color, isArchived, isDefault, sortOrder}` — 6 defaults: career / joy / social / chores / health / self-care. Joy = broad recharge umbrella.
- **Preferences**: `{plusButtonCorner, weeklyTargets, lastSort, todayQueue[]}`
- **Theme**: stored separately at `preflight.theme.v1` (system | light | dark)

### Priority formula (0–100)

- startability = `(enjoyment × 4) + ((6 - friction) × 4)` → 8–40
- timeBoost: lt15=15, 15_45=10, 45_2h=5, 2h+=0
- urgency: none=0, >14d=5, 8–14d=15, 3–7d=25, 1–2d=35, today/overdue=45
- routine: -5 if true
- Sum, clamp 0–100. Biases toward what Pauline will _start_, not pure urgency.

### EXP formula (forward-compat for After)

`exp = (friction × 8) + timeXP - (10 if routine)`
where timeXP: lt15=10, 15_45=25, 45_2h=50, 2h+=100. Range ~8–140. Displayed as `+N xp` pill.

### Layout (current state, Thu noon)

- Slim sticky header: date on left, settings icon on right. **No app title** — saves real estate.
- **Today zone**: drop target, numbered playlist of committed tasks. First card emphasized + Start button. Sortable within via dnd-kit.
- **Sort chips row** (every scoring input toggleable; persists in prefs.lastSort).
- **Queue section** headed "Up next — sorted for you" (Mixtape framing). When sort=category, renders as grouped buckets.
- **Completed accordion**: droppable. Tasks inside are desaturated; can be dragged out / restored.
- **Archived accordion**: droppable, requires confirm modal.
- Floating `+` button in user-chosen corner.

### Card design (Thu noon)

- **Priority score BLOCK on the left** of each card, full card height. Big number + breakdown bar + "priority" label. Highlights when sort=priority.
- **Right side**: task title (Fraunces, serif) + chip pill row.
- **Chip pills**: category (themed), time, due (ADHD-friendly framing: today/tomorrow/this week/etc, exact day count on hover), enjoyment (with symbol when extreme), friction (with symbol), flow arrow (if >0), routine icon (if true), **+N xp** pill.
- **Active sort chip highlighted** on every card → user can compare that field across tasks.
- Card height scales with time bucket; score block scales accordingly.
- Hover/tap expands card to reveal action row (queue / start / done / edit / archive / restore).

### Interaction

- **Drag** with @dnd-kit/core. PointerSensor, 180ms long-press activation. Tap = expand, long-press + drag = move card.
- Drop targets: Today, Queue, Completed, Archived. Drag between any of them.
- Restore from Completed/Archived: drop on Queue (becomes active) or Today (becomes committed).
- Archive route goes through confirm modal. Delete is destructive + red, also confirmed.
- Haptics on pickup/drop/success (Android only; iOS Safari can't access Taptic Engine).
- Confetti burst on complete (category-colored).

### Visual / typography

- **Fraunces** for headings (Calm Garden direction). **Inter** for body.
- Priority score saturation-mapped on the purple ramp.
- Category-themed cards: soft tinted background + accent border-left + colored title ink.
- Light/dark theme toggle via Settings (overrides OS pref so it doesn't auto-flicker).

### Libraries currently in use

- @dnd-kit/core, /sortable, /utilities — touch+mouse drag-and-drop
- framer-motion — bubble slider, animations
- canvas-confetti — celebration

---

## Deferred / parking lot

These were proposed mid-session and parked for later (either by user bracket convention or by team triage).

**[bracketed by user — needs explicit unbracket to engage]**

- Stale-chore detection: "you haven't done [chore] in a while, did you?" opt-in setting. Could surface on app open as a soft suggestion. Storage already tracks completedAt per task.
- Sliders animate between notches with motion (per Jun 25 bracket).
- iOS Swift port: would not be trivial. SwiftUI is its own paradigm; you'd rebuild every screen, gesture, and state model. Alternative paths that preserve the React code: Capacitor (wrap as iOS app), Expo + react-native-web (share logic), or a PWA installed to home screen. PWA is the cheapest 80%.

**Structural redesigns (queued, not bracketed — next sessions):**

- **Today carousel.** Replace stacked numbered list with swipe carousel; #1 in focus, next ones peek. Library candidates: Embla Carousel (recommended — lightweight, touch-first), Keen-slider, framer-motion's drag. Includes optional toggle to 3-column minimized view (per Sticky Stack direction).
- **Multi-page navigation.** Swipe horizontally between Archive ⇄ Home ⇄ TBD-third-page. State-based, no router needed. Use framer-motion drag gestures.
- **Subtask "mitosis"** for 45m+ tasks: button on card to break into smaller subtasks that inherit category. Schema: optional `parentId` on Task.
- **Routine task auto-populate menu** / self-care suggestions modal. Pre-baked lists user can tap to seed.
- **Section accordions** for queue/completed/archived (scrobble-style minimize/maximize).
- **Three-column minimized view** for queue items (per Sticky Stack), swipe up = add to Today, swipe back = return to queue.

**Polish-weekend pile:**

- @formkit/auto-animate for sort-change list reorder animation (one-line drop-in)
- floating-ui for proper tooltip positioning on score breakdown
- View toggle in header (carousel vs list)
- Animated gradient background on Today when it has tasks
- Lottie celebration when Today empties
- radix-ui primitives for Modal/Dropdown accessibility
- @property gradient animation on priority score
- Deploy preview (Vercel/Netlify)

---

## Daily Timeline

| Date          | Session           | Work                                                                                                                                                                              | Status       |
| ------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Mon Jun 22    | 1.5 hr            | Steps 0–3 + Tue scaffold                                                                                                                                                          | ✅           |
| Tue Jun 23    | morning + evening | Wed scope: playlist concept, score breakdown, hover/tap, sort, completed                                                                                                          | ✅           |
| Tue Jun 23    | afternoon         | Big redesign: rename to preflight via FS MCP, themed cards, sort chips, edit modal, drag-out, grouping                                                                            | ✅           |
| Wed Jun 24    | evening           | Tier-1 push: dnd-kit, settings panel, theme toggle, archived view, form contrast pass 1, slider symbols, bubble slider, confetti, drag-to-complete/archive                        | ✅           |
| Thu Jun 25    | noon              | Cleanup + structure: title removed, Fraunces font, new card layout (score block + chip pills), EXP pill, ADHD-friendly due framing, active-sort chip highlight, "Up next" framing | ✅           |
| Thu Jun 25    | pm?               | Today carousel (Embla) + multi-page swipe nav                                                                                                                                     | Next session |
| Fri Jun 26    | 45 min            | Buffer / 3-column minimized view, section accordions                                                                                                                              | —            |
| Sat Jun 27    | Polish            | Animations, micro-interactions, gradient bg, auto-animate                                                                                                                         | —            |
| Sun Jun 28    | Polish            | Portfolio snapshots, write-up, deploy preview                                                                                                                                     | —            |
| Mon Jun 29 AM | Delivery          | Final build + README + docs                                                                                                                                                       | —            |

**Status: roughly on track. The polish weekend has plenty of structural work pre-loaded (carousel, multi-page, subtasks), so "polish" may stretch into Sat/Sun by necessity.**

---

## Decisions Log

- **Jun 22, 5:30 PM:** Project kicked off. Axioms drafted. Recommended Before app.
- **Jun 22, 6:00 PM:** Before confirmed. Scoring inputs locked. Stack = React/Vite/Tailwind/localStorage.
- **Jun 22, 6:30 PM:** Schema + formula locked. Flow as separate marker not in score. ~1 day ahead.
- **Jun 22, 6:43 PM:** Saturation rule. All inputs sortable. Hover-to-bucket. Timestamp format adopted.
- **Jun 22, 7:00 PM:** Wireframes drafted. Title + category required only.
- **Jun 22, 7:30 PM:** Touch-and-drag gesture for `+`. 4-state status. Completed accordion specced.
- **Jun 22, 8:00 PM:** Gesture split by platform. `+` repositionable. Tap-to-edit. Weekly quota. Joy category. Tags placeholder.
- **Jun 22, 8:30 PM:** Tuesday scaffold built early. Tests passing. ~2 days ahead.
- **Jun 23, 10:30 AM:** Wednesday push — playlist concept, always-visible breakdown bar, sort dropdown.
- **Jun 23, 12:00 PM:** Filesystem MCP workflow shift. Claude Code excluded.
- **Jun 23, 12:45 PM:** Renamed to `preflight`. Themed cards. All components visible. Sort chips. EditModal + confirm. Today/Queue. Grouping. Animations deferred.
- **Jun 23, evening (Wed scope, shipped late Tue):** dnd-kit touch drag. Settings panel + theme toggle. Category editor. Archived view. Form contrast pass 1. Sliders with symbols. Bubble slider. Confetti. Drag-to-complete/archive zones. Card desaturation when inactive.
- **Jun 25, 12:30 PM (Thu):** Bracket convention adopted (`[...]` = deferred). claude_design MCP unavailable in this workflow; working from text. Team verdict on "one at a time vs visible variety" routed to carousel synthesis (Mixtape x Sticky Stack x Quest); block layout deprioritized. Shipped: no title in header (date + settings only), Fraunces font, new card layout (priority block left + title + chip pill row right), EXP pill (forward-compat for After), ADHD-friendly due framing (today/tomorrow/this week/etc), active-sort chip highlighted on every card for comparison, "Up next, sorted for you" header. Parked for next session: Today carousel (Embla), multi-page swipe nav, subtask mitosis, routine-task auto-populate, 3-column minimized view, section accordions.
- **Jun 25, ~4:00 PM (Thu, hit usage limit):** Quick-cleanup pass + theme bug fix. Em dash banned via axiom 19. Routine UI commented out (schema kept). "optional" form section renamed to "due date" and split into its own row (flow gets own section). Career +5 category bonus implemented via `priorityBonus` field on category (other defaults = 0). Dotted box around Today removed, replaced with soft gradient + empty-state prompt card. Theme bug root-caused and fixed: Tailwind `dark:` was reading OS media query, not our `data-theme` attribute. Updated `darkMode: ['selector', '[data-theme="dark"]']` in tailwind.config.js, and theme.js now always sets `data-theme` to a concrete light/dark value (resolving "system" from `prefers-color-scheme` at apply time + listening for OS changes). Cards, modals, settings panel now all switch theme consistently. Routine modifier removed from priority formula. Tests updated. Carousel + multi-page nav + glass cards still queued for next session.
