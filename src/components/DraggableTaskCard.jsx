// components/DraggableTaskCard.jsx
// Card wrapper for non-Today contexts. Combines:
//   - dnd-kit useDraggable for long-press drag (move between zones, drop to complete/archive)
//   - motion onPan for quick-swipe gestures (right=complete, left=archive, up=enqueue)
// Both can listen at the same time because motion's onPanEnd just observes the
// pointer trajectory; the 180ms activation delay on dnd-kit means a fast swipe
// triggers the pan handler before long-press fires, while a true long-press
// has no horizontal motion so the pan thresholds aren't crossed.

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'motion/react';
import TaskCard from './TaskCard.jsx';

const SWIPE_THRESHOLD = 80;        // px before a swipe registers
const SWIPE_VELOCITY  = 200;       // px/s for a fast flick

export default function DraggableTaskCard({
  task,
  onSwipeRight,    // typically complete
  onSwipeLeft,     // typically archive
  onSwipeUp,       // typically enqueue (Queue only)
  ...rest
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const style = { transform: CSS.Translate.toString(transform) };

  function handlePanEnd(_event, info) {
    // dnd-kit is already moving the card; don't double-fire a swipe action
    if (isDragging) return;
    const { offset, velocity } = info;
    const horiz = Math.abs(offset.x) > Math.abs(offset.y);
    const fastEnough = (axis) => Math.abs(velocity[axis]) > SWIPE_VELOCITY;
    const farEnough  = (axis) => Math.abs(offset[axis])   > SWIPE_THRESHOLD;

    if (horiz) {
      if (offset.x > 0 && (farEnough('x') || fastEnough('x'))) onSwipeRight?.(task.id);
      else if (offset.x < 0 && (farEnough('x') || fastEnough('x'))) onSwipeLeft?.(task.id);
    } else {
      if (offset.y < 0 && (farEnough('y') || fastEnough('y'))) onSwipeUp?.(task.id);
    }
  }

  return (
    <motion.div ref={setNodeRef} style={style} onPanEnd={handlePanEnd}>
      <TaskCard
        task={task}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
        {...rest}
      />
    </motion.div>
  );
}
