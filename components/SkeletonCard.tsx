export default function SkeletonCard() {
  return (
    <div className="glass animate-pulse overflow-hidden rounded-[28px] p-4">
      <div className="aspect-[4/5] rounded-2xl bg-charcoal/10" />
      <div className="mt-5 space-y-2 px-1">
        <div className="h-5 w-2/3 rounded bg-charcoal/10" />
        <div className="h-3.5 w-full rounded bg-charcoal/10" />
        <div className="h-3.5 w-4/5 rounded bg-charcoal/10" />
      </div>
    </div>
  );
}
