// components/DraggableTaskCard.jsx
// Wrapper for cards living in Queue (just draggable, not sortable).

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard.jsx';

export default function DraggableTaskCard({ task, ...rest }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard
        task={task}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
        {...rest}
      />
    </div>
  );
}
