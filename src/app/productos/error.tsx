"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-5xl space-y-4 p-6">
      <h1 className="text-2xl font-bold">No pudimos cargar el catálogo</h1>
      <p className="text-stone-500">
        Hubo un problema al conectar con el servidor. Intenta de nuevo.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
      >
        Reintentar
      </button>
    </main>
  );
}