// components/ArchivePage.jsx
// Dedicated history view for archived tasks. Block view by default for a
// fuller browseable layout. Cards remain draggable so user can restore by
// dragging back to Home (when present), or use the restore button.

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import DraggableTaskCard from "./DraggableTaskCard.jsx";
import ViewToggle from "./ViewToggle.jsx";

export default function ArchivePage({
  tasks,
  categoriesById,
  onRestore,
  onMarkCompleted,
  onEdit,
}) {
  const [view, setView] = useState("block");
  const { setNodeRef, isOver } = useDroppable({ id: "zone-archived" });
  const empty = tasks.length === 0;

  function cardProps(t) {
    return {
      key: t.id,
      task: t,
      category: categoriesById[t.categoryId],
      source: "archived",
      onRestore,
      onMarkCompleted,
      onEdit,
      onSwipeRight: () => onMarkCompleted?.(t.id),
      onSwipeLeft: () => onRestore?.(t.id),
    };
  }

  return (
    <main className="mx-auto max-w-3xl px-5 pb-32">
      <section
        ref={setNodeRef}
        className={[
          "rounded-2xl transition-all",
          isOver
            ? "ring-2 ring-amber-400 bg-amber-50/30 dark:bg-amber-900/10 p-3"
            : "",
        ].join(" ")}
      >
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-2xl">Archive</h2>
          <ViewToggle view={view} onChange={setView} />
        </div>

        {empty ? (
          <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
            nothing archived yet
          </div>
        ) : view === "block" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tasks.map((t) => (
              <DraggableTaskCard {...cardProps(t)} compact />
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t) => (
              <li key={t.id}>
                <DraggableTaskCard {...cardProps(t)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
