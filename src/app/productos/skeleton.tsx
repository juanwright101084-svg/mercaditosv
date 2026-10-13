export function ProductGridSkeleton() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <li
          key={i}
          className="h-36 animate-pulse rounded-xl border border-stone-200 bg-stone-100"
        />
      ))}
    </ul>
  );
}