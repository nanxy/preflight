# preflight — Project Context

## Axioms (always abide)

1. **Update this file after every step.** Section is living; axioms grow with learning.
2. **One step at a time.** Focus on the current step. Ask clarifying questions only for this step.
3. **Asides are asides.** Address briefly, return to the current step immediately.
4. **Dream team framing.** Senior PM, engineer, product/visual designer, and behavioral consultant.
5. **Pauline is the north star.** App must reduce planning paralysis, make starting easy, and remove friction.
6. **Minimal text entry. Tap and drag.** Title + category required; neutral defaults for the rest.
7. **Smooth, enjoyable UI.** High polish, portfolio-grade animations, and visual micro-interactions.
8. **Responsive web app.** Local-first hosting proof-of-concept. Mobile test via `npm run dev -- --host`.
9. **Forward-compat schema.** Ready for future apps (During, After). Sessions, points, and percent complete tracked.
10. **Document workflow.** Process is portfolio material. Working at `/Users/nanx/test/preflight/` via Filesystem MCP.
11. **Direct, concise communication.** No filler text. Visual layout diagrams welcome.
12. **Bracket convention.** Items wrapped in `[...]` are deferred ideas logged under "Deferred / parking lot".
13. **No em dashes anywhere.** Never use an em dash in writing or code comments. Use colon, comma, hyphen, or period.
14. **Surgical edits.** Do not change copy, wording, or layouts unless explicitly requested. Trust user manual rollbacks.

## The User: Pauline (North Star)

30 y/o, extreme executive dysfunction. Wakes daily forgetting progress; suffers from planning paralysis. Needs the app to make executive choices for her and explicitly reward task completion.

---

## Locked Decisions & Architecture

### Tech Stack & Frameworks

- Vite + React + TypeScript + Tailwind CSS
- `@dnd-kit/core` (sortable/utilities) — 180ms long-press activation for drag-and-drop.
- `motion/react` — bubble sliders and UI physics animations.
- `canvas-confetti` — category-colored celebratory bursts on task completion.

### Component Layout Rules

- **Header**: Sticky layout. Date on the left. Menu options on the right.
- **Menu Bar**: Structured as `[Settings Icon] [Archive]` | `[Centered Home]` | `[Other Items]`.
- **Today Carousel**: Active card must always remain centered (including first/last cards using padding/margins). Card width must be at least `50vw`.
- **Task Cards**: Left side features a full-height priority block (saturation-mapped on a purple ramp). Right side displays the task title (Fraunces font) and the chip pill row.
- **Pill & Title Wrapping**: The title sits right of the priority block. Insert a line break. The chip pills must fill the remaining space starting from the right edge of the priority block, wrapping completely underneath it when needed.
- **UI States**: Highlight the active filter pill with a distinct visual glow effect.

### Data Model & Core Workflows

- **Task**: `{id, title, categoryId, enjoyment(1-5), friction(1-5), timeBucket, dueDate, flow(0|1|2), isRoutine, status, createdAt, startedAt, completedAt, tags[], sessions[], pointsAwarded, percentComplete}`
- **Category**: `{id, label, color, isArchived, isDefault, sortOrder}` (6 defaults: career, joy, social, chores, health, self-care).
- **Preferences**: `{plusButtonCorner, weeklyTargets, lastSort, todayQueue[]}`
- **Task Entry Workflow**: Streamlined fast-entry flow [Pending implementation details].
- **Priority Formula (0-100)**: `startability (enjoyment × 4 + (6 - friction) × 4) + timeBoost + urgency - routine(-5)`. Clamped 0-100. Biased toward what Pauline will _start_, not pure urgency.
- **EXP Formula**: `exp = (friction × 8) + timeXP - (10 if routine)`. Range ~8–140. Rendered as a `+N xp` pill.

---

## Deferred / Parking Lot

- `[...]` Stale-chore detection settings and open-app suggestions.
- `[...]` Sliders animating between notches using motion.
- `[...]` Native iOS Swift port.
