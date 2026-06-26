// App.jsx
import { useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import {
  tasks as tasksStore,
  categories as categoriesStore,
  preferences as preferencesStore,
} from "./lib/storage.js";
import { sortTasks, groupByCategory } from "./lib/sort.js";
import { haptics } from "./lib/haptics.js";
import { celebrate } from "./lib/celebrate.js";

import TodayCarousel from "./components/TodayCarousel.jsx";
import QueueSection from "./components/QueueSection.jsx";
import SortChips from "./components/SortChips.jsx";
import CompletedAccordion from "./components/CompletedAccordion.jsx";
import ArchivedAccordion from "./components/ArchivedAccordion.jsx";
import TaskEntry from "./components/TaskEntry.jsx";
import EditModal from "./components/EditModal.jsx";
import ConfirmModal from "./components/ConfirmModal.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import TaskCard from "./components/TaskCard.jsx";
import PageNav from "./components/PageNav.jsx";
import ArchivePage from "./components/ArchivePage.jsx";
import PlaceholderPage from "./components/PlaceholderPage.jsx";

const PAGES = ["archive", "home", "tbd"];

export default function App() {
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  const [currentPage, setCurrentPage] = useState("home");
  const [pageDir, setPageDir] = useState(1); // 1 = right, -1 = left, for transitions

  function changePage(next) {
    const curIdx = PAGES.indexOf(currentPage);
    const nextIdx = PAGES.indexOf(next);
    setPageDir(nextIdx > curIdx ? 1 : -1);
    setCurrentPage(next);
    haptics.tap();
  }

  const [sortField, setSortField] = useState(
    () => preferencesStore.get().lastSort?.field ?? "priority",
  );
  const [sortDir, setSortDir] = useState(
    () => preferencesStore.get().lastSort?.direction ?? "desc",
  );

  function handleSortChange(field, dir) {
    setSortField(field);
    setSortDir(dir);
    preferencesStore.setLastSort(field, dir);
  }

  const today = useMemo(() => tasksStore.queued(), [version]);
  const queueRaw = useMemo(() => tasksStore.inQueue(), [version]);
  const completed = useMemo(() => tasksStore.completed(), [version]);
  const archived = useMemo(() => tasksStore.archived(), [version]);
  const cats = useMemo(() => categoriesStore.active(), [version]);
  const prefs = useMemo(() => preferencesStore.get(), [version]);

  const categoriesById = useMemo(
    () => Object.fromEntries(categoriesStore.list().map((c) => [c.id, c])),
    [version],
  );

  const queueSorted = useMemo(
    () => sortTasks(queueRaw, sortField, sortDir, new Date(), categoriesById),
    [queueRaw, sortField, sortDir, categoriesById],
  );
  const queueGrouped = useMemo(
    () =>
      sortField === "category"
        ? groupByCategory(
            queueSorted,
            "priority",
            "desc",
            new Date(),
            categoriesById,
          )
        : null,
    [queueSorted, sortField, categoriesById],
  );

  const [editingTask, setEditingTask] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState(null);

  // ---------- actions ----------

  const handleCreate = (data) => {
    tasksStore.create(data);
    haptics.success();
    refresh();
  };
  const handleEnqueue = (id) => {
    preferencesStore.enqueue(id);
    haptics.tap();
    refresh();
  };
  const handleDequeue = (id) => {
    preferencesStore.dequeue(id);
    haptics.tap();
    refresh();
  };
  const handleStart = (id) => {
    tasksStore.start(id);
    haptics.tap();
    refresh();
  };

  const handleComplete = (id) => {
    const t = tasksStore.byId(id);
    const cat = t ? categoriesById[t.categoryId] : null;
    tasksStore.complete(id);
    preferencesStore.dequeue(id);
    haptics.success();
    celebrate(cat);
    refresh();
  };

  const handleArchive = (id) => {
    const t = tasksStore.byId(id);
    setPendingConfirm({
      title: "Archive this task?",
      message: `"${t?.title ?? ""}" will be hidden but kept. You can restore it later.`,
      confirmLabel: "Archive",
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

  // restore from completed or archived back to not-started
  const handleRestore = (id, opts = {}) => {
    tasksStore.update(id, { status: "not_started", completedAt: null });
    if (opts.enqueue) preferencesStore.enqueue(id);
    haptics.tap();
    refresh();
  };

  // archived to completed: useful when user realises they actually finished it
  const handleMarkCompleted = (id) => {
    tasksStore.update(id, {
      status: "completed",
      completedAt: new Date().toISOString(),
    });
    haptics.success();
    refresh();
  };

  const handleEdit = (task) => setEditingTask(task);
  const handleSaveEdit = (id, patch) => {
    tasksStore.update(id, patch);
    refresh();
  };

  // ---------- dnd ----------

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 180, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
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
    const overId = over.id;

    const wasInToday = today.some((t) => t.id === activeId);
    const wasInQueue = queueSorted.some((t) => t.id === activeId);
    const wasInCompleted = completed.some((t) => t.id === activeId);
    const wasInArchived = archived.some((t) => t.id === activeId);
    const wasInactive = wasInCompleted || wasInArchived;

    const overIsToday =
      overId === "zone-today" || today.some((t) => t.id === overId);
    const overIsQueue =
      overId === "zone-queue" || queueSorted.some((t) => t.id === overId);
    const overIsCompleted =
      overId === "zone-completed" || completed.some((t) => t.id === overId);
    const overIsArchived =
      overId === "zone-archived" || archived.some((t) => t.id === overId);

    if (overIsToday) {
      if (wasInQueue) {
        const insertAt =
          overId === "zone-today"
            ? today.length
            : today.findIndex((t) => t.id === overId);
        preferencesStore.reorderQueue(activeId, insertAt);
        refresh();
      } else if (wasInactive) {
        handleRestore(activeId, { enqueue: true });
      } else if (wasInToday && activeId !== overId && overId !== "zone-today") {
        const oldIndex = today.findIndex((t) => t.id === activeId);
        const newIndex = today.findIndex((t) => t.id === overId);
        const newOrder = arrayMove(
          today.map((t) => t.id),
          oldIndex,
          newIndex,
        );
        preferencesStore.setQueue(newOrder);
        refresh();
      }
      return;
    }

    if (overIsQueue) {
      if (wasInToday) {
        preferencesStore.dequeue(activeId);
        refresh();
      } else if (wasInactive) {
        handleRestore(activeId);
      }
      return;
    }

    if (overIsCompleted && !wasInCompleted) {
      handleComplete(activeId);
      return;
    }

    if (overIsArchived && !wasInArchived) {
      handleArchive(activeId);
      return;
    }
  }

  const activeTask = activeDragId ? tasksStore.byId(activeDragId) : null;
  const activeCategory = activeTask
    ? categoriesById[activeTask.categoryId]
    : null;

  // ---------- render ----------

  const now = new Date();
  const dayLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const pageVariants = {
    enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen">
        <PageNav
          currentPage={currentPage}
          onPageChange={changePage}
          onOpenSettings={() => setSettingsOpen(true)}
          dayLabel={dayLabel}
        />

        <AnimatePresence mode="wait" custom={pageDir}>
          <motion.div
            key={currentPage}
            custom={pageDir}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {currentPage === "home" && (
              <main className="py-5 pb-32">
                <div className="mb-5">
                  <TodayCarousel
                    tasks={today}
                    categoriesById={categoriesById}
                    activeSort={sortField}
                    onDequeue={handleDequeue}
                    onComplete={handleComplete}
                    onEdit={handleEdit}
                    onArchive={handleArchive}
                    onStart={handleStart}
                  />
                </div>
                <div className="mx-auto max-w-3xl px-5 space-y-5">
                  <SortChips
                    field={sortField}
                    direction={sortDir}
                    onChange={handleSortChange}
                  />

                  <QueueSection
                    tasks={queueSorted}
                    grouped={queueGrouped}
                    categoriesById={categoriesById}
                    activeSort={sortField}
                    onEnqueue={handleEnqueue}
                    onComplete={handleComplete}
                    onEdit={handleEdit}
                    onArchive={handleArchive}
                  />

                  <CompletedAccordion
                    tasks={completed}
                    categoriesById={categoriesById}
                    onRestore={(id) => handleRestore(id)}
                    onArchive={handleArchive}
                    onEdit={handleEdit}
                  />

                  <ArchivedAccordion
                    tasks={archived}
                    categoriesById={categoriesById}
                    onRestore={(id) => handleRestore(id)}
                    onMarkCompleted={handleMarkCompleted}
                    onEdit={handleEdit}
                  />
                </div>{" "}
              </main>
            )}

            {currentPage === "archive" && (
              <ArchivePage
                tasks={archived}
                categoriesById={categoriesById}
                onRestore={(id) => handleRestore(id)}
                onMarkCompleted={handleMarkCompleted}
                onEdit={handleEdit}
              />
            )}

            {currentPage === "tbd" && <PlaceholderPage />}
          </motion.div>
        </AnimatePresence>

        <DragOverlay
          dropAnimation={{
            duration: 220,
            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}
        >
          {activeTask ? (
            <div className="opacity-95 rotate-1">
              <TaskCard
                task={activeTask}
                category={activeCategory}
                source="queue"
              />
            </div>
          ) : null}
        </DragOverlay>

        {currentPage === "home" && (
          <TaskEntry
            corner={prefs.plusButtonCorner}
            categories={cats}
            onCreate={handleCreate}
            onCategoriesChanged={refresh}
          />
        )}

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
          onConfirm={() => {
            pendingConfirm?.execute?.();
            setPendingConfirm(null);
          }}
          onCancel={() => setPendingConfirm(null)}
        />
      </div>
    </DndContext>
  );
}
