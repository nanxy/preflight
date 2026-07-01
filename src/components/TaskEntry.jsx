// components/TaskEntry.jsx
// Tap + once: modal opens immediately with duration buttons at the top.
// One tap selects the duration and the form is already visible below.
// No intermediate fan/picker step.

import { useState } from 'react';
import Modal from './Modal.jsx';
import TaskForm from './TaskForm.jsx';
import { TIME_BUCKETS } from '../data/defaults.js';

export default function TaskEntry({ corner = 'bottom-right', categories, onCreate, onCategoriesChanged }) {
  const [open, setOpen]           = useState(false);
  const [formBucket, setFormBucket] = useState(TIME_BUCKETS[1].id); // default: 15-45m

  const corners = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left':  'bottom-6 left-6',
    'top-right':    'top-6 right-6',
    'top-left':     'top-6 left-6',
  };

  function handleCreate(data) {
    onCreate(data);
    setOpen(false);
    setFormBucket(TIME_BUCKETS[1].id);
  }

  function handleClose() {
    setOpen(false);
    setFormBucket(TIME_BUCKETS[1].id);
  }

  return (
    <>
      <div className={`fixed ${corners[corner] ?? corners['bottom-right']} z-30`}>
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-priority-600 hover:bg-priority-800 text-white text-2xl font-light shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 no-select"
          aria-label="Add task"
        >+</button>
      </div>

      <Modal open={open} onClose={handleClose}>
        {/* Duration row at the top of the modal. Selecting one immediately
            scopes the form below without navigating anywhere. */}
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {TIME_BUCKETS.map(b => (
            <button
              key={b.id}
              onClick={() => setFormBucket(b.id)}
              className={[
                'text-xs px-3 py-1.5 rounded-full font-medium border-2 transition-all',
                formBucket === b.id
                  ? 'border-priority-600 bg-priority-600 text-white shadow-sm'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:border-priority-400',
              ].join(' ')}
            >
              {b.short}
            </button>
          ))}
        </div>

        <TaskForm
          bucket={formBucket}
          categories={categories}
          submitLabel="add task"
          onSubmit={handleCreate}
          onCancel={handleClose}
          onCategoriesChanged={onCategoriesChanged}
        />
      </Modal>
    </>
  );
}
