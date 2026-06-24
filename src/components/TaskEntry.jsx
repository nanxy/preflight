// components/TaskEntry.jsx
import { useState, useRef, useEffect } from 'react';
import Modal from './Modal.jsx';
import TaskForm from './TaskForm.jsx';
import { TIME_BUCKETS } from '../data/defaults.js';

export default function TaskEntry({ corner = 'bottom-right', categories, onCreate, onCategoriesChanged }) {
  const [bucketsOpen, setBucketsOpen] = useState(false);
  const [formBucket, setFormBucket]   = useState(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setBucketsOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const corners = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left':  'bottom-6 left-6',
    'top-right':    'top-6 right-6',
    'top-left':     'top-6 left-6',
  };

  function pickBucket(id) { setBucketsOpen(false); setFormBucket(id); }
  function handleCreate(data) { onCreate(data); setFormBucket(null); }

  return (
    <>
      <div
        ref={wrapRef}
        className={`fixed ${corners[corner] ?? corners['bottom-right']} z-30`}
        onMouseEnter={() => setBucketsOpen(true)}
        onMouseLeave={() => setBucketsOpen(false)}
      >
        <div
          className={[
            'flex flex-col items-end gap-2 mb-2 transition-all duration-200',
            bucketsOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-2 pointer-events-none',
          ].join(' ')}
        >
          {[...TIME_BUCKETS].reverse().map(b => (
            <button
              key={b.id}
              onClick={() => pickBucket(b.id)}
              className="text-sm px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 hover:bg-priority-100 dark:hover:bg-priority-900 hover:border-priority-400 transition-colors font-medium no-select"
            >
              {b.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setBucketsOpen(o => !o)}
          className="w-14 h-14 rounded-full bg-priority-600 hover:bg-priority-800 text-white text-2xl font-light shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 no-select"
          aria-label="Add task"
        >+</button>
      </div>

      <Modal open={!!formBucket} onClose={() => setFormBucket(null)}>
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="text-lg font-semibold">New task</h3>
          <span className="text-sm text-gray-500">{TIME_BUCKETS.find(b => b.id === formBucket)?.label}</span>
        </div>
        {formBucket && (
          <TaskForm
            bucket={formBucket}
            categories={categories}
            submitLabel="add task"
            onSubmit={handleCreate}
            onCancel={() => setFormBucket(null)}
            onCategoriesChanged={onCategoriesChanged}
          />
        )}
      </Modal>
    </>
  );
}
