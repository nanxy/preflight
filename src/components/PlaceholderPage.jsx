// components/PlaceholderPage.jsx
// Reserved for the third trilogy app once we figure out what lives here.
// Could be a weekly review, the During app's bridge, or a stats / streaks
// surface. For now: friendly placeholder.

export default function PlaceholderPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 pb-32 flex flex-col items-center justify-center text-center min-h-[60vh]">
      <h2 className="font-display text-2xl text-gray-800 dark:text-gray-100 mb-2">Coming soon</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
        This page will eventually house the bridge into the During app or a
        weekly review. Swipe back to Home.
      </p>
    </main>
  );
}
