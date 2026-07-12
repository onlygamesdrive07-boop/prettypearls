"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center">
      <p className="eyebrow text-gold-dark">Something went astray</p>
      <h1 className="mt-4 font-display text-3xl font-light text-charcoal">
        We couldn&rsquo;t load this page.
      </h1>
      <p className="mt-3 max-w-sm text-sm font-light text-charcoal/60">
        {error.message || "An unexpected error occurred. Please try again."}
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
