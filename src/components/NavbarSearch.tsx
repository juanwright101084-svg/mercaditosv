// src/components/NavbarSearch.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';

interface ProductSuggestion {
  id: number;
  name: string;
  price: number | string;
  image?: string;
}

const IMAGE_URL =
  process.env.NEXT_PUBLIC_IMAGE_URL ?? 'http://127.0.0.1:8000';

export function NavbarSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&limit=6`
        );
        const data = await res.json();
        setResults(data.products ?? []);
        setOpen(true);
      } catch (err) {
        console.error('Error buscando:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    inputRef.current?.blur();
    router.push(`/productos?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelect = (productId: number) => {
    setOpen(false);
    setQuery('');
    router.push(`/productos/${productId}`);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Buscar productos..."
          className="w-full rounded-full border-2 border-cream-200 bg-cream-50 py-2 pl-10 pr-10 text-sm text-stone-900 placeholder-stone-400 transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-100"
        />
        {loading && (
          <Loader2
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-brand-500"
          />
        )}
        {!loading && query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-brand-500"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-xl">
          {results.length === 0 && !loading ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-stone-500">
                No encontramos productos para{' '}
                <strong className="text-stone-900">{query}</strong>
              </p>
            </div>
          ) : (
            <>
              <div className="max-h-80 overflow-y-auto py-2">
                {results.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSelect(product.id)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-cream-50"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-cream-100">
                      {product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`${IMAGE_URL}${product.image.replace(
                            /\\\//g,
                            '/'
                          )}`}
                          alt={product.name}
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <span className="text-lg">📦</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-stone-900">
                        {product.name}
                      </p>
                      <p className="text-xs font-bold text-brand-500">
                        ${Number(product.price).toFixed(2)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="border-t border-cream-100 bg-cream-50 px-4 py-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-xs font-semibold text-brand-500 transition hover:text-brand-600"
                >
                  Ver todos los resultados para &quot;{query}&quot; →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}