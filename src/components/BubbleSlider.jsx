// components/BubbleSlider.jsx
// Fluid, bubble-on-touch slider. Built on pointer events + framer-motion.
// On press: thumb scales up, a value bubble pops above with a small tail.
// Track fill animates with a spring. Each step has a faint tick mark.
// Symbol bounds (e.g. 😩 / 🤩) flank the track for context.

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { haptics } from '../lib/haptics.js';

export default function BubbleSlider({
  value,
  onChange,
  min = 1,
  max = 5,
  step = 1,
  color = '#534AB7',         // priority-600
  trackBg = 'rgba(0,0,0,0.08)',
  lowSymbol,
  highSymbol,
  lowLabel,
  highLabel,
}) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(false);
  const [hover, setHover]   = useState(false);
  const steps = (max - min) / step;
  const fraction = (value - min) / (max - min);

  function updateFromClientX(clientX) {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const raw = (clientX - rect.left) / rect.width;
    const frac = Math.max(0, Math.min(1, raw));
    const next = Math.round(frac * steps) * step + min;
    if (next !== value) {
      onChange(next);
      haptics.tap();
    }
  }

  function onPointerDown(e) {
    setActive(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  }
  function onPointerMove(e) {
    if (!active) return;
    updateFromClientX(e.clientX);
  }
  function onPointerUp(e) {
    setActive(false);
    try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch {}
  }

  return (
    <div className="flex items-center gap-3 select-none">
      {lowSymbol && (
        <span className="text-xl leading-none shrink-0" title={lowLabel} aria-label={lowLabel}>
          {lowSymbol}
        </span>
      )}

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative flex-1 h-10 flex items-center cursor-pointer"
        style={{ touchAction: 'none' }}
      >
        {/* base track */}
        <div
          className="absolute inset-x-0 h-2 rounded-full"
          style={{ background: trackBg }}
        />

        {/* tick marks */}
        {Array.from({ length: steps + 1 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${(i / steps) * 100}%`,
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.15)',
            }}
          />
        ))}

        {/* fill */}
        <motion.div
          className="absolute h-2 rounded-full"
          style={{ background: color }}
          animate={{ width: `${fraction * 100}%` }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />

        {/* thumb */}
        <motion.div
          className="absolute"
          style={{ left: `${fraction * 100}%`, x: '-50%' }}
          animate={{
            scale: active ? 1.45 : hover ? 1.12 : 1,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 24 }}
        >
          <div
            className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 shadow-md"
            style={{
              background: color,
              boxShadow: active ? `0 4px 18px ${color}77` : undefined,
            }}
          />

          {/* bubble */}
          <AnimatePresence>
            {active && (
              <motion.div
                key="bubble"
                initial={{ y: -4, opacity: 0, scale: 0.4 }}
                animate={{ y: -42, opacity: 1, scale: 1 }}
                exit={{ y: -4, opacity: 0, scale: 0.4 }}
                transition={{ type: 'spring', stiffness: 520, damping: 24 }}
                className="absolute left-1/2 -translate-x-1/2 -top-2 px-3 py-1.5 rounded-full text-sm font-bold text-white shadow-xl whitespace-nowrap"
                style={{ background: color }}
              >
                {value}
                <div
                  className="absolute left-1/2 -bottom-1 w-2.5 h-2.5 -translate-x-1/2 rotate-45"
                  style={{ background: color }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {highSymbol && (
        <span className="text-xl leading-none shrink-0" title={highLabel} aria-label={highLabel}>
          {highSymbol}
        </span>
      )}
    </div>
  );
}
