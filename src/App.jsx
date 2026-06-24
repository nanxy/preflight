// App.jsx — orchestrates Today / Queue / Completed and modal flows.

import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  tasks as tasksStore,
  categories as categoriesStore,
  preferences as preferencesStore,
} from './lib/storage.js';
import { sortTasks, groupByCategory } from './lib/sort.js';

import TodayZone from './components/TodayZone.jsx';
import QueueSection from './components/QueueSection.jsx';
import SortChips from './components/SortChips.jsx';
import CompletedAccordion from './components/CompletedAccordion.jsx';
import TaskEntry from './components/TaskEntry.jsx';
import EditModal from './components/EditModal.jsx';

export default function App() {
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion(v => v + 1), []);

  // sort state — initial from prefs, persisted on change
  const [sortField, setSortField] = useState(() => preferencesStore.get().lastSort?.field ?? 'priority');
  const [sortDir, setSortDir]     = useState(() => preferencesStore.get().lastSort?.direction ?? 'desc');

  function handleSortChange(field, dir) {
    setSortField(field);
    setSortDir(dir);
    preferencesStore.setLastSort(field, dir);
  }

  // data (rebuilt on every version bump)
  const all       = useMemo(() => tasksStore.list(),      [version]);
  const today     = useMemo(() => tasksStore.queued(),    [version]);
  const queueRaw  = useMemo(() => tasksStore.inQueue(),   [version]);
  const completed = useMemo(() => tasksStore.completed(), [version]);
  const cats      = useMemo(() => categoriesStore.active(), [version]);
  const prefs     = useMemo(() => preferencesStore.get(), [version]);

  const categoriesById = useMemo(
    () => Object.fromEntries(cats.map(c => [c.id, c])),
    [cats]
  );

  // sorted/grouped queue
  const queueSorted = useMemo(
    () => sortTasks(queueRaw, sortField, sortDir),
    [queueRaw, sortField, sortDir]
  );
  const queueGrouped = useMemo(
    () => sortField === 'category'
      ? groupByCategory(queueSorted, 'priority', 'desc')
      : null,
    [queueSorted, sortField]
  );

  // edit modal
  const [editingTask, setEditingTask] = useState(null);

  // ---------- actions ----------

  const handleCreate = (data) => { tasksStore.create(data); refresh(); };

  const handleEnqueue = (id) => { preferencesStore.enqueue(id); refresh(); };
  const handleDequeue = (id) => { preferencesStore.dequeue(id); refresh(); };

  const handleComplete = (id) => {
    tasksStore.complete(id);
    preferencesStore.dequeue(id);
    refresh();
  };

  const handleStart = (id) => { tasksStore.start(id); refresh(); };

  const handleArchive = (id) => {
    tasksStore.archive(id);
    preferencesStore.dequeue(id);
    refresh();
  };

  const handleDelete = (id) => {
    tasksStore.remove(id);
    preferencesStore.dequeue(id);
    refresh();
  };

  const handleEdit = (task) => setEditingTask(task);

  const handleSaveEdit = (id, patch) => {
    tasksStore.update(id, patch);
    refresh();
  };

  // ---------- render ----------

  const now = new Date();
  const dayLabel = now.toLocaleDateString(undefined, {
    weekday: 'long', month: 'short', day: 'numeric',
  });

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-3xl px-5 py-8 pb-32">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">preflight</h1>
          <p className="text-sm text-gray-500 mt-0.5">{dayLabel}</p>
        </div>

        {/* PLACEHOLDER: weekly quota strip (Friday). */}
        {/* PLACEHOLDER: in-progress section with elapsed time (Thursday). */}

        {/* Today */}
        <div className="mb-6">
          <TodayZone
            tasks={today}
            categoriesById={categoriesById}
            onDropTask={handleEnqueue}
            onDequeue={handleDequeue}
            onComplete={handleComplete}
            onEdit={handleEdit}
            onArchive={handleArchive}
            onStart={handleStart}
          />
        </div>

        {/* Sort chips */}
        <div className="mb-3">
          <SortChips field={sortField} direction={sortDir} onChange={handleSortChange} />
        </div>

        {/* Queue (was Backlog) */}
        <QueueSection
          tasks={queueSorted}
          grouped={queueGrouped}
          categoriesById={categoriesById}
          onEnqueue={handleEnqueue}
          onComplete={handleComplete}
          onEdit={handleEdit}
          onArchive={handleArchive}
          onDragOutOfToday={handleDequeue}
        />

        {/* Completed (muted, list-style) */}
        <CompletedAccordion tasks={completed} categoriesById={categoriesById} />

        {/* PLACEHOLDER: archived accordion (Friday). */}
      </main>

      <TaskEntry
        corner={prefs.plusButtonCorner}
        categories={cats}
        onCreate={handleCreate}
      />

      <EditModal
        open={!!editingTask}
        task={editingTask}
        categories={cats}
        onSave={handleSaveEdit}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onClose={() => setEditingTask(null)}
      />
    </div>
  );
}
