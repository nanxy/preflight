// lib/haptics.js
// Best-effort haptic feedback via the Web Vibration API.
// Android browsers: works. iOS Safari: silent no-op (Apple doesn't expose
// the Taptic Engine to the web). Always safe to call.

function buzz(pattern) {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch { /* ignore */ }
}

export const haptics = {
  tap()      { buzz(8);          },
  pickup()   { buzz(12);         },  // grabbing a card to drag
  drop()     { buzz([6, 30, 18]); }, // releasing into a zone
  success()  { buzz([20, 40, 60]); },
  warning()  { buzz([40, 60, 40]); },
};
