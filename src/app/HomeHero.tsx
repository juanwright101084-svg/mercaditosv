// src/app/HomeHero.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';

export function HomeHero() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      router.push('/productos');
      return;
    }
    router.push(`/productos?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-8 shadow-xl sm:p-12 lg:p-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
          Tu mercado,
          <br />
          ahora en línea
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/90 sm:text-lg">
          Encuentra todo lo que necesitas con envío gratis en tu primera
          compra.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full rounded-full border-2 border-transparent bg-white py-3.5 pl-12 pr-4 text-sm text-stone-900 placeholder-stone-400 shadow-lg transition focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-200"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-8 py-3.5 text-sm font-bold text-stone-900 shadow-lg transition hover:bg-accent-400 hover:shadow-xl active:scale-[0.98]"
          >
            Ver catálogo
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-6 text-xs text-white/70">
          🚚 Envío gratis en compras mayores a $20
        </p>
      </div>
    </section>
  );
}