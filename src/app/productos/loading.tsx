import { ProductGridSkeleton } from "./skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <h1 className="text-3xl font-extrabold">Catálogo</h1>
      <ProductGridSkeleton />
    </main>
  );
}