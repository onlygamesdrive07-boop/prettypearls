export default function ProductsLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-40 rounded bg-charcoal/10" />
          <div className="mt-2 h-4 w-20 rounded bg-charcoal/10" />
        </div>
        <div className="h-11 w-32 rounded-full bg-charcoal/10" />
      </div>

      <div className="mt-6 h-11 w-full max-w-xl rounded-lg bg-charcoal/10" />

      <div className="mt-6 space-y-3 rounded-2xl border border-charcoal/10 bg-white/50 p-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-charcoal/10" />
            <div className="h-4 flex-1 max-w-xs rounded bg-charcoal/10" />
            <div className="h-4 w-16 rounded bg-charcoal/10" />
            <div className="h-4 w-16 rounded bg-charcoal/10" />
            <div className="h-6 w-20 rounded-full bg-charcoal/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
