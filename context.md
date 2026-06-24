# preflight — Project Context

## Project Brief (from user)

Read and organize the entire entry before proceeding with any task. We plan the process and after each step update this context.md so critical information is retained for how to proceed. The user gives all initial thoughts up front; the AI organizes them and refers back when pertinent to the current step. Each piece of information, proposed design, or function is noted and its value assessed for inclusion in the plan. Inquiries or clarifications from the user mid-step should be addressed as asides without derailing the current step. The top of context.md holds **axioms** extrapolated from this brief — rules the AI always abides by, updated as needed. Below the axioms sit the **plans**, updated at every step. The AI asks clarifying questions only for the current step. The framing is a small dream team (senior PM, full-stack engineer, product designer, behavioral consultant with therapy/psychology background, visual designer, plus other roles as needed) collaborating with the user in a week-long hackathon that delivers a polished, enjoyable app. Tentative final delivery: **morning of June 29**, leaving **3 days for polish**.

---

## Axioms (always abide)

1. **Update this file after every step.** Plan section is living; axioms grow as we learn.
2. **One step at a time.** Don't sprint ahead. Ask clarifying questions for the *current* step only.
3. **Asides are asides.** When user drops an inquiry mid-step, answer briefly and return to the step.
4. **Dream team framing.** Surface insights from the relevant role (PM, engineer, designer, behavioral consultant, visual designer) when a decision warrants it. Don't perform every role on every reply — invoke the ones that matter.
5. **Pauline is the north star.** Every feature judged against: does it reduce planning paralysis, make starting easier, reinforce completion, or remove friction? If not, cut it.
6. **Minimal text entry. Tap and drag.** Task creation and interaction must feel effortless. Typing is the enemy.
7. **Smooth, enjoyable UI.** Polish is not optional — this is also a portfolio piece.
8. **Responsive web app.** No Swift, no Apple Watch native, no platform-specific detours.
9. **Deployable standalone, scalable to the other two apps.** Whatever we build must have a data model and architecture that the Before/During/After siblings can plug into later.
10. **Local-first hosting for the proof of concept.** Snapshots taken throughout for portfolio documentation.
11. **Document the AI-assisted workflow.** This is portfolio material for UX dev/design — process matters as much as product.
12. **Schedule realism.** User has ~45 min/day Mon–Fri. Timeline updates dynamically; missed sessions get redistributed, not abandoned.
13. **Communication style: direct, concise.** No over-explaining, no AI-sounding filler. Visual diagrams welcome. File-and-line-number edits over full rewrites when iterating on code.
14. **Decisions log uses timestamps.** Each entry stamped with date + time (e.g., "Jun 22, 6:43 PM").
15. **Categories are user-editable.** The 6 defaults ship out of the box, but the data model treats categories as user-managed entities (addable, editable, archivable). Same for tags (schema reserved, UI later).
16. **Workflow: Filesystem MCP + VS Code + git on user's Mac.** Claude writes files directly to the user's project directory via the Filesystem MCP server (no tar archives). User edits/reviews in VS Code. User runs git commits manually after each session to capture history. Mobile testing via `npm run dev -- --host` on local network. Claude Code (CLI) is **not** part of this workflow — redundant given chat + FS MCP. Project lives at `/Users/nanx/test/preflight/`.

---

## The User: Pauline

- 30 y/o woman, extreme executive dysfunction, weak childhood foundation for habit-building.
- Wakes daily/weekly forgetting what she was working on; spends redundant time re-planning.
- No strong financial pressure but wants to start a small business and contribute to household.
- Planning paralysis — too many things she wants/needs to do, can't start any.
- Doesn't feel rewarded or remember completing tasks → no positive reinforcement loop.
- No external support system → app must be the offload destination *and* the decision-maker.
- Needs: smooth UI, minimal text, tap-and-drag, task creation that's "second-nature and enjoyable."

## The Three App Concepts

**BEFORE — Plan & Prioritize** (currently building, named **preflight**)
Pauline submits all tasks. App computes a priority score from enjoyment/friction, due date, time, flow, routine. Goal: open app, do the top task. No mental prioritization.

**DURING — Track & Review** (later)
Timer + check-ins + brain dump + post-task review + day visualized.

**AFTER — Reward (Gacha)** (later)
Completed tasks → points → gacha pulls for collectibles.

---

## Locked Decisions (current state)

### Data model
**Task** ({id, title, categoryId, enjoyment 1–5, friction 1–5, timeBucket, dueDate, flow 0|1|2, isRoutine, status, createdAt, startedAt, completedAt, tags[], sessions[], pointsAwarded, percentComplete})
**Category** ({id, label, color, isArchived, isDefault, sortOrder})
**Preferences** ({plusButtonCorner, weeklyTargets, lastSort, todayQueue[]})

6 default categories: career, joy, social, chores, health, self-care. Joy is the broad umbrella for hobbies/games/movies/etc.

Time buckets: `<15 min` | `15–45 min` | `45m–2h` | `2h+`

### Priority formula (0–100)
- `startability` = `(enjoyment × 4) + ((6 - friction) × 4)` → 8–40
- `timeBoost`: <15min=15, 15–45min=10, 45m–2h=5, 2h+=0
- `urgency`: no due=0, >14d=5, 8–14d=15, 3–7d=25, 1–2d=35, today/overdue=45
- `routineAdjust`: -5 if `isRoutine`
- Sum, clamp 0–100, round.

