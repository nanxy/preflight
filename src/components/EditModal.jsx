// components/EditModal.jsx
import { useState } from 'react';
import Modal from './Modal.jsx';
import TaskForm from './TaskForm.jsx';
import ConfirmModal from './ConfirmModal.jsx';

export default function EditModal({
  open, task, categories,
  onSave, onArchive, onDelete, onClose, onCategoriesChanged,
}) {
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [confirmDelete, setConfirmDelete]   = useState(false);

  if (!task) return null;

  function handleSubmit(patch) { onSave(task.id, patch); onClose(); }

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <div className="flex justify-end mb-2">
          <span className="text-xs uppercase tracking-wider text-gray-400">{task.status}</span>
        </div>
        <TaskForm
          initial={task}
          categories={categories}
          submitLabel="save"
          onSubmit={handleSubmit}
          onCancel={onClose}
          onCategoriesChanged={onCategoriesChanged}
          extraActions={
            <>
              {task.status !== 'archived' && (
                <button
                  onClick={() => setConfirmArchive(true)}
                  className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600"
                >archive</button>
              )}
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >delete</button>
            </>
          }
        />
      </Modal>

      <ConfirmModal
        open={confirmArchive}
        title="Archive this task?"
        message="Archived tasks are hidden but kept. You can find them later."
        confirmLabel="Archive"
        onConfirm={() => { onArchive(task.id); setConfirmArchive(false); onClose(); }}
        onCancel={() => setConfirmArchive(false)}
      />
      <ConfirmModal
        open={confirmDelete}
        title="Delete this task?"
        message="This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => { onDelete(task.id); setConfirmDelete(false); onClose(); }}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}
