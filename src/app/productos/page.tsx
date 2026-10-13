// src/app/productos/page.tsx
import { Suspense } from 'react';
import { getProducts } from '@/lib/products';
import { ProductCatalog } from './ProductCatalog';

export const metadata = {
  title: 'Catálogo de Productos',
  description: 'Explora nuestro catálogo completo en MercaditoSV',
};

interface Product {
  id: number;
  name: string;
  price: string | number;
  image?: string;
  stock?: number;
  category_id?: number;
  category?: { id: number; name: string } | null;
}

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

async function ProductLoader({ query }: { query: string }) {
  let products: Product[] = [];

  try {
    const data = await getProducts();
    products = data ?? [];
  } catch (error) {
    console.error('Error cargando productos:', error);
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
        <p className="text-sm font-semibold text-brand-700">
          No pudimos cargar los productos. Intenta recargar la página.
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-cream-200 bg-white p-12 text-center">
        <p className="text-lg font-bold text-stone-700">
          No hay productos disponibles
        </p>
        <p className="mt-2 text-sm text-stone-500">
          Vuelve pronto, estamos surtiendo el mercado 🛒
        </p>
      </div>
    );
  }

  return <ProductCatalog products={products} initialQuery={query} />;
}

export default async function ProductosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q ?? '';

  return (
    <main className="min-h-screen bg-cream-50 px-4 py-8 text-stone-900 sm:px-6 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductLoader query={query} />
        </Suspense>
      </div>
    </main>
  );
}

function ProductGridSkeleton() {
  return (
    <>
      <div className="mb-8 h-40 animate-pulse rounded-3xl bg-cream-100" />
      <div className="mb-6 flex gap-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-10 w-24 animate-pulse rounded-full bg-cream-100"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-2xl border border-cream-200 bg-white"
          >
            <div className="aspect-square bg-cream-100" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-20 rounded bg-cream-100" />
              <div className="h-5 w-full rounded bg-cream-100" />
              <div className="h-7 w-24 rounded bg-cream-100" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}