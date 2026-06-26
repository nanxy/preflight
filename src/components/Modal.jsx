// components/Modal.jsx
// Generic centered modal shell. Now picks up dark: utilities correctly
// because Tailwind reads our html[data-theme="dark"] selector.

import { useEffect } from 'react';

export default function Modal({ open, onClose, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === 'Escape') onClose?.(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidth} bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
}
