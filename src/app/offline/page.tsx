"use client";

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="text-5xl">📴</div>
      <h1 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-slate-100">You're offline</h1>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        Your saved progress is safe in this browser. Reconnect to continue — or reopen the app to retry.
      </p>
      <button
        className="btn-primary mt-6"
        onClick={() => {
          if ("serviceWorker" in navigator) navigator.serviceWorker.controller?.postMessage({ type: "SKIP_WAITING" });
          window.location.reload();
        }}
      >
        Retry
      </button>
    </div>
  );
}