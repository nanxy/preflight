// App.jsx
import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  DndContext, DragOverlay, PointerSensor, KeyboardSensor,
  useSensor, useSensors, closestCenter,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import {
  tasks as tasksStore,
  categories as categoriesStore,
  preferences as preferencesStore,
} from './lib/storage.js';
import { sortTasks, groupByCategory } from './lib/sort.js';
import { haptics } from './lib/haptics.js';
import { CATEGORY_COLOR_STOPS } from './data/defaults.js';

import TodayZone from './components/TodayZone.jsx';
import QueueSection from './components/QueueSection.jsx';
import SortChips from './components/SortChips.jsx';
import CompletedAccordion from './components/CompletedAccordion.jsx';
import ArchivedAccordion from './components/ArchivedAccordion.jsx';
import TaskEntry from './components/TaskEntry.jsx';
import EditModal from './components/EditModal.jsx';
import ConfirmModal from './components/ConfirmModal.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import TaskCard from './components/TaskCard.jsx';
import { SettingsIcon } from './components/Icons.jsx';

export default function App() {
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion(v => v + 1), []);

  // sort persisted across reloads
  const [sortField, setSortField] = useState(() => preferencesStore.get().lastSort?.field ?? 'priority');
  const [sortDir, setSortDir]     = useState(() => preferencesStore.get().lastSort?.direction ?? 'desc');

  function handleSortChange(field, dir) {
    setSortField(field); setSortDir(dir);
    preferencesStore.setLastSort(field, dir);
  }

  // data
  const all       = useMemo(() => tasksStore.list(),      [version]);
  const today     = useMemo(() => tasksStore.queued(),    [version]);
  const queueRaw  = useMemo(() => tasksStore.inQueue(),   [version]);
  const completed = useMemo(() => tasksStore.completed(), [version]);
  const archived  = useMemo(() => tasksStore.archived(),  [version]);
  const cats      = useMemo(() => categoriesStore.active(), [version]);
  const prefs     = useMemo(() => preferencesStore.get(), [version]);

  // include archived categories so archived tasks still resolve their chip
  const categoriesById = useMemo(() => {
    const all = categoriesStore.list();
    return Object.fromEntries(all.map(c => [c.id, c]));
  }, [version]);

  const queueSorted = useMemo(
    () => sortTasks(queueRaw, sortField, sortDir),
    [queueRaw, sortField, sortDir]
  );
  const queueGrouped = useMemo(
    () => sortField === 'category' ? groupByCategory(queueSorted, 'priority', 'desc') : null,
    [queueSorted, sortField]
  );

  // edit & settings modals
  const [editingTask, setEditingTask] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // pending confirm pattern — any destructive action goes through this
  const [pendingConfirm, setPendingConfirm] = useState(null);

  // ---------- actions ----------

  const handleCreate    = (data) => { tasksStore.create(data); haptics.success(); refresh(); };
  const handleEnqueue   = (id) => { preferencesStore.enqueue(id); haptics.tap(); refresh(); };
  const handleDequeue   = (id) => { preferencesStore.dequeue(id); haptics.tap(); refresh(); };
  const handleComplete  = (id) => { tasksStore.complete(id); preferencesStore.dequeue(id); haptics.success(); refresh(); };
  const handleStart     = (id) => { tasksStore.start(id); haptics.tap(); refresh(); };
  const handleUnarchive = (id) => { tasksStore.update(id, { status: 'not_started' }); haptics.tap(); refresh(); };

  const handleArchive = (id) => {
    const t = tasksStore.byId(id);
    setPendingConfirm({
      kind: 'archive',
      title: 'Archive this task?',
      message: `"${t?.title ?? ''}" will be hidden but kept. You can restore it later.`,
      confirmLabel: 'Archive',
      destructive: false,
      execute: () => {
        tasksStore.archive(id);
        preferencesStore.dequeue(id);
        haptics.warning();
        refresh();
      },
    });
  };

  const handleDelete = (id) => {
    tasksStore.remove(id);
    preferencesStore.dequeue(id);
    haptics.warning();
    refresh();
  };

  const handleEdit = (task) => setEditingTask(task);
  const handleSaveEdit = (id, patch) => { tasksStore.update(id, patch); refresh(); };

  // ---------- drag and drop ----------

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const [activeDragId, setActiveDragId] = useState(null);

  function handleDragStart(event) {
    setActiveDragId(event.active.id);
    haptics.pickup();
  }

  function handleDragEnd(event) {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over) return;
    haptics.drop();

    const activeId = active.id;
    const overId   = over.id;

    const wasInToday = today.some(t => t.id === activeId);
    const wasInQueue = queueSorted.some(t => t.id === activeId);

    const overIsToday = overId === 'zone-today' || today.some(t => t.id === overId);
    const overIsQueue = overId === 'zone-queue' || queueSorted.some(t => t.id === overId);

    if (overIsToday) {
      if (wasInQueue) {
        // moving from queue into today at insertion point
        const insertAt = overId === 'zone-today'
          ? today.length
          : today.findIndex(t => t.id === overId);
        preferencesStore.reorderQueue(activeId, insertAt);
        refresh();
      } else if (wasInToday && activeId !== overId && overId !== 'zone-today') {
        const oldIndex = today.findIndex(t => t.id === activeId);
        const newIndex = today.findIndex(t => t.id === overId);
        const newOrder = arrayMove(today.map(t => t.id), oldIndex, newIndex);
        preferencesStore.setQueue(newOrder);
        refresh();
      }
      return;
    }

    if (overIsQueue && wasInToday) {
      preferencesStore.dequeue(activeId);
      refresh();
    }
  }

  // overlay preview while dragging
  const activeTask = activeDragId ? tasksStore.byId(activeDragId) : null;
  const activeCategory = activeTask ? categoriesById[activeTask.categoryId] : null;

  // ---------- render ----------

  const now = new Date();
  const dayLabel = now.toLocaleDateString(undefined, {
    weekday: 'long', month: 'short', day: 'numeric',
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen">
        <header className="sticky top-0 z-20 backdrop-blur bg-[#FBFAF7]/80 dark:bg-[#1B1B1A]/80 border-b border-gray-200/60 dark:border-gray-700/60">
          <div className="mx-auto max-w-3xl px-5 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">preflight</h1>
              <p className="text-xs text-gray-500 -mt-0.5">{dayLabel}</p>
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Settings"
            >
              <SettingsIcon />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-5 py-5 pb-32 space-y-5">

          <TodayZone
            tasks={today}
            categoriesById={categoriesById}
            onDequeue={handleDequeue}
            onComplete={handleComplete}
            onEdit={handleEdit}
            onArchive={handleArchive}
            onStart={handleStart}
          />

          <SortChips field={sortField} direction={sortDir} onChange={handleSortChange} />

          <QueueSection
            tasks={queueSorted}
            grouped={queueGrouped}
            categoriesById={categoriesById}
            onEnqueue={handleEnqueue}
            onComplete={handleComplete}
            onEdit={handleEdit}
            onArchive={handleArchive}
          />

          <CompletedAccordion tasks={completed} categoriesById={categoriesById} />
          <ArchivedAccordion
            tasks={archived}
            categoriesById={categoriesById}
            onUnarchive={handleUnarchive}
            onEdit={handleEdit}
          />
        </main>

        <DragOverlay>
          {activeTask ? (
            <div className="opacity-90">
              <TaskCard task={activeTask} category={activeCategory} source="queue" />
            </div>
          ) : null}
        </DragOverlay>

        <TaskEntry
          corner={prefs.plusButtonCorner}
          categories={cats}
          onCreate={handleCreate}
          onCategoriesChanged={refresh}
        />

        <EditModal
          open={!!editingTask}
          task={editingTask}
          categories={cats}
          onSave={handleSaveEdit}
          onArchive={handleArchive}
          onDelete={handleDelete}
          onClose={() => setEditingTask(null)}
          onCategoriesChanged={refresh}
        />

        <SettingsPanel
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          categories={categoriesStore.list()}
          onCategoriesChanged={refresh}
        />

        <ConfirmModal
          open={!!pendingConfirm}
          title={pendingConfirm?.title}
          message={pendingConfirm?.message}
          confirmLabel={pendingConfirm?.confirmLabel}
          destructive={pendingConfirm?.destructive}
          onConfirm={() => { pendingConfirm?.execute?.(); setPendingConfirm(null); }}
          onCancel={() => setPendingConfirm(null)}
        />
      </div>
    </DndContext>
  );
}
