import SkeletonCard from "@/components/SkeletonCard";

export default function HomeLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="h-[100svh] w-full animate-pulse bg-ivory" />
      <section className="bg-ivory px-6 py-28 md:py-36">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto h-10 w-72 animate-pulse rounded bg-charcoal/10" />
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
