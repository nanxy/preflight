// components/ConfirmModal.jsx
// Reusable yes/no confirmation. Used for destructive actions (archive, delete).

import Modal from './Modal.jsx';

export default function ConfirmModal({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal open={open} onClose={onCancel} maxWidth="max-w-sm">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {message && <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">{message}</p>}
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          className={[
            'px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors',
            destructive
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-priority-600 hover:bg-priority-800',
          ].join(' ')}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
