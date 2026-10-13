// src/app/productos/ProductCatalog.tsx
'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Truck, ArrowRight, Sparkles, X } from 'lucide-react';
import { ProductCard } from './ProductCard';

interface Product {
  id: number;
  name: string;
  price: string | number;
  image?: string;
  stock?: number;
  category_id?: number;
  category?: { id: number; name: string } | null;
}

interface ProductCatalogProps {
  products: Product[];
  initialQuery?: string;
}

export function ProductCatalog({
  products,
  initialQuery = '',
}: ProductCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');

  const query = searchParams.get('q') ?? initialQuery;

  const categories = useMemo(() => {
    const map = new Map<number, string>();
    products.forEach((p) => {
      if (p.category?.id && p.category?.name) {
        map.set(p.category.id, p.category.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category?.id === activeCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    return result;
  }, [products, activeCategory, query]);

  const handleClearSearch = () => {
    router.push('/productos');
  };

  return (
    <>
      {query && (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3">
          <p className="text-sm text-stone-700">
            Mostrando resultados para{' '}
            <strong className="text-brand-600">&quot;{query}&quot;</strong>
            <span className="ml-2 text-stone-500">
              ({filteredProducts.length}{' '}
              {filteredProducts.length === 1 ? 'producto' : 'productos'})
            </span>
          </p>
          <button
            onClick={handleClearSearch}
            className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-500 transition hover:bg-brand-100"
          >
            <X size={14} />
            Limpiar
          </button>
        </div>
      )}

      {!query && (
        <div className="animate-fade-in-up mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-6 shadow-xl sm:p-10">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 text-white">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                <Sparkles size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Oferta de la semana
                </span>
              </div>
              <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
                🚚 Envío GRATIS
              </h2>
              <p className="mt-2 max-w-md text-sm text-white/90 sm:text-base">
                En tu primera compra mayor a <strong>$20</strong>. Aprovecha
                nuestras ofertas antes de que se acaben.
              </p>
            </div>

            <button
              type="button"
              className="group inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-stone-900 shadow-lg transition hover:bg-accent-400 hover:shadow-xl"
            >
              Ver ofertas
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      )}

      {!query && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeCategory === 'all'
                ? 'bg-brand-500 text-white shadow-md'
                : 'border border-cream-200 bg-white text-stone-700 hover:border-brand-300 hover:text-brand-500'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeCategory === cat.id
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'border border-cream-200 bg-white text-stone-700 hover:border-brand-300 hover:text-brand-500'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {!query && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-stone-600">
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'producto' : 'productos'}
            {activeCategory !== 'all' && (
              <>
                {' en '}
                <span className="font-semibold text-brand-500">
                  {categories.find((c) => c.id === activeCategory)?.name}
                </span>
              </>
            )}
          </p>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-cream-200 bg-white p-12 text-center">
          <p className="text-lg font-bold text-stone-700">
            {query
              ? `No encontramos productos para "${query}"`
              : 'No hay productos en esta categoría'}
          </p>
          <button
            onClick={() => {
              if (query) handleClearSearch();
              else setActiveCategory('all');
            }}
            className="mt-4 text-sm font-semibold text-brand-500 hover:text-brand-600"
          >
            {query ? 'Ver todos los productos' : 'Ver todo el catálogo'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}