Biases toward what Pauline will *actually start*, not pure urgency. Flow indicator shown next to score as `>` or `>>` rather than baked in.

### Layout (as of Wednesday)
- Header: `preflight` + date
- **Today** zone: drop target, numbered playlist of committed tasks. First card emphasized + Start button.
- **Sort chips** row (every scoring input + category sortable, persists in prefs)
- **Queue** zone (was "backlog"): everything not yet committed. Doubles as drop target for dragging cards out of Today.
- When sort = category: Queue renders as grouped buckets (CategoryGroup), each with category-tinted background.
- **Completed accordion**: muted, list-style, grouped by date, strikethrough.
- **Floating `+`** in chosen corner. Hover (desktop) or tap (mobile) reveals time-bucket stack. Pick a bucket → form modal.

### Card visuals
Each card themed by category color: soft tinted background, accent border-left, title in category's deep stop. Always-visible row shows every priority component (enjoy/friction/time/due/flow/routine). Score number is purple-saturation-mapped; segmented breakdown bar under it.

### Interaction rules
- Hover/tap on any card → expands to reveal action buttons (themed in category color)
- In Queue: actions = `+ today / done / edit / archive`
- In Today: actions = `start (first only) / remove / done / edit / archive`
- Tap card → opens EditModal (reuses TaskForm)
- Archive + Delete require ConfirmModal confirmation. Delete is destructive (red).
- Drag a Queue card up onto Today = enqueue. Drag a Today card down onto Queue = dequeue. Mirror gesture, no ✕ button.

---

## Daily Timeline

| Date | Session | Work | Status |
|---|---|---|---|
| Mon Jun 22 | 1.5 hr | Steps 0–3 + Tue scaffold | ✅ Done |
| Tue Jun 23 (eve) | early | Wed scope: playlist, score breakdown, hover/tap, entry, sort, completed | ✅ Done |
| Tue Jun 23 (afternoon) | 45+ min | Wed redesign push: rename to `preflight`, themed cards, all components visible, sort chips, edit modal + confirm, drag-out, category grouping | ✅ Done |
| Wed Jun 24 | 45 min | In-progress section + elapsed time, mobile radial fan, long-press reposition `+` | — |
| Thu Jun 25 | 45 min | Weekly quota strip + archived view | — |
| Fri Jun 26 | 45 min | Buffer / edge cases / empty states | — |
| Sat Jun 27 | Polish | Animations (sort transitions, queue reorder), micro-interactions | — |
| Sun Jun 28 | Polish | Portfolio snapshots, write-up, deploy preview | — |
| Mon Jun 29 AM | Delivery | Final build + README + docs | — |

**Status: ~2.5 days ahead of original schedule.**

---

## Decisions Log

- **Jun 22, ~5:30 PM:** Project kicked off. Axioms drafted. Recommended Before app.
- **Jun 22, ~6:00 PM:** User confirmed Before. Scoring inputs locked. Stack = React/Vite/Tailwind/localStorage.
- **Jun 22, ~6:30 PM:** Step 2 schema + formula locked. Flow as separate marker, not in score. Project ~1 day ahead.
- **Jun 22, 6:43 PM:** Saturation rule added (score color = priority). All inputs sortable. Hover-to-bucket interaction. Timestamp format adopted.
- **Jun 22, ~7:00 PM:** Wireframes drafted (input flow + list view). Title + category as the only required fields.
- **Jun 22, ~7:30 PM:** Touch-and-drag gesture for `+`. 4-state status field. Completed accordion specced.
- **Jun 22, ~8:00 PM:** Gesture split: desktop hover+click, mobile radial. `+` repositionable. Tap-to-edit. Weekly quota added. `joy` category for hobbies. Tags placeholder reserved.
- **Jun 22, ~8:30 PM:** Tuesday scaffold built early. Data layer + formula + 7 passing tests. Project ~2 days ahead.
- **Jun 23, ~10:30 AM:** Wednesday push: **playlist concept** as core layout. Always-visible score breakdown bar. Universal hover/tap affordances. Entry flow. SortMenu dropdown. CompletedAccordion. ~2.5 days ahead.
- **Jun 23, ~12:00 PM:** **Workflow shift** — Filesystem MCP installed; moving off tar archives. Claude Code excluded as redundant.
- **Jun 23, ~12:45 PM:** **Project renamed to `preflight`**, location `/Users/nanx/test/preflight/`. Major redesign shipped via FS MCP:
  - Today / Queue rename (was Today's queue / Backlog). Drag in and drag out (mirror gesture, ✕ removed).
  - Cards themed by category color (tinted bg + accent border + colored ink).
  - All priority components visible on every card (ScoreInputs).
  - Sort as visible chip row (SortChips), persisted in `prefs.lastSort`.
  - Category sort triggers grouped buckets view (CategoryGroup).
  - Completed accordion redesigned: list-style, muted, strikethrough — clearly differentiated from active cards.
  - EditModal wired (reuses TaskForm). Archive + delete via ConfirmModal. Delete = red/destructive.
  - Action buttons restyled per source. Animations deferred to polish weekend.
  - **Still pending:** weekly quota, in-progress section + elapsed time, archived view, mobile radial fan, long-press reposition `+`. Project ~2.5 days ahead.
