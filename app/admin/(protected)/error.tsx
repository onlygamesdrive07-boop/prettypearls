"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow text-gold-dark">Dashboard error</p>
      <h1 className="mt-4 font-display text-2xl font-light text-charcoal">
        Something went wrong loading this view.
      </h1>
      <p className="mt-3 max-w-sm text-sm font-light text-charcoal/60">
        {error.message || "Please try again, or check your Supabase connection."}
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-full bg-charcoal px-8 py-3.5 text-sm text-ivory transition-colors hover:bg-gold-dark"
      >
        Try Again
      </button>
    </div>
  );
}
