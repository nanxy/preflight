// components/TodayCarousel.jsx
// Horizontal carousel for Today. CSS scroll-snap with snap-always to force
// one-card-at-a-time snapping. Scroll padding lets first/last cards center.
// Each card is ~68% wide on mobile / ~58% on desktop so about a quarter of
// the neighbor peeks on each side.
//
// Reorder is enabled via @dnd-kit's SortableContext with horizontal strategy.
// Long-press a card to start a drag and shift it left/right; CSS scroll-snap
// doesn't fight us because dnd-kit captures the pointer events during drag.

import { useEffect, useRef, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import SortableTaskCard from './SortableTaskCard.jsx';

export default function TodayCarousel({
  tasks, categoriesById, activeSort,
  onDequeue, onComplete, onEdit, onArchive, onStart,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: 'zone-today' });
  const empty = tasks.length === 0;
  const ids = tasks.map(t => t.id);
  const scrollerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Track which card is closest to the scroller's center so we can scale
  // and dim the others. Subtle depth without 3D transforms.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    function update() {
      const containerCenter = el.scrollLeft + el.offsetWidth / 2;
      let closest = 0, minDist = Infinity;
      for (let i = 0; i < el.children.length; i++) {
        const child = el.children[i];
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const d = Math.abs(childCenter - containerCenter);
        if (d < minDist) { minDist = d; closest = i; }
      }
      setActiveIdx(closest);
    }
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }
    el.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [tasks.length]);

  return (
    <section
      ref={setNodeRef}
      className={[
        'rounded-2xl py-4 transition-all',
        'bg-gradient-to-b from-priority-50/60 via-priority-50/20 to-transparent',
        'dark:from-priority-900/30 dark:via-priority-900/10 dark:to-transparent',
        isOver ? 'ring-2 ring-priority-400' : '',
      ].join(' ')}
    >
      <div className="px-5 mb-3">
        <h2 className="font-display text-lg">Today</h2>
      </div>

      {empty ? (
        <div className="mx-5 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-priority-100 dark:border-priority-900 px-5 py-7 text-center">
          <p className="font-display text-base text-gray-700 dark:text-gray-200 mb-1">
            Pick what to do today.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Drag a card up from your queue, or tap + to add something new.
          </p>
        </div>
      ) : (
        <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
          <div
            ref={scrollerRef}
            className="overflow-x-auto snap-x snap-mandatory flex gap-3 pb-2 no-scrollbar scroll-smooth"
            style={{
              scrollPaddingLeft: '16%',
              scrollPaddingRight: '16%',
              paddingLeft: '16%',
              paddingRight: '16%',
            }}
          >
            {tasks.map((task, i) => {
              const isActive = i === activeIdx;
              return (
                <div
                  key={task.id}
                  className="snap-center snap-always shrink-0 w-[68%] sm:w-[58%] transition-all duration-300 ease-out"
                  style={{
                    transform: isActive ? 'scale(1)' : 'scale(0.9)',
                    opacity: isActive ? 1 : 0.55,
                  }}
                >
                  <SortableTaskCard
                    task={task}
                    category={categoriesById[task.categoryId]}
                    source="today"
                    isFirstInToday={i === 0}
                    activeSort={activeSort}
                    onDequeue={onDequeue}
                    onComplete={onComplete}
                    onEdit={onEdit}
                    onArchive={onArchive}
                    onStart={onStart}
                  />
                </div>
              );
            })}
          </div>
        </SortableContext>
      )}
    </section>
  );
}